const express = require('express')
const bcrypt = require('bcrypt')
const path = require('path')
const session = require('express-session')
const flash = require('express-flash')
const passport = require('passport')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://crhoytxefjakrm:12d2681bacc9a91ca1a739602394426f5f302a84ec3d37c540bb26884c91743c@ec2-3-234-85-177.compute-1.amazonaws.com:5432/d1frlrcnih6i81',
  ssl: {
    rejectUnauthorized: false
  }
});


express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  //.get('/index', (req, res) => res.render('pages/index'))
  //.get('/inicio', (req, res) => res.render('pages/inicio'))
  .get('/inscreva-se', (req, res) => res.render('pages/inscreva-se'))
  .get('/criaTarefa', (req, res) => res.render('pages/criaTarefa'))
  .get('/criaEvento', (req, res) => res.render('pages/criaEvento'))
  .get('/criaHorario', (req, res) => res.render('pages/criaHorario'))
  .get('/eventos', (req, res) => res.render('pages/eventos'))
  .get('/perfil', (req, res) => res.render('pages/perfil'))
  .get('/tarefas', (req, res) => res.render('pages/tarefas'))
  .get('/db', async (req, res) => {
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

  .get('/inicio', async (req, res) => {
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

  .get('/index', async (req, res) => {
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

  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

/*express().post('/inscreva-se', async(req,res)=>{
    let name:string = req.body.name;
    let email:string = req.body.email;
    let password = req.body.password;
    let password2 = req.body.password2;
    
    const client = await pool.connect();//conecta com o banco
    pool.query(//usuario valido insere no banco de dados
    `INSERT INTO usuarios (nome_usuario,email,senha)
    VALUES ($1,$2,$3)
    RETURNING id,senha`,
    [name,email,password])
    
})*/
