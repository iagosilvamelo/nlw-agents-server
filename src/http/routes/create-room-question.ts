import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { db } from '../../db/connection.ts';
import { schema } from '../../db/schema/index.ts';

export const createRoomQuestionRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:room_id/questions',
    {
      schema: {
        params: z.object({
          room_id: z.string(),
        }),
        body: z.object({
          question: z.string().min(1),
        }),
      },
    },
    async (request, reply) => {
      const { room_id } = request.params;
      const { question } = request.body;

      const result = await db
        .insert(schema.questions)
        .values({ room_id, question })
        .returning();

      const insertedRoomQuestion = result[0];

      if (!insertedRoomQuestion) {
        throw new Error('Failed to create new question.');
      }

      return reply.status(201).send({ question_id: insertedRoomQuestion.id });
    }
  );
};
