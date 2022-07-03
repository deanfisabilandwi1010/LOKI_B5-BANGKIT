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
    res.render("dosen_beranda", { accessToken, nama, NIP} ) 
}
controllers.daftarRPS = async (req, res)=>{
    models.course_plans.hasMany(models.course_plan_lecturers, {foreignKey: "id"})
    models.course_plan_lecturers.belongsTo(models.course_plans, {foreignKey: "course_plan_id"})
    const RPS = await models.course_plan_lecturers.findAll({
        where : {
            lecturer_id : 2
        },
        atribute : ['course_plan_id', 'lecturer_id'],
        include : {
            model : models.course_plans,
            atribute : ['id', 'code', 'name', 'credit']
        }
    })

    res.render("dosen_daftarRPS", {RPS})
}

controllers.lihatDetailRPSS = async (req, res) => {
    const id = req.params.id
    const name = req.params.name

    models.course_los.hasMany(models.course_lo_details, {foreignKey : "id"})
    models.course_lo_details.belongsTo(models.course_los, {foreignKey : "course_lo_id"})
    
    const RPS = await models.course_plans.findOne({
        where : {id : id}
    })
    const CPMK = await models.course_los.findAll({
        where : {course_plan_id : id}
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
    res.render("dosen_detail", {RPS, CPMK, ref, pertemuan, komponen})
}

controllers.exportDetailRPSS = async (req, res) => {
    target="_blank"
    const id = req.params.id
    const name = req.params.name

    models.course_los.hasMany(models.course_lo_details, {foreignKey : "id"})
    models.course_lo_details.belongsTo(models.course_los, {foreignKey : "course_lo_id"})
    
    const RPS = await models.course_plans.findOne({
        where : {id : id}
    })
    const CPMK = await models.course_los.findAll({
        where : {course_plan_id : id}
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
    res.render("dosen_export", {RPS, CPMK, ref, pertemuan, komponen})
}

module.exports = controllers