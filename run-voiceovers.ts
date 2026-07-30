import fs from 'fs';
import path from 'path';
import https from 'https';
import { M5_TEMPLATE_DATA } from './src/lib/m5-template-data';

const API_KEY = 'sk_07a67f6acf22e74130f0bcd59ccf26a805da2c0032b13b33';
const VOICE_ID = 'CwhRBWXzGAHq8TQ4Fs17'; // Roger
const outputDir = path.join(process.cwd(), 'public', 'audio');

function generateSpeech(text: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(outputPath)) {
      console.log(`Skipping (already exists): ${path.basename(outputPath)}`);
      return resolve();
    }

    const data = JSON.stringify({
      text: text,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.0, use_speaker_boost: true }
    });

    const options = {
      hostname: 'api.elevenlabs.io',
      path: `/v1/text-to-speech/${VOICE_ID}`,
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        console.error(`Error for ${path.basename(outputPath)}: Status ${res.statusCode}`);
        return resolve();
      }
      const writeStream = fs.createWriteStream(outputPath);
      res.pipe(writeStream);
      writeStream.on('finish', () => {
        console.log(`Generated: ${path.basename(outputPath)}`);
        resolve();
      });
      writeStream.on('error', reject);
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  let count = 0;
  for (const template of M5_TEMPLATE_DATA) {
    const baseId = `m5-${template.id}`;
    
    const slides = [
      { id: `${baseId}-1-recap`, text: `You know how to set up your harness, wire tools and MCPs, provide context, and structure prompts. Now, we put it all to the test for your ${template.title}.` },
      { id: `${baseId}-2-upside-down`, text: `We're going upside down. For your ${template.title}, we look at the harness and toolset first, and then use AI to enrich the context and prompt engineering.` },
      { id: `${baseId}-3-harness-checklist`, text: `First, let's verify your harness. To build the ${template.title}, your infrastructure requires a ${template.harnessChecklist[0]}, ${template.harnessChecklist[1]}, and ${template.harnessChecklist[2]}.` },
      { id: `${baseId}-4-toolset-checklist`, text: `Next, the toolset. Without these specific skills, your agent will be paralyzed. We will integrate the ${template.toolsetChecklist[0]}, ${template.toolsetChecklist[1]}, and ${template.toolsetChecklist[2]}.` },
      { id: `${baseId}-5-context-revamp`, text: `Now, let's inject rich context. A generic prompt won't work. Before, you might have simply said: "${template.contextRevamp.before}". But now, you'll establish ${template.contextRevamp.title}: "${template.contextRevamp.after}".` },
      { id: `${baseId}-6-prompt-revamp`, text: `With context established, we rebuild your prompts. Instead of a basic command like "${template.promptRevamp.before}", watch how it evolves into a structured execution: "${template.promptRevamp.after}".` },
      { id: `${baseId}-7-best-practices`, text: `Don't forget software engineering fundamentals. When deploying the ${template.title}, you must enforce strict rate limiting, version control, and security boundaries for your MCPs.` },
      { id: `${baseId}-8-advanced-skills`, text: `To push this further, integrating advanced skills gives your agent a definitive edge. Your architecture for the ${template.title} is now fully agentic and ready to execute complex workflows.` },
      { id: `${baseId}-9-final-deliverables`, text: `This is it. Provide the links to your completed ${template.title} deliverables to finalize this capstone. Your journey from concept to application is complete.` }
    ];

    for (const slide of slides) {
      const outputPath = path.join(outputDir, `${slide.id}.mp3`);
      await generateSpeech(slide.text, outputPath);
      count++;
      await new Promise(r => setTimeout(r, 200)); // Rate limiting
    }
  }
  console.log(`Finished processing ${count} files.`);
}

main().catch(console.error);
