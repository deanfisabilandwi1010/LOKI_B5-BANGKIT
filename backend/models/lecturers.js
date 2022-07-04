'use strict'
const { Sequelize, DataTypes, err } = require('sequelize');
const db = require('../config/database.js')
var lecturers = db.define('lecturers', {
    id : {
        type        : DataTypes.BIGINT,
        allowNull   : false,
        primaryKey  : true
    },
    name    : Sequelize.STRING,
    reg_id  : Sequelize.STRING,
    phone   : Sequelize.STRING,
    status  : Sequelize.INTEGER,
},{
    freezeTableName : true,
    timestamps      : false
})

module.exports = lecturers