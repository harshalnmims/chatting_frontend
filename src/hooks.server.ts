import type { Handle, RequestEvent } from "@sveltejs/kit";
import { PUBLIC_USER_COOKIE } from "$env/static/public";
import { redirect } from "@sveltejs/kit";
import redis from "$lib/redis/redis";


export const handle : Handle = async ({event,cookies,resolve}) : Promise<any> => {
    console.log('hooks called ',event.url.pathname)
   
    let token: string = PUBLIC_USER_COOKIE;
    let userToken :string | undefined | null = event.cookies.get('token')
    let response;
    console.log('user cookie token ',userToken)

    if(event.url.pathname != '/login'){

      if(userToken == undefined || userToken == null || token != userToken ){
       redirect(302,'/login')
      }
   }
       response= await resolve(event);
       return response;
}


