const app = require('./src/app');
const connectDB = require('./src/config/db');
const { env, assertEnv } = require('./src/config/env');

const start = async () => {
  assertEnv();
  await connectDB();
  app.listen(env.port, () => console.log(`Server running on http://localhost:${env.port}`));
};

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
