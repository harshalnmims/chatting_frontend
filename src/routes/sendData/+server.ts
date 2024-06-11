import { PUBLIC_BACKEND_URL } from "$env/static/public";
import { redirect } from "@sveltejs/kit";
import type { ApiResponse } from "$lib/types/api";

export const sendData = async <T>(url : string,obj : object) : Promise<ApiResponse<T>> => {

   try{

   let credentials : RequestInit = {
      method:'POST',
      headers: {
      'Content-Type':'application/json'
      },
      body:JSON.stringify(obj)
    }

    let response = await fetch(`${PUBLIC_BACKEND_URL}${url}`,credentials);

    if(!response.ok){
      redirect(302,'/error')
    }

    let json = await response.json();

    if(json == undefined){
      return {json:{status:401,message:[]}}  
    }

    if(json.status == 500){
        redirect(302,'/error')
    }

    console.log('chat json ',JSON.stringify(json))
    return {json}

   }catch(error){
    console.log(error)
    redirect(302,'/error')
   } 

  
}