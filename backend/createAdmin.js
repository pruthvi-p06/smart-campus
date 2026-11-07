const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

async function createInitialAdmin() {
  const { MONGO_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!MONGO_URI) throw new Error('MONGO_URI is missing from backend/.env');
  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('Set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env before running this script.');
  }
  if (ADMIN_PASSWORD.length < 10) throw new Error('ADMIN_PASSWORD must contain at least 10 characters.');

  await mongoose.connect(MONGO_URI);
  const email = ADMIN_EMAIL.trim().toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role === 'admin') {
      console.log(`[Admin setup] An administrator account already exists for ${email}. No changes made.`);
      return;
    }
    throw new Error(`The email ${email} already belongs to a non-admin account. Choose a different ADMIN_EMAIL.`);
  }

  const admin = await User.create({
    name: ADMIN_NAME.trim(),
    email,
    password: ADMIN_PASSWORD,
    role: 'admin',
    department: 'Administration',
    status: 'active',
  });
  console.log(`[Admin setup] Administrator account created successfully: ${admin.email}`);
  console.log('[Admin setup] Open the website and choose Admin portal to sign in.');
}

createInitialAdmin()
  .catch((error) => {
    console.error(`[Admin setup] ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState) await mongoose.connection.close();
  });
