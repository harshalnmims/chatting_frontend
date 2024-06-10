import { JWT_TOKEN } from "$env/static/private";
import jwt from "jsonwebtoken"

export const POST = async ({request,cookies}) : Promise<object> => {

    let {phoneNumber} = await request.json();

    let token = jwt.sign({username : phoneNumber},JWT_TOKEN,{expiresIn : '1 day'});
    console.log('user token ',token)
    
    cookies.set('userToken',token,{path : '/',secure : true , httpOnly :true ,SameSite :'Strict'});

    return new Response(JSON.stringify({ message: 'success' }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}