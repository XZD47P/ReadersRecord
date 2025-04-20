import {redirect, type Handle} from "@sveltejs/kit";
import {handle as authenticationHandle} from "$lib/server/auth";
import {sequence} from "@sveltejs/kit/hooks";

const authorizationHandle: Handle = async ({event, resolve}) => {
    if (event.url.pathname === "/profile") {
        const session = await event.locals.auth();
        if (!session) {
            throw redirect(303, "/login");
        }
    }


    return resolve(event);
}

export const handle: Handle = sequence(authenticationHandle, authorizationHandle);