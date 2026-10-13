// Excludes look-alike characters (0/O, 1/I/L) so references are easy to read aloud.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const LENGTH = 6;
// Largest multiple of the alphabet size below 256, for unbiased sampling.
const LIMIT = 256 - (256 % ALPHABET.length);

type RandomSource = (bytes: Uint8Array) => Uint8Array;

const browserRandom: RandomSource = (bytes) => crypto.getRandomValues(bytes);

/**
 * A clearly labelled demonstration reference, e.g. `AUR-DEMO-7KQ2XM`. Generate it when
 * the form is submitted, never during render, to avoid hydration mismatches.
 */
export function createDemoReference(random: RandomSource = browserRandom): string {
  let code = "";
  while (code.length < LENGTH) {
    for (const byte of random(new Uint8Array(LENGTH))) {
      if (byte < LIMIT && code.length < LENGTH) code += ALPHABET[byte % ALPHABET.length];
    }
  }
  return `AUR-DEMO-${code}`;
}
