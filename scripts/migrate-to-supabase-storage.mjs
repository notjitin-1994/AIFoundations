import { createClient } from '@supabase/supabase-js';
import { readdirSync, readFileSync, statSync } from 'fs';
import { extname, join } from 'path';

// Node.js 20 doesn't expose a global WebSocket, but @supabase/supabase-js
// initialises a realtime client on createClient(). We don't use realtime here,
// so a minimal polyfill lets storage-only usage work without adding the `ws`
// dependency or changing the Node version.
if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = class MinimalWebSocket {
    constructor() {}
    addEventListener() {}
    removeEventListener() {}
    send() {}
    close() {}
  };
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error(
    'Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const MIME_TYPES = {
  '.mp3': 'audio/mpeg',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

async function uploadDir(localDir, bucketName) {
  const files = readdirSync(localDir);
  let uploaded = 0;
  let failed = 0;
  let skipped = 0;

  for (const file of files) {
    const filePath = join(localDir, file);
    const stats = statSync(filePath);

    if (!stats.isFile()) {
      console.log(`SKIP (not a file): ${bucketName}/${file}`);
      skipped++;
      continue;
    }

    const fileBuffer = readFileSync(filePath);
    const ext = extname(file).toLowerCase();
    const contentType = MIME_TYPES[ext];

    if (!contentType) {
      console.warn(
        `WARN: unknown extension for ${bucketName}/${file}; uploading without content type`
      );
    }

    const { error } = await supabase.storage
      .from(bucketName)
      .upload(file, fileBuffer, { upsert: true, contentType });

    if (error) {
      console.error(`FAIL: ${bucketName}/${file} - ${error.message}`);
      failed++;
    } else {
      console.log(`OK: ${bucketName}/${file}`);
      uploaded++;
    }
  }

  console.log(
    `${bucketName}: ${uploaded} uploaded, ${failed} failed, ${skipped} skipped`
  );
  return { uploaded, failed, skipped };
}

async function main() {
  console.log('Starting media migration to Supabase Storage...');

  const results = [];
  results.push(await uploadDir('public/audio', 'course-audio'));
  results.push(await uploadDir('public/images', 'course-images'));

  // Video directory may not exist in all environments.
  try {
    results.push(await uploadDir('public/video', 'course-videos'));
  } catch (e) {
    console.log('No video directory found, skipping');
  }

  const totalUploaded = results.reduce((sum, r) => sum + r.uploaded, 0);
  const totalFailed = results.reduce((sum, r) => sum + r.failed, 0);

  console.log('Migration complete!');
  console.log(`Totals: ${totalUploaded} uploaded, ${totalFailed} failed`);

  if (totalFailed > 0) {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
