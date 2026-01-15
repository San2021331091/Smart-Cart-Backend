import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js'; 
import { Optional } from '../types/optional.js';

interface ProductAttributes {
  id: number;
  title?: string;
  description?: string;
  category?: string;
  price?: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: object | null;
  availabilityStatus?: string;
  minimumOrderQuantity?: number;
  meta?: object | null;
  images?: string[];
  thumbnail?: string;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> {}

export class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: number;
  public title?: string;
  public description?: string;
  public category?: string;
  public price?: number;
  public discountPercentage?: number;
  public rating?: number;
  public stock?: number;
  public tags?: string[];
  public brand?: string;
  public sku?: string;
  public weight?: number;
  public dimensions?: object | null;
  public availabilityStatus?: string;
  public minimumOrderQuantity?: number;
  public meta?: object | null;
  public images?: string[];
  public thumbnail?: string;
}

Product.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: DataTypes.TEXT,
  description: DataTypes.TEXT,
  category: DataTypes.TEXT,
  price: DataTypes.DECIMAL,
  discountPercentage: {
    type: DataTypes.DECIMAL,
    field: 'discountpercentage',
  },
  rating: DataTypes.DECIMAL,
  stock: DataTypes.INTEGER,
  tags: DataTypes.ARRAY(DataTypes.TEXT),
  brand: DataTypes.TEXT,
  sku: DataTypes.TEXT,
  weight: DataTypes.DECIMAL,
  dimensions: DataTypes.JSONB,
  availabilityStatus: {
    type: DataTypes.TEXT,
    field: 'availabilitystatus',
  },
  minimumOrderQuantity: {
    type: DataTypes.INTEGER,
    field: 'minimumorderquantity',
  },
  meta: DataTypes.JSONB,
  images: DataTypes.ARRAY(DataTypes.TEXT),
  thumbnail: DataTypes.TEXT,
}, {
  sequelize,
  tableName: 'products',
  timestamps: false,
});
