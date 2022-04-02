class HttpError extends Error {
    constructor(message, errorCode) {
        super(message); //pass message property to constructor of base class
        this.code = errorCode; //adds a "code" property
    }
}

module.exports = HttpError;

