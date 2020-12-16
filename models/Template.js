const { Model, DataTypes } = require('sequelize')
const sequelize = require('../db')

class Template extends Model { }

Template.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, { sequelize, modelName: 'template' })

module.exports = Template
