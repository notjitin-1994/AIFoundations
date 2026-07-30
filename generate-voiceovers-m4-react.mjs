import fs from 'fs';
import path from 'path';
import https from 'https';

const API_KEY = 'sk_c0bb6102f0c5b025676aaa48318d16726ea518de17219d3c';
const VOICE_ID = 'CwhRBWXzGAHq8TQ4Fs17'; // Roger

const scripts = {
  "m4-3a-naive-execution": "Before ReAct, we used naive zero-shot execution. We gave the agent a goal, and it immediately fired a tool. But without a space to plan, it hallucinated arguments, misunderstood context, and ultimately crashed.",
  "m4-3b-react-pattern": "Enter ReAct: Reason, then Act. ReAct forces the model into an internal monologue. By thinking out loud in a scratchpad, the agent catches its own logical flaws before it ever touches your systems."
};

const outputDir = path.join(process.cwd(), 'public', 'audio');

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
  console.log(`Starting voiceover generation...`);
  
  for (const [id, text] of Object.entries(scripts)) {
    const outputPath = path.join(outputDir, `${id}.mp3`);
    try {
      await generateSpeech(text, outputPath);
    } catch (error) {
      console.error(`Failed to generate speech for ${id}:`, error.message);
    }
  }
  
  console.log('Voiceover generation complete!');
}

main();
