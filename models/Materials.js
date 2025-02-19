const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


  
  const Material = sequelize.define('Material', {
      material_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      file_path: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      lesson_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'lessons',
          key: 'id',
        },
      },
    }, {
      tableName: 'materials',
      timestamps: false,
    });
  
  module.exports={Material}


