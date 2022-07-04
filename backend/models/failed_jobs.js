'use strict'
const { Sequelize, DataTypes, err } = require('sequelize');
const db = require('../config/database.js')
var failed_jobs = db.define('failed_jobs', {
    id : {
        type        : DataTypes.BIGINT,
        allowNull   : false,
        primaryKey  : true
    },
    uuid : {
        type        : DataTypes.UUID,
        allowNull   : false,
        primaryKey  : false
    },
    connection  : Sequelize.TEXT,
    queue       : Sequelize.TEXT,
    payload     : Sequelize.TEXT,
},{
    freezeTableName : true,
    timestamps      : false
})

module.exports = failed_jobs