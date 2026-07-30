import fs from 'fs';
import path from 'path';

const favicons = [
  { name: 'smithery', url: 'https://www.google.com/s2/favicons?domain=smithery.ai&sz=128' },
  { name: 'mcp-so', url: 'https://www.google.com/s2/favicons?domain=mcp.so&sz=128' },
  { name: 'glama', url: 'https://www.google.com/s2/favicons?domain=glama.ai&sz=128' },
  { name: 'mcp-official', url: 'https://www.google.com/s2/favicons?domain=modelcontextprotocol.io&sz=128' },
  { name: 'github', url: 'https://www.google.com/s2/favicons?domain=github.com&sz=128' }
];

const dir = path.join(process.cwd(), 'public', 'images', 'favicons');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

async function download() {
  for (const f of favicons) {
    try {
      const res = await fetch(f.url);
      if (!res.ok) throw new Error(`Unexpected status ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const filePath = path.join(dir, `${f.name}.png`);
      fs.writeFileSync(filePath, buffer);
      console.log(`Downloaded ${f.name} (${buffer.length} bytes)`);
    } catch (err) {
      console.error(`Error downloading ${f.name}:`, err);
    }
  }
}

download();
