const fs = require('fs');

const text = fs.readFileSync('games.txt', 'utf8');
const lines = text.split('\n');

const games = [];
const regex = /^(.+?):\s*(cl[a-zA-Z0-9_.-]+(?:\.html|\.temphtml)?)$/i;
const regex2 = /^(.+?):\s*([a-zA-Z0-9_.-]+(?:\.html|\.temphtml)?)$/i;

for (let line of lines) {
  line = line.trim();
  if (!line || line.startsWith('─') || line.startsWith('~') || line.startsWith('*')) continue;
  
  let match = line.match(regex);
  if (!match) {
    match = line.match(regex2);
  }

  if (match) {
    let name = match[1].trim();
    let file = match[2].trim();
    
    // Clean up name if it has weird characters at the start
    name = name.replace(/^[^a-zA-Z0-9]+/, '').trim();
    
    if (name && file) {
      games.push({ name, file });
    }
  }
}

// Remove duplicates based on file name
const uniqueGames = [];
const seenFiles = new Set();
for (const game of games) {
  if (!seenFiles.has(game.file)) {
    seenFiles.add(game.file);
    uniqueGames.push(game);
  }
}

const tsContent = `export interface Game {
  name: string;
  file: string;
}

export const gamesList: Game[] = ${JSON.stringify(uniqueGames, null, 2)};
`;

fs.writeFileSync('src/data/games.ts', tsContent);
console.log(`Parsed ${uniqueGames.length} games.`);
