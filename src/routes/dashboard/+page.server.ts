import type { PageServerLoad } from "./$types"
import { redirect } from "@sveltejs/kit";
import { authenticate } from "$lib/middleware/auth";

export const load : PageServerLoad = async ({cookies}) : Promise<object> => {

    let userToken : any =  cookies?.get('userToken'); 

    if(userToken == undefined){
     redirect (302,'/login');
    }

    let response = await authenticate(String(userToken));
    let json : object = response.json;

    return {
        json
     }

   
}