export const errorHandler = (err, req, res, _next) => {
    const status = err?.status || 500;
    const message = err?.message || 'Internal Server Error';

      console.error('Error caught by middleware:', err);

    res.status(status).json({
        success: false,
        err: {
            message,
            name: err?.name || 'ServerError'
        }
    })
};