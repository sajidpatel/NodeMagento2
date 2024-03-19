import { Model, DataTypes } from 'sequelize';
import sequelize from './database';

class ProductName extends Model {
  public entity_id!: number;
  public value!: string;
}

ProductName.init({
  entity_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    field: 'entity_id', // This field name is based on Magento's schema
    references: {
      model: 'catalog_product_entity',
      key: 'entity_id',
    }
  },
  value: {
    type: new DataTypes.STRING(255),
    allowNull: false,
    field: 'value' // This field name is based on Magento's product name attribute schema
  },
}, {
  sequelize,
  tableName: 'catalog_product_entity_varchar', // This table name is based on Magento's schema for product names
  timestamps: false, // Magento does not use timestamp fields in this table
  modelName: 'ProductName'
});

ProductName.sync().then(() => {
  console.log("ProductName model was synchronized successfully.");
}).catch((error) => {
  console.error("Error synchronizing ProductName model:", error.message, error.stack);
});

export default ProductName;