import fs from 'fs';
import path from 'path';
import https from 'https';

const API_KEY = 'sk_c0bb6102f0c5b025676aaa48318d16726ea518de17219d3c';
const VOICE_ID = 'CwhRBWXzGAHq8TQ4Fs17'; // Roger

const slides = [
  {
    id: "m3-mcp-translator",
    text: "In late 2024, the industry aligned on an open standard: The Model Context Protocol, or MCP. Think of it as the USB-C port for AI. It allows any model to securely connect to any external data source using one standardized plug."
  },
  {
    id: "m3-mcp-architecture",
    text: "Instead of a chaotic web, MCP uses a clean client-server architecture. An AI application runs an MCP Client, which speaks the standard protocol to any MCP Server. This transforms the N by M nightmare into a simple N plus M equation."
  },
  {
    id: "m3-mcp-components",
    text: "An MCP Server exposes three main capabilities to the LLM: Resources, which provide context like file contents; Prompts, which are reusable templates; and Tools, which are executable functions. This standardizes the entire AI workflow."
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
