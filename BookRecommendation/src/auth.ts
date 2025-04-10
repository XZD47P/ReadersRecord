import {SvelteKitAuth} from "@auth/sveltekit";
import GitHub from "@auth/core/providers/github";
import {GITHUB_ID, GITHUB_SECRET} from "$env/static/private";

//SvelteKitAuth generál egy pár objectet, ebből mi szeretnénk a handle objectet
//Pl ha a Github válaszol, akkor ezzel a "handle"-lel kezeljük
export const {handle, signIn, signOut} = SvelteKitAuth({
    providers: [
        GitHub({
            clientId: GITHUB_ID,
            clientSecret: GITHUB_SECRET
        }),
        //További providerek jöhetnek ide, ha kell
    ]
})