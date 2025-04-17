import {json} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";
import {db} from "$lib/db/schema";

export const GET: RequestHandler = async ({params, locals}) => {
    const session = await locals.auth();

    if (!session) {
        return new Response("Unauthorized", {status: 401});
    }

    const {book_id} = params;
    const row = await db.select({
        rating: book_ratings.rating,
    })
}