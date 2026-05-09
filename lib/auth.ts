import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import bcrypt from "bcryptjs";
import { loginSchema } from "./validations";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = await loginSchema.parseAsync(credentials);

          // Try to find admin user
          const admin = await db.admin.findUnique({
            where: { email },
          });

          if (!admin) {
            throw new Error("Invalid credentials");
          }

          const isPasswordValid = await bcrypt.compare(password, admin.password);

          if (!isPasswordValid) {
            throw new Error("Invalid credentials");
          }

          return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
});

export async function createAdminIfNotExists() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD ;

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set before creating the admin user.");
  }

  const existingAdmin = await db.admin.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await db.admin.create({
      data: {
        email: adminEmail,
        name: "Admin",
        password: hashedPassword,
      },
    });

    console.log("Admin user created with email:", adminEmail);
  }
}
