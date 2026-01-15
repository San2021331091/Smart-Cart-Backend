import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { sequelize } from './config/db.js';
import { registerRoutes } from './routes/routes.js';
import { registerAdminRoutes } from './routes/admin.routes.js';

dotenv.config();

const app = Fastify({ logger: true });

// -------------------- CORS --------------------
await app.register(cors, { origin: '*' });

// -------------------- JWT --------------------
import fastifyJwt from '@fastify/jwt';
const jwtSecret = process.env.SUPABASE_JWT_SECRET;
if (!jwtSecret) throw new Error('SUPABASE_JWT_SECRET not set');
app.register(fastifyJwt, { secret: jwtSecret });

// -------------------- Auth decorator --------------------
app.decorate('authenticate', async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch {
    reply.code(401).send({ error: 'Unauthorized' });
  }
});

// -------------------- Routes --------------------
await registerRoutes(app);
await registerAdminRoutes(app);

// -------------------- Start server --------------------
async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    const PORT = Number(process.env.PORT || 8900);
    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`🛠️ Admin Panel: http://localhost:${PORT}/admin`);
  } catch (err) {
    console.error('❌ Server failed:', err);
    process.exit(1);
  }
}

start();
