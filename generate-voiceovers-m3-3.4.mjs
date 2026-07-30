import fs from 'fs';
import path from 'path';
import https from 'https';

const API_KEY = 'sk_c0bb6102f0c5b025676aaa48318d16726ea518de17219d3c';
const VOICE_ID = 'CwhRBWXzGAHq8TQ4Fs17'; // Roger

const slides = [
  {
    id: "m3-agents-md",
    text: "Beyond external APIs, modern AI agents rely on Markdown-based documentation like AGENTS.md placed directly in your repository. Think of this as the system prompt translated into code. It gives the agent your project's coding standards, boundaries, and architectural context every time it opens your folder."
  },
  {
    id: "m3-skills-ecosystem",
    text: "But you can't fit everything into one file. That's where the SKILLS ecosystem comes in. By creating targeted documents like a Frontend Design Skill or a System Architecture Skill, you give the AI specific, modular instructions. For example, a frontend skill can force the AI to use specific Tailwind spacing or animation libraries. It reads the relevant file only when executing that specific task."
  },
  {
    id: "m3-enhancing-harness",
    text: "You can radically enhance your harness by installing these skills directly into your workspace. By keeping a world-class AGENTS.md and modular skill documents in your project folder, any capable harness—like Antigravity or Claude Desktop—will dynamically ingest this context. This is how you transform a generic assistant into a specialized team member."
  },
  {
    id: "m3-enriching-prompts",
    text: "Finally, to actually trigger these capabilities, you must enrich your prompts. Instead of simply asking the AI to 'build a component', explicitly instruct it to 'use the frontend design skill to build a component'. This forces the agent to read the documentation first via local RAG, ensuring its output perfectly matches your project standards."
  }
];

const outputDir = path.join(process.cwd(), 'public', 'audio');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function generateSpeech(text, outputPath) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      text: text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true
      }
    });

    const options = {
      hostname: 'api.elevenlabs.io',
      path: `/v1/text-to-speech/${VOICE_ID}`,
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let errorData = '';
        res.on('data', chunk => { errorData += chunk; });
        res.on('end', () => {
          reject(new Error(`API returned ${res.statusCode}: ${errorData}`));
        });
        return;
      }

      const fileStream = fs.createWriteStream(outputPath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        console.log(`Successfully generated ${path.basename(outputPath)}`);
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(outputPath, () => reject(err));
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(data);
    req.end();
  });
}

async function main() {
  console.log(`Starting voiceover generation for ${slides.length} slides...`);
  
  for (const slide of slides) {
    const outputPath = path.join(outputDir, `${slide.id}.mp3`);
    try {
      await generateSpeech(slide.text, outputPath);
    } catch (error) {
      console.error(`Failed to generate speech for ${slide.id}:`, error.message);
    }
  }
  
  console.log('Voiceover generation complete!');
}

main();
