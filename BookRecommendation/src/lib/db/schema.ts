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
        password      TEXT,
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

    CREATE TABLE IF NOT EXISTS book_rating
    (
        user_id TEXT    NOT NULL,
        book_id TEXT    NOT NULL,
        rating  INTEGER NOT NULL,
        comment TEXT,
        PRIMARY KEY (user_id, book_id),
        FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS favourite
    (
        user_id   TEXT NOT NULL,
        book_id   TEXT NOT NULL,
        title     TEXT NOT NULL,
        thumbnail TEXT NOT NULL,
        PRIMARY KEY (user_id, book_id),
        FOREIGN KEY (user_id) references user (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS currently_reading
    (
        user_id   TEXT NOT NULL,
        book_id   TEXT NOT NULL,
        title     TEXT NOT NULL,
        thumbnail TEXT NOT NULL,
        PRIMARY KEY (user_id, book_id),
        FOREIGN KEY (user_id) references user (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS already_read
    (
        user_id   TEXT NOT NULL,
        book_id   TEXT NOT NULL,
        title     TEXT NOT NULL,
        thumbnail TEXT NOT NULL,
        PRIMARY KEY (user_id, book_id),
        FOREIGN KEY (user_id) references user (id) ON DELETE CASCADE
    );
`);

export const users = sqliteTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    password: text("password"),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: integer("emailVerified", {mode: "timestamp_ms"}),
    image: text("image"),
})

export const accounts = sqliteTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, {onDelete: "cascade"}),
        type: text("type").$type<AdapterAccountType>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    })
)

export const sessions = sqliteTable(
    "session",
    {
        sessionToken: text("sessionToken").primaryKey(),
        userId: text("userId")
            .notNull()
            .references(() => users.id, {onDelete: "cascade"}),
        expires: integer("expires", {mode: "timestamp_ms"}).notNull(),
    })

export const book_ratings = sqliteTable(
    "book_rating",
    {
        user_id: text("user_id")
            .notNull()
            .references(() => users.id, {onDelete: "cascade"}),
        book_id: text("book_id")
            .notNull(),
        rating: integer("rating")
            .notNull(),
        comment: text("comment")
    },
    (book_rating) => ({
        compoundKey: primaryKey({
            columns: [book_rating.user_id, book_rating.book_id]
        })
    })
)

export const favourites = sqliteTable(
    "favourite",
    {
        user_id: text("user_id")
            .notNull()
            .references(() => users.id, {onDelete: "cascade"}),
        book_id: text("book_id").notNull(),
        title: text("title").notNull(),
        thumbnail: text("thumbnail").notNull(),
    },
    (favourite) => ({
        compoundKey: primaryKey({
            columns: [favourite.user_id, favourite.book_id]
        })
    })
)

export const currentlyReading = sqliteTable(
    "currently_reading",
    {
        user_id: text("user_id")
            .notNull()
            .unique()
            .references(() => users.id, {onDelete: "cascade"}),
        book_id: text("book_id").notNull(),
        title: text("title").notNull(),
        thumbnail: text("thumbnail").notNull(),
    },
    (favourite) => ({
        compoundKey: primaryKey({
            columns: [favourite.user_id, favourite.book_id]
        })
    })
)

export const alreadyRead = sqliteTable(
    "already_read",
    {
        user_id: text("user_id")
            .notNull()
            .references(() => users.id, {onDelete: "cascade"}),
        book_id: text("book_id").notNull(),
        title: text("title").notNull(),
        thumbnail: text("thumbnail").notNull(),
    },
    (favourite) => ({
        compoundKey: primaryKey({
            columns: [favourite.user_id, favourite.book_id]
        })
    })
)