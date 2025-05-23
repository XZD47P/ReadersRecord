import {json} from '@sveltejs/kit';
import type {RequestHandler} from './$types';
import {book_ratings, db, users} from '$lib/db/schema';
import {eq} from "drizzle-orm";

export const GET: RequestHandler = async ({params}) => {
    const {book_id} = params;

    const rows = await db.select({
        username: users.name,
        rating: book_ratings.rating,
        comment: book_ratings.comment,
    })
        .from(book_ratings)
        .innerJoin(users, eq(book_ratings.user_id, users.id))
        .where(
            eq(book_ratings.book_id, book_id)
        );

    const average =
        rows.length > 0 ? rows.reduce((sum, r) => sum + r.rating, 0) / rows.length : null;

    return json({
        averageRating: average ? Number(average.toFixed(1)) : null,
        reviewCount: rows.length,
        reviews: rows
    });
};