import type {RequestHandler} from "@sveltejs/kit";
import bcrypt from "@node-rs/bcrypt";
import {db, users} from "$lib/db/schema";
import {eq} from "drizzle-orm";

export const POST: RequestHandler = async ({request}) => {
    const {name, email, password} = await request.json();

    if (!name || !email || !password) {
        return new Response(JSON.stringify({error: "Missing fields"}), {status: 400})
    }

    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
        return new Response(JSON.stringify({error: 'User already exists'}), {status: 400});
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.insert(users).values({
        name,
        email,
        password: hashedPassword
    });

    return new Response(JSON.stringify({success: true}), {status: 200});

}