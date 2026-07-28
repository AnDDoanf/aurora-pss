import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const asset = (url, en, vi) => ({ url, targets: { en, vi } });
const assets = [
  asset('https://blog.pixelstarships.com/wp-content/uploads/2020/04/Superweapon_Fed_Laser.gif', 'super-weapons.gif', 'sieu-vu-khi.gif'),
  asset('https://blog.pixelstarships.com/wp-content/uploads/2020/04/Superweapon_Nuke_1.gif', 'super-weapons-2.gif', 'sieu-vu-khi-2.gif'),
  asset('https://blog.pixelstarships.com/wp-content/uploads/2020/04/Superweapon_Qta_launcher.gif', 'super-weapons-3.gif', 'sieu-vu-khi-3.gif'),
  asset('https://blog.pixelstarships.com/wp-content/uploads/2021/09/Tasks-1024x576.jpg', 'advanced-crew-training-6.jpg', 'phuong-phap-train-crew-nang-cao-6.jpg'),
  asset('https://blog.pixelstarships.com/wp-content/uploads/2022/08/GMST2.png', 'galaxy-map-2.png', 'galaxy-map-2.png'),
  asset('https://blog.pixelstarships.com/wp-content/uploads/2022/10/CouncilIN-1024x576.png', 'galaxy-map-3.png', 'galaxy-map-3.png'),
  asset('https://blog.pixelstarships.com/wp-content/uploads/2023/08/Skin-Unlocked.png', 'introduction-37.png', 'gioi-thieu-36.png'),
  asset('https://blog.pixelstarships.com/wp-content/uploads/2026/04/Resurrection-Chamber_lv3.gif', 'introduction-13.gif', 'gioi-thieu-11.gif'),
  asset('https://blog.pixelstarships.com/wp-content/uploads/2026/04/WarpHangar_lv3.gif', 'hangars-10.gif', 'hangar-10.gif'),
  asset('https://blog.pixelstarships.com/wp-content/uploads/2026/04/CorvetteHangar_lv3.gif', 'hangars-11.gif', 'hangar-11.gif'),
  asset('https://blog.pixelstarships.com/wp-content/uploads/2026/04/Booster-1.gif', 'introduction-7.gif', 'gioi-thieu-7.gif'),
  asset('https://blog.pixelstarships.com/wp-content/uploads/2025/06/Defense-Hangar.gif', 'hangars-8.gif', 'hangar-8.gif'),
  asset('https://blog.pixelstarships.com/wp-content/uploads/2025/06/Defense-Crafts.png', 'hangars-9.png', 'hangar-9.png'),
  asset('https://blog.pixelstarships.com/wp-content/uploads/2025/06/ship-setup-1024x602.png', 'introduction-10.png', 'gioi-thieu-35.png'),
  asset('https://blog.pixelstarships.com/wp-content/uploads/2025/06/WargameButtons-1024x423.png', 'advanced-strategies-2.png', 'cac-chien-thuat-nang-cao-2.png')
];

const targetPath = (language, fileName) =>
  path.join(root, 'public', 'guide-images', language, fileName);

const download = async ({ url, targets }) => {
  try {
    const cached = await readFile(targetPath('en', targets.en));
    if (cached.length > 1024) return cached;
  } catch {
    // Fetch a missing or incomplete local asset below.
  }

  const response = await fetch(url, { signal: AbortSignal.timeout(180000) });
  if (!response.ok) throw new Error(`${url} returned ${response.status}.`);
  return Buffer.from(await response.arrayBuffer());
};

for (const language of ['en', 'vi']) {
  await mkdir(path.join(root, 'public', 'guide-images', language), {
    recursive: true
  });
}

for (const [index, entry] of assets.entries()) {
  const buffer = await download(entry);
  await Promise.all(
    Object.entries(entry.targets).map(([language, fileName]) =>
      writeFile(targetPath(language, fileName), buffer)
    )
  );
  console.log(`Prepared ${index + 1}/${assets.length}.`);
}

console.log(`Prepared ${assets.length} official assets for topical guide pages.`);
