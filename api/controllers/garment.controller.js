const Garment = require('../models/garment.model');

exports.getAll = async (req, res) => {
    try {
        console.log(req.query);

        console.log('User id: ')
        console.log(req.user._id)

        const { skip = 0, limit = 20 } = req.query;

        if(limit > 50)
            return res.status(400).send({ message: "BAD_REQUEST: Limit shoud not be bigger than 50"})

        const garments = await Garment
                .find()
                .sort({ createdAt: -1 })
                .skip(parseInt(skip))
                .limit(parseInt(limit));

        const amountOfGarments = await Garment.countDocuments({});

        res.status(200).send({
            totalAmount: amountOfGarments,
            retrievedAmount: garments.length,
            data: garments
        });
    }
    catch(err) {
        console.error(err, err.message, err.stack);

        return res.status(500).send({
            message: "Error retrieving garments"
        });
    }
};

exports.getById = async (req, res) => {
    try {
        const garment = await Garment.findById(req.params.garmentId);

        if(!garment) {
            return res.status(404).send({
                message: "Garment not found with id " + req.params.garmentId
            });
        }

        res.status(200).send(garment);
    }
    catch(err) {
        console.error(err, err.message, err.stack);

        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Garment not found with id " + req.params.garmentId
            });
        }

        return res.status(500).send({
            message: "Error retrieving garment with id " + req.params.garmentId
        });
    }
};

exports.create = async (req, res) => {
    const garment = new Garment(req.body);

    garment.owner = req.user._id;

    try {
        await garment.save();

        res.status(201).send(garment);
    }
    catch(err) {
        console.error(err, err.message, err.stack);

        res.status(500).send({
            message: "An error occured when creating the garment."
        });
    }
};
