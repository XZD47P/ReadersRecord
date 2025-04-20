import type {RequestHandler} from './$types';
import {db, favourites} from '$lib/db/schema'; // your Drizzle setup
import {json} from '@sveltejs/kit';
import {and, eq} from "drizzle-orm";

export const POST: RequestHandler = async ({request}) => {
    const {bookId, userId, title, thumbnail, favorite} = await request.json();

    if (!userId || !bookId) {
        return json({error: 'Missing user or book ID'}, {status: 400});
    }

    if (favorite) {
        await db.insert(favourites).values({
            user_id: userId,
            book_id: bookId,
            title: title,
            thumbnail: thumbnail
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

    if (!userId) {
        return json({error: 'Missing user!'}, {status: 400});
    }

    // Ha a bookId megvan adva, akkor keressen egy specifikus könyv állapotát
    if (bookId) {
        const result = await db
            .select()
            .from(favourites)
            .where(and(
                eq(favourites.user_id, userId),
                eq(favourites.book_id, bookId)
            ));

        return json({isFavorite: result.length > 0});
    } else { //Ha nincs, akkor kérje le a felhasználó összes kedvenc könyvét
        const result = await db
            .select({
                bookId: favourites.book_id,
                title: favourites.title,
                thumbnailUrl: favourites.thumbnail
            })
            .from(favourites)
            .where(eq(favourites.user_id, userId));

        return json({favourites: result});
    }
};