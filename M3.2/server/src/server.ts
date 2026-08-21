import app from './app';

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`========================================================`);
  console.log(`⚡ Dashstack System API Server running on port ${PORT}`);
  console.log(`👉 API Base: http://localhost:${PORT}/api`);
  console.log(`👉 Health:   http://localhost:${PORT}/api/health`);
  console.log(`========================================================`);
});
