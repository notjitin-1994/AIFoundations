import fs from 'fs';
import path from 'path';
import https from 'https';

const API_KEY = 'sk_c0bb6102f0c5b025676aaa48318d16726ea518de17219d3c';
const VOICE_ID = 'CwhRBWXzGAHq8TQ4Fs17'; // Roger

const slides = [
  {
    id: "m4-1-title-metaphor",
    text: "Welcome to Module 4. If the AI model is the engine that generates text, then the engine room is the harness that steers it. A raw engine is powerful, but without transmission, steering, and brakes, it's dangerous. Let's see how we control it."
  },
  {
    id: "m4-2-harness-vs-model",
    text: "It's critical to distinguish the raw model from the harness. The model generates text. The harness orchestrates tools, memory, and UI. Connect the model to the harness to see the difference."
  },
  {
    id: "m4-3-agent-anatomy",
    text: "When a harness gives a model three specific things, it becomes an agent. Those three pillars are: Autonomy to make decisions, Tools to take actions, and Memory to maintain context. Explore each pillar."
  },
  {
    id: "m4-4-agent-memory",
    text: "Agents don't just use one type of memory. They use Context for the immediate conversation, Trajectory to remember the steps they just took, and Persistent memory to recall long-term facts across sessions. Watch how data flows between them."
  },
  {
    id: "m4-5-agent-spectrum",
    text: "Agents exist on a spectrum of autonomy. From a single prompt, to a tool-calling agent, up to complex multi-agent systems where specialists collaborate. Slide through the spectrum to see how autonomy scales."
  },
  {
    id: "m4-6-failure-modes",
    text: "But more autonomy means new ways to break. An agent might get stuck in an infinite loop, suffer a cascade failure where one mistake ruins the rest, hallucinate uncontrollably, or rack up massive API costs. Click each panel to see a failure in action."
  },
  {
    id: "m4-7-guardrails",
    text: "To prevent those failures, we build guardrails. The most common is the Human-in-the-Loop. Before the agent takes a high-stakes action, it must stop and ask you for permission. Try being the human in the loop."
  },
  {
    id: "m4-8-project-integration",
    text: "Let's bring this back to your running project. Depending on the project you chose, an agent could automate significant portions of your workflow. Let's see how agents and guardrails apply to your specific project spine."
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
      // Wait a bit to respect free tier rate limits
      await new Promise(r => setTimeout(r, 1000));
    } catch (e) {
      console.error(`Stopping due to error on ${slide.id}`);
      break;
    }
  }
  console.log('Finished generation.');
}

main();
