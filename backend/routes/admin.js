//Routes > Controller untuk admin

const express = require('express')
const server = express.Router()
const controllers = require('../controllers/index.js')
const cekLogin = require('../middleware/cekLogin.js')
const cekAdmin = require('../middleware/cekAdmin.js')

server.get('/admin', (req, res) => {
    res.render("loginAdmin")
})
server.post('/login', controllers.auth.loginUser)
server.post('/login/check', controllers.auth.loginUser)
server.post('/logout', controllers.auth.logoutUser)
server.get('/admin/index', cekLogin, controllers.admin.home)
server.get('/admin/report', cekLogin, controllers.admin.home)
server.get('/admin/courses', cekLogin, controllers.admin.courses)
server.get('/admin/courses/add', cekLogin, controllers.admin.courseAddpage)
server.post('/admin/courses/add', cekLogin, controllers.admin.courseAdd)
server.get('/admin/courses/delete/:idmatkul', cekLogin, controllers.admin.courseDelete)
server.get('/admin/courses/rps/:id', cekLogin, controllers.admin.coursesRps)
server.get('/admin/courses/:idmatkul/lecturer', cekLogin, controllers.admin.courseLecturer)
server.get('/admin/courses/:idmatkul/lecturer/add/:iddosen', cekLogin, controllers.admin.lecturerAdd)
server.get('/admin/courses/:idmatkul/lecturer/delete/:iddosen', cekLogin, controllers.admin.lecturerDelete)


server.get('/detailCPMKdanCPL/:id/:name', cekLogin, controllers.admin.detailCPMKdanCPL)
server.get('/semuaCPMKdanCPL', cekLogin, controllers.admin.semuaCPMKdanCPL)


server.get('/detailRPS/:id/:name', cekLogin, controllers.admin.detailRPS)

server.get('/cetakRPS/:id/:name', cekLogin, controllers.admin.cetakRPS)

server.get('/persentaseRPS', cekLogin, controllers.admin.persentaseRPS)

module.exports = server