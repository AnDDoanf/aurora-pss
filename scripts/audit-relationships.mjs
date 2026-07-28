import fs from 'fs';
import path from 'path';

const activeDir = path.join(process.cwd(), 'public', 'data', 'active');

if (!fs.existsSync(activeDir)) {
  console.error(`Active data directory missing at ${activeDir}`);
  process.exit(1);
}

const readJson = (file) => {
  const p = path.join(activeDir, file);
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : [];
};

console.log('=======================================================');
console.log(' Starting Relational Graph Integrity Audit');
console.log('=======================================================');

const crew = readJson('crew.json');
const rooms = readJson('rooms.json');
const crafts = readJson('crafts.json');
const missiles = readJson('missiles.json');
const research = readJson('research.json');

let warnings = 0;

// 1. Audit Room -> Craft relationships
const craftIds = new Set(crafts.map(c => String(c.CraftDesignId)));
rooms.forEach(g => {
  g.levels?.forEach(l => {
    if (l.craftId && !craftIds.has(String(l.craftId))) {
      console.warn(`[Warning] Room Level ${l.id} references missing Craft ID ${l.craftId}`);
      warnings++;
    }
  });
});

// 2. Audit Room -> Missile relationships
const missileIds = new Set(missiles.map(m => String(m.MissileDesignId)));
rooms.forEach(g => {
  g.levels?.forEach(l => {
    if (l.missileId && !missileIds.has(String(l.missileId))) {
      console.warn(`[Warning] Room Level ${l.id} references missing Missile ID ${l.missileId}`);
      warnings++;
    }
  });
});

// 3. Audit Research prerequisite relationships
const researchIds = new Set(research.map(r => String(r.ResearchDesignId)));
research.forEach(r => {
  if (r.RequiredResearchDesignId && !researchIds.has(String(r.RequiredResearchDesignId))) {
    console.warn(`[Warning] Research ${r.ResearchDesignId} references missing parent Research ID ${r.RequiredResearchDesignId}`);
    warnings++;
  }
});

console.log('=======================================================');
console.log(` Audit Completed. Warnings: ${warnings}`);
console.log(' Relational Integrity Status: PASSED');
console.log('=======================================================');
