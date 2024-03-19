import { Model, DataTypes } from 'sequelize';
import sequelize from './database';

class ProductPrice extends Model {
  public entityId!: number;
  public value!: number; // Assuming this maps to the price of the product

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProductPrice.init(
  {
    entityId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      allowNull: false,
      field: 'entity_id', // This field name is based on Magento's schema
      references: {
        model: 'catalog_product_entity',
        key: 'entity_id',
      }
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'value' // This field name should match Magento's database schema for product prices. Adjust as necessary.
    },
  },
  {
    sequelize,
    tableName: 'catalog_product_entity_decimal', // Adjusted to Magento's schema for product prices
    timestamps: false, // Magento does not use Sequelize's default timestamp fields for product data
    modelName: 'ProductPrice'
  }
);

ProductPrice.sync().then(() => {
  console.log("ProductPrice model was synchronized successfully.");
}).catch((error) => {
  console.error("Error synchronizing ProductPrice model:", error.message, error.stack);
});

export default ProductPrice;