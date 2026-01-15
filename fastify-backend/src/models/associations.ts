import { Product } from './Product.js';
import { Review } from './Review.js';
import { User } from './User.js';
import { CartItem } from './CartItem.js';
import { Order } from './Order.js';


// ------------------- Product ↔ Review -------------------
Product.hasMany(Review, { foreignKey: 'product_id', as: 'reviews' });
Review.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// ------------------- User ↔ CartItem -------------------
User.hasMany(CartItem, { foreignKey: 'user_uid', as: 'cartItems' });
CartItem.belongsTo(User, { foreignKey: 'user_uid', as: 'user' });

// ------------------- Product ↔ CartItem -------------------
Product.hasMany(CartItem, { foreignKey: 'product_id', as: 'cartItems' });
CartItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// ------------------- User ↔ Order -------------------
User.hasMany(Order, { foreignKey: 'user_uid', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_uid', as: 'user' });

// ------------------- Product ↔ Order -------------------
Product.hasMany(Order, { foreignKey: 'product_id', as: 'orders' });
Order.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });


