import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Item = sequelize.define('Item', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'items',
  timestamps: false
});

export default Item;
