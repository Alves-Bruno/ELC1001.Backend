const Wardrobe = require('../models/wardrobe.model');
const Garment = require('../models/garment.model');
const User = require('../models/user.model');
// const User = require('../models/user.model')


// const validator = require('validator');


// Dica: você pode usar req.user para acessar informações do usuário que está fazendo a request.

exports.getAll = async (req, res) => {
    try {
        // Essa rota deve retornar todos os guarda-roupas *que pertencem ao usuário*.
        // Não é necessário popular as referências para as roupas (garments).

        // Você pode escolher como retornar os dados, contanto que todas as informações
        // dos guarda-roupas estejam presentes.

        // Pesquise qual deve ser o código de retorno HTTP quando a requisição foi bem sucedida.
        console.log('req.query');
        console.log(req.query);

        user = User(req.user);
        console.log(user);

        // // Criando um wardrobe:
        // let w_owner = await User.findOne({username: 'schdck'})
        // let w_garment = await Garment.findOne({model: "Camiseta Internacional 2019/20"})
        // let wardrobe = await Wardrobe.create({
        //     name: 'Verão',
        //     description: 'Roupas de verão',
        //     owner: w_owner,
        //     garments: [w_garment],
        //     image_url: 'https://www.casasbahia-imagens.com.br/Moveis/quartos/guardaroupa/13888083/1040289635/roupeiro-ana-6-portas-canela-panan-13888083.jpg'
        // })

        // wardrobe = await Wardrobe.create({
        //     name: 'Inverno',
        //     description: 'Roupas de inverno',
        //     owner: w_owner,
        //     garments: [w_garment],
        //     image_url: 'https://www.casasbahia-imagens.com.br/Moveis/quartos/guardaroupa/13888083/1040289635/roupeiro-ana-6-portas-canela-panan-13888083.jpg'
        // })

        // wardrobe = await Wardrobe.create({
        //     name: 'Primavera',
        //     description: 'Roupas de Primavera',
        //     owner: w_owner,
        //     garments: [w_garment],
        //     image_url: 'https://www.casasbahia-imagens.com.br/Moveis/quartos/guardaroupa/13888083/1040289635/roupeiro-ana-6-portas-canela-panan-13888083.jpg'
        // })

        // wardrobe = await Wardrobe.create({
        //     name: 'Outono',
        //     description: 'Roupas de Outono',
        //     owner: w_owner,
        //     garments: [w_garment],
        //     image_url: 'https://www.casasbahia-imagens.com.br/Moveis/quartos/guardaroupa/13888083/1040289635/roupeiro-ana-6-portas-canela-panan-13888083.jpg'
        // })
    

        // Consulta o banco: 

        // TODO: ALTERAR PARA A ENTREGA //
        let w_owner = await User.findOne({username: 'schdck'})

        const wardrobe = await Wardrobe.find({owner: w_owner});

        res.status(200).send({
            // totalAmount: amountOfwardrobe,
            // retrievedAmount: wardrobe.length,
            data: wardrobe
        });
    }
    catch(err) {
        console.error(err, err.message, err.stack);

        return res.status(500).send({
            message: "Error retrieving wardrobes"
        });
    }
};

exports.getById = async (req, res) => {
    try {
        // Essa rota deve retornar todas as informações de um guarda-roupas *se ele pertencer ao usuário*.
        // Nesse caso, você deve popular as referências para as roupas (garments).

        // Você pode escolher como retornar os dados, contanto que todas as informações
        // do guarda-roupas estejam presentes.

        // Pesquise qual deve ser o código de retorno HTTP quando a requisição foi bem sucedida.

        const wardrobe_req = await Wardrobe.findById(req.params.wardrobeId);
        if(wardrobe_req){
            // TODO: ALTERAR PARA A ENTREGA //
            let w_owner = await User.findOne({username: 'schdck'})

            user = User(req.user);
            console.log(user)
            
            const wardrobes = await Wardrobe.find({
                owner: w_owner
            });
            found = false;
            let found_element = Wardrobe();

            for (each_wardrobe of wardrobes) {
                console.log(each_wardrobe)

                if(each_wardrobe._id == req.params.wardrobeId){
                    found = true;
                    found_element = each_wardrobe;
                }
            } 

            if(found){
                res.status(200).send(found_element);
            } else{
                return res.status(403).send({
                message: "Wardroube (id=" + req.params.wardrobeId + ") not owned by user."});
            }
        }else{
            return res.status(404).send({
            message: "Wardroube (id=" + req.params.wardrobeId + ") not found."});
        }
    }
    catch(err) {
        console.error(err, err.message, err.stack);

        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Wardrobe not found with id " + req.params.wardrobeId
            });
        }

        return res.status(500).send({
            message: "Error retrieving wardrobe with id " + req.params.wardrobeId
        });
    }
};

exports.create = async (req, res) => {
    try {
        // Essa rota deve criar um novo guarda-roupas no banco de dados e atribuir ele
        // ao usuário que está fazendo a requisição.

        // Você pode escolher se quer retornar as informações do guarda-roupas criado.
        // Pesquise qual deve ser o código de retorno HTTP quando um novo recurso foi criado no banco.
    }
    catch(err) {
        console.error(err, err.message, err.stack);

        res.status(500).send({
            message: "An error occured when creating the wardrobe."
        });
    }
};

exports.addGarment = async (req, res) => {
    try {
        // Essa rota deve adicionar uma peça de roupas (recebida através do parâmetro garmentId) 
        // ao guarda-roupas do usuário (recebido através do parâmetro wardrobeId).
        
        // Atenção: verifique se o guarda-roupas informado (wardrobeId) realmente
        //          pertence ao usuário que está fazendo a requisição.

        // Pesquise qual deve ser o código de retorno HTTP quando a requisição foi bem sucedida.
    }
    catch(err) {
        console.error(err, err.message, err.stack);

        res.status(500).send({
            message: "An error occured when creating the wardrobe."
        });
    }
};