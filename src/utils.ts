import cuid2 from '@paralleldrive/cuid2';

const createId = cuid2.init({
  length: 20,
});

export function toQueryString(params: Record<string, string | number | null | boolean>): string {
  return Object.keys(params)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
}

export const genReqIdAmznTraceId = (req) => {
  const traceId = req.headers['X-Amzn-Trace-Id'];

  if (traceId) {
    return Array.isArray(traceId) ? traceId[0] : traceId;
  }

  return createId();
};
