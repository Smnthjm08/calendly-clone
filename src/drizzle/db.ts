import { neon } from "@neondatabase/serverless";  // Neon HTTP driver
import { drizzle } from "drizzle-orm/neon-http";  // Drizzle ORM with Neon HTTP support
import * as schema from "./schema";


const sql = neon(process.env.DATABASE_URL!);  // This is HTTP-based when using `neon-http`
export const db = drizzle(sql, { schema });  // Use Drizzle with the schema
