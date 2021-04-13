// Imports
const http = require('http');
require('dotenv').config();
const port = 3000;
const EcoleDirecte = require("node-ecole-directe");
const session = new EcoleDirecte.Session();
const express = require('express')
const app = express()

// Create a server
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
});


async function getNotes(){
  const compte = await session.connexion(process.env.LOGIN, process.env.PASSWORD);
  const notes = await compte.fetchNotes();
  return notes;
}

async function getNotes(){
  const compte = await session.connexion(process.env.LOGIN, process.env.PASSWORD);
  const notes = await compte.fetchNotes();
  return notes;
}

// Roots
app.get('/', async (req, res) => {
  const notes = await getNotes();
  console.log(notes.periodes[0].ensembleMatieres);
  res.send('Hello');
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})