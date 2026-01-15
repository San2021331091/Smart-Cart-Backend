import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Optional } from '../types/optional.js';

interface ImageCarouselAttributes {
  id: number;
  title?: string;
  image_url: string;
}

export interface ImageCarouselCreationAttributes extends Optional<ImageCarouselAttributes, 'id'> {}

export class ImageCarousel extends Model<ImageCarouselAttributes, ImageCarouselCreationAttributes> implements ImageCarouselAttributes {
  public id!: number;
  public title?: string;
  public image_url!: string;
}

ImageCarousel.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING(255), allowNull: true },
  image_url: { type: DataTypes.TEXT, allowNull: false },
}, {
  sequelize,
  tableName: 'image_carousel',
  timestamps: false,
});
