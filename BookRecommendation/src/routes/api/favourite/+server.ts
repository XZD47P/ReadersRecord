import type {RequestHandler} from './$types';
import {db, favourites} from '$lib/db/schema'; // your Drizzle setup
import {json} from '@sveltejs/kit';
import {and, eq} from "drizzle-orm";

export const POST: RequestHandler = async ({request}) => {
    const {bookId, userId, favorite} = await request.json();

    if (!userId || !bookId) {
        return json({error: 'Missing user or book ID'}, {status: 400});
    }

    if (favorite) {
        await db.insert(favourites).values({
            user_id: userId,
            book_id: bookId
        }).onConflictDoNothing();
    } else {
        await db.delete(favourites).where(
            and(
                eq(favourites.user_id, userId),
                eq(favourites.book_id, bookId)
            )
        );
    }

    return json({success: true});
};

export const GET: RequestHandler = async ({url}) => {
    const userId = url.searchParams.get('userId');
    const bookId = url.searchParams.get('bookId');

    if (!userId || !bookId) {
        return json({error: 'Missing parameters'}, {status: 400});
    }

    const result = await db
        .select()
        .from(favourites)
        .where(and(
            eq(favourites.user_id, userId),
            eq(favourites.book_id, bookId)
        ));

    return json({isFavorite: result.length > 0});
};