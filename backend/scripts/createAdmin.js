import 'dotenv/config';

import readline from 'node:readline';
import bcrypt from 'bcryptjs';
import { connectDB } from '../src/config/db.js';
import AdminUser from '../src/models/AdminUser.js';
import mongoose from 'mongoose';

function prompt(question, { hidden = false } = {}) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    if (!hidden) {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer.trim());
      });
      return;
    }
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  await connectDB();

  const name = (await prompt('Admin name: ')) || 'Administrator';
  const email = (await prompt('Admin email: ')).toLowerCase();
  const password = await prompt('Admin password (min 8 chars): ');

  if (!email || !email.includes('@')) {
    console.error('A valid email is required.');
    process.exit(1);
  }
  if (!password || password.length < 8) {
    console.error('Password must be at least 8 characters.');
    process.exit(1);
  }

  const existing = await AdminUser.findOne({ email });
  if (existing) {
    console.error(`An admin with email ${email} already exists.`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await AdminUser.create({ name, email, passwordHash });

  console.log(`Admin account created for ${email}.`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
