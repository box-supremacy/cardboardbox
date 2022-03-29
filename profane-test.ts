import words from 'profane-words';
const arg = process.argv[2];

if (words.includes(arg.toLowerCase())) {
    console.warn('Watch your mouth.');
}
