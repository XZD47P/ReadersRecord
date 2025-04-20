import type {RequestHandler} from './$types';
import {alreadyRead, currentlyReading, db} from '$lib/db/schema'; // your Drizzle setup
import {json} from '@sveltejs/kit';
import {and, eq} from "drizzle-orm";

export const POST: RequestHandler = async ({request}) => {
    const {bookId, userId, title, thumbnail, reading} = await request.json();

    if (!userId || !bookId) {
        return json({error: 'Missing user or book ID'}, {status: 400});
    }
    if (reading) {

        const existing = await db
            .select()
            .from(currentlyReading)
            .where(eq(currentlyReading.user_id, userId));

        if (existing.length > 0) {
            return json(
                {error: 'You already have a book marked as currently reading.\n Please remove it first, then try again!'},
                {status: 409}
            );
        }

        await db.insert(currentlyReading).values({
            user_id: userId,
            book_id: bookId,
            title: title,
            thumbnail: thumbnail
        })

        await db.delete(alreadyRead).where(
            and(
                eq(alreadyRead.user_id, userId),
                eq(alreadyRead.book_id, bookId)
            )
        )
    } else {
        await db.insert(alreadyRead).values({
            user_id: userId,
            book_id: bookId,
            title: title,
            thumbnail: thumbnail
        })

        await db.delete(currentlyReading).where(
            and(
                eq(currentlyReading.user_id, userId),
                eq(currentlyReading.book_id, bookId)
            )
        )
    }
    return json({success: true});
}

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
            .from(currentlyReading)
            .where(and(
                eq(currentlyReading.user_id, userId),
                eq(currentlyReading.book_id, bookId)
            ));

        return json({isReading: result.length > 0});
    } else { //Ha nincs, akkor kérje le a felhasználó összes kedvenc könyvét
        const result = await db
            .select({
                bookId: currentlyReading.book_id,
                title: currentlyReading.title,
                thumbnailUrl: currentlyReading.thumbnail
            })
            .from(currentlyReading)
            .where(eq(currentlyReading.user_id, userId));

        return json({read: result});
    }
}