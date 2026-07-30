import fs from 'fs';
import path from 'path';
import https from 'https';

const API_KEY = 'sk_07a67f6acf22e74130f0bcd59ccf26a805da2c0032b13b33';
const VOICE_ID = 'CwhRBWXzGAHq8TQ4Fs17'; // Roger
const outputDir = path.join(process.cwd(), 'public', 'audio');

function generateSpeech(text: string, outputPath: string) {
  return new Promise<void>((resolve, reject) => {
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
        'Content-Length': Buffer.byteLength(data)
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
  const slides = [
    { id: "m6-1-intro", text: "You've built your AI app. But a prompt that works once on your laptop isn't production-ready. Welcome to the real world of LLMOps, where applications must survive scale, edge cases, and continuous drift." },
    { id: "m6-2-lifecycle", text: "The LLMOps lifecycle replaces prototype thinking with engineering rigor. It introduces version control for prompts, golden datasets for regression testing, and CI/CD pipelines tailored specifically for AI." },
    { id: "m6-3-judge", text: "How do you know if an LLM's output is actually good? Traditional code tests fail here. Instead, we use LLM-as-a-Judge: employing a superior model like GPT-4 to grade your application's output against a strict semantic rubric." },
    { id: "m6-4-drift", text: "AI is not static. Prompt drift occurs when users change their behavior, or when model providers quietly update their endpoints. Without constant observability and regression testing, your app will silently degrade." },
    { id: "m6-5-pace", text: "The landscape is evolving at a breakneck pace. New models, frameworks, and techniques drop weekly. You cannot learn everything. You must build a system to filter the noise and focus on durable paradigms." },
    { id: "m6-6-signal", text: "We maintain the Tool Landscape as a living document. Check it quarterly. Don't chase every trend. Focus on tools that solve your immediate bottlenecks, whether that's tracing, evaluation, or context retrieval." },
    { id: "m6-8-journey", text: "Look how far you've come. From understanding tokens and context windows, to wiring tools and MCPs, to orchestrating autonomous agents, and finally deploying robust LLMOps. You are now an AI Engineer." },
    { id: "m6-9-graduation", text: "Congratulations. Your capstone is complete, your foundations are solid, and your horizon is clear. Share your work with the community, keep building, and never stop experimenting. Class dismissed." }
  ];

  let count = 0;
  for (const slide of slides) {
    const outputPath = path.join(outputDir, `${slide.id}.mp3`);
    // Delete if it was the old m6 voiceover
    if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
    }
    await generateSpeech(slide.text, outputPath);
    count++;
    await new Promise(r => setTimeout(r, 200));
  }
  console.log(`Finished processing ${count} m6 files.`);
}

main().catch(console.error);
