import fs from 'fs';
import path from 'path';
import https from 'https';

const API_KEY = 'sk_c0bb6102f0c5b025676aaa48318d16726ea518de17219d3c';
const VOICE_ID = 'CwhRBWXzGAHq8TQ4Fs17'; // Roger

const slides = [
  {
    id: "m4-1-evolution",
    text: "You've mastered prompts, you've injected context, and in the last module, you built your harness. Now, we reach the final frontier of agentic AI: Loop Engineering. You are no longer the pilot giving step-by-step instructions. You are the architect designing the system that pilots itself."
  },
  {
    id: "m4-2-loop-anatomy",
    text: "An autonomous loop isn't magic; it's a structured control system. It starts with a Goal, Reasons about the next step, Acts using tools, Observes the result, and crucially, Verifies if it's done. Without verification, agents drift into infinite loops."
  },
  {
    id: "m4-3-react-pattern",
    text: "At the heart of loop engineering is the ReAct pattern. ReAct forces the model to 'think out loud' before taking an action. This internal scratchpad dramatically improves reliability, as the agent can catch its own logical flaws before executing a tool."
  },
  {
    id: "m4-4-capstone-sim",
    text: "Let's see this in action for your specific Capstone. Watch the terminal. You'll see the agent reason about the problem, use the tools you wired in the last module, observe the results, and self-correct when it hits a roadblock."
  },
  {
    id: "m4-5-verification",
    text: "The most dangerous thing you can do is give an agent a vague goal. 'Make this better' is a recipe for an infinite loop and a massive API bill. A loop must have a rigid, mathematically verifiable 'Done' condition."
  },
  {
    id: "m4-6-hitl",
    text: "True autonomy is earned, not given. For destructive actions, subjective decisions, or high-stakes outputs, we engineer a Human-in-the-Loop gate. The loop pauses, alerts you, and waits for your cryptographic approval before proceeding."
  },
  {
    id: "m4-7-execution",
    text: "This is it. The engine room is primed. You have your harness, your tools, and your loop architecture. Copy your Capstone loop prompt into your real environment, hit enter, and close your laptop. Let the agent do the work."
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
