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
   
        // Procura no DB os armários do user:
        const wardrobe = await Wardrobe.find({owner: req.user});
        console.log(wardrobe)

        if(wardrobe.length){
            // Retorna os armários
            res.status(200).send({
                message: 'Wardrobes were found.',
                data: wardrobe
            });
        }else{
            // User não possui armários
            res.status(404).send({
                message: 'User does not have wardrobes.',
            });
        }

        
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

        const guarda_roupa = await Wardrobe.findById(req.params.wardrobeId)
        // console.log(exist)

        if(guarda_roupa){
    
            if(!String(req.user._id).localeCompare(String(guarda_roupa.owner))){
                // Retorna o armário
                res.status(200).send({
                    message: 'Wardrobe found.',
                    data: guarda_roupa
                });
            } else{
                res.status(403).send({
                    message: 'Wardrobe not owned by user.',
                });
            }
        } else{
            res.status(404).send({
                message: 'Wardrobe not found.',
            });
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
        
        // user = User(req.user);
        // let w_owner = await User.findById(user._id);

        // Testar JSON enviado
        const prop_list = ["garments", "name", "description", "image_url"]
        for (prop of prop_list) {
            if(!req.body.hasOwnProperty(prop)){
                res.status(400).send({
                    message: 'Invalid JSON format. See example at data field.',
                    data: []
                });
                return;
            }
        }
        
        let lista_de_roupas = []
        // Valida se a lista das roupas está no formato certo:
        for (each_roupa of req.body.garments) {
            if(each_roupa.hasOwnProperty('_id')){
                let roupa_db = await Garment.findById(each_roupa._id)
                console.log(roupa_db)
                
                if(roupa_db){
                    // Add na lista de roupas
                    lista_de_roupas.push(roupa_db)
                }else{
                    res.status(404).send({
                        message: 'Invalid garment id. _id:' + each_roupa._id + " .",
                    });
                    return;
                }

            }else{
                res.status(404).send({
                    message: 'Invalid JSON format. See example at data field.',
                    data: []
                });
                return;
            }
        }
       
        // Cria um objeto da classe wardrobe com base no JSON enviado
        req.body.garments = lista_de_roupas;
        let wardrobe = new Wardrobe(req.body);
        wardrobe.owner = req.user;

        // Manda para o banco o que foi criado:
        let wardrobe_on_db = await Wardrobe.create(wardrobe);
        res.status(201).send({
            message: 'Wardrobe successfully created.',
            data: wardrobe_on_db
        });

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

        // user = User(req.user);
        // let w_owner = await User.findById(user._id);

        const guarda_roupa = await Wardrobe.findById(req.params.wardrobeId)
        console.log(guarda_roupa)

        if(guarda_roupa){
    
            // Testa se o guarda roupa é do user
            console.log(guarda_roupa.owner)
            console.log(req.user._id)
            // console.log()
            if(!String(req.user._id).localeCompare(String(guarda_roupa.owner))){
    
                // Procura a roupa no BD
                const roupa_nova = await Garment.findById(req.params.garmentId)
    
                if(roupa_nova){

                    // Add roupa ao guarda roupa
                    guarda_roupa.garments.push(roupa_nova);
                
                    // Atualiza o BD
                    let wardrobe_on_db = await Wardrobe.findByIdAndUpdate(guarda_roupa._id, {garments:guarda_roupa.garments});
                    res.status(201).send({
                        message: 'Wardrobe successfully updated.',
                        data: guarda_roupa
                    });
                    return;
                }else{
                    res.status(404).send({
                        message: 'Garment id not found.',
                    });
                    return;
                }
    
            }else{
                res.status(403).send({
                    message: 'Wardrobe not owned by user.',
                });
            }
        }
        else{
            res.status(404).send({
                message: 'Wardrobe not found.',
            });
        }   

    }
    catch(err) {
        console.error(err, err.message, err.stack);

        res.status(500).send({
            message: "An error occured when creating the wardrobe."
        });
    }
};