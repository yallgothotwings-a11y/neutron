import fs from 'fs';
import https from 'https';

https.get('https://api.github.com/repos/bubbls/ugs-singlefile/git/trees/main?recursive=1', {
  headers: { 'User-Agent': 'Node.js' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const tree = JSON.parse(data).tree;
    const files = tree.filter(item => item.path.startsWith('UGS-Files/') && item.path.endsWith('.html')).map(item => item.path.replace('UGS-Files/', ''));
    
    const games = files.map(file => {
      let name = file.replace(/^cl/, '').replace(/\.html$/, '');
      // Add spaces before capitals
      name = name.replace(/([A-Z])/g, ' $1').trim();
      // Capitalize first letter
      name = name.charAt(0).toUpperCase() + name.slice(1);
      return { name, file };
    });

    const tsContent = `export interface Game {
  name: string;
  file: string;
}

export const gamesList: Game[] = ${JSON.stringify(games, null, 2)};
`;
    fs.writeFileSync('src/data/games.ts', tsContent);
    console.log(`Wrote ${games.length} games to src/data/games.ts`);
  });
});
