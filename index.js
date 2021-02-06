const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;
const EcoleDirecte = require("node-ecole-directe");
const session = new EcoleDirecte.Session();
async function fetchNotes() {
    const compte = await session.connexion("LeBonMoustique", "Lurin92");

    const notes = await compte.fetchNotes();
    philo = notes.notes.filter((n) => n.codeMatiere == 'PHILO').map((v) => v.valeur)
    return philo


};

const server = http.createServer(async (req, res) => {

  res.writeHead(200, {'Content-Type': 'text/html'});
  let file = fs.readFileSync('./index.html', {encoding: 'utf8'})

  file = file.replace('{{NAME}}', await fetchNotes());

  res.write(file);
  res.end();
});
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
})


/*
   const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;


const server = http.createServer((req, res) => {
  const api = require("api-ecoledirecte-france")
  res.writeHead(200, {'Content-Type': 'text/html'});

api.accounts("paul", "Lurin92")
    .then((accounts) => {
        const prenom = accounts[0].prenom;
        const nom = accounts[0].nom;
        const fam = prenom + " " + nom;
        let file = fs.readFileSync('./index.html', {encoding: 'utf8'})
        
        console.log(accounts);

        file = file.replace('{{NAME}}',fam);
        

        res.write(file);
        res.end();

        
    })
    .catch((err) => {
        throw err
    })
 });

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

*/
