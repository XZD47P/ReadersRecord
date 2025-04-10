import {integer, sqliteTable, text, primaryKey} from "drizzle-orm/sqlite-core"
import {drizzle} from 'drizzle-orm/better-sqlite3';
import Database from "better-sqlite3";
import type {AdapterAccountType} from "@auth/core/adapters";

// This is the raw SQLite DB instance
const sqlite = new Database("src/lib/db/database.db");

// This is your Drizzle-wrapped version (used elsewhere)
export const db = drizzle(sqlite);

sqlite.exec(`
    CREATE TABLE IF NOT EXISTS user
    (
        id            TEXT PRIMARY KEY,
        name          TEXT,
        email         TEXT UNIQUE,
        emailVerified INTEGER,
        image         TEXT
    );

    CREATE TABLE IF NOT EXISTS account
    (
        userId            TEXT NOT NULL,
        type              TEXT NOT NULL,
        provider          TEXT NOT NULL,
        providerAccountId TEXT NOT NULL,
        refresh_token     TEXT,
        access_token      TEXT,
        expires_at        INTEGER,
        token_type        TEXT,
        scope             TEXT,
        id_token          TEXT,
        session_state     TEXT,
        PRIMARY KEY (provider, providerAccountId),
        FOREIGN KEY (userId) REFERENCES user (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS session
    (
        sessionToken TEXT PRIMARY KEY,
        userId       TEXT    NOT NULL,
        expires      INTEGER NOT NULL,
        FOREIGN KEY (userId) REFERENCES user (id) ON DELETE CASCADE
    );
`);