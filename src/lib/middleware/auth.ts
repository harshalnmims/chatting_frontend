import { verifyCookie } from "$lib/utils/fetchApi";
import { goto } from "$app/navigation";

export async function authenticate(userToken : string) :Promise<object> {

  try{

    let {json} =  await verifyCookie('/verifyCookie',userToken);
    return {json};

  }catch(error){
    goto('/error');
    return {}
  }


}