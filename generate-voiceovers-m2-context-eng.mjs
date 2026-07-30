import fs from 'fs';
import path from 'path';
import https from 'https';

const API_KEY = 'sk_045c83bc266603005e3547a8ab743e012fb6302bb1d1071b';
const VOICE_ID = 'CwhRBWXzGAHq8TQ4Fs17'; // Roger

const slides = [
  {
    id: 'm2-context-engineering',
    text: "Context Engineering is the art of managing AI working memory. The three golden rules: keep the context clean by filtering noise, put the most important instructions at the very end to exploit the U-curve, and use external memory to offload large datasets."
  },
  {
    id: 'm2-mcp-teaser',
    text: "To implement this External Memory, the industry standard is MCP: the Model Context Protocol. MCPs are standardized servers that securely connect your AI to databases, APIs, and file systems. You can find pre-built MCPs at smithery.ai or mcp.so, or even build your own."
  },
  {
    id: 'm2-skills-teaser',
    text: "To implement Clean Context, you use Markdown Skills. Instead of giving an agent one massive, confusing prompt, you create modular dot-MD files that define highly specific behaviors. You can find community skills on GitHub, or simply instruct your agent to research and write new skills for itself."
  },
  {
    id: 'm2-module-transition',
    text: "These two technologies—MCPs for data, and Markdown Skills for behavior—form the ultimate AI Toolbelt. In the next module, we will dive deep into the architecture of how an LLM actually executes these tools."
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
