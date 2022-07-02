//controllers untuk admin

const models = require('../models/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const controllers = {}



controllers.home = async(req, res) => {
    const accessToken = req.cookies.accessToken 
    if (!accessToken)
        return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const id = payload.id
    const nama = payload.nama
    const NIP = payload.NIP
    res.render("admin_beranda", {accessToken, nama, NIP})
}

controllers.courses = async(req, res) => {
   const accessToken = req.cookies.accessToken 
    if (!accessToken)
        return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const id = payload.id
    const nama = payload.nama
    const NIP = payload.NIP

    const RPS = await models.course_plans.findAll({
        atribute : ['rev', 'code', 'name', 'credit', 'semester']
    })
    res.render("admin_matkul", {RPS, accessToken, nama, NIP} )
    // res.json({RPS})
}

controllers.coursesRps = async (req, res) => {
    const id = req.params.id
    const name = req.params.name
    const accessToken = req.cookies.accessToken 
    if (!accessToken)
        return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const id_dosen = payload.id
    const nama = payload.nama
    const NIP = payload.NIP

    models.courses.hasMany(models.course_plans, {foreignKey : "id" })
    models.course_plans.belongsTo(models.courses, {foreignKey : "course_id"})

    const RPS = await models.course_plans.findAll({
        where : {
            course_id : id
        },
        include : [{
            model : models.courses
        }]
    })
    res.render("admin_matkul_rps", {RPS, id, nama, name, NIP})
}

controllers.courseLecturer = async (req, res) => {
    const id = req.params.id
    const name = req.params.name
    const accessToken = req.cookies.accessToken 
    if (!accessToken)
        return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const id_dosen = payload.id
    const nama = payload.nama
    const NIP = payload.NIP

    models.lecturers.hasMany(models.course_plan_lecturers, {foreignKey : "id" })
    models.course_plan_lecturers.belongsTo(models.lecturers, {foreignKey : "lecturer_id"})
    const dosenmatkul = await models.course_plan_lecturers.findAll({
        where : {
            course_plan_id : id
        },
        include : [{
            model : models.lecturers
        }]
    })
    
    const daftardosen = await models.lecturers.findAll({})
    res.render("admin_dosen", {dosenmatkul, daftardosen, id, nama, name, NIP})
}

controllers.lecturerAdd = async (req, res) => {
    const id = req.params.id
    const idDosen = req.params.idDosen
    const name = req.params.name
    const accessToken = req.cookies.accessToken 
    if (!accessToken)
        return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const id_dosen = payload.id
    const nama = payload.nama
    const NIP = payload.NIP

    const isIdUnique = id =>
    db.Profile.findOne({ where: { id} })
      .then(token => token !== null)
      .then(isUnique => isUnique);
    
    const dosen = await models.course_plan_lecturers.count({
        where : {
            course_plan_id : id,
            lecturer_id: idDosen
        }
    })

    if(dosen>0){
        return res.status(200).json("dosen sudah ditambahkan!");
    }
    else{
        return res.status(200).json("dosen berhasil ditambahkan!");
    }
        
    
    res.render("tambahDosen", {dosen, idDosen, id, nama, name, NIP})
}

controllers.cekTambahAksesDosen = async (req, res) => {
    const id = req.params.id
    const idDosen = req.params.idDosen
    const name = req.params.name
    const accessToken = req.cookies.accessToken 
    if (!accessToken)
        return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const id_dosen = payload.id
    const nama = payload.nama
    const NIP = payload.NIP

    const dosen = await models.lecturers.findOne({
        where : {
            id : idDosen
        }
    })
    res.render("tambahDosen", {dosen, idDosen, id, nama, name, NIP})
}

controllers.tambahAksesDosen = async (req, res) => {
    try {
        const id = req.params.id
    const idDosen = req.params.idDosen
    const name = req.params.name
    const accessToken = req.cookies.accessToken 
    if (!accessToken)
        return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const id_dosen = payload.id
    const nama = payload.nama
    const NIP = payload.NIP

    await models.course_plan_lecturers.create({
        course_plan_id : id,
        lecturer_id : idDosen,
        creator : 0
    })
    res.status(200).redirect("/admin/lecturer/"+id)
    } catch (err) {
        console.log(err)
    }
}

controllers.semuaAksesDosen = async (req, res) => {
    const accessToken = req.cookies.accessToken 
    if (!accessToken)
        return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const id = payload.id
    const nama = payload.nama
    const NIP = payload.NIP

    const RPS = await models.course_plans.findAll({
        atribute : ['rev', 'code', 'name', 'credit', 'semester']
    })
    res.render("aksesDosen", {RPS, accessToken, nama, NIP})
}

controllers.semuaCPMKdanCPL = async (req, res) => {
    const accessToken = req.cookies.accessToken 
    if (!accessToken)
        return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const id = payload.id
    const nama = payload.nama
    const NIP = payload.NIP

    const RPS = await models.course_plans.findAll({
        atribute : ['rev', 'code', 'name', 'credit', 'semester']
    })
    res.render("cpmk-cpl", {RPS, accessToken, nama, NIP})
}

controllers.detailCPMKdanCPL = async (req, res) => {
    const id = req.params.id
    const name = req.params.name
    const accessToken = req.cookies.accessToken 
    if (!accessToken)
        return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const id_dosen = payload.id
    const nama = payload.nama
    const NIP = payload.NIP

    models.course_los.hasMany(models.course_lo_details, {foreignKey : "id"})
    models.course_lo_details.belongsTo(models.course_los, {foreignKey : "course_lo_id"})

    const CPMK = await models.course_los.findAll({
        where : {
            course_plan_id : 2
        },
        include : {
            model : models.course_lo_details
        }
    })
    const RPS = await models.course_plans.findAll({
        where : {id : id}
    })
    const CPL = await models.course_lo_details.findAll({
        include : {
            model: models.course_los,
            where : {
                course_plan_id : 2
            }
        }
    })
    // res.json({CPL})
    res.render("admin_cplcpmk", {RPS, CPL})
}

controllers.detailRPS = async (req, res) => {
    const id = req.params.id
    const name = req.params.name
    
    const accessToken = req.cookies.accessToken 
    if (!accessToken)
        return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const id_dosen = payload.id
    const nama = payload.nama
    const NIP = payload.NIP

    models.course_los.hasMany(models.course_lo_details, {foreignKey : "id"})
    models.course_lo_details.belongsTo(models.course_los, {foreignKey : "course_lo_id"})
    
    const RPS = await models.course_plans.findOne({
        where : {id : id}
    })
    const CPL = await models.course_lo_details.findAll({
        include : {
            model: models.course_los,
            where : {course_plan_id : id}
        }
    })
    const ref = await models.course_plan_references.findAll({
        where : {course_plan_id : id}
    })
    const pertemuan = await models.course_plan_details.findAll({
        where : {course_plan_id : id}
    })
    const komponen = await models.course_plan_assessments.findAll({
        where : {course_plan_id : id}
    })
    res.render("detailFileRPS", {RPS, CPL, ref, pertemuan, komponen})
}

controllers.cetakRPS = async (req, res) => {
    target="_blank"
    const id = req.params.id
    const name = req.params.name
    
    const accessToken = req.cookies.accessToken 
    if (!accessToken)
        return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const id_dosen = payload.id
    const nama = payload.nama
    const NIP = payload.NIP

    models.course_los.hasMany(models.course_lo_details, {foreignKey : "id"})
    models.course_lo_details.belongsTo(models.course_los, {foreignKey : "course_lo_id"})
    
    const RPS = await models.course_plans.findOne({
        where : {id : id}
    })
    const CPL = await models.course_lo_details.findAll({
        include : {
            model: models.course_los,
            where : {course_plan_id : id}
        }
    })
    const ref = await models.course_plan_references.findAll({
        where : {course_plan_id : id}
    })
    const pertemuan = await models.course_plan_details.findAll({
        where : {course_plan_id : id}
    })
    const komponen = await models.course_plan_assessments.findAll({
        where : {course_plan_id : id}
    })
    res.render("PrintRPS", {RPS, CPL, ref, pertemuan, komponen})
}

controllers.persentaseRPS = async (req, res) => {
    const accessToken = req.cookies.accessToken 
    if (!accessToken)
        return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const id_dosen = payload.id
    const nama = payload.nama
    const NIP = payload.NIP

    const RPS = await models.course_plans.count({})

    const hitung = await models.course_plan_assessments.count({
        where : {flag : 1}
    })
    // res.json({RPS})
    var c = RPS - hitung
    var project = hitung/RPS*100
    var casee = c/RPS*100
    // res.json({casee})
    res.render("admin_persentase", {nama, NIP, hitung, RPS, project, casee})
}

module.exports = controllers