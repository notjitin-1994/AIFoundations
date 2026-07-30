import fs from 'fs';
import path from 'path';
import https from 'https';

const API_KEY = 'sk_045c83bc266603005e3547a8ab743e012fb6302bb1d1071b';
const VOICE_ID = 'CwhRBWXzGAHq8TQ4Fs17'; // Roger

const slides = [
  {
    id: 'm3-markdown-skills',
    text: "Beyond external tools, modern AI agents rely on Markdown-based documentation like AGENTS.md or SKILLS.md. These files act as the system prompt or instruction manual, providing the agent with the project's coding standards and architectural context every time it opens your repository."
  },
  {
    id: 'm3-modular-skills',
    text: "Instead of stuffing every rule into one massive prompt, we use modular capabilities. A SKILLS.md file defines specific, reusable workflows—like how to write a Pull Request—so the agent only loads that context when it's actively needed."
  },
  {
    id: 'm3-agent-hierarchy',
    text: "This creates a powerful hierarchy. You maintain a single AGENTS.md as your source of truth, while tool-specific files like CLAUDE.md or GEMINI.md act as thin entry points. This ensures your project's AI personality remains consistent across any platform."
  },
  {
    id: 'm3-plugins-architecture',
    text: "Now, how do agents connect to enterprise systems? Historically, this required proprietary plugins. A plugin is a rigid, hardcoded integration that only works for one specific tool, creating a fragile and siloed ecosystem."
  },
  {
    id: 'm3-standard-connectors',
    text: "Today, we've moved to standard connectors. Unlike rigid plugins, connectors act as fluid bridges using protocols like MCP. They give the agent dynamic access to workflows, whether it's querying a database or executing a server deployment."
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
      // Wait a moment between requests to avoid rate limits
      await new Promise(r => setTimeout(r, 1000));
    } catch (error) {
      console.error(`Failed to generate speech for ${slide.id}:`, error.message);
    }
  }
  
  console.log('Voiceover generation complete!');
}

main();
