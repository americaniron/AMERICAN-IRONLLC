const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const client = await pool.connect();
  try {
    const catResult = await client.query(
      `SELECT category, COUNT(*) as cnt FROM parts GROUP BY category ORDER BY cnt DESC`
    );
    const categories = catResult.rows;
    const totalParts = categories.reduce((s, c) => s + parseInt(c.cnt), 0);
    const totalImages = 975;
    let imageIndex = 0;

    for (const cat of categories) {
      const catCount = parseInt(cat.cnt);
      const imagesForCat = Math.max(1, Math.round((catCount / totalParts) * totalImages));
      const startIdx = imageIndex;
      const endIdx = Math.min(imageIndex + imagesForCat, totalImages);
      const catImageCount = endIdx - startIdx;

      console.log(`${cat.category}: ${catCount} parts, images ${startIdx + 1}-${endIdx}`);

      const partsResult = await client.query(
        `SELECT id, ROW_NUMBER() OVER (ORDER BY id) - 1 as rn FROM parts WHERE category = $1 ORDER BY id`,
        [cat.category]
      );

      const batchSize = 500;
      for (let b = 0; b < partsResult.rows.length; b += batchSize) {
        const batch = partsResult.rows.slice(b, b + batchSize);
        const cases = batch.map((row) => {
          const imgNum = startIdx + (parseInt(row.rn) % catImageCount) + 1;
          const imgPath = `/images/parts/items/part-${String(imgNum).padStart(4, '0')}.png`;
          return `WHEN ${row.id} THEN '${imgPath}'`;
        }).join(' ');
        const ids = batch.map(r => r.id).join(',');
        await client.query(`UPDATE parts SET image_url = CASE id ${cases} END WHERE id IN (${ids})`);
      }

      imageIndex = endIdx;
      if (imageIndex >= totalImages) imageIndex = 0;
    }

    const verify = await client.query(
      `SELECT COUNT(DISTINCT image_url) as unique_images FROM parts WHERE image_url LIKE '/images/parts/items/%'`
    );
    console.log(`Done! ${verify.rows[0].unique_images} unique images assigned`);
  } finally {
    client.release();
    await pool.end();
  }
}
main().catch(console.error);
