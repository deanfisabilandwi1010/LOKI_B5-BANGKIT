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
controllers.report = async(req, res) => {
    const accessToken = req.cookies.accessToken 
    if (!accessToken)
        return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const id = payload.id
    const nama = payload.nama
    const NIP = payload.NIP
    

    models.course_plans.hasMany(models.course_los, {foreignKey : "id" })
    models.course_los.belongsTo(models.course_plans, {foreignKey : "course_plan_id"})
    models.course_lo_details.belongsTo(models.course_los, {foreignKey : "course_lo_id"})
    models.course_lo_details.belongsTo(models.curriculum_los, {foreignKey : "curriculum_lo_id"})
    models.curricula.hasMany(models.curriculum_los, {foreignKey : "id" })
    models.curriculum_los.belongsTo(models.curricula, {foreignKey : "curriculum_id"})
    const rps = await models.course_plans.findAll({
    })
    const kurkul = await models.curricula.findAll({
    })
    const cpl = await models.curriculum_los.findAll({
    })
    const cpmk = await models.course_los.findAll({
    
    })
    const cplcpmk = await models.course_lo_details.findAll({
        include: [
            {
                model:models.curriculum_los,
                /*on: {
                    col1: sequelize.where(sequelize.col("course_lo_details.curriculum_lo_id"), "=", sequelize.col("curriculum_los.id"))
                }*/
            },
            {
                model:models.course_los,
                /*on: {
                    col1: sequelize.where(sequelize.col("course_lo_details.course_lo_id"), "=", sequelize.col("course_los.id"))
                },*/
                include: [{
                    model: models.course_plans,
                    /*on: {
                        col1: sequelize.where(sequelize.col("course_los.course_plan_id"), "=", sequelize.col("course_plans.id"))
                    }*/
                }]
            }
        ]
    
    })
    const pblcpl = await models.course_plan_assessments.findAll({
    
    })
    
    res.render("admin_report", {rps,cpl,cpmk,cplcpmk,pblcpl,accessToken, nama, NIP})
}
//CRUD Matkul
controllers.courses = async(req, res) => {
   const accessToken = req.cookies.accessToken 
    if (!accessToken)
        return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const id = payload.id
    const nama = payload.nama
    const NIP = payload.NIP

    models.courses.hasMany(models.course_plans, {foreignKey : "id" })
    models.course_plans.belongsTo(models.courses, {foreignKey : "course_id"})
    const matkul = await models.courses.findAll({
    })
    const RPS = await models.course_plans.findAll({
        include : [{
            model : models.courses
        }]
    })
    res.render("admin_matkul", {RPS, matkul, accessToken, nama, NIP} )
    // res.json({RPS})
}
controllers.courseAddpage = async (req, res) => {
    const name = req.params.name
    const accessToken = req.cookies.accessToken 
    if (!accessToken)
        return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const nama = payload.nama
    const NIP = payload.NIP

    const curricula = await models.curricula.findAll({
        atribute : ['id','name']
    })
    
    res.render("admin_matkul_tambah", {curricula,nama, name, NIP});
    
}
controllers.courseAdd = async (req, res) => {
    const name = req.params.name
    const accessToken = req.cookies.accessToken 
    if (!accessToken)
        return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const nama = payload.nama
    const NIP = payload.NIP

    const kurkul = req.body.kurkul
    const kode = req.body.kode
    const matkul = req.body.namaMatkul
    const alias = req.body.alias
    const sks = req.body.sks
    const sem = req.body.sem
    const desc = req.body.desc

    const curricula = await models.curricula.findAll({
        atribute : ['id','name']
    })

    const courses = await models.courses.findOne({
        where : {
            code : kode
        }
    })

    if(courses){
        console.log("Hasil: "+courses);
        return res.status(200).json("matkul sudah ada!");
    }
    else{
        console.log(courses);
        await models.courses.create({
            curriculum_id : kurkul,
            code : kode, 
            name: matkul,
            alias_name : alias, 
            credit : sks,
            semester : sem, 
            description : desc
        })
        const course = await models.courses.findOne({
            where : {
                code : kode
            }
        })
        const id_course = course.id
        await models.course_plans.create({
            course_id : id_course,
            rev : -1, 
            code: kode,
            name: matkul,
            alias_name : alias, 
            credit : sks,
            semester : sem, 
            description : desc
        })
        res.status(200).redirect("/admin/courses");
    }
    
}
controllers.courseDelete = async (req, res) => {
    const idmatkul = req.params.idmatkul
    const accessToken = req.cookies.accessToken 
    if (!accessToken)
        return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const id_dosen = payload.id
    const nama = payload.nama
    const NIP = payload.NIP

    models.courses.hasMany(models.course_plans, {foreignKey : "id" })
    const matkul = await models.courses.findOne({
        where : {
            id: idmatkul
        }
    })
    models.course_plans.hasMany(models.course_plan_lecturers, {foreignKey : "id" })
    const rps = await models.course_plans.findOne({
        where : {
            course_id: matkul.id
        }
    })



    models.course_plan_lecturers.belongsTo(models.course_plans, {foreignKey : "course_plan_id"})
    const hapusdosenrps = await models.course_plan_lecturers.destroy({
        where : {
            course_plan_id : rps.id,
        },
        include : [{
            model : models.course_plans
        }]
    })
    models.course_plans.belongsTo(models.courses, {foreignKey : "course_id"})
    const hapusrps = await models.course_plans.destroy({
        where : {
            course_id : matkul.id,
        },
        include : [{
            model : models.courses
        }]
    })
    
    const hapusmatkul = await models.courses.destroy({
        where : {
            id : idmatkul,
        }
    })
    res.status(200).redirect("/admin/courses/");
}
controllers.coursesReport = async (req, res) => {
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
    res.render("admin_matkul_report", {RPS, id, nama, name, NIP})
}

controllers.petacplcpmk = async (req, res) => {
    const idmatkul = req.params.idrps;
    res.render("admin_cplcpmk", {idmatkul})
  };

//CRUD Dosen
controllers.courseLecturer = async (req, res) => {
    const idmatkul = req.params.idmatkul
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
            course_plan_id : idmatkul
        },
        include : [{
            model : models.lecturers
        }]
    })
    
    const daftardosen = await models.lecturers.findAll({})
    res.render("admin_dosen", {dosenmatkul, daftardosen, idmatkul, nama, NIP})
}
controllers.lecturerAdd = async (req, res) => {
    const idmatkul = req.params.idmatkul
    const iddosen = req.params.iddosen
    const accessToken = req.cookies.accessToken 
    if (!accessToken)
        return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const id_dosen = payload.id
    const nama = payload.nama
    const NIP = payload.NIP

    models.lecturers.hasMany(models.course_plan_lecturers, {foreignKey : "id" })
    const dosen = await models.lecturers.findOne({
        where : {
            reg_id: iddosen
        }
    })
    models.course_plan_lecturers.belongsTo(models.lecturers, {foreignKey : "lecturer_id"})
    const dosenrps = await models.course_plan_lecturers.findOne({
        where : {
            course_plan_id : idmatkul,
            lecturer_id: dosen.id
        },
        include : [{
            model : models.lecturers
        }]
    })


    if(dosenrps){
        console.log("Hasil: "+dosenrps+"\n"+idmatkul+iddosen);
        return res.status(200).json("dosen sudah ditambahkan!"+dosenrps+"\n"+idmatkul+iddosen);
    }
    else{
        console.log(dosenrps+"\n"+idmatkul+iddosen);
        await models.course_plan_lecturers.create({
            course_plan_id : idmatkul,
            lecturer_id : dosen.id,
            creator : 0
        })
        res.status(200).redirect("/admin/courses/"+idmatkul+"/lecturer");
    }
        
    
}
controllers.lecturerDelete = async (req, res) => {
    const idmatkul = req.params.idmatkul
    const iddosen = req.params.iddosen
    const name = req.params.name
    const accessToken = req.cookies.accessToken 
    if (!accessToken)
        return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const id_dosen = payload.id
    const nama = payload.nama
    const NIP = payload.NIP

    models.lecturers.hasMany(models.course_plan_lecturers, {foreignKey : "id" })
    const dosen = await models.lecturers.findOne({
        where : {
            reg_id: iddosen
        }
    })
    models.course_plan_lecturers.belongsTo(models.lecturers, {foreignKey : "lecturer_id"})
    const hapusdosenmatkul = await models.course_plan_lecturers.destroy({
        where : {
            course_plan_id : idmatkul,
            lecturer_id: dosen.id
        },
        include : [{
            model : models.lecturers
        }]
    })
    if(hapusdosenmatkul){
        console.log("Berhasil dihapus: ");
        res.status(200).redirect("/admin/courses/"+idmatkul+"/lecturer");
    }
    else{
        console.log("Gagal dihapus: ");
        return res.status(200).json("Gagal dihapus")
    }
}


controllers.cetakRPS = async (req, res) => {
    target="_blank"
    const idmatkul = req.params.idmatkul
    const accessToken = req.cookies.accessToken 
    if (!accessToken)
        return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const id_dosen = payload.id
    const nama = payload.nama
    const NIP = payload.NIP

    const RPS = await models.course_plans.count({})
    const week = await models.course_plan_details.count({})
    const hitung = await models.course_plan_assessments.count({
        where : {flag : "1"}
    })

    var c = week - hitung
    var project = hitung/week*100
    var casee = c/week*100
    res.render("admin_print",{nama, NIP, hitung, RPS, project, casee, idmatkul})
}

controllers.persentaseRPS = async (req, res) => {
    const idmatkul = req.params.idmatkul
    const accessToken = req.cookies.accessToken 
    if (!accessToken)
        return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const id_dosen = payload.id
    const nama = payload.nama
    const NIP = payload.NIP

    const RPS = await models.course_plans.count({})
    const week = await models.course_plan_details.count({})
    const hitung = await models.course_plan_assessments.count({
        where : {flag : "1"}
    })

    var c = week - hitung
    var project = hitung/week*100
    var casee = c/week*100
    res.render("admin_persentase", {nama, NIP, hitung, RPS, project, casee, idmatkul})
}

module.exports = controllers