const models = require('../models/index')
const jwt = require('jsonwebtoken')

const controllers = {}

controllers.hlmTambahRPS = async (req, res) => {
    const accessToken = req.cookies.accessToken 
    if (!accessToken)
        return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const id = payload.id
    const nama = payload.nama
    const NIP = payload.NIP
    res.render("dosen_tambahRPS", {nama, NIP})
}

controllers.tambahRPS = async (req, res) => {
    const RPS = await models.course_plans.findOne({
        where : {
            course_id : req.body.course_id
        }
    })
    if (RPS)
        return res.status(200).json("Tidak dapat menambahkan RPS yang sudah tersedia")
    const {course_id, code, name, alias_name, credit, semester, description} = req.body
    try {
        await models.course_plans.create({
            course_id       : req.body.course_id,
            rev             : 0,
            code            : req.body.code,
            name            : req.body.name,
            alias_name      : req.body.alias_name,
            credit          : req.body.credit,
            semester        : req.body.semester,
            description     : req.body.description
        })
        res.status(200).redirect("/homeDosen")
    } catch (err) {
        console.log(err);
    }
}

controllers.hlmRevRPS = async (req, res) => {
    const id = req.params.id
    const name = req.params.name
    const idEdit = req.params.idEdit
    const accessToken = req.cookies.accessToken 
    if (!accessToken)
        return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const id_dosen = payload.id
    const nama = payload.nama
    const NIP = payload.NIP

    const rev = await models.course_plans.findOne({
        where : {
            id : req.params.idEdit
        }
    })
    res.render("dosen_revisirps", {rev,idEdit, id, name, nama, NIP})
} 

controllers.editRev = async (req, res) => { 
    const {course_id, code, name, alias_name, credit, semester, description} = req.body
    try {
        await models.course_plans.create({
            course_id       : req.body.course_id,
            rev             : req.body.rev,
            code            : req.body.code,
            name            : req.body.name,
            alias_name      : req.body.alias_name,
            credit          : req.body.credit,
            semester        : req.body.semester,
            description     : req.body.description
        })
        res.status(200).redirect("/daftarRPS")
    } catch (err) {
        console.log(err);
    }
}

controllers.lihatRPS = async (req, res) => {
    const RPS = await models.course_plans.findAll({})
    res.status(200).json(RPS)
}

controllers.revisiRPS = async (req, res) => {
    const accessToken = req.cookies.accessToken 
    if (!accessToken)
        return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const id = payload.id
    const nama = payload.nama
    const NIP = payload.NIP

    const RPS = await models.course_plans.findOne({
        where : {
            id : req.body.course_id
        }
    })
    if (!RPS)
        return res.status(200).json("Revisi hanya untuk RPS yang sudah ada")
    const {course_id, code, name, alias_name, credit, semester, description} = req.body
    const revNew = RPS.rev
    try {
        await models.course_plans.update({
            rev             : revNew+1,
            code            : code,
            name            : name,
            alias_name      : alias_name,
            credit          : credit,
            semester        : semester,
            description     : description
        },{
            where : {
                course_id : course_id
            }
        })
        res.json({msg: "Berhasil merevisi RPS"});
    } catch (err) {
        console.log(err);
    }
}

module.exports = controllers