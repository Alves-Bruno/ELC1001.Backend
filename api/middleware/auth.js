const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

const auth = async(req, res, next) => {
    try {
        // The token comes in the format "Bearer [token]"
        const token = req.header('Authorization').replace('Bearer ', '');
        // const data = jwt.verify(token, process.env.JWT_KEY);
        
        // const user = await User.findOne({ _id: data._id, 'tokens.token': token });
        // if (!user) {
        //   throw new Error();
        // }

        const user = {
            _id: '5e792274034bef4e13137b08',
            account_activated: true,
            username: 'BrunoAlves',
            email: 'bdalves@gmail.com',
            password: '$2a$12$JXULTIaN0ejnRld8rZ2UfeuO2xd8BOpvpvl8DPDF3ZleDr4XI6KQa',
            tokens: [ ]
        };

        // const user = {
        //     _id: '5e78409baddad463f985f488',
        //     account_activated: false,
        //     username: 'pablo',
        //     email: 'pablo@gmaiil.com',
        //     password: '$2a$12$9QvMwZajayvES.bKhGOnReF7HFnlCCFDDG91eZwT.7k2TBn5BP8Bm',
        //     tokens: [ ]
        // };

        req.user = user;
        req.token = token;

        next();
    } catch (error) {
        res.status(401).send({ error: 'Forbidden' });
    }

}
module.exports = auth;