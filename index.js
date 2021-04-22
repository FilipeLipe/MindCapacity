const express = require('express')
const bcrypt = require('bcrypt')
const path = require('path')
const session = require('express-session')
const flash = require('express-flash')
const passport = require('passport')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg');
const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://crhoytxefjakrm:12d2681bacc9a91ca1a739602394426f5f302a84ec3d37c540bb26884c91743c@ec2-3-234-85-177.compute-1.amazonaws.com:5432/d1frlrcnih6i81',
  ssl: {
    rejectUnauthorized: false
  }
});

  app.use(express.urlencoded({ extended: false}));
  app.use(express.static(path.join(__dirname, 'public')))
  
  

  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'ejs')
  app.get('/', (req, res) => res.render('pages/index'))
  //app.get('/index', (req, res) => res.render('pages/index'))
  //app.get('/inicio', (req, res) => res.render('pages/inicio'))
  app.get('/criaTarefa', (req, res) => res.render('pages/criaTarefa'))
  app.get('/criaEvento', (req, res) => res.render('pages/criaEvento'))
  app.get('/criaHorario', (req, res) => res.render('pages/criaHorario'))
  app.get('/eventos', (req, res) => res.render('pages/eventos'))
  app.get('/perfil', (req, res) => res.render('pages/perfil'))
  app.get('/tarefas', (req, res) => res.render('pages/tarefas'))
  app.get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM tarefas');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  
  app.get('/inicio', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM horarios where users = \'Filipe\'');
      const results = { 'results': (result) ? result.rows : null};
      console.log(results);
      res.render('pages/inicio', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  
  app.get('/index', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM USUARIOS');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  
  /*app.get('/logout',(req,res)=>{
    req.logOut();
    req.flash("success_msg","você foi desconectado");
    res.redirect("/index");
  })*/
  
  app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
  
  app.get('/inscreva-se', (req, res) => res.render('pages/inscreva-se'))

  app.post('/inscreva-se', async(req,res)=>{

   
    let errors =[];
    const {nome,email,password,password2} = req.body;//pega os componentes do body por desestruturação
    if(!email||!password||!password2){
      errors.push({message:'Preencha todos os campos!'});
    }
    if(password!=password2){
      errors.push({message:'As senhas não conferem'});
    }
    if(errors.length>0){
      res.render('pages/inscreva-se',{errors});
    }else{
    const client = await pool.connect();//conecta com o banco
    pool.query(`SELECT * from usuarios WHERE nome_usuario=$1`,[nome],(err,results)=>{
      if(err){
        throw err;
      }else{
        
        if(results.rows.length>0){
          errors.push({message: nome + " já está registrado !!"});
          console.log(errors)
            res.render('pages/inscreva-se',{errors});
          
        }else{
          pool.query(
            `INSERT INTO usuarios 
            VALUES ($1,$2,$3)`,
            [nome,password,email],
            (err,results)=>{
              if(err){
                throw err;
              }else{
                client.release();
                return res.redirect('/');
              }
            }
          )
        }
      }
      
    })
    }
  })

