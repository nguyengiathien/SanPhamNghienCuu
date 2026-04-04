

function requestLoggerMiddleWare(req, res, next) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    
    // Log request body cho POST/PUT requests (trừ password)
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
        const logBody = { ...req.body };
        if (logBody.password) logBody.password = '***';
        if (logBody.confirmPassword) logBody.confirmPassword = '***';
        console.log(`[${timestamp}] Request Body:`, JSON.stringify(logBody, null, 2));
    }
    
    next();
}
module.exports = requestLoggerMiddleWare;