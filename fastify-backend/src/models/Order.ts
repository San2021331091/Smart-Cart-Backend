import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Optional } from '../types/optional.js';

interface OrderAttributes {
  id: number;
  user_uid: string;
  product_id: number;
  img_url: string;
  quantity: number;
  price: number;
  ordered_at?: Date;
  status?: string;
}

export interface OrderCreationAttributes extends Optional<OrderAttributes, 'id' | 'ordered_at' | 'status'> {}

export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: number;
  public user_uid!: string;
  public product_id!: number;
  public img_url!: string;
  public quantity!: number;
  public price!: number;
  public ordered_at?: Date;
  public status?: string;
}

Order.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_uid: { type: DataTypes.STRING, allowNull: false, references: { model: 'users', key: 'uid' } },
  product_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'products', key: 'id' } },
  img_url: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  ordered_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
}, {
  sequelize,
  tableName: 'orders',
  timestamps: false,
});
