import {SvelteKitAuth} from "@auth/sveltekit";
import GitHub from "@auth/core/providers/github";
import Credentials from "@auth/core/providers/credentials";
import {GITHUB_ID, GITHUB_SECRET, AUTH_SECRET} from "$env/static/private";
import {hash} from "@node-rs/bcrypt";
import {DrizzleAdapter} from "@auth/drizzle-adapter";
import {drizzle} from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3'
import {db} from "$lib/db/schema"

import * as schema from "$lib/db/schema";

// const db = drizzle(new Database('src/lib/db/database.db'), {schema});


//SvelteKitAuth generál egy pár objectet, ebből mi szeretnénk a handle objectet
//Pl ha a Github válaszol, akkor ezzel a "handle"-lel kezeljük
export const {handle, signIn, signOut} = SvelteKitAuth({
    providers: [
        GitHub({
            clientId: GITHUB_ID,
            clientSecret: GITHUB_SECRET
        }),
        // Credentials({
        //     //credentials object felel azért, hogy mit várunk el a felhasználótól, hogy megadjon
        //     credentials: {
        //         email: {},
        //         password: {},
        //     },
        //     authorize: async (credentials) => {
        //         let user = null;
        //
        //         // @ts-ignore
        //         const passwordHash = hash(credentials.password, 12);
        //
        //         user = await getUserFromDb(credentials.email, passwordHash);
        //
        //         if (!user) {
        //             throw new Error("Invalid credentials.")
        //         }
        //         return user;
        //     }
        // })
        //További providerek jöhetnek ide, ha kell
    ],
    secret: AUTH_SECRET,
    adapter: DrizzleAdapter(db),
})