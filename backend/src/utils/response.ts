export const successResponse = (
    res: any,
    message: string,
    data: any = {},
    statusCode: number = 200,
) => {
    return res.status(statusCode).json({
        status: 'success',
        message,
        data,
    });
};


export const errorResponse = (
    res: any,
    message: string,
    statusCode: number = 500,
    errorDetails?: any,
) => {
    return res.status(statusCode).json({
        status: 'error',
        message,
        ...(errorDetails && { error: errorDetails }),
    });
};