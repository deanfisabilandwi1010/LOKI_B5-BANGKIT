const express = require('express')
const server = express.Router()
const controllers = require('../controllers/index.js')

server.get('/', controllers.mhs.home)
server.get('/RPS', controllers.mhs.RPS)
server.get('/detail/:id', controllers.mhs.detail)
server.get('/lihatDetailRPS/:id/:name', controllers.mhs.lihatDetailRPS)
server.get('/exportDetailRPS/:id/:name', controllers.mhs.exportDetailRPS)
server.get('/cari', controllers.mhs.cari)

module.exports = server