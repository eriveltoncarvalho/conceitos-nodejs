const express = require("express");
const cors = require("cors");
const { uuid } =require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = { 
    id: uuid(), 
    title, 
    url, 
    techs, 
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repositorieIndex = repositories.findIndex(repository => repository.id == id);

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repositore not found'});
  } 

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositorieIndex].likes 
  }

  repositories[repositorieIndex] = repository;

 return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositorieIndex = repositories.findIndex(repository => repository.id == id);

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repositore not found'});
  } 

  repositories.splice(repositorieIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:idRepositore/like", (request, response) => {
  const { idRepositore } = request.params;

  const repositorieIndex = repositories.findIndex(repository => repository.id == idRepositore);

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repositore not found'});
  } 
  
  repositories[repositorieIndex].likes++;
 
  return response.json(repositories[repositorieIndex]);

});

module.exports = app;
