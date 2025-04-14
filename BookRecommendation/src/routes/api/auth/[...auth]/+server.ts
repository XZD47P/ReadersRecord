import {handleAuth} from '@auth/sveltekit';

export const GET = handleAuth();
export const POST = handleAuth();