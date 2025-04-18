import {json} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";
import {db, book_ratings} from "$lib/db/schema";
import {and, eq, sql} from "drizzle-orm";

export const GET: RequestHandler = async ({params, locals}) => {
    const session = await locals.auth();

    if (!session) {
        return new Response("Unauthorized", {status: 401});
    }

    const {book_id} = params;
    const row = await db.select({
        rating: book_ratings.rating,
        comment: book_ratings.comment
    }).from(book_ratings)
        .where(
            and(
                //@ts-ignore
                eq(book_ratings.user_id, session.user?.id),
                eq(book_ratings.book_id, book_id)
            )
        );

    console.log(row[0]);
    return json(row[0] || {});
}

export const POST: RequestHandler = async ({params, locals, request}) => {
    const session = await locals.auth();

    if (!session) {
        return new Response("Unauthorized", {status: 401});
    }

    const {rating, comment} = await request.json();
    const {book_id} = params;

    await db.insert(book_ratings)
        .values({
            //@ts-ignore
            user_id: session.user?.id,
            book_id: book_id,
            rating: rating,
            comment: comment
        })
        .onConflictDoUpdate({
            target: [book_ratings.user_id, book_ratings.book_id],
            set: {
                rating: sql`${sql.raw('excluded.rating')}`,
                comment: sql`${sql.raw('excluded.comment')}`
            }
        });

    return json({success: true});
}