//Routes > Controller untuk admin

const express = require('express')
const server = express.Router()
const controllers = require('../controllers/index.js')
const cekLogin = require('../middleware/cekLogin.js')
const cekAdmin = require('../middleware/cekAdmin.js')

server.get('/admin', (req, res) => {
    res.render("loginAdmin")
})
server.post('/loginAdmin', controllers.auth.loginAdmin)
server.get('/admin/index', cekLogin, controllers.admin.home)
server.get('/admin/courses', cekLogin, controllers.admin.courses)
server.get('/admin/courses/add', cekLogin, controllers.admin.courses)
server.get('/admin/courses/rps/:id', cekLogin, controllers.admin.coursesRps)
server.get('/admin/courses/lecturer/:id', cekLogin, controllers.admin.courseLecturer)
server.get('/admin/lecturer/:id/add/:idDosen', cekLogin, controllers.admin.lecturerAdd)
server.get('/admin/lecturer/:id/delete/:idDosen', cekLogin, controllers.admin.lecturerDelete)

server.get('/admin/lecturer/add/:idDosen/:id/:name', cekLogin, controllers.admin.cekTambahAksesDosen)
server.post('/admin/lecturer/add/:idDosen/:id/:name', cekLogin, controllers.admin.tambahAksesDosen)

server.get('/detailCPMKdanCPL/:id/:name', cekLogin, controllers.admin.detailCPMKdanCPL)
server.get('/semuaCPMKdanCPL', cekLogin, controllers.admin.semuaCPMKdanCPL)

server.get('/semuaAksesDosen', cekLogin, controllers.admin.semuaAksesDosen)

server.get('/detailRPS/:id/:name', cekLogin, controllers.admin.detailRPS)

server.get('/cetakRPS/:id/:name', cekLogin, controllers.admin.cetakRPS)

server.get('/persentaseRPS', cekLogin, controllers.admin.persentaseRPS)

module.exports = server