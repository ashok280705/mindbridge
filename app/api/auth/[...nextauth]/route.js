import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({ email: credentials.email });

        if (!user) throw new Error("No user found");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        // ✅ NextAuth expects a plain object — NOT a full mongoose doc
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          googleId: user.googleId || null,
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
      await dbConnect();

      if (account.provider === "google") {
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          // Create new Google user
          await User.create({
            name: user.name,
            email: user.email,
            googleId: profile.sub,
          });
        } else if (!existingUser.googleId) {
          existingUser.googleId = profile.sub;
          await existingUser.save();
        }
      }

      return true;
    },

    async session({ session, token }) {
      await dbConnect();
      const dbUser = await User.findOne({ email: session.user.email });

      if (dbUser) {
        session.user.id = dbUser._id.toString();
        session.user.googleId = dbUser.googleId || null;
      }

      return session;
    },

    async jwt({ token, user }) {
      // When using credentials, `user` only exists on first sign in
      if (user) {
        token.id = user.id;
        token.googleId = user.googleId || null;
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