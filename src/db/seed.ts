import { reset, seed } from 'drizzle-seed';
import { db, sql } from './connection.ts';
import { schema } from './schema/index.ts';

await reset(db, schema);

await seed(db, schema).refine((faker) => {
  return {
    rooms: {
      count: 4,
      columns: {
        name: faker.companyName(),
        description: faker.loremIpsum(),
      },
    },
    questions: {
      count: 20,
    },
  };
});

await sql.end();

// biome-ignore lint/suspicious/noConsole: only in ded
console.log('Database seeded');
