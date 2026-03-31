import fs from 'fs';
import path from 'path';

const envFile = fs.readFileSync(path.resolve('.env'), 'utf8');
let stripeKey = '';
envFile.split('\n').forEach(line => {
  if (line.startsWith('VITE_STRIPE_SECRET_KEY=')) stripeKey = line.split('=')[1].trim();
});

console.log("Stripe Key:", stripeKey ? "Found" : "Not Found");
