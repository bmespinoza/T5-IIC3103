const express = require('express');
const router = express.Router();
const axios = require('axios');
EPISODES_URL = 'https://rickandmortyapi.com/api/episode'
const fetch = require('node-fetch');
GRAPH_QL= 'http://integracion-rick-morty-api.herokuapp.com/graphql'

const Episodios = async () => {
  var resultados = [];
  var actual = await fetch(EPISODES_URL ,{
    method: 'GET'
  } 
    ).then(response =>{
      return response.json()
    })
  var sgte = actual.info.next;
  actual.results.forEach(element =>
    {
      resultados.push(element)
    })
  while (sgte){
    actual = await fetch(sgte ,{
      method: 'GET'
    } 
      ).then(response =>{
        return response.json()
      })
    sgte = actual.info.next;
    actual.results.forEach(element =>
      {
        resultados.push(element)
      })
  }
  return resultados
}



const Obtener_episodios = async () => {
  let resultados = []
  const resul = await fetch(GRAPH_QL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        query: `
            query {
              episodes{
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
                episodes(page: ${p}){
                  results{
                    air_date
                    name
                    episode
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
      resultados = resultados.concat(res.data.episodes.results)
  }
  return resultados
}

router.get('/', async (req, res)=> {
  res.render('index.html', {resii: await Obtener_episodios()});
});


module.exports= router;
