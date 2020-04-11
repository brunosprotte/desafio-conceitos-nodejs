const express = require("express");
const cors = require("cors");

 const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validadeRepoId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository ID.' })
  }
  return next();
}

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const results = title
    ? repositories.filter(repo => repo.title.includes(title))
    : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;

  const repo = { id: uuid(), url, title, techs, likes: 0 }
  repositories.push(repo);

  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  const originalRepo = repositories[repoIndex];

  const repo = {
    id, url, title, techs, "likes": originalRepo.likes
  }

  repositories[repoIndex] = repo;

  return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex(repo => repo.id === id);
  
  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  const repo = repositories[repoIndex];
  repo.likes = repo.likes+1;
  repositories[repoIndex] = repo;

  return response.json(repo);
});

module.exports = app;
