const express = require('express');
const router = express.Router();
const axios = require('axios');
LOCATION_URL = 'https://rickandmortyapi.com/api/location'
GRAPH_QL = 'http://integracion-rick-morty-api.herokuapp.com/graphql'
const fetch = require('node-fetch');


const infoLocacion = async (place) => {
  var personajes = [];
  var actual = await fetch(place ,{
    method: 'GET'
  } 
    ).then(response =>{
      return response.json()
    })
  var respuestapi = actual;
  var i=0;
  while(i<=respuestapi.residents.length-1){
    var elem = await infoResidente(respuestapi.residents[i]);
    personajes.push(elem);
    i++;
  }
  respuestapi['residentes'] = personajes;
  return respuestapi
}

const infoResidente = async (res) => {
  var actual = await fetch(res ,{
    method: 'GET'
  } 
    ).then(response =>{
      return response.json()
    })
  var result = actual;
  return result
}

const detallesLocation = async (loc) => {
  resultados = []
  const resul = await fetch(GRAPH_QL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        query: `
            query {
              locations(filter: {name: "${loc}"}){
                info{
                  pages
                }
              }
            }
        `
    })
  })
  .then(res => res.json())
  paginas = resul.data.locations.info.pages
  for (let p = 1; p <= paginas; p++)
  {
    const res = await fetch(GRAPH_QL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
          query: `
            query {
              locations(filter: {name: "${loc}"}){
                results{
                  name
                  type
                  dimension
                  residents{
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
      resultados.push(res.data.locations.results[0])
  }
  return resultados[0]
}


router.get('/locacion', async (req, res)=> {
  res.render('locacion.html', {resii: await detallesLocation(req.query.loc)});
});


module.exports= router;
