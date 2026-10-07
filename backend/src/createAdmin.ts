import "dotenv/config";
import bcrypt from "bcryptjs";

import connectDB from "./config/db";
import Admin from "./models/Admin";

const createAdmin = async () => {
    try {
        await connectDB();

        const email = "admin@radhikacopyhouse.com";
        const password = "ChangeThisPassword123!";

        const existingAdmin = await Admin.findOne({
            email,
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(
            password,
            12
        );

        await Admin.create({
            name: "Radhika Admin",
            email,
            password: hashedPassword,
            role: "admin",
            isActive: true,
        });

        console.log("Admin created successfully");
        console.log("Email:", email);
        console.log("Password:", password);

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createAdmin();