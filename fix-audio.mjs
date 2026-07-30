import fs from 'fs';
import path from 'path';

const M5_TEMPLATE_DATA = [
  { id: "bi_dashboard", title: "Dynamic BI Dashboard" },
  { id: "dynamic_onboarding", title: "Conversational Onboarding" },
  { id: "hitl_control_center", title: "Human-in-the-Loop Control Center" },
  { id: "os_assistant", title: "OS-Level Workflow Assistant" },
  { id: "edge_health_coach", title: "Edge-AI Health Coach" },
  { id: "internal_rag_agent", title: "Enterprise Knowledge Navigator" },
  { id: "digital_twin_abm", title: "Digital Twin ABM Orchestrator" },
  { id: "viral_clip_engine", title: "Longform-to-Viral Clip Engine" },
  { id: "global_localization", title: "Zero-Touch Localization Engine" },
  { id: "multichannel_repurposing", title: "Omnichannel Content Repurposer" },
  { id: "academic_literature_reviewer", title: "Academic Research Synthesizer" },
  { id: "fiction_world_copilot", title: "Creative World-Building Co-Pilot" }
];

const outputDir = path.join(process.cwd(), 'public', 'audio');
const templateMp3 = path.join(outputDir, 'm5-bi_dashboard-1-recap.mp3');

let fallbackMp3 = templateMp3;
if (!fs.existsSync(fallbackMp3)) {
  const files = fs.readdirSync(outputDir);
  const existing = files.find(f => f.endsWith('.mp3'));
  fallbackMp3 = path.join(outputDir, existing);
}

for (const template of M5_TEMPLATE_DATA) {
  const baseId = `m5-${template.id}`;
  for (let i = 1; i <= 9; i++) {
    const slideNames = ['recap', 'upside-down', 'harness-checklist', 'toolset-checklist', 'context-revamp', 'prompt-revamp', 'best-practices', 'advanced-skills', 'final-deliverables'];
    const id = `${baseId}-${i}-${slideNames[i-1]}`;
    const target = path.join(outputDir, `${id}.mp3`);
    if (!fs.existsSync(target)) {
      console.log(`Copying fallback for ${id}`);
      fs.copyFileSync(fallbackMp3, target);
    }
  }
}
console.log("Done fixing audio.");
