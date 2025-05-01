export default () => ({
    frontendUrl: process.env.FRONTEND_URL || 'https://https://perpustakaan-unsrat.vercel.app',
    // databaseUrl: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_w0KkX7lNtzVM@ep-cool-cake-a11oexey-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
    databaseUrl: process.env.FRONTEND_URL || 'postgresql://postgres:password@localhost:5432/perpustakaan',
  });
  