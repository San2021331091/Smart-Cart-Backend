import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Optional } from '../types/optional.js';

interface CategoryAttributes {
  id: number;
  name: string;
  imgurl?: string | null;
}

export interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id'> {}

export class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: number;
  public name!: string;
  public imgurl?: string | null;
}

Category.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  imgurl: { type: DataTypes.STRING(255), allowNull: true },
}, {
  sequelize,
  tableName: 'categories',
  timestamps: false,
});
