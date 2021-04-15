// Imports
const http = require('http');
require('dotenv').config();
const port = 3000;
const EcoleDirecte = require("node-ecole-directe");
const ecole = new EcoleDirecte.Session();
const express = require('express')
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express()



// EJS
app.set('views', './views');
app.set('view engine', 'ejs');


// Middleweres
app.use(express.urlencoded({ extended: true }));
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(express.static(__dirname + '/public'));


// Functions
async function getNotes(username, mdp){
  const compte = await ecole.connexion(username, mdp);
  const notes = await compte.fetchNotes();
  return notes;
}

async function getEmploiDuTemps(username, mdp){
  const compte = await ecole.connexion(username, mdp);
  const emploiDuTemps = await compte.fetchEmploiDuTemps();
  return emploiDuTemps;
}



// Roots
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/connexion', async (req, res) => {
  if(req.session.compte){
    const notes = await getNotes(req.session.compte.data.identifiant, req.session.mdp);
    var last = notes.notes.length - 1;
    res.render('index', {username:req.session.compte.data.identifiant, mdp:req.session.mdp, lastNote:notes.notes[last]});
  }
  else{
    res.render('connect', {error: ''});
  }
})

app.all('/index', async (req, res) => {
  if(req.session.compte){
    const notes = await getNotes(req.session.compte.data.identifiant, req.session.mdp);
    var last = notes.notes.length - 1;
    res.render('index', {username:req.session.compte.data.identifiant, mdp:req.session.mdp, lastNote:notes.notes[last]});
  }
  else{
    var username = req.body.nom;
    var mdp = req.body.mdp;
    try {
      const compte = await ecole.connexion(username, mdp);
      var sess = req.session;
      sess.compte = compte;
      sess.mdp = mdp;
      const notes = await getNotes(username, mdp);
      var last = notes.notes.length - 1;
      res.render('index', {username:username, mdp:mdp, lastNote:notes.notes[last]});
    }
    catch(err) {
      if(username == undefined || mdp == undefined){
        res.render('connect', {error: ''})
      }
      else{
        res.render('connect', {error: "Identifiant ou mot de passe incorrect"});
      }
    }
  }
});


app.get('/profil', async (req, res) => {
  if(req.session.compte){
    res.render('profil', {compte:req.session.compte});
  }
  else{
    res.redirect('/connexion');
  }
})

app.get('/notes', async (req, res) => {
  if(req.session.compte){
    const notes = await getNotes(req.session.compte.data.identifiant, req.session.mdp);
    /* Display the teacher's object (id and name)
    console.log(notes.periodes[0].ensembleMatieres.disciplines[3].professeurs); */
    res.render('notes', {notes:notes});
  }
  else{
    res.redirect('/connexion');
  }
});

app.get('/deconnexion', (req, res) => {
  req.session.destroy();
  res.redirect('/connexion');
});

// Listening
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})