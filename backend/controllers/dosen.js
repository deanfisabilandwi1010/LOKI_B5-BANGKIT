const models = require('../models/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const controllers = {}
//manggil cookies untuk menyimpan jwt token
controllers.home = async(req, res) => {
   const accessToken = req.cookies.accessToken //membuat var untuk meminta cookies yg bernama accesToken
    if (!accessToken) //negasi
        return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET) //decode bentuk token yg dia punya
    const id = payload.id
    const nama = payload.nama
    const NIP = payload.NIP
    // const RPS = await models.course_plan_lecturers.findAll({
    //     where :{
    //         lecturer_id : id
    //     },
    //     include : [
    //         models.course_plans
    //     ]
    // })
    res.render("dosen_beranda", { accessToken, nama, NIP} ) 
    //res.json({RPS})
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

module.exports = controllers