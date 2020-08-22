const express = require("express");
const cors = require("cors");
const { uuid } =require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const _repositories = [];
const _likes = [];

app.get("/repositories", (request, response) => {
  const {list} = request.query;
  
  const results = list ? _repositories.filter(repository => repository.list.includes(list)) : _repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const likes = 0;
  const repository = { id: uuid(), title, url, techs, likes};

  _repositories.push(repository);

  return response.json(_repositories);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repositorieIndex = _repositories.findIndex(repository => repository.id == id);

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repositore not found'});
  } 

  const repository = {
    id,
    title,
    url,
    techs,
    likes: _repositories[repositorieIndex].likes  
  }

  _repositories[repositorieIndex] = repository;

 return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositorieIndex = _repositories.findIndex(repository => repository.id == id);

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repositore not found'});
  } 

  _repositories.splice(repositorieIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:idRepositore/like", (request, response) => {
  const { idRepositore } = request.params;
  let like = 0;
  let likeIndex = 0;

  const repositorieIndex = _repositories.findIndex(repository => repository.id == idRepositore);

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repositore not found'});
  } 
  
  likeIndex = _likes.findIndex(likeItem => likeItem.idRepositore == idRepositore);
  
  if (likeIndex < 0) {
    like = 1;
    const likesItem = { id: uuid(), idRepositore, like};
    
    _likes.push(likesItem);
   
    likeIndex = _likes.findIndex(likeItem => likeItem.idRepositore == idRepositore);
  } 
  else { 
    like = _likes[likeIndex].like + 1 

    const likesItem = {
      id: _likes[likeIndex].id, 
      idRepositore: _likes[likeIndex].idRepositore,
      like: like 
    };

   _likes[likeIndex] = likesItem;
  }

  const repository = {
    id: _repositories[repositorieIndex].id,
    title: _repositories[repositorieIndex].title,
    url: _repositories[repositorieIndex].url,
    techs: _repositories[repositorieIndex].techs,
    likes: like
  }
  
  _repositories[repositorieIndex] = repository;
   
  return response.json(_likes[likeIndex]);

});

module.exports = app;
