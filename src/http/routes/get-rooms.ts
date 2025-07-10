import { count, eq } from 'drizzle-orm';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { db } from '../../db/connection.ts';
import { schema } from '../../db/schema/index.ts';

export const getRoomsRoute: FastifyPluginCallbackZod = (app) => {
  app.get('/rooms', async () => {
    const results = await db
      .select({
        id: schema.rooms.id,
        name: schema.rooms.name,
        questions_count: count(schema.questions.id),
        created_at: schema.rooms.created_at,
      })
      .from(schema.rooms)
      .leftJoin(schema.questions, eq(schema.questions.room_id, schema.rooms.id))
      .groupBy(schema.rooms.id, schema.rooms.name)
      .orderBy(schema.rooms.created_at);

    return results;
  });
};
