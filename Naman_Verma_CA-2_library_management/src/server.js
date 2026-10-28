const fs = require('fs');
const path = require('path');
const rootEnvPath = path.resolve(__dirname, '..', '.env');
const envPath = fs.existsSync(rootEnvPath)
  ? rootEnvPath
  : path.resolve(__dirname, '.env');

require('dotenv').config({ path: envPath });
const mongoose = require('mongoose');
const app = require('./app');

const port = Number(process.env.PORT) || 3000;
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('MONGODB_URI is required');
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => {
    app.listen(port, () => {
      console.log(`Library API listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });
