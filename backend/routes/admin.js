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

server.get('/admin/courses', cekLogin, controllers.admin.courses)
server.get('/admin/courses/add', cekLogin, controllers.admin.courseAddpage)
server.post('/admin/courses/add', cekLogin, controllers.admin.courseAdd)
server.get('/admin/courses/delete/:idmatkul', cekLogin, controllers.admin.courseDelete)

server.get('/admin/courses/report/:id', cekLogin, controllers.admin.coursesReport)
server.get('/admin/course/report/:idmatkul/cplcpmk/:idrps', cekLogin, controllers.admin.petacplcpmk)
server.get('/admin/course/report/:idmatkul/cblpbl', cekLogin, controllers.admin.persentaseRPS)

server.get('/admin/courses/:idmatkul/lecturer', cekLogin, controllers.admin.courseLecturer)
server.get('/admin/courses/:idmatkul/lecturer/add/:iddosen', cekLogin, controllers.admin.lecturerAdd)
server.get('/admin/courses/:idmatkul/lecturer/delete/:iddosen', cekLogin, controllers.admin.lecturerDelete)


server.get('/admin/course/report/:id/print', cekLogin, controllers.admin.cetakRPS, controllers.admin.persentaseRPS)


module.exports = server