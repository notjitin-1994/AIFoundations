import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Lock, LogIn, UserPlus } from "lucide-react";

export function AuthModal({ isOpen }: { isOpen: boolean }) {
  const router = useRouter();
  
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogPortal>
        <DialogOverlay className="backdrop-blur-sm bg-background/80" />
        <DialogContent className="sm:max-w-md [&>button]:hidden border-border/50 bg-card shadow-2xl">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-center text-xl font-bold tracking-tight">Access Restricted</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground pt-2">
              Please sign in or create an account to access the course dashboard, modules, and your progress.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button onClick={() => router.push('/login')} className="w-full h-11 font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <Button onClick={() => router.push('/signup')} variant="outline" className="w-full h-11 font-medium border-border hover:bg-muted/50 transition-colors">
              <UserPlus className="w-4 h-4 mr-2" />
              Create an Account
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
