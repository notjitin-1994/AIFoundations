import fs from 'fs';
import https from 'https';
const API_KEY = 'sk_07a67f6acf22e74130f0bcd59ccf26a805da2c0032b13b33';
const VOICE_ID = 'CwhRBWXzGAHq8TQ4Fs17'; // Roger
const text = "Now, let's inject rich context. A generic prompt won't work. Before, you might have simply said: 'Read the file and summarize.' But now, you'll establish Desktop Context: 'You are a local OS assistant. The user's currently active window is ACTIVE_WINDOW_TITLE. You have read access to WORKSPACE_DIR. Maintain strict privacy, do not log PII to external servers.'";
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
    'Content-Length': data.length
  }
};
const req = https.request(options, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Status ${res.statusCode}`);
  } else {
    const writeStream = fs.createWriteStream('public/audio/m5-os_assistant-5-context-revamp.mp3');
    res.pipe(writeStream);
    console.log("Fixed!");
  }
});
req.write(data);
req.end();
