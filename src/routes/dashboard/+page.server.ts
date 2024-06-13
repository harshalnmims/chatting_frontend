import type { PageServerLoad } from "./$types"
import { redirect } from "@sveltejs/kit";
import { sendData } from "../sendData/+server";

export const load : PageServerLoad = async ({fetch}) : Promise<object> => {

    try {

    let credentials : RequestInit = {
        method :'GET',
        headers :{
            'Accept':'application/json'
        }
    }

    let response = await fetch('/verifyJwt',credentials);

    if(!response.ok){
     redirect(302,'/login')
    }

    let data = await response.json();
    let username : string = data.message.username;

    return {username}
        
    } catch (error) {
        console.log(error)
        redirect (302,'/error');
    }
   
}