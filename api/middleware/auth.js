const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

const auth = async(req, res, next) => {
    try {
        // The token comes in the format "Bearer [token]"
        const token = req.header('Authorization').replace('Bearer ', '');
        const data = jwt.verify(token, process.env.JWT_KEY);
        
        const user = await User.findOne({ _id: data._id, 'tokens.token': token });

        if (!user) {
            throw new Error();
        }

        req.user = user;
        req.token = token;

        next();
    } catch (error) {
        res.status(401).send({ error: 'Forbidden' });
    }

}
module.exports = auth;