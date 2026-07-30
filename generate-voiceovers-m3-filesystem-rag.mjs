import fs from 'fs';
import path from 'path';
import https from 'https';

const API_KEY = 'sk_045c83bc266603005e3547a8ab743e012fb6302bb1d1071b';
const VOICE_ID = 'CwhRBWXzGAHq8TQ4Fs17'; // Roger

const slides = [
  {
    id: 'm3-filesystem-rag',
    text: "Filesystems are essentially local RAG. Saving markdown documents in a folder and initiating the agent there provides the most effective dynamic context management. This is the foundation of skills dot m d systems. We will learn more about this soon. These documents simply teach the AI a certain skill—how to do something in a very specific way. All AI agents use this local RAG approach to read these skills and perform truly exceptional work."
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
