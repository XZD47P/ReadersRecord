import {SvelteKitAuth} from "@auth/sveltekit";
import GitHub from "@auth/core/providers/github";
import Credentials from "@auth/core/providers/credentials";
import {GITHUB_ID, GITHUB_SECRET, AUTH_SECRET} from "$env/static/private";
import {compareSync, hash} from "@node-rs/bcrypt";
import {DrizzleAdapter} from "@auth/drizzle-adapter";
import {drizzle} from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3'
import {db, users} from "$lib/db/schema"
import {eq} from "drizzle-orm";


//SvelteKitAuth generál egy pár objectet, ebből mi szeretnénk a handle objectet
//Pl ha a Github válaszol, akkor ezzel a "handle"-lel kezeljük
export const {handle, signIn, signOut} = SvelteKitAuth({
    providers: [
        GitHub({
            clientId: GITHUB_ID,
            clientSecret: GITHUB_SECRET
        }),
        //TODO: Befejezni
        Credentials({
            //credentials object felel azért, hogy mit várunk el a felhasználótól, hogy megadjon
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                let user = null;

                // @ts-ignore
                const passwordHash = hash(credentials.password, 12);

                // @ts-ignore
                user = await getUserFromDb(credentials.email, passwordHash);

                if (!user) {
                    throw new Error("Invalid credentials.")
                }
                return user;
            },
        })
        //További providerek jöhetnek ide, ha kell
    ],
    secret: AUTH_SECRET,
    adapter: DrizzleAdapter(db),
})

async function getUserFromDb(email: string, password: string) {
    const userFromDB = await db.select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)
        .execute();

    if (!userFromDB) {
        throw new Error("No user found.");
    }

    const foundUser = userFromDB[0];
    // @ts-ignore
    const isPasswordValid = compareSync(password, foundUser.password);

    if (!isPasswordValid) {
        throw new Error("Invalid username or password");
    }

    return foundUser;
}