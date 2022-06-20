const atividades = require('../models/atividades')
const usuarios = require('../models/usuarios')

module.exports = (app)=>{
    app.post('/atividades',async(req,res)=>{
        var dados = req.body
       // return console.log(dados)
       //conectar com o mongo
       const database = require('../config/database')()
       //importar model atividades
       const atividades = require('../models/atividades')
       //gravar as informações do formulário no database
       var gravar = await new atividades({
           data:dados.data,
           tipo:dados.tipo,
           entrega:dados.entrega,
           disciplina:dados.disciplina,
           instrucoes:dados.orientacoes,
           usuario:dados.id,
           titulo:dados.titulo
       }).save()
       
       //recarregar a página atividades
       res.redirect('/atividades?id='+dados.id)
    })
    app.get('/atividades', async(req,res)=>{
        // listar todos os usu logados
        var user = req.query.id
        if (!user) {
            res.redirect('/login')
        }
        var usuarios = require('../models/usuarios')
        var atividades = require('../models/atividades')

        var dadosuser = await usuarios.findOne ({_id:user})
        var dadosAberto = await atividades.find({usuario:user,status:"0"}).sort({data:1})

        var dadosEntregue = await atividades.find({usuario:user,status:"1"}).sort({data:1})

        var dadosExcluido = await atividades.find({usuario:user,status:"2"}).sort({data:1})

        res.render('atividades.ejs', {nome:dadosuser.nome,id:dadosuser._id,dadosAberto,dadosEntregue,dadosExcluido})
        //res.render('accordion.ejs', {nome:dadosuser.nome,id:dadosuser._id,dadosAberto,dadosEntregue,dadosExcluido})
    })

    app.get('/excluir', async(req,res)=>{
        //qual o doc sera excluir da collection atividades??????????????
        var doc = req.query.id
        //excluir o doc
        var excluir = await atividades.findOneAndUpdate(
            {_id:doc},
            {status:"2"}
        )
        //voltar para lista de atividades
        res.redirect('/atividades?id='+excluir.usuario)
    })

    app.get('/entregue', async(req,res)=>{
        //qual o doc sera entregue da collection atividades??????????????
        var doc = req.query.id
        //entreguar o doc
        var entregue = await atividades.findOneAndUpdate(
            {_id:doc},
            {status:"1"}
            )
        //voltar para lista de atividades
        res.redirect('/atividades?id='+entregue.usuario)
    })

    app.get('/desfazer', async(req,res)=>{
        //qual o doc sera devolvido da collection atividades??????????????
        var doc = req.query.id
        //devolver o doc
        var desfazer = await atividades.findOneAndUpdate(
            {_id:doc},
            {status:"0"}
            )
        //voltar para lista de atividades
        res.redirect('/atividades?id='+desfazer.usuario)
    })

    //renderizar a view alterar.ejs
    app.get('/alterar',async(req,res)=>{
        //recuperar o id da atividade na barra de endereço
        var id = req.query.id
        //procurar o id na collection atividades
        var alterar = await atividades.findOne({_id:id})
        //localizar o usuário proprietário da atividade
        var user = await usuarios.findOne({_id:alterar.usuario})
        //renderizar a view alterar e enviar o nome e id do usuário e todos os dados da atividade
        res.render("alterar.ejs",{nome:user.nome,id:user._id,alterar})
    })

    //gravar as alterações na atividade selecionada
   /app.post("/alterar",async(req,res)=>{
        //armazenar as informações recebidas do formulário
       var dados = req.body
        //visualizar os dados
        res.send(dados) 
    })
}
