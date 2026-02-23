import net from 'node:net';
import concurrently from 'concurrently';

const DEFAULT_BACKEND_PORT = Number(process.env.PORT || 5001);
const MAX_PORT_ATTEMPTS = 50;

const isPortFree = (port) =>
  new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port, '0.0.0.0');
  });

const findAvailablePort = async (startPort) => {
  for (let i = 0; i < MAX_PORT_ATTEMPTS; i += 1) {
    const candidate = startPort + i;
    // eslint-disable-next-line no-await-in-loop
    const free = await isPortFree(candidate);
    if (free) {
      return candidate;
    }
  }

  throw new Error(`Unable to find a free port in range ${startPort}-${startPort + MAX_PORT_ATTEMPTS - 1}`);
};

const run = async () => {
  const backendPort = await findAvailablePort(DEFAULT_BACKEND_PORT);
  const apiUrl = `http://127.0.0.1:${backendPort}`;

  const env = {
    ...process.env,
    PORT: String(backendPort),
    BACKEND_PORT: String(backendPort),
    VITE_API_URL: apiUrl,
    VITE_API_BASE_URL: `${apiUrl}/api/v1`
  };

  console.log(`[cigali] backend port selected: ${backendPort}`);
  console.log(`[cigali] frontend API target: ${apiUrl}`);

  const { result } = concurrently(
    [
      {
        name: 'backend',
        command: 'npm run dev --workspace backend',
        env
      },
      {
        name: 'frontend',
        command: 'npm run dev --workspace frontend',
        env
      }
    ],
    {
      prefix: 'name',
      killOthers: ['failure'],
      restartTries: 0
    }
  );

  await result;
};

run().catch((error) => {
  console.error('[cigali] failed to start dev environment', error);
  process.exit(1);
});
