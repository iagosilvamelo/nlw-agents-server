import { desc, eq } from 'drizzle-orm';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { db } from '../../db/connection.ts';
import { schema } from '../../db/schema/index.ts';

export const getRoomQuestionsRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/rooms/:id/questions',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request) => {
      const { id } = request.params;

      const result = await db
        .select({
          id: schema.questions.id,
          question: schema.questions.question,
          answer: schema.questions.answer,
          created_at: schema.questions.created_at,
        })
        .from(schema.questions)
        .where(eq(schema.questions.room_id, id))
        .orderBy(desc(schema.questions.created_at));

      return result;
    }
  );
};
