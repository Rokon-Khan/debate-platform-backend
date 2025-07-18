export const bannedWords = ["stupid", "idiot", "dumb"];

export function containsBannedWords(text: string) {
  const regex = new RegExp(`\\b(${bannedWords.join("|")})\\b`, "i");
  return regex.test(text);
}
