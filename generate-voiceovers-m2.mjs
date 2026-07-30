import fs from 'fs';
import path from 'path';
import https from 'https';

const API_KEY = process.env.ELEVENLABS_API_KEY || 'YOUR_API_KEY_HERE';
const VOICE_ID = 'CwhRBWXzGAHq8TQ4Fs17'; // Roger

const slides = [
  { id: "m2-title", text: "What happens when the bowl is too small? Like a goldfish, an AI has limited short-term memory. When a conversation exceeds that window, early information simply falls out of reach." },
  { id: "m2-forgot-name", text: "Have you ever given an AI a long document, set a strict rule at the top, and found it completely ignoring that rule by the end? Let's look at the Goldfish Problem in action. In this chat, we told the AI to always call us 'Captain'. Watch what happens when we feed it a massive 3,500 token report." },
  { id: "m2-forgot-name-mechanics", text: "To understand why this happens, you have to look at how an AI processes conversation history. It doesn't read the chat like a book; it treats it like a conveyor belt with a strict length limit. This is called a First-In-First-Out, or FIFO, queue. When you paste in a massive document, the newest tokens push the oldest tokens—like your critical system instructions—right off the edge of the belt." },
  { id: "m2-real-world-consequences", text: "This isn't just an annoyance; it's a critical failure point in production. If you're coding, the AI might revert to older framework versions. In data analysis, it might forget your specific exclusion rules. And in content creation, your carefully crafted brand voice is replaced by generic AI speak. Understanding this limitation is the first step to becoming an AI engineer." },
  { id: "m2-tokens-intro", text: "Before we solve the problem, we need to understand how AI measures information. Let's talk about Tokens—the true currency of AI. An AI doesn't read words like we do. It breaks text into smaller chunks called tokens. A simple word might be one token, but a complex word like 'Hamburger' gets chopped into 'Ham', 'bur', and 'ger'. Three tokens for one word." },
  { id: "m2-token-economics", text: "Why does this distinction matter? Because every token has a cost. You are billed per token, both for input and output. Furthermore, tokens are heavily biased towards English. A single sentence in English might be five tokens, but translating that exact sentence to Hindi or Japanese could cost twenty tokens. Finally, tokens define the absolute limit of what the model can remember at once." },
  { id: "m2-tokenizer", text: "Try typing a sentence below. You'll see that a token isn't always a full word. Sometimes it's a syllable, or even just a space. This is how the AI sees your text." },
  { id: "m2-context-windows", text: "A context window is the absolute limit of tokens an AI can process at one time. In 2023, eight thousand tokens was considered large. By 2026, models can process over a million tokens in a single prompt." },
  { id: "m2-lost-in-middle", text: "But bigger isn't always better. Research consistently shows a U-shaped performance curve. Models pay close attention to the beginning and end of a prompt, but often ignore what's buried in the middle." },
  { id: "m2-attention-heatmap", text: "Hover over the text to see the attention heatmap. The teal edges represent high attention scores, while the dark center shows where critical details get lost in the noise." },
  { id: "m2-rag-video", text: "So, if stuffing a massive context window doesn't work, what does? The answer is Retrieval-Augmented Generation, or RAG. It's like giving the AI an open-book test." },
  { id: "m2-rag-pipeline", text: "Click through the steps to see RAG in action. First, a retriever searches a database. Then, it pulls only the most relevant facts. Finally, it injects those specific facts into the context window right before generating the answer." },
  { id: "m2-rag-compare", text: "RAG is cheaper, faster, and far more accurate than just pasting a massive document into the prompt. It grounds the AI in reality." },
  { id: "m2-context-engineering", text: "This brings us to Context Engineering. The three golden rules: keep the context clean, put the most important instructions at the very end, and use external memory when dealing with large datasets." },
  { id: "m2-project-intro", text: "Now, let's look at your running project. How will context limits affect what you're building?" },
  { id: "m2-project-sandbox", text: "Take a moment to define your context strategy. How will you ensure your AI doesn't forget its core instructions over long interactions? Write your approach below." },
  { id: "m2-assessment-intro", text: "Before we move on to The Toolbelt, let's verify your understanding of tokens, context limits, the lost-in-the-middle phenomenon, and RAG." }
];

const outputDir = path.join(process.cwd(), 'public', 'audio');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function generateSpeech(text, outputPath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(outputPath)) {
        console.log(`Skipping ${path.basename(outputPath)}, already exists`);
        resolve();
        return;
    }
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
      await new Promise(r => setTimeout(r, 1000));
    } catch (error) {
      console.error(`Failed to generate speech for ${slide.id}:`, error.message);
    }
  }
  
  console.log('Voiceover generation complete!');
}

main();
