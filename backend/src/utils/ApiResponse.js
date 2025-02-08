class ApiResponse{
    constructor(
statusCode,
data,
message="success"

    ){
        //returning the response from the above
        this.statusCode = statusCode;
        this.data = data
        this.message = message;
        this.success =statusCode < 400
    }
}

export {ApiResponse}