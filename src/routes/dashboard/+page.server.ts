import type { PageServerLoad } from "./$types"
import { verifyCookie } from "$lib/utils/fetchApi";

export const load : PageServerLoad = async ({cookies}) : Promise<object> => {

    let userToken : string = await cookies.get('token'); 
    let response : Promise<object> =  await verifyCookie('/verifyCookie',userToken);

   return {
    json : 'Hello'
   }
}