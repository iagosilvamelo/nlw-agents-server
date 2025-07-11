import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { db } from '../../db/connection.ts';
import { schema } from '../../db/schema/index.ts';
import { generateEmbeddings, trancribeAudio } from '../../services/gemini.ts';

export const uploadAudio: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:room_id/audio',
    {
      schema: {
        params: z.object({
          room_id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { room_id } = request.params;
      const audio = await request.file();

      if (!audio) {
        throw new Error('Audio is required.');
      }

      const audioBuffer = await audio.toBuffer();
      const audioAsBase64 = audioBuffer.toString('base64');

      const transcription = await trancribeAudio(audioAsBase64, audio.mimetype);
      const embeddings = await generateEmbeddings(transcription);

      const result = await db
        .insert(schema.audioChunks)
        .values({
          room_id,
          transcription,
          embeddings,
        })
        .returning();

      const chunk = result[0];

      if (!chunk) {
        throw new Error('Erro ao salvar chunk do áudio.');
      }

      return reply.status(201).send({ chunk_id: chunk.id });
    }
  );
};
