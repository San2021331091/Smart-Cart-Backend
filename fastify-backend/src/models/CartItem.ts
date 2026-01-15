import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Optional } from '../types/optional.js';

interface CartItemAttributes {
  id: number;
  user_uid: string;
  product_id: number;
  img_url: string;
  quantity: number;
  added_at?: Date;
  price: number;
}

export interface CartItemCreationAttributes extends Optional<CartItemAttributes, 'id' | 'added_at'> {}

export class CartItem extends Model<CartItemAttributes, CartItemCreationAttributes> implements CartItemAttributes {
  public id!: number;
  public user_uid!: string;
  public product_id!: number;
  public img_url!: string;
  public quantity!: number;
  public added_at?: Date;
  public price!: number;
}

CartItem.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_uid: { type: DataTypes.STRING, allowNull: false, references: { model: 'users', key: 'uid' } },
  product_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'products', key: 'id' } },
  img_url: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  added_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, {
  sequelize,
  tableName: 'cart_items',
  timestamps: false,
});
