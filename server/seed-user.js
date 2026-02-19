const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

dotenv.config();

const { MONGODB_URL } = process.env;

if (!MONGODB_URL) {
  console.error("MONGODB_URL is not defined");
  process.exit(1);
}

async function seedUser() {
  try {
    await mongoose.connect(MONGODB_URL);

    const email = "admin@example.com";
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.userName = "superadmin";
      existingUser.role = "superadmin";
      existingUser.isApproved = true;
      await existingUser.save();

      console.log("Existing user updated to superadmin");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 12);

    await User.create({
      userName: "superadmin",
      email,
      password: hashedPassword,
      role: "superadmin",
      isApproved: true,
    });

    console.log("Superadmin user created successfully");
  } catch (error) {
    console.error("Error seeding admin user", error);
  } finally {
    await mongoose.disconnect();
  }
}

seedUser();
