/**
 * Express middleware to log the URL and method of every incoming request.
 */
const logger = (req, res, next) => {
    const logMessage = `[${new Date().toISOString()}] ${req.method} Request to: ${req.originalUrl}`;
    
    console.log(logMessage);
    
    next(); 
};

module.exports = logger;