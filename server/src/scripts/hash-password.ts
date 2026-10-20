import { Writable } from 'node:stream';
import { createInterface } from 'node:readline/promises';
import bcrypt from 'bcryptjs';

/**
 * Generates the bcrypt hash for ADMIN_PASSWORD_HASH.
 *
 *   pnpm --filter @umar-portfolio/server hash-password
 *
 * The password is typed at a hidden prompt, so it never appears in your shell
 * history or on screen (unlike passing it as a command-line argument).
 */
const BCRYPT_ROUNDS = 12;
const MIN_LENGTH = 12;

/** Shows the question, then stops echoing what the user types. */
async function promptHidden(question: string): Promise<string> {
  let muted = false;

  const output = new Writable({
    write(chunk: Buffer | string, encoding, callback): void {
      if (!muted) process.stdout.write(chunk, encoding as BufferEncoding);
      callback();
    },
  });

  const rl = createInterface({ input: process.stdin, output, terminal: true });

  try {
    const answer = rl.question(question); // prints the question immediately...
    muted = true; // ...then typed characters are no longer echoed
    return await answer;
  } finally {
    rl.close();
    process.stdout.write('\n');
  }
}

async function main(): Promise<void> {
  const password = await promptHidden('Admin password (hidden): ');
  const confirmation = await promptHidden('Confirm password (hidden): ');

  if (password.length < MIN_LENGTH) {
    console.error(`Use at least ${MIN_LENGTH} characters.`);
    process.exit(1);
  }
  if (password !== confirmation) {
    console.error('The two passwords do not match.');
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  console.log('\nAdd this line to your .env file.');
  console.log('Keep the single quotes: bcrypt hashes contain "$", which Docker');
  console.log('Compose would otherwise try to expand as a variable.\n');
  console.log(`ADMIN_PASSWORD_HASH='${hash}'`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
