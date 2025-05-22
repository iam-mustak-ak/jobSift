import { ErrorRequestHandler } from "express";

const globalErrorHandler: ErrorRequestHandler = (err, _, res, next) => {
    try {
        let statusCode = err.statusCode || 500;
        let message = err.message || "Internal Server Error";

        switch (err.name) {
            case "CastError":
                statusCode = 404;
                message = `Resource not found. Invalid: ${err.path}`;
                break;

            case "ValidationError":
                statusCode = 400;
                message = Object.values(err.errors)
                    .map((val) => (val as { message: string }).message)
                    .join(", ");
                break;

            case "JsonWebTokenError":
                statusCode = 401;
                message = "Invalid token. Please log in again.";
                break;

            case "TokenExpiredError":
                statusCode = 401;
                message = "Token expired. Please log in again.";
                break;

            case "SyntaxError":
                statusCode = 400;
                message = "Invalid JSON format.";
                break;

            default:
                break;
        }

        if (err.code === 11000) {
            statusCode = 400;
            const duplicateField = Object.keys(err.keyValue)[0];
            message = `Duplicate value for field: ${duplicateField}`;
        }

        res.status(statusCode).json({
            success: false,
            message,
        });
    } catch (error) {
        next(error);
    }
};

export default globalErrorHandler;
