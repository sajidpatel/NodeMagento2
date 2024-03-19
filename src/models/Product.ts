import { Model, DataTypes, Association } from 'sequelize';
import sequelize from './database';
import ProductName from './ProductName';
import ProductDescription from './ProductDescription';
import ProductPrice from './ProductPrice';

interface ProductAttributes {
  entity_id: number; // Magento's primary key for products
  sku: string;
}

class Product extends Model<ProductAttributes> implements ProductAttributes {
  public entity_id!: number;
  public sku!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations can be declared with types
  public readonly productNames?: ProductName[];
  public readonly productDescriptions?: ProductDescription[];
  public readonly productPrices?: ProductPrice[];

  public static associations: {
    productNames: Association<Product, ProductName>;
    productDescriptions: Association<Product, ProductDescription>;
    productPrices: Association<Product, ProductPrice>;
  };

  // Sequelize model configuration
  public static initializeModel() {
    Product.init({
      entity_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
      },
      sku: {
        type: new DataTypes.STRING(64),
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: 'catalog_product_entity', // Adjusted to Magento's primary product table
      timestamps: false, // Magento does not use Sequelize's default timestamp fields
    });
  }

  public static setupAssociations() {
    Product.hasMany(ProductName, { foreignKey: 'entity_id', as: 'productNames', sourceKey: 'entity_id' });
    Product.hasMany(ProductDescription, { foreignKey: 'entity_id', as: 'productDescriptions', sourceKey: 'entity_id' });
    Product.hasMany(ProductPrice, { foreignKey: 'entity_id', as: 'productPrices', sourceKey: 'entity_id' }); // Adjusted for potential multiple prices per product
  }
}

// Initialize model and setup associations
Product.initializeModel();
Product.setupAssociations();

console.log("Product model and associations were initialized successfully.");

export default Product;