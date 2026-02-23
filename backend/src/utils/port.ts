import net from 'node:net';

const DEFAULT_MAX_ATTEMPTS = 50;

const isPortFree = async (port: number, host: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once('error', () => {
      resolve(false);
    });

    server.once('listening', () => {
      server.close(() => resolve(true));
    });

    server.listen(port, host);
  });
};

export const findAvailablePort = async (
  startPort: number,
  host: string,
  maxAttempts = DEFAULT_MAX_ATTEMPTS
): Promise<number> => {
  for (let offset = 0; offset < maxAttempts; offset += 1) {
    const candidate = startPort + offset;
    // eslint-disable-next-line no-await-in-loop
    const free = await isPortFree(candidate, host);
    if (free) {
      return candidate;
    }
  }

  throw new Error(`No available port found in range ${startPort}-${startPort + maxAttempts - 1}`);
};
