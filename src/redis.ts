import process from 'node:process';

import { Redis } from 'ioredis';

export const redisClient = new Redis(process.env.REDIS_URL, {
  enableAutoPipelining: true,
});

export async function expireAllSessions(userId: string) {
  const sessionListKey = `sessionList:${userId}`;

  const script = `
    local sessionIds = redis.call("LRANGE", KEYS[1], 0, -1)
    for _, sessionId in ipairs(sessionIds) do
      redis.call("DEL", sessionId)
    end
    redis.call("DEL", KEYS[1])
    return #sessionIds
  `;

  await redisClient.eval(script, 1, sessionListKey);
}

export async function registerSessionInList(userId: string, sessionId: string) {
  const sessionListKey = `sessionList:${userId}`;
  await redisClient.rpush(sessionListKey, `sess:${sessionId}`);
}
