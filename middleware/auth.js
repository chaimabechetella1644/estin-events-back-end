const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    // Extracts the token part from "Bearer <token>"
    const token = authHeader?.split(' ')[1]; 
    
    if (!token) {
        console.log('access denied!!')
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // 1. Verify Token
        console.log('checking access permissions...')
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 2. Attach User Data (id, email, name) to the request object
        req.club = decoded; 

        next(); // Proceed to the protected route handler
    } catch (e) {
        res.status(403).json({ message: 'Token is not valid' });
    }
};