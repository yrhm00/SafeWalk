// scripts/JS/genYassHash.js
import { hashPassword } from '../../utils/password.js';

const run = async () => {
  const hash = await hashPassword('YassinMoi');
  console.log('hash_yass =', hash);
};

run().catch(console.error);