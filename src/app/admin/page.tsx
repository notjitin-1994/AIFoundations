import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface RecentStatement {
  actor_id: string;
  verb_display: string | null;
  object_name: string | null;
  timestamp: string;
  context_module_id: string | null;
}

interface AssessmentRow {
  overall_score: number;
  module_id: string | null;
}

function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("app_role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.app_role !== "admin") {
    redirect("/");
  }

  const [
    { count: learnerCount },
    { count: orgCount },
    { count: xapiCount },
    { data: recentData },
    { data: assessmentData },
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("organizations").select("id", { count: "exact", head: true }),
    supabase.from("xapi_statements").select("id", { count: "exact", head: true }),
    supabase
      .from("xapi_statements")
      .select(
        "actor_id, verb_display, object_name, timestamp, context_module_id"
      )
      .order("timestamp", { ascending: false })
      .limit(50),
    supabase.from("assessment_results").select("overall_score, module_id"),
  ]);

  const recent: RecentStatement[] = recentData ?? [];
  const assessments: AssessmentRow[] = assessmentData ?? [];

  const avgScore =
    assessments.length > 0
      ? Math.round(
          assessments.reduce((sum, row) => sum + row.overall_score, 0) /
            assessments.length
        )
      : 0;

  const stats = [
    { label: "Total Learners", value: learnerCount ?? 0 },
    { label: "Total Organizations", value: orgCount ?? 0 },
    { label: "Total xAPI Events", value: xapiCount ?? 0 },
    { label: "Avg Assessment Score", value: `${avgScore}%` },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Read-only overview of learner activity across all organizations.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="pb-2">
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-3xl">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Last 50 xAPI statements across the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Learner</TableHead>
                  <TableHead>Verb</TableHead>
                  <TableHead>Object</TableHead>
                  <TableHead>Module</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No recent activity found.
                    </TableCell>
                  </TableRow>
                )}
                {recent.map((statement, index) => (
                  <TableRow key={`${statement.actor_id}-${statement.timestamp}-${index}`}>
                    <TableCell>{formatTimestamp(statement.timestamp)}</TableCell>
                    <TableCell className="font-medium">
                      {statement.actor_id}
                    </TableCell>
                    <TableCell>{statement.verb_display ?? "—"}</TableCell>
                    <TableCell>{statement.object_name ?? "—"}</TableCell>
                    <TableCell>
                      {statement.context_module_id ? (
                        <Badge variant="secondary">
                          {statement.context_module_id}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
