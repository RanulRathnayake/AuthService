const jwt = require ('jsonwebtoken');

exports.identifier = (req, res, next) => {
    let token;
    if(req.header.client === 'not-browser'){
        token = req.header.authorization
    } else {
        token= req.cookies['Authorization']
    }

    if(!token) {
        return res.status(403).json({success: false, message: 'Unauthorized'});
    }

    try {
        const userToken = token.split('')[1]
        const jwtVerified = jwt.verify(userToken, process.env.TOKEN_SECRET);

        if(jwtVerified) {
            req.user = jwtVerified;
            next()
        } else {
            throw new Error('Error in token');
        }

    } catch {
        console.log(error);
    }
}