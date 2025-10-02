export type FlamesResult = 'Friends' | 'Love' | 'Affection' | 'Marriage' | 'Enemy' | 'Siblings';

const FLAMES_SEQUENCE: FlamesResult[] = ['Friends', 'Love', 'Affection', 'Marriage', 'Enemy', 'Siblings'];

export function calculateFlames(name1: string, name2: string): FlamesResult {
  let str1 = name1.toLowerCase().replace(/[^a-z]/g, '');
  let str2 = name2.toLowerCase().replace(/[^a-z]/g, '');

  const name1Chars = str1.split('');
  const name2Chars = str2.split('');
  
  for (let i = 0; i < name1Chars.length; i++) {
    const char = name1Chars[i];
    const indexInName2 = name2Chars.indexOf(char);

    if (indexInName2 !== -1) {
      name1Chars.splice(i, 1);
      name2Chars.splice(indexInName2, 1);
      i--; 
    }
  }

  const count = name1Chars.length + name2Chars.length;

  if (count === 0) {
    // If names are identical or anagrams, original FLAMES has no rule.
    // Let's return a neutral/positive result.
    return 'Friends';
  }

  const flames = [...FLAMES_SEQUENCE];
  let startIndex = 0;

  while (flames.length > 1) {
    const removalIndex = (startIndex + count - 1) % flames.length;
    flames.splice(removalIndex, 1);
    startIndex = removalIndex;
  }

  return flames[0];
}
