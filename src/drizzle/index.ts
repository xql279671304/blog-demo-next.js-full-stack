import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as AuthSchema from "./schema/auth";
import * as BlogSchema from "./schema/blog";

const databaseURL = process.env["DATABASE_URL"];
if (!databaseURL) throw new Error("Enviromental database Url not");

const connection = postgres(databaseURL, {
  max: 20, // Set the maximum number of clients in the pool
  idle_timeout: 30, // Set idle timeout in seconds
  connect_timeout: 10, // Set connect timeout in seconds
});

export const adapterDB = drizzle(connection);
export const db = drizzle(connection, {
  schema: { ...AuthSchema, ...BlogSchema },
});

export type DbClient = typeof db;
