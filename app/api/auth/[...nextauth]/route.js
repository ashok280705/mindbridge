import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Doctor from "@/models/Doctor";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isDoctor: { label: "Doctor Login", type: "text" },
      },
      async authorize(credentials) {
        await dbConnect();
        let account;

        if (credentials.isDoctor === "true") {
          account = await Doctor.findOne({ email: credentials.email });
        } else {
          account = await User.findOne({ email: credentials.email });
        }

        if (!account) throw new Error("No account found");

        const isValid = await bcrypt.compare(
          credentials.password,
          account.password
        );
        if (!isValid) throw new Error("Invalid password");

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
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        await dbConnect();
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            googleId: profile.sub, // Save Google ID!
          });
        }
      }
      return true;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.isDoctor = token.isDoctor || false;
      session.user.googleId = token.googleId || null; // ✅ Add Google ID!
      return session;
    },

    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id || token.id;
        token.isDoctor = user.isDoctor || false;
        if (profile?.sub) {
          token.googleId = profile.sub; // ✅ Save Google ID!
        }
      }
      return token;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };