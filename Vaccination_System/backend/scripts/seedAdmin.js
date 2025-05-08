const mongoose = require('mongoose');
const adminModal = require('../src/models/adminModel');
require('dotenv').config();

async function seedAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await adminModal.findOne({ username: 'admin' });
  if (existing) {
    console.log('Admin user already exists');
    return process.exit();
  }

  const admin = new adminModal({
    username: 'admin',
    password: 'admin',
  });

  await admin.save();
  console.log('Admin user created');
  process.exit();
}

seedAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});