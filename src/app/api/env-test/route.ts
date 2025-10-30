export async function GET() {
  // Only return non-sensitive environment variables
  const envVars = {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT,
  };
  
  return Response.json({
    envVars,
    message: 'Environment variables loaded'
  });
}