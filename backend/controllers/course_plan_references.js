const models = require('../models/index') 
const jwt = require('jsonwebtoken')
const controllers = {}

controllers.hlmTambahRef = async (req, res) => { 
    const id = req.params.id
    const name = req.params.name
    const accessToken = req.cookies.accessToken
    if (!accessToken) 
        return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET) 
    const id_dosen = payload.id 
    const nama = payload.nama
    const NIP = payload.NIP
    res.render("dosen_tambahref", {id, name, nama, NIP}) 
}

controllers.hlmEditRef = async (req, res) => { 
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

    const ref = await models.course_plan_references.findOne({
        where : {
            id : req.params.idEdit
        }
    })
    res.render("dosen_editref", {ref, idEdit, id, name, nama, NIP})
}

controllers.editRef = async (req, res) => { 
    try {
        const idEdit = req.params.idEdit
        const accessToken = req.cookies.accessToken 
        if (!accessToken)
            return res.status(200).json("tidak ada token")
        const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        const id_dosen = payload.id
        const nama = payload.nama
        const NIP = payload.NIP

        const id = req.params.id
        const name = req.params.name
        await models.course_plan_references.update({
            course_plan_id  : req.params.id,
            title           : req.body.title,
            author          : req.body.author,
            publisher       : req.body.publisher,
            year            : req.body.year,
            description     : req.body.description
        },{
            where : {id : req.params.idEdit}
        })
        res.status(200).redirect("/detailRef/"+id+"/"+name)
    } catch (err) {
        console.log(err);
    }
}

controllers.DetailRef = async (req, res) => { 
    const accessToken = req.cookies.accessToken 
    if (!accessToken)
        res.render("loginDosen")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const id_dosen = payload.id
    const nama = payload.nama
    const NIP = payload.NIP

    const id = req.params.id
    const name = req.params.name
    const ref = await models.course_plan_references.findAll({
        where : {
            course_plan_id : req.params.id
        }
    })
    res.render("dosen_ref", {ref, name, id, nama, NIP})
}

controllers.semuaRef = async (req, res) => { 
    const accessToken = req.cookies.accessToken 
    if (!accessToken)
        res.render("loginDosen")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const id = payload.id
    const nama = payload.nama
    const NIP = payload.NIP

    models.course_plans.hasMany(models.course_plan_references, {foreignKey: "course_plan_id"})
    models.course_plan_references.belongsTo(models.course_plans, {foreignKey: "id"})
    models.course_plans.hasMany(models.course_plan_lecturers, {foreignKey: "id"})
    models.course_plan_lecturers.belongsTo(models.course_plans, {foreignKey: "course_plan_id"})

    const ref = await models.course_plan_references.findAll({
        include : [{
            model : models.course_plans,
            include : [{
                model : models.course_plan_lecturers,
                where : {
                    lecturer_id : id
                }
            }]
        }]
    })
    res.render("semuaReferensi", { ref, nama, NIP})
}

controllers.tambahRef = async(req, res) => {
    try {
        const id = req.params.id
        const name = req.params.name
        await models.course_plan_references.create({
            course_plan_id  : req.params.id,
            title           : req.body.title,
            author          : req.body.author,
            publisher       : req.body.publisher,
            year            : req.body.year,
            description     : req.body.description
        })
        res.status(200).redirect("/detailRef/"+id+"/"+name)
    } catch (err) {
        console.log(err);
    }
}

controllers.hapusRef = async(req, res) => { 
    try {
        const id = req.params.id 
        const name = req.params.name 
        await models.course_plan_references.destroy({
            where : {
                id   : req.params.idHapus
            }
        })
        res.status(200).redirect("/detailRef/"+id+"/"+name) 
    } catch (err) {
        console.log(err);
    }
}


module.exports = controllers