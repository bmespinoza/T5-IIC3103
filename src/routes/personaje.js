const express = require('express');
const router = express.Router();
const axios = require('axios');
CHARACTER_URL = 'https://rickandmortyapi.com/api/character'
const fetch = require('node-fetch');


const infoCharacter = async (per) => {
  var capitulos = [];
  var actual = await fetch(per ,{
    method: 'GET'
  } 
    ).then(response =>{
      return response.json()
    })
  var respuestapi = actual;
  var i=0;
  while(i<=respuestapi.episode.length-1){
    var elem = await infoEpisodes(respuestapi.episode[i]);
    capitulos.push(elem);
    i++;
  }
  respuestapi['caps'] = capitulos;
  return respuestapi
}

const infoEpisodes = async (epi) => {
  var actual = await fetch(epi ,{
    method: 'GET'
  } 
    ).then(response =>{
      return response.json()
    })
  var result = actual
  return result
}

const detallesCharacter = async (pers) => {
  resultados = []
  const resul = await fetch(GRAPH_QL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        query: `
            query {
              characters(filter: {name: "${pers}"}){
                info{
                  pages
                }
              }
            }
        `
    })
  })
  .then(res => res.json())
  paginas = resul.data.characters.info.pages
  for (let p = 1; p <= paginas; p++)
  {
    const res = await fetch(GRAPH_QL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
          query: `
            query {
              characters(filter: {name: "${pers}"}){
                results{
                  name
                  status
                  species
                  gender
                  type
                  origin{
                    name
                  }
                  location{
                    name
                  }
                  image
                  episode{
                    name
                    episode
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
      resultados.push(res.data.characters.results[0])
  }
  return resultados[0]
}


router.get('/personaje', async (req, res)=> {
  res.render('personaje.html', {resii: await detallesCharacter(req.query.pers)});
});


module.exports= router;
