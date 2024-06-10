import { JWT_TOKEN } from "$env/static/private";
import jwt from "jsonwebtoken";
import { redirect } from "@sveltejs/kit";

export const GET = async ({ cookies }): Promise<object> => {
  try {

    let token = cookies.get('userToken');
    if (!token) {
      redirect(302,'/login');
    }

    console.log('JWT to verify:', token);
    console.log('Using secret:', JWT_TOKEN);

    let response = jwt.verify(token, JWT_TOKEN);

    console.log('User response:', response);

    return new Response(JSON.stringify({ message: response }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.log('JWT Verification Error:', error);
     redirect(302, '/error');
  }
};
