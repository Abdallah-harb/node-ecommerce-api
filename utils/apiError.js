// these class to handel error that can i predict it
class ApiError extends Error{
    constructor(message,statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith(4) ? 'fail':'error';
    }
}
module.exports = ApiError;