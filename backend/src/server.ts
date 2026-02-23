import { app } from './app';
import { connectDb } from './config/db';
import { ensureDemoUsers, seedIfEmpty, verifyDemoLoginPipeline } from './seed';

const startServer = async (): Promise<void> => {
  try {
    const dbConnected = await connectDb();
    if (dbConnected) {
      await seedIfEmpty();
      await ensureDemoUsers();
    }

    await verifyDemoLoginPipeline();

    const PORT = process.env.PORT || 5001;
    app.listen(Number(PORT), '0.0.0.0', () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[CIGALI] Failed to start server', error);
    process.exit(1);
  }
};

void startServer();
