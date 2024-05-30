import { defineConfig } from "drizzle-kit";
import "dotenv/config";

const databaseURL = process.env["DATABASE_URL"];
if (!databaseURL) throw new Error("Enviromental database Url not");

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/drizzle/schema/*",
  out: "./src/drizzle/migrations",
  dbCredentials: {
    url: databaseURL,
  },
});
