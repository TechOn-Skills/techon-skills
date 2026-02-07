export const HTTP_RESPONSES = {
    HTTP_RESPONSE_401: {
        code: 401,
        message: "UNAUTHENTICATED",
    },
    HTTP_RESPONSE_403: {
        code: 403,
        message: "FORBIDDEN",
    },
    HTTP_RESPONSE_404: {
        code: 404,
        message: "NOT_FOUND",
    },
    HTTP_RESPONSE_500: {
        code: 500,
        message: "INTERNAL_SERVER_ERROR",
    },
    HTTP_RESPONSE_400: {
        code: 400,
        message: "BAD_REQUEST",
    },
    HTTP_RESPONSE_422: {
        code: 422,
        message: "UNPROCESSABLE_ENTITY",
    },
    HTTP_RESPONSE_429: {
        code: 429,
        message: "TOO_MANY_REQUESTS",
    },
    HTTP_RESPONSE_200: {
        code: 200,
        message: "OK",
    },
    HTTP_RESPONSE_201: {
        code: 201,
        message: "CREATED",
    },
    HTTP_RESPONSE_202: {
        code: 202,
        message: "ACCEPTED",
    },
    HTTP_RESPONSE_204: {
        code: 204,
        message: "NO_CONTENT",
    },
    HTTP_RESPONSE_301: {
        code: 301,
        message: "MOVED_PERMANENTLY",
    },
    HTTP_RESPONSE_302: {
        code: 302,
        message: "FOUND",
    },
    HTTP_RESPONSE_303: {
        code: 303,
        message: "SEE_OTHER",
    },
    HTTP_RESPONSE_304: {
        code: 304,
        message: "NOT_MODIFIED",
    },
    HTTP_RESPONSE_305: {
        code: 305,
        message: "USE_PROXY",
    },
    HTTP_RESPONSE_307: {
        code: 307,
        message: "TEMPORARY_REDIRECT",
    },
    HTTP_RESPONSE_308: {
        code: 308,
        message: "PERMANENT_REDIRECT",
    },
    HTTP_RESPONSE_502: {
        code: 502,
        message: "BAD_GATEWAY",
    },
    HTTP_RESPONSE_503: {
        code: 503,
        message: "SERVICE_UNAVAILABLE",
    },
    HTTP_RESPONSE_504: {
        code: 504,
        message: "GATEWAY_TIMEOUT",
    },
    HTTP_RESPONSE_505: {
        code: 505,
        message: "HTTP_VERSION_NOT_SUPPORTED",
    },
    HTTP_RESPONSE_506: {
        code: 506,
        message: "VARIANT_ALSO_NEGOTIATES",
    },
    HTTP_RESPONSE_507: {
        code: 507,
        message: "INSUFFICIENT_STORAGE",
    },
    HTTP_RESPONSE_508: {
        code: 508,
        message: "LOOP_DETECTED",
    },
} as const;