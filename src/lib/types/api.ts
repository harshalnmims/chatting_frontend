export type ApiResponse<T> = {
    json : T ;
    error : null;
} | 

{
    json :null;
    error : string;
}