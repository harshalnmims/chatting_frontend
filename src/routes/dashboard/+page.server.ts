import type { PageServerLoad } from "./$types"
import { redirect } from "@sveltejs/kit";
import { fetchApi } from "$lib/utils/fetchApi";

export const load : PageServerLoad = async ({fetch}) : Promise<object> => {

    try {

    let credentials = {
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
    let username = data.username;

    let chatList = await fetch('/')
    return {username}

        
    } catch (error) {
        console.log(error)
        redirect (302,'/error');
    }
   
}