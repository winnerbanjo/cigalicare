import { app } from './app';
import { connectDb } from './config/db';
import { env } from './config/env';
import { ensureDemoUsers, seedIfEmpty, verifyDemoLoginPipeline } from './seed';
import { findAvailablePort } from './utils/port';

const startServer = async (): Promise<void> => {
  try {
    const dbConnected = await connectDb();
    if (dbConnected) {
      await seedIfEmpty();
      await ensureDemoUsers();
    }

    await verifyDemoLoginPipeline();

    const selectedPort = await findAvailablePort(env.port, env.bindHost);
    app.listen(selectedPort, env.bindHost, () => {
      // eslint-disable-next-line no-console
      console.log(`[CIGALI] API listening on http://${env.bindHost}:${selectedPort}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[CIGALI] Failed to start server', error);
    process.exit(1);
  }
};

void startServer();
