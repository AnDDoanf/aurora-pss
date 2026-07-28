import fs from 'fs';
import path from 'path';

const levelMap = {
  // Introduction
  'introduction.md': 'beginner',

  // Rooms
  'intro.md': 'beginner',
  'laser.md': 'beginner',
  'missile.md': 'beginner',
  'hangar.md': 'intermediate',
  'superweapon.md': 'intermediate',
  'shield.md': 'beginner',
  'engine.md': 'intermediate',
  'cloak.md': 'intermediate',
  'anticraft.md': 'intermediate',
  'teleport.md': 'advanced',
  'android.md': 'advanced',

  // Crews
  'stats.md': 'beginner',
  'skills.md': 'beginner',
  'roles.md': 'intermediate',
  'stamina.md': 'intermediate',
  'crew-mechanics.md': 'intermediate',
  'skill-mechanics.md': 'advanced',
  'train-foundation.md': 'intermediate',
  'train-advanced.md': 'advanced',
  'assets.md': 'intermediate',
  'collection.md': 'advanced',

  // Strategies
  'gunship.md': 'beginner',
  'pen-boarding.md': 'intermediate',
  'hangar-ship.md': 'intermediate',
  'droid.md': 'advanced',
  'shield-battery.md': 'advanced',
  'rush-b.md': 'intermediate',
  'fire-ship.md': 'advanced',

  // AIs
  'overview.md': 'beginner',
  'target.md': 'beginner',
  'condition.md': 'intermediate',
  'action.md': 'intermediate',
  'priority.md': 'intermediate',
  'loop.md': 'advanced',
  'setups.md': 'advanced',

  // Updates
  '2026-patch.md': 'beginner'
};

function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const filename = entry.name;
      const assignedLevel = levelMap[filename] || 'beginner';

      // Parse frontmatter
      const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
      if (fmMatch) {
        let fmLines = fmMatch[1].split(/\r?\n/).filter(line => !line.startsWith('level:'));
        fmLines.push(`level: "${assignedLevel}"`);

        const newFm = `---\n${fmLines.join('\n')}\n---\n`;
        const body = content.slice(fmMatch[0].length);
        const newContent = `${newFm}${body}`;

        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Updated ${fullPath} -> level: ${assignedLevel}`);
      }
    }
  }
}

const baseGuideDir = path.join(process.cwd(), 'src', 'content', 'guide');
processDirectory(baseGuideDir);
console.log('Finished updating markdown frontmatter level metadata!');
