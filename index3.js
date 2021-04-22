const Sequelize = require('sequelize')
const sequelize = new Sequelize('postgres://crhoytxefjakrm:12d2681bacc9a91ca1a739602394426f5f302a84ec3d37c540bb26884c91743c@ec2-3-234-85-177.compute-1.amazonaws.com:5432/d1frlrcnih6i81')


//cria uma tabela
const Cadastro = sequelize.define('cadastrar', {
    nome: {
        type: Sequelize.STRING
    },
    senha: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    }
})

//Faz o cadastro de dados na tabela
Cadastro.Create({
    nome: "Jura",
    senha: "0000",
    email: "JuraJurinha@gmail.com"
})

//Cria a tabela
Cadastro.sync({force: true})