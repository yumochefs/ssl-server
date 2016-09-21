import server from '../src'
import express from 'express'

server({
    email: 'julienlucvincent@gmail.com',
    domain: 'temp.yumochefs.com',
    clusterKey: "localhost",
    api: "http://localhost:8080/graphql",
    server: "staging",
    app: express()
}).listen(80, 443)