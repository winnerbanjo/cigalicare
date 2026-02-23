/* eslint-disable no-console */
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cigali';
const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12);

const providerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String },
    subscriptionPlan: {
      type: String,
      enum: ['starter', 'growth', 'enterprise'],
      default: 'starter'
    },
    logoUrl: { type: String }
  },
  { timestamps: true, versionKey: false }
);

const userSchema = new mongoose.Schema(
  {
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'doctor', 'pharmacy'], required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true, versionKey: false }
);

const Provider = mongoose.models.Provider || mongoose.model('Provider', providerSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);

const DEMO_USERS = [
  {
    name: 'Demo Doctor',
    email: 'demo@cigali.com',
    password: 'password123',
    role: 'doctor'
  },
  {
    name: 'Demo Admin',
    email: 'admin@cigali.com',
    password: 'password123',
    role: 'admin'
  }
];

const seed = async () => {
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log(`[seed] connected to MongoDB: ${mongoUri}`);

    const providerEmail = 'demo-provider@cigali.com';
    const providerName = 'CIGALI Demo Clinic';

    const provider = await Provider.findOneAndUpdate(
      { email: providerEmail },
      {
        $set: {
          name: providerName,
          email: providerEmail,
          phone: '+1 555 010 2000',
          subscriptionPlan: 'growth'
        }
      },
      { new: true, upsert: true, runValidators: false }
    );

    for (const demoUser of DEMO_USERS) {
      const hashedPassword = await bcrypt.hash(demoUser.password, saltRounds);

      await User.findOneAndUpdate(
        { email: demoUser.email },
        {
          $set: {
            providerId: provider._id,
            name: demoUser.name,
            role: demoUser.role,
            password: hashedPassword,
            isActive: true
          }
        },
        { new: true, upsert: true, runValidators: false }
      );

      console.log(`[seed] upserted ${demoUser.role}: ${demoUser.email}`);
    }

    console.log('[seed] demo users ready');
    console.log('Doctor  -> demo@cigali.com / password123');
    console.log('Admin   -> admin@cigali.com / password123');
  } catch (error) {
    console.error('[seed] failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

void seed();
