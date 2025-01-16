import { FastifyReply, FastifyRequest } from 'fastify';

export async function verifyApiKey(req: FastifyRequest, reply: FastifyReply) {
  const authHeader = req.headers['x-api-key'];

  if (!authHeader || authHeader !== process.env.API_KEY) {
    reply.status(401).send({
      message: 'Not authenticated',
    });
  }
}
