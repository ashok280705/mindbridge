import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Doctor from "@/models/Doctor"; // ✅ import your Doctor model
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isDoctor: { label: "Doctor Login", type: "text" }, // 👈 hidden input for role
      },
      async authorize(credentials) {
        await dbConnect();

        let account;

        if (credentials.isDoctor === "true") {
          // ✅ Doctor login
          account = await Doctor.findOne({ email: credentials.email });
        } else {
          // ✅ User login
          account = await User.findOne({ email: credentials.email });
        }

        if (!account) throw new Error("No account found");

        const isValid = await bcrypt.compare(
          credentials.password,
          account.password
        );
        if (!isValid) throw new Error("Invalid password");

        // ✅ return plain object
        return {
          id: account._id.toString(),
          name: account.name,
          email: account.email,
          isDoctor: credentials.isDoctor === "true",
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.isDoctor = token.isDoctor || false;
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isDoctor = user.isDoctor || false;
      }
      return token;
    },
  },

  pages: {
    signIn: "/signin",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };