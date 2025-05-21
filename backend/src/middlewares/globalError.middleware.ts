import { ErrorRequestHandler } from "express";

const globalErrorHandler: ErrorRequestHandler = (err, _, res, next) => {
    try {
        let error = { ...err };
        error.message = err.message;

        if (err.name === "CastError") {
            const message = `Resource not found. Invalid: ${err.path}`;
            error = new Error(message);
            error.statusCode = 404;
        }
        if (err.code === 11000) {
            const message = `Duplicate field value entered: ${err.keyValue.name}`;
            error = new Error(message);
            error.statusCode = 400;
        }
        if (err.name === "ValidationError") {
            const message = Object.values(err.errors)
                .map((val) => (val as { message: string }).message)
                .join(", ");
            error = new Error(message);
            error.statusCode = 400;
        }
        if (err.name === "JsonWebTokenError") {
            const message = "Invalid token. Please log in again";
            error = new Error(message);
            error.statusCode = 401;
        }
        if (err.name === "TokenExpiredError") {
            const message = "Token expired. Please log in again";
            error = new Error(message);
            error.statusCode = 401;
        }
        if (err.name === "SyntaxError") {
            const message = "Invalid JSON format";
            error = new Error(message);
            error.statusCode = 400;
        }
        if (err.name === "TypeError") {
            const message = "Type error occurred";
            error = new Error(message);
            error.statusCode = 400;
        }
        if (err.name === "ReferenceError") {
            const message = "Reference error occurred";
            error = new Error(message);
            error.statusCode = 400;
        }
        if (err.name === "RangeError") {
            const message = "Range error occurred";
            error = new Error(message);
            error.statusCode = 400;
        }
        if (err.name === "Error") {
            const message = "An error occurred";
            error = new Error(message);
            error.statusCode = 400;
        }
        if (err.name === "EvalError") {
            const message = "Eval error occurred";
            error = new Error(message);
            error.statusCode = 400;
        }
        if (err.name === "URIError") {
            const message = "URI error occurred";
            error = new Error(message);
            error.statusCode = 400;
        }

        if (err.name === "AggregateError") {
            const message = "Aggregate error occurred";
            error = new Error(message);
            error.statusCode = 400;
        }
        if (err.name === "InternalServerError") {
            const message = "Internal server error occurred";
            error = new Error(message);
            error.statusCode = 500;
        }
        if (err.name === "NotFoundError") {
            const message = "Resource not found";
            error = new Error(message);
            error.statusCode = 404;
        }
        if (err.name === "BadRequestError") {
            const message = "Bad request";
            error = new Error(message);
            error.statusCode = 400;
        }
        if (err.name === "ForbiddenError") {
            const message = "Forbidden";
            error = new Error(message);
            error.statusCode = 403;
        }
        if (err.name === "UnauthorizedError") {
            const message = "Unauthorized";
            error = new Error(message);
            error.statusCode = 401;
        }
        if (err.name === "ConflictError") {
            const message = "Conflict";
            error = new Error(message);
            error.statusCode = 409;
        }
        if (err.name === "PreconditionFailedError") {
            const message = "Precondition failed";
            error = new Error(message);
            error.statusCode = 412;
        }
        if (err.name === "UnsupportedMediaTypeError") {
            const message = "Unsupported media type";
            error = new Error(message);
            error.statusCode = 415;
        }
        if (err.name === "UnprocessableEntityError") {
            const message = "Unprocessable entity";
            error = new Error(message);
            error.statusCode = 422;
        }
        if (err.name === "TooManyRequestsError") {
            const message = "Too many requests";
            error = new Error(message);
            error.statusCode = 429;
        }
        if (err.name === "ServiceUnavailableError") {
            const message = "Service unavailable";
            error = new Error(message);
            error.statusCode = 503;
        }
        if (err.name === "GatewayTimeoutError") {
            const message = "Gateway timeout";
            error = new Error(message);
            error.statusCode = 504;
        }
        if (err.name === "NetworkError") {
            const message = "Network error";
            error = new Error(message);
            error.statusCode = 503;
        }
        if (err.name === "TimeoutError") {
            const message = "Timeout error";
            error = new Error(message);
            error.statusCode = 504;
        }
        if (err.name === "AbortError") {
            const message = "Abort error";
            error = new Error(message);
            error.statusCode = 400;
        }
        if (err.name === "NotImplementedError") {
            const message = "Not implemented";
            error = new Error(message);
            error.statusCode = 501;
        }
        if (err.name === "NotAcceptableError") {
            const message = "Not acceptable";
            error = new Error(message);
            error.statusCode = 406;
        }
        if (err.name === "MethodNotAllowedError") {
            const message = "Method not allowed";
            error = new Error(message);
            error.statusCode = 405;
        }
        if (err.name === "HttpError") {
            const message = "HTTP error";
            error = new Error(message);
            error.statusCode = 400;
        }
        if (err.name === "HttpStatusError") {
            const message = "HTTP status error";
            error = new Error(message);
            error.statusCode = 400;
        }
        if (err.name === "HttpResponseError") {
            const message = "HTTP response error";
            error = new Error(message);
            error.statusCode = 400;
        }
        if (err.name === "HttpRequestError") {
            const message = "HTTP request error";
            error = new Error(message);
            error.statusCode = 400;
        }
        if (err.name === "HttpClientError") {
            const message = "HTTP client error";
            error = new Error(message);
            error.statusCode = 400;
        }
        if (err.name === "HttpServerError") {
            const message = "HTTP server error";
            error = new Error(message);
            error.statusCode = 500;
        }
        if (err.name === "HttpNetworkError") {
            const message = "HTTP network error";
            error = new Error(message);
            error.statusCode = 503;
        }
        if (err.name === "HttpTimeoutError") {
            const message = "HTTP timeout error";
            error = new Error(message);
            error.statusCode = 504;
        }
        if (err.name === "HttpAbortError") {
            const message = "HTTP abort error";
            error = new Error(message);
            error.statusCode = 400;
        }
        if (err.name === "HttpNotFoundError") {
            const message = "HTTP not found error";
            error = new Error(message);
            error.statusCode = 404;
        }
        if (err.name === "HttpBadRequestError") {
            const message = "HTTP bad request error";
            error = new Error(message);
            error.statusCode = 400;
        }
        if (err.name === "HttpUnauthorizedError") {
            const message = "HTTP unauthorized error";
            error = new Error(message);
            error.statusCode = 401;
        }
        if (err.name === "HttpForbiddenError") {
            const message = "HTTP forbidden error";
            error = new Error(message);
            error.statusCode = 403;
        }
        if (err.name === "HttpConflictError") {
            const message = "HTTP conflict error";
            error = new Error(message);
            error.statusCode = 409;
        }
        if (err.name === "HttpPreconditionFailedError") {
            const message = "HTTP precondition failed error";
            error = new Error(message);
            error.statusCode = 412;
        }
        if (err.name === "HttpUnsupportedMediaTypeError") {
            const message = "HTTP unsupported media type error";
            error = new Error(message);
            error.statusCode = 415;
        }
        if (err.name === "HttpUnprocessableEntityError") {
            const message = "HTTP unprocessable entity error";
            error = new Error(message);
            error.statusCode = 422;
        }

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            stack: process.env.NODE_ENV === "production" ? null : error.stack,
        });
    } catch (error) {
        next(error);
    }
};

export default globalErrorHandler;
