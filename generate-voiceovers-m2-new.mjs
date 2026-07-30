import fs from 'fs';
import path from 'path';
import https from 'https';

const API_KEY = 'sk_045c83bc266603005e3547a8ab743e012fb6302bb1d1071b';
const VOICE_ID = 'CwhRBWXzGAHq8TQ4Fs17'; // Roger

const slides = [
  {
    id: 'm2-web-vs-local',
    text: "Web versions of LLMs are often highly sandboxed and limited in the tools they can use. Going forward into the Toolbelt section, you'll need to set up tools and understand how API calls work. We recommend using CLI tools to install and run agents. Or, for a GUI experience, download a Desktop LLM application. The rest of the project steps will require a platform capable of tool calls, MCPs, and skills management."
  },
  {
    id: 'm2-finding-tools',
    text: "If you're wondering how to find the best and most cost-effective tools for your project, don't worry. The ecosystem is moving fast, but the strategy is simple. First, select a foundation model known for strong function-calling capabilities. Then, choose a CLI harness or desktop application to host your agent. Finally, browse registries like smithery dot a i to find pre-built MCPs that instantly connect your agent to databases and APIs."
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
