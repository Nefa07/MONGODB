class Response {
    constructor(status = false, code = 400, message = "", data = null) {
        this.status = status,
            this.code = code,
            this.message,
            this.data = null
    }
}

module.exports = Response;