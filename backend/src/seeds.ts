import pool from './db.js';
import { QUESTION_BANK } from './questionBank.js';

export const seedQuestionsIfEmpty = async () => {
  const existingRows = await pool.query('SELECT text, language, "order" FROM "Question"');
  const existingKeys = new Set(
    existingRows.rows.map((row) => `${Number(row.order) || 0}:${String(row.language || 'hinglish').toLowerCase()}`)
  );

  let inserted = 0;

  for (const question of QUESTION_BANK) {
    const variants = [
      {
        language: 'hinglish',
        text: question.hinglish,
        options: question.options.map((option) => ({
          text: option.hinglish,
          stream: option.stream,
          weight: option.weight
        }))
      },
      {
        language: 'english',
        text: question.english,
        options: question.options.map((option) => ({
          text: option.english,
          stream: option.stream,
          weight: option.weight
        }))
      }
    ];

    for (const variant of variants) {
      const key = `${question.order}:${variant.language}`;
      if (existingKeys.has(key)) {
        continue;
      }

      await pool.query(
        `INSERT INTO "Question" (text, options, category, "order", hidden, fixed, language, "createdAt")
         VALUES ($1, $2, $3, $4, FALSE, FALSE, $5, NOW())`,
        [variant.text, JSON.stringify(variant.options), question.category, question.order, variant.language]
      );
      existingKeys.add(key);
      inserted += 1;
    }
  }

  if (inserted > 0) {
    console.log(`Seeded ${inserted} missing question variants.`);
  }
};
