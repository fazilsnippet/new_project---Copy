// class ApiError extends Error{
//     constructor (
//         statusCode, 
//         message= "something went wrong",
//         error=[],
//         stack=""
//     ){
//         super(message)
//         this.statusCode = statusCode
//         this.data =null
//         this.message = message
//         this.success=false
//         this.error= error
// if (stack) {this.stack= stack
    
// } else {Error.captureStackTrace(this,this.constructor)
    
// }
//     }
// }

// export {ApiError}

/*This code defines a custom error class called ApiError that extends the built-in Error class in JavaScript. The ApiError class has a constructor that accepts four parameters: statusCode, message, error, and stack. 

In the constructor, the super(message) call is used to call the constructor of the parent class (Error), passing the message parameter. Then, the statusCode, data, message, success, and error properties are initialized with the provided values or default values.

If a stack parameter is provided, it is assigned to the stack property of the ApiError instance. Otherwise, the Error.captureStackTrace() method is used to capture the stack trace of the current error and assign it to the stack property.

Finally, the ApiError class is exported using the export {ApiError} statement. */

class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.success = false;
    this.data = null;
    this.errors = errors.length ? errors : undefined;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };

