import "dotenv/config";
import { User, getServerSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { adapterDB, db } from "@/drizzle";
import { DrizzleAdapter } from "@/drizzle/adapter";
import * as AuthSchema from "@/drizzle/schema/auth";
import {
  pGetSessionAndUser,
  pGetSessionByToken,
  pGetUserByAccount,
  pGetUserByEmail,
  pGetUserById,
  pGetVerificationTokenByToken,
} from "@/drizzle/prepared";
import bcrypt from "bcryptjs";

const NEXTAUTH_SECRET = process.env["NEXTAUTH_SECRET"];
const GOOGLE_CLIENT_ID = process.env["GOOGLE_CLIENT_ID"];
const GOOGLE_CLIENT_SECRET = process.env["GOOGLE_CLIENT_SECRET"];
if (!NEXTAUTH_SECRET)
  throw new Error("NEXTAUTH_SECRET is missing from env variables");
if (!GOOGLE_CLIENT_ID)
  throw new Error("GOOGLE_CLIENT_ID is missing from env variables");
if (!GOOGLE_CLIENT_SECRET)
  throw new Error("GOOGLE_CLIENT_SECRET is missing from env variables");

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(adapterDB, {
    schemas: {
      account: AuthSchema.account,
      session: AuthSchema.session,
      user: AuthSchema.user,
      verificationToken: AuthSchema.verificationToken,
    },
    prepared: {
      getUserByEmail: pGetUserByEmail,
      getUserById: pGetUserById,
      getUserByAccount: pGetUserByAccount,
      getSessionByToken: pGetSessionByToken,
      getSessionAndUser: pGetSessionAndUser,
      getVerificationTokenByToken: pGetVerificationTokenByToken,
    },
  }),
  secret: NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 15 * 60,
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};
        try {
          if (!email || !password) {
            // throw new Error("Missing Fields");
            return null;
          }

          const dbUser = await db.query.user.findFirst({
            where: (user, { eq }) => eq(user.email, email!),
          });

          if (!dbUser) {
            // throw new Error("User does not exist");
            return null;
          }

          const passwordsMatch = await bcrypt.compare(
            password!,
            dbUser.password!
          );

          if (!passwordsMatch) {
            throw new Error("Incorrect Password");
            // return "/signin?error=Incorrect Password";
          }

          return dbUser as any;
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
        session.user.name = token?.name || "asasd";
        session.user.email = token.email;
        session.user.image = token.picture;
      }

      return session;
    },

    jwt: async ({ token, user }) => {
      const dbUser = await db.query.user.findFirst({
        where: (user, { eq }) => eq(user.email, token.email),
      });

      if (!dbUser) {
        if (user) {
          token.id = user.id;
        }
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name || "",
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
