const jwt = require('jsonwebtoken');


module.exports = (req,res,next) => {
    try {
        token = req.headers.authorization.split(" ")[1];
        const tokenDecoded = jwt.verify(token,process.env.JWT_KEY);
        req.userData = tokenDecoded;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Auth fail"
        });
    }    
}