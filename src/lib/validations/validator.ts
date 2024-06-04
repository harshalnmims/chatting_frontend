import {z} from 'zod';
import { message } from '$lib/stores/validation';

export const numberValidator = (data : number) : boolean => {
  console.log('number type ',typeof data)

  if(data != null  || data != undefined ){
    try{

      let validNumber = z.number();
      validNumber.parse(data);

      // let checkLength  = z.string().refine(value => value.length == 10 );
      // checkLength.parse(String(data));
      message.set(null)
    
      return true

    }catch(error){

      //message.set('Otp Should Be Of 5 Digits And Number Format Only !'); 
      message.set('Otp Should Be In Number Format Only !'); 
      console.log('zod error',error)  
      return false;

    }
    }else{
      console.log('inside else validator')
      message.set('Otp Is Required !');
      return false;
    }  

}

export const phoneValidator = (data : number ) : boolean  => {

    if(data != undefined  || data != null ){
      try{

       let zod = z.number();
       zod.parse(data);   

       let checkLength  = z.string().refine(value => value.length == 10 );
       checkLength.parse(String(data));
       
       message.set(null)    
       return true;

      }catch(error){
       message.set('Phone No. Should Be Of 10 Digits and Number Format Only')
       return false;
      }
    }else{
      message.set('Phone No. Is Required');
      return false;
    }
}


