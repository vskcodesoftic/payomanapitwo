const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
   
    try {
        const accessToken = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(accessToken, process.env.JWT_KEY)
        // const user = await User.findOne( { _id: decoded._id, 'tokens.accessToken': accessToken})

        const user = decoded;
        if (!user) {
            throw new Error()
        }
        req.token = accessToken
        req.user = user
        req.userId = user.userId
        next()
    } catch (e) {
        res.status(401).send({error: 'Please authenticate.'})
    }
};