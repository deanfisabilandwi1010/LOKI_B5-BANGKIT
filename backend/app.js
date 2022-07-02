console.log ('BISMILLAH YAA ALLAH LULUS MATKUL PWEB YAA ALLAH AAMIIN');
const database = require('./config/database.js')
const bodyParser = require("body-parser");
const express = require('express')
const app = express()
const port = 9000
const controllers = require('./controllers/index.js')
const server = require('./routes/index.js')
const cookieParser = require('cookie-parser');
require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())

database.authenticate()
  .then(() => {
    console.log('ALHAMDULILLAH DAH KONEK KE DATABASE');
  })
  .catch(err => {
    console.error(`SEMANGAT AYO KONEKIN PROGRAM KE DATABASE : ${err}`);
  });

app.set("view engine", "ejs")
app.use(express.static("views"))

app.get('/login', controllers.auth.login)
app.get('/logout', controllers.auth.logout)
app.use('/', server.mhs)
app.use('/', server.admin)
app.use('/', server.dosen)
app.use('/', server.user)


app.listen(port, () =>
{
    console.log(`SERVERNYA UDAH JALAN DI PORT ${port}`)
})