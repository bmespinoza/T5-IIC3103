const express = require('express');
const router = express.Router();
const axios = require('axios');
EPISODES_URL = 'https://rickandmortyapi.com/api/episode'
const fetch = require('node-fetch');



const infoEpisodio = async (cap) => {
  var personajes = [];
  var actual = await fetch(cap ,{
    method: 'GET'
  } 
    ).then(response =>{
      return response.json()
    })
  var respuestapi = actual;
  var i=0;
  while(i<=respuestapi.characters.length-1){
    var elem = await infoCharacters(respuestapi.characters[i]);
    personajes.push(elem);
    i++;
  }
  respuestapi['characs'] = personajes;
  return respuestapi
}

const infoCharacters = async (charac) => {
  var actual = await fetch(charac ,{
    method: 'GET'
  } 
    ).then(response =>{
      return response.json()
    })
  var result = actual;
  return result
}

const detallesEpisodios = async (code) => {
  resultados = []
  const resul = await fetch(GRAPH_QL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        query: `
            query {
              episodes(filter: {episode: "${code}"}){
                info{
                  pages
                }
              }
            }
        `
    })
  })
  .then(res => res.json())
  paginas = resul.data.episodes.info.pages
  for (let p = 1; p <= paginas; p++)
  {
    const res = await fetch(GRAPH_QL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
          query: `
            query {
              episodes(filter: {episode: "${code}"}){
                results{
                  episode
                  name
                  air_date
                  characters{
                    name
                  }
                }
              }
            }
          `
        })
      }).then(
        response => {
          if (response.status ===404){
            return null
          }
          return response.json()
        }
      )
      resultados.push(res.data.episodes.results[0])
  }
  return resultados[0]
}



router.get('/episodio', async (req, res)=> {
  res.render('episodio.html', {resii: await detallesEpisodios(req.query.epix)});
});


module.exports= router;
