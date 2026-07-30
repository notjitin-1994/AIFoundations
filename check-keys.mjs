import https from 'https';
const keys = [
  'sk_c0bb6102f0c5b025676aaa48318d16726ea518de17219d3c',
  'sk_045c83bc266603005e3547a8ab743e012fb6302bb1d1071b',
  'sk_9284ac0e5288b42d2bd0d4c8b0181c9d208b4fba278ddfd9'
];

async function checkKey(key) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.elevenlabs.io',
      path: '/v1/user',
      headers: { 'xi-api-key': key }
    };
    https.get(options, (res) => {
      resolve({ key, status: res.statusCode });
    });
  });
}

async function main() {
  for (const key of keys) {
    const res = await checkKey(key);
    console.log(`Key ${key.substring(0,8)}... Status: ${res.status}`);
  }
}
main();
