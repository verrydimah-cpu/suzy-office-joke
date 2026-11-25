// suzy-office-joke — writes one single-line office joke to entry.txt.
//
// The joke (107 characters, gate limit is 1 to 200):
//   My boss said dress for the job you want, so I came as a retired
//   person and HR called it a policy violation.
// It takes the familiar office advice "dress for the job you want"
// literally: the job actually wanted is retirement, and the punchline
// is HR treating that honest outfit as a policy violation. The twist
// lands in one read, with no setup that needs explaining.

import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const JOKE =
  "My boss said dress for the job you want, so I came as a retired person and HR called it a policy violation.";

// The program's own directory, resolved from its own location so no
// bare relative path is ever used for anything this program touches.
// It is kept as a sanity anchor: the entry text is a constant in this
// file, so the program never needs to read anything from disk.
const HERE = dirname(fileURLToPath(import.meta.url));
void HERE;

function outputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  return fromEnv && fromEnv.trim() !== "" ? fromEnv : "/output";
}

function main(): void {
  // Fail loudly rather than ship an entry the gate would refuse:
  // it must be 1-200 characters, a single line, and not only whitespace.
  if (
    JOKE.length < 1 ||
    JOKE.length > 200 ||
    JOKE.trim() === "" ||
    JOKE.includes("\n")
  ) {
    throw new Error(`joke fails the gate: ${JOKE.length} characters`);
  }

  const dir = outputDir();
  mkdirSync(dir, { recursive: true });

  // Clear the directory's contents entry by entry; the directory
  // itself is never removed.
  for (const entry of readdirSync(dir)) {
    rmSync(join(dir, entry), { recursive: true, force: true });
  }

  writeFileSync(join(dir, "entry.txt"), JOKE, "utf8");
}

main();
