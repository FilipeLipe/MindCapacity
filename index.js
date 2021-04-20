const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/index', (req, res) => res.render('pages/index'))
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
      const result = await client.query('SELECT * FROM tarefas');
      const results = { 'results': (result) ? result.rows : null};
      console.log(results);
      res.render('pages/inicio', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
