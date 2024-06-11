import type { LayoutServerLoad } from "./$types"
import { getData } from "../getData/+server";

export const load : LayoutServerLoad= async () : Promise<object> => {
 
    let {json} = await getData('/getModules');
    let modules : object[s] = json.message;

    return { modules }

}