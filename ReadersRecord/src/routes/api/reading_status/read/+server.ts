import {json, type RequestHandler} from "@sveltejs/kit";
import {alreadyRead, db} from "$lib/db/schema";
import {eq} from "drizzle-orm";


export const GET: RequestHandler = async ({url}) => {
    const userId = url.searchParams.get('userId');

    if (!userId) {
        return json({error: 'Missing user!'}, {status: 401});
    }

    const res = await db.select({
        bookId: alreadyRead.book_id,
        title: alreadyRead.title,
        thumbnailUrl: alreadyRead.thumbnail
    })
        .from(alreadyRead)
        .where(eq(alreadyRead.user_id, userId));

    return json({read: res});
}