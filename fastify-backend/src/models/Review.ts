import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Optional } from '../types/optional.js';

interface ReviewAttributes {
  id: number;
  product_id: number;
  rating?: number;
  comment?: string;
  date?: Date;
  reviewerName?: string;
  reviewerEmail?: string;
}

export interface ReviewCreationAttributes extends Optional<ReviewAttributes, 'id'> {}

export class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  public id!: number;
  public product_id!: number;
  public rating?: number;
  public comment?: string;
  public date?: Date;
  public reviewerName?: string;
  public reviewerEmail?: string;
}

Review.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  product_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'products', key: 'id' } },
  rating: DataTypes.INTEGER,
  comment: DataTypes.TEXT,
  date: DataTypes.DATE,
  reviewerName: { type: DataTypes.TEXT, field: 'reviewername' },
  reviewerEmail: { type: DataTypes.TEXT, field: 'revieweremail' },
}, {
  sequelize,
  tableName: 'reviews',
  timestamps: false,
});
