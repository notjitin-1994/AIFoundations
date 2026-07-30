import fs from 'fs';
import path from 'path';
import https from 'https';

const API_KEY = 'sk_c0bb6102f0c5b025676aaa48318d16726ea518de17219d3c';
const VOICE_ID = 'CwhRBWXzGAHq8TQ4Fs17'; // Roger

const slides = [
  {
    id: "m3-plugin-chaos",
    text: "In the early days, every AI company built their own proprietary way to connect to tools. If you had 5 models and 5 tools, you needed 25 custom, fragile integrations. We call this the N by M integration problem."
  },
  {
    id: "m3-plugin-chaos-cost",
    text: "This plugin chaos meant development teams spent most of their time fixing broken plumbing rather than building features. It was a maintenance nightmare, like trying to travel internationally with dozens of different power adapters."
  }
];

const outputDir = path.join(process.cwd(), 'public', 'audio');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateAudio(slide) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      text: slide.text,
      model_id: "eleven_turbo_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5
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
        console.error(`Failed to generate audio for ${slide.id}: ${res.statusCode}`);
        res.on('data', (d) => process.stdout.write(d));
        reject(new Error(`Status Code: ${res.statusCode}`));
        return;
      }

      const filePath = path.join(outputDir, `${slide.id}.mp3`);
      const fileStream = fs.createWriteStream(filePath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Generated audio for ${slide.id}`);
        resolve();
      });
    });

    req.on('error', (error) => {
      console.error(`Error with ${slide.id}:`, error);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('Starting ElevenLabs voiceover generation...');
  for (const slide of slides) {
    try {
      await generateAudio(slide);
      await new Promise(r => setTimeout(r, 1000));
    } catch (e) {
      console.error(`Stopping due to error on ${slide.id}`);
      break;
    }
  }
  console.log('Finished generation.');
}

main();
