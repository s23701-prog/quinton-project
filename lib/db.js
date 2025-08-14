// lib/db.js
import Database from "better-sqlite3";

export const db = new Database("posts.db");