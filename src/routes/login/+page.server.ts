import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types"

export const load :PageServerLoad= async ({cookies}) : Promise<void> => {
    let userToken : any =  cookies?.get('userToken'); 

    if(userToken != undefined){
     redirect (302,'/dashboard');
    }

}