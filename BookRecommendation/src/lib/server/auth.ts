import {SvelteKitAuth} from "@auth/sveltekit";
import GitHub from "@auth/core/providers/github";
import Credentials from "@auth/core/providers/credentials";
import {GITHUB_ID, GITHUB_SECRET, AUTH_SECRET} from "$env/static/private";
import bcrypt, {compareSync, hash} from "@node-rs/bcrypt";
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

                //@ts-ignore
                const foundUsers = await db.select().from(users).where(eq(users.email, credentials.email));
                const user = foundUsers[0];

                if (!user) {
                    throw new Error("User not found");
                }

                //@ts-ignore
                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) {
                    throw new Error("Invalid credentials");
                }

                return user;
            },
        })
        //További providerek jöhetnek ide, ha kell
    ],
    secret: AUTH_SECRET,
    adapter: DrizzleAdapter(db),
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },
        async session({session, token}) {
            if (token) {
                //@ts-ignore
                session.user.id = token.id;
                //@ts-ignore
                session.user.email = token.email;
                session.user.name = token.name;
            }
            return session;
        }
    }
})