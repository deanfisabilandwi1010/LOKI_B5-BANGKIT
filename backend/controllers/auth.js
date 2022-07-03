//Controllers buat login

const models = require('../models/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const controllers = {}

controllers.login = async (req, res) => {
    res.render("login")
}

controllers.loginUser = async (req, res) => {
        try 
        {
            const dosen = await models.lecturers.findOne({
                where : {
                    reg_id : req.body.NIP 
                }
            })
            if (!dosen){
                return res.status(400).json({msg : "NIP salah" + dosen})
            }
            else{
                models.user.hasMany(models.lecturers, {foreignKey : "id" })
                models.lecturers.belongsTo(models.user, {foreignKey : "id"})
                const user = await models.user.findOne({
                    where : {
                        id  : dosen.id
                    },
                    include : [{
                        model : models.lecturers
                    }]
                })
                //const cocok = await bcrypt.compareSync(req.body.password, user.password)
                //if(!cocok)
                  //  return res.status(400).json({msg : "Password salah"})
                const id = user.id
                const nama = user.name
                const email = user.email
                const type = user.type
                const NIP = req.body.NIP
                const accessToken = jwt.sign({id, nama, email, type, NIP}, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn : '600s'
                })
                await models.user.update({remember_token : accessToken}, {
                    where : {
                        email : email
                    }
                })
                res.cookie('accessToken', accessToken, {
                    httpOnly    : true,
                    maxAge      : 24 * 60 * 60 * 1000
                })

                
                if (user.type=='T'){
                    res.status(200).redirect("/admin/index")
                    console.log("Alhamdulillah login admin");
                }
                else if (user.type=='D'){
                    res.status(200).redirect("/homeDosen")
                    console.log("Alhamdulillah login dosen");
                }

            }
        } 
        catch (err) 
        {
            res.status(404).json({msg : "NIP tidak ditemukan"})
            console.log(err)
        }
    }
    controllers.loginDosen = async (req, res) => {
        try 
        {
            const cekNIP = await models.lecturers.findOne({
                where : {
                    reg_id : req.body.NIP
                }
            })
            if (!cekNIP)
                return res.status(400).json({msg : "NIP salah"})
            const user = await models.user.findOne({
                where : {
                    id : cekNIP.id
                }
            })
            //const cocok = await bcrypt.compareSync(req.body.password, user.password)
            //if(!cocok)
                //return res.status(400).json({msg : "Password salah"})
            const id = user.id
            const nama = user.name
            const email = user.email
            const type = user.type
            const NIP = req.body.NIP
            const accessToken = jwt.sign({id, nama, email, type, NIP}, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn : '600s'
            })
            await models.user.update({remember_token : accessToken}, {
                where : {
                    email : email
                }
            })
            res.cookie('accessToken', accessToken, {
                httpOnly    : true,
                maxAge      : 24 * 60 * 60 * 1000
            })
            res.status(200).redirect("/homeDosen")
        } 
        catch (err) 
        {
            res.status(404).json({msg : "Email tidak ditemukan"})
            console.log(err)
        }
    }
controllers.logoutUser = async (req, res) => {
    const accessToken = req.cookies.accessToken 
    if (!accessToken)
        return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const user = await models.user.findOne({
        where : {
            email: payload.email
        }
    })
    if (!user)
        return res.status(200).json("tidak ada usernya")
    const id = user.id
    await models.user.update({remember_token : null}, {
        where : {
            id : id
        }
    })
    res.clearCookie('accessToken')
    res.redirect("/")
    // return res.sendStatus(200);
}
controllers.logout = async (req, res) => {
    const accessToken = req.cookies.accessToken 
    if (!accessToken)
        return res.status(200).json("tidak ada token")
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const user = await models.user.findOne({
        where : {
            email: payload.email
        }
    })
    if (!user)
        return res.status(200).json("tidak ada usernya")
    const id = user.id
    await models.user.update({remember_token : null}, {
        where : {
            id : id
        }
    })
    res.clearCookie('accessToken')
    res.redirect("/")
    // return res.sendStatus(200);
}
module.exports = controllers