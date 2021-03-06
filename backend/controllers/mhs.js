const { Op } = require("sequelize");
const models = require('../models/index')

const controllers = {}

controllers.home = async(req, res) => {
    res.render("mhs_beranda")
}

controllers.RPS = async(req, res) => {
    const RPS = await models.course_plans.findAll({})
    res.render("mhs_RPS", {RPS} )
}

controllers.detail = async(req, res) => {
    const RPS = await models.course_plans.findAll({
        where : {
            id : req.params.id
        }
    })
    res.render("RPS", {RPS} )
}

controllers.lihatDetailRPS = async (req, res) => {
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
    res.render("mahasiswa_detail", {RPS, CPMK, ref, pertemuan, komponen})
}

controllers.exportDetailRPS = async (req, res) => {
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
    res.render("mahasiswa_export", {RPS, CPMK, ref, pertemuan, komponen})
}

controllers.cari = async (req, res) => {
    cari = req.query.cari

    const RPS = await models.course_plans.findAll({
        where : {
            [Op.or] : [
                {name : {[Op.like] : cari }},            ]
        }
    })
    res.render("mhs_RPS", {RPS}) 
    // res.json({RPS})
}



module.exports = controllers