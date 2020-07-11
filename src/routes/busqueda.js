const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
GRAPH_QL= 'http://integracion-rick-morty-api.herokuapp.com/graphql'


async function Search(busq){
  let resultados = [[],[],[]]
  let resul3 = await fetch(GRAPH_QL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      query: `
      query {
        locations(filter: {name: "${busq}"}){
          info{
            pages
          }
        }
      }
      `
    })
  })
  .then(res =>{
    return res.json()
  })
  if("errors" in resul3){
    resul3 = {"data": {"locations": { "info": {"pages": 0}}}}
  }
  let resul2 = await fetch(GRAPH_QL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      query: `
      query {
        characters(filter: {name: "${busq}"}){
          info{
            pages
          }
        }
      }
      `
    })
  })
  .then(res =>{
    return res.json()
  })

  if("errors" in resul2){
    resul2 = {"data": {"characters": { "info": {"pages": 0}}}}
  }


  let resul1 = await fetch(GRAPH_QL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      query: `
      query {
        episodes(filter: {name: "${busq}"}){
          info{
            pages
          }
        }
      }
      `
    })
  })
  .then(res =>{
    return res.json()
  })

  if("errors" in resul1){
    resul1 = {"data": {"episodes": { "info": {"pages": 0}}}}
  }

  paginas_epi = resul1.data.episodes.info.pages
  for (let p = 1; p <= paginas_epi; p++)
  {
    const res = await fetch(GRAPH_QL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
          query: `
            query {
              episodes(page: ${p}, filter: {name: "${busq}"}){
                results{
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
          resultados[0] = resultados[0].concat(res.data.episodes.results)
        }

  paginas_char = resul2.data.characters.info.pages
        for (let p = 1; p <= paginas_char; p++)
        {
          const res = await fetch(GRAPH_QL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                  query {
                    characters(page: ${p},filter: {name: "${busq}"}){
                      results{
                        name
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
          resultados[1] = resultados[1].concat(res.data.characters.results)
        }

  paginas_loc = resul3.data.locations.info.pages
  for (let p = 1; p <= paginas_loc; p++)
  {
    const res = await fetch(GRAPH_QL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
          query: `
            query {
              locations(page: ${p},filter: {name: "${busq}"}){
                results{
                  name
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
      resultados[2] = resultados[2].concat(res.data.locations.results)
  }

  return resultados
}


router.get('/busqueda', async (req, res)=> {
  res.render('busqueda.html', {resii: await Search(req.query.busco)});
});


module.exports= router;
