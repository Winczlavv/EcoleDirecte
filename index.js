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
app.use(express.static(__dirname + '/public'));
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));


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

app.post('/home', async (req, res) => {
  var username = req.body.nom;
  var mdp = req.body.mdp;
  try {
    const compte = await ecole.connexion(username, mdp);
    var sess = req.session;
    sess.compte = compte;
    const notes = await getNotes(username, mdp);
    var last = notes.notes.length - 1;
    res.render('home', {username:username, mdp:mdp, lastNote:notes.notes[last]});
  }
  catch(err) {
    res.render('index', {error: "Identifiant ou mot de passe incorrect"});
  }
});


app.post('/profil', async (req, res) => {
  console.log(req.session.compte.data.profile.classe.id);
  res.render('profil', {compte:req.session.compte});
})

app.post('/notes', async (req, res) => {
  var username = req.body.username;
  var mdp = req.body.mdp;
  const compte = await ecole.connexion(username, mdp);
  const notes = await getNotes(username, mdp);
});


// Listening
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})