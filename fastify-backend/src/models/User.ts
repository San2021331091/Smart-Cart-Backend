import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Optional } from '../types/optional.js';

interface UserAttributes {
  uid: string;
  email: string;
  name?: string;
  role?: string;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'role'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public uid!: string;
  public email!: string;
  public name?: string;
  public role?: string;
}

User.init({
  uid: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  name: DataTypes.STRING,
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'user' },
}, {
  sequelize,
  tableName: 'users',
  timestamps: true,
});
