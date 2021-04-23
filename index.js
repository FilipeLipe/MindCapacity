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
let user=null;
  app.use(express.urlencoded({ extended: false}));
  app.use(express.static(path.join(__dirname, 'public')))
  
  let numeroHorario;
  
  

  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'ejs')
  //app.get('/inicio', (req, res) => res.render('pages/inicio'))
  app.get('/criaEvento', (req, res) => res.render('pages/criaEvento'))
  app.get('/criaTarefa', (req, res) => res.render('pages/criaTarefa'))
  app.get('/criaHorario', (req, res) => res.render('pages/criaHorario'))
  //app.get('/eventos', (req, res) => res.render('pages/eventos'))
  app.get('/perfil', (req, res) => res.render('pages/perfil'))
  //app.get('/tarefas', (req, res) => res.render('pages/tarefas'))
  
  
  app.get('/inicio', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query(`SELECT * FROM horarios where users =$1`,[user.nome_usuario]);
      const results = { 'results': (result) ? result.rows : null};
      //console.log(results);
      res.render('pages/inicio', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  
  app.get('/tarefas', async (req, res) => {
    try {
      
      const {num}  = req.query;
      console.log(typeof(num));
      const client = await pool.connect();
      const result = await client.query(
        `SELECT * FROM tarefas 
        where cod_h = $1`, 
        [parseInt(num)],
        (err,result)=>{
          if(err){
            throw err;
          }else{
            const results =  (result) ? result.rows : null;
            client.release();
            res.render('pages/tarefas', {"results":results,"num":num} );
          }
        })
        
        
      } catch (err) {
        console.error(err);
        res.send("Error " + err);
      }
    })
    app.post('/criaEvento', async(req,res)=>{
      
      
      let errors =[];
      const {nome_e,dias,horas} = req.body;//pega os componentes do body por desestruturação
      const client = await pool.connect();//conecta com o banco
      console.log(nome_e,dias,horas)
      const {num} = req.query;
      console.log(num,typeof(num));
      pool.connect();
      pool.query(
        `INSERT INTO eventos 
        VALUES ($1,$2,$3,$4)`,
        [nome_e,dias,horas,parseInt(num)],
        (err,results)=>{
          if(err){
            throw err;
          }else{
            client.release();
            return res.redirect('/inicio');
          }
        }
        )
      })
      app.get('/eventos', async (req, res) => {
        try {
          
          const {num}  = req.query;
          const client = await pool.connect();
          const result = await client.query(
            `SELECT * FROM eventos 
            where codigo_h = $1`, 
            [parseInt(num)],
            (err,result)=>{
              if(err){
                throw err;
              }else{
                const results =  (result) ? result.rows : null;
                client.release();
                res.render('pages/eventos', {"results":results,"num":num} );
              }
            })
            
            
          } catch (err) {
            console.error(err);
            res.send("Error " + err);
          }
        })
        
        
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
          
          app.get('/criaTarefa', (req, res) => res.render('pages/criaTarefa'))
          
          app.post('/criaTarefa', async(req,res)=>{
            
            
            let errors =[];
            const {titulo,descricao,arquivos,links,dia,hora} = req.body;//pega os componentes do body por desestruturação
            const client = await pool.connect();//conecta com o banco
            console.log(titulo,descricao,arquivos,links,dia,hora)
            const {num} = req.query;
            console.log(num,typeof(num));
            pool.connect();
            pool.query(
              `INSERT INTO tarefas 
              VALUES ($1,$2,1,$3,$4,$5,$6)`,
              [titulo,descricao,links,dia,hora,parseInt(num)],
              (err,results)=>{
                if(err){
                  throw err;
                }else{
                  client.release();
                  return res.redirect('/inicio');
                }
              }
              )
            })
            
            
            app.get('/', (req, res) => res.render('pages/index'))
            
            app.post('/', async(req,res)=>{
              let errors =[];
                const {email,password} = req.body;
                console.log(email,password)
                const client = await pool.connect();
                pool.query(
                  `select * from usuarios
                   where email=$1`
                  ,[email]
                  ,(err,result)=>{
                    if(err){
                      throw err;
                    }else{
                      
                      if(result.rows.length>0){
                        console.log(result.rows[0].senha,password,typeof(password))
                        if(result.rows[0].senha==password){
                          user = result.rows[0];
                          console.log(user)
                          client.release();
                          res.redirect('/inicio')
                        }else{
                          errors.push({message:'As senhas não conferem'});
                          res.render('pages/index',{errors});
                        }
                      }else{
                        errors.push({message:'usuario não encontrado'});
                        res.render('pages/index',{errors});
                      }
                    }

                  }
                );//conecta com o banco

            });

            app.post("/criaHorario",async(req,res)=>{
                const {titulo,descricao} = req.body;
                console.log(titulo,descricao)
                const client = await pool.connect();
                numeroHorario = await client.query("select max(cod_h) from horarios");
                
                const a =  (numeroHorario) ? numeroHorario.rows[0] : null;
                const max= a.max;
                console.log(max);
                client.query(`INSERT INTO horarios
                Values ($1,$2,$3,$4,$5)`,[parseInt(max)+1,titulo,descricao,"segunda",user.nome_usuario]);
                
                client.release();
                
                res.redirect("/inicio");
            })