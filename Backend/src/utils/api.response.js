const  HTTP_CODES  = require("http-status");

module.exports = {
    BAD_REQUEST: ({ res, message = '-', data = {} } = {}) => {
        res.status(HTTP_CODES.BAD_REQUEST).json({
            status: false,
            message: message,
            payload: data
        })
    },

    DUPLICATE_VALUE: ({ res, message, data = {} } = {}) => {
        res.status(HTTP_CODES.CONFLICT).json({
            status: false,
            message: message || "Duplicate value.",
            payload: data,
        });
    },

    FORBIDDEN: ({ res, message = "-", data = {} } = {}) => {
        res.status(HTTP_CODES.FORBIDDEN).json({
            status: false,
            message: message,
            payload: data,
        });
    },

    CATCH_ERROR: ({ res, message = "-", data = {} } = {}) => {
        let responseCode = HTTP_CODES.INTERNAL_SERVER_ERROR;
        if ((message && message.includes("validation failed")) || message.includes("duplicate key error collection")) responseCode = HTTP_CODES.BAD_REQUEST;
        res.status(responseCode).json({
            status: false,
            message: message,
            payload: data,
        });
    },

    CONFLICT: ({ res, message = '-', data = {} } = {}) => {
        res.status(HTTP_CODES.CONFLICT).json({
            status: false,
            message: message,
            payload: data,
        });
    },

    METHOD_NOT_ALLOWED: ({ res, message = "-", data = {} } = {}) => {
        res.status(HTTP_CODES.METHOD_NOT_ALLOWED).json({
            status: false, 
        });
    },

    MOVED_PERMANENTLY: ({ res, message = "-", data = {} } = {}) => {
        res.status(HTTP_CODES.MOVED_PERMANENTLY).json({
            status: false,
            message: message,
            payload: data,
        });
    },

    NOT_ACCEPTABLE: ({ res, message = "-", data = {} } = {}) => {
        res.status(HTTP_CODES.NOT_ACCEPTABLE).json({
            status: false,
            message: message,
            payload: data,
        });
    },

    NOT_FOUND: ({ res, message = "-", data = {} } = {}) => {
        res.status(HTTP_CODES.NOT_FOUND).json({
            status: false,
            message: message,
            payload: data,
        });
    },

    NO_CONTENT_FOUND: ({ res, message = "-", data = {} } = {}) => {
        res.status(HTTP_CODES.NO_CONTENT).json({
            status: false,
            message: message,
            payload: data,
        });
    },

    OK: ({ res, message = "-", data = {} } = {}) => {
        res.status(HTTP_CODES.OK).json({
            status: true,
            messages: message,
            payload: data,
        });
    },

    PERMANENT_REDIRECT: ({ res, message = "-", data = {} } = {}) => {
        res.status(HTTP_CODES.PERMANENT_REDIRECT).json({
            status: false,
            message: message,
            payload: data,
        });
    },

    UNAUTHORIZED: ({ res, message = "-", data = {} } = {}) => {
        res.status(HTTP_CODES.UNAUTHORIZED).json({
            status: false,
            message: message,
            payload: data,
        });
    },

    UPGRADE_REQUIRED: ({ res, message = "-", data = {} } = {}) => {
        res.status(HTTP_CODES.UPGRADE_REQUIRED).json({
            status: false,
            message: message,
            payload: data,
        });
    },

    VALIDATION_ERROR: ({ res, message = "-", data = {} } = {}) => {
        res.status(HTTP_CODES.VARIANT_ALSO_NEGOTIATES).json({
            status: false,
            message: message,
            payload: data,
        });
    },
};
