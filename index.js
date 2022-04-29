import http from 'http'
import { cpus } from 'os'
// import {process_mathml} from "./tem.js"
import mathjax from 'mathjax'


import express from 'express'
import cluster from "cluster"

const numCPUs = cpus().length
const PORT = process.argv[2]

if (cluster.isMaster){
  console.log('Primary ${process.pid} is running')
  for (let i = 0; i<numCPUs; i++){
    cluster.fork()
  }
  cluster.on('exit',(worker, code, signal)=> {
    console.log("work ${worker.process.pid} died")
  })
}

else {
  console.log(`Worker ${process.pid} started`)
  const app = express()
  app.listen(PORT)
  app.post('/mathml', (req,res)=>{

    let messages = ''

    req.on('data',chunk =>{
      messages +=chunk
    })

    req.on('end', function() {
      //res.writeHead(200, {'Content-Type':"text/json;charset=utf-8"})
      res.writeHead(200, {'content-type':'text/html;charset=utf-8'})

      let output_obj = Object()
      mathjax.init({
        loader: {load: ['input/mml','output/svg']}
      }).then((MathJax) => {
        let svg = MathJax.mathml2svg(messages, {display: false});
        svg = MathJax.startup.adaptor.innerHTML(svg)
        output_obj.code = 200
        output_obj.result = svg
        output_obj = JSON.stringify(output_obj)
        res.write(output_obj)
        res.end()
      }).catch((err) =>{
        console.log(err.message)

        output_obj.code = 400
        output_obj.result = err.message
        output_obj = JSON.stringify(output_obj)
        res.write(output_obj)
        res.end()
      })

    })
  })

  app.post('/latex', (req,res)=>{

    let messages = ""

    req.on('data',chunk =>{
      messages +=chunk
    })

    req.on('end', function() {
      const buf = messages
      res.writeHead(200, {'content-type':'text/json;charset=utf-8'})

      let output_obj = Object()
      mathjax.init({
        loader: {load: ['input/tex', 'output/svg']}
      }).then((MathJax) => {
        let svg = MathJax.tex2svg(buf, {display: true});
        svg = MathJax.startup.adaptor.innerHTML(svg)
        output_obj.code = 200
        output_obj.result = svg
        output_obj = JSON.stringify(output_obj)
        res.write(output_obj)
        res.end()
      }).catch((err) =>{
        output_obj.code = 400
        output_obj.result = err.message
        output_obj = JSON.stringify(output_obj)
        res.write(output_obj)
        res.end()
        console.log(err.message)
      })


    })
  })

}

// app.post\
// app.use('/', router)

console.log('server running at http://127.0.0.1:'+PORT+'/')
