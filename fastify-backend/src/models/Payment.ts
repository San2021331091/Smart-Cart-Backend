import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Optional } from '../types/optional.js';

interface PaymentAttributes {
  id: number;
  amount: number;
  card_type: 'visa' | 'mastercard';
  card_number: string;
  expiry: string;
  cvv: string;
  email?: string;
  username?: string;
  status?: 'pending' | 'success' | 'failed';
  created_at?: Date;
}

export interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id' | 'email' | 'username' | 'status' | 'created_at'> {}

export class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: number;
  public amount!: number;
  public card_type!: 'visa' | 'mastercard';
  public card_number!: string;
  public expiry!: string;
  public cvv!: string;
  public email?: string;
  public username?: string;
  public status?: 'pending' | 'success' | 'failed';
  public created_at?: Date;
}

Payment.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  amount: { type: DataTypes.INTEGER, allowNull: false },
  card_type: { type: DataTypes.ENUM('visa','mastercard'), allowNull: false },
  card_number: { type: DataTypes.STRING, allowNull: false },
  expiry: { type: DataTypes.STRING, allowNull: false },
  cvv: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: true },
  username: { type: DataTypes.STRING, allowNull: true },
  status: { type: DataTypes.ENUM('pending','success','failed'), defaultValue: 'pending' },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  sequelize,
  tableName: 'payments',
  timestamps: false,
});
