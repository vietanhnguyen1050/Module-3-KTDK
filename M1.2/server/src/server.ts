import app from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Edupress API Server is running on port ${PORT}`);
  console.log(`👉 API Base URL: http://localhost:${PORT}/api`);
  console.log(`👉 Health check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
