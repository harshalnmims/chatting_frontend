
export const POST = async ({request,cookies}) : Promise<object> => {

    let {userToken} = await request.json();
    cookies.set('userToken',userToken,{path : '/',secure : true , httpOnly :true ,SameSite :'Strict'});


    return new Response(JSON.stringify({ message: 'success' }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}