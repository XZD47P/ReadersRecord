import {redirect, type Handle} from "@sveltejs/kit";
import {handle as authenticationHandle} from "./auth";
import {sequence} from "@sveltejs/kit/hooks";

const authorizationHandle: Handle = async ({event, resolve}) => {
    // if (event.url.pathname.startsWith("/")) {
    //     const session = await event.locals.auth();
    //     if (!session) {
    //         throw redirect(303, "/auth/signin");
    //     }
    // }

    return resolve(event);
}

export const handle: Handle = sequence(authenticationHandle, authorizationHandle);