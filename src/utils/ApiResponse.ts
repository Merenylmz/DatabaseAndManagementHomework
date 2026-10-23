export class ApiResponse<T> {
    constructor(public success: boolean, public message: string, public data?: T, public errors?: any) {}

    static success<T>(message:string, data?:T){
        return new ApiResponse(true, message, data);
    }

    static error<T>(message:string, errors?:any){
        return new ApiResponse(true, message, undefined, errors);
    }
}