import type {LayoutServerLoad} from "./$types";

export const load: LayoutServerLoad = async (event) => {
    return {
        session: await event.locals.auth(),
        pathname: event.url.pathname
    }
}