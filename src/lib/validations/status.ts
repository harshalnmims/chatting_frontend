import { message } from "$lib/stores/validation";
import { redirect } from "@sveltejs/kit";

export function checkStatusCode(json : object) : boolean | null | undefined{

    let statusCode : number = json.status as unknown as number;

    if(statusCode == 200){
      return true;  
    }

    if(statusCode == 500){  
      return false;  
    }

    if(statusCode == 400){
      message.set(json.message);  
      return null;
    }
}
