import type { Handle, RequestEvent } from "@sveltejs/kit";
import { PUBLIC_USER_COOKIE } from "$env/static/public";
import { redirect } from "@sveltejs/kit";

export const handle : Handle = async ({event,cookies,resolve}) : Promise<any> => {
    console.log('hooks called ',event.url.pathname)
   
    let token: string = PUBLIC_USER_COOKIE;
    let userToken :string = await cookies?.get('token')
    let response;

    if(event.url.pathname != '/login'){
      if(token != userToken){
        throw redirect(300,'/login')
      }
       response= await resolve(event);
       return response;
   }
       response= await resolve(event);
       return response;
}


