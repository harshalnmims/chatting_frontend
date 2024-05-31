import type { ApiResponse } from "$lib/types/api";
import { PUBLIC_BACKEND_URL } from "$env/static/public";

export const fetchApi = async <T>(url : string , obj : object) : Promise<ApiResponse<T>> => {

    let urlHeader : RequestInit = {
        method : 'POST',
        headers : {
            'Content-Type':'application/json'
        },
        body : JSON.stringify(obj)
    }

    let requesturl : string = PUBLIC_BACKEND_URL
    console.log('request url ',requesturl);

    let response = await fetch(`${PUBLIC_BACKEND_URL}${url}`,urlHeader)
    let json = await response.json();

    if(json != undefined){
    return { json  , error : null};
    }else{
    return {json : null , error : 'Invalid'}
    }
}