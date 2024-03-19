import { Model, DataTypes } from 'sequelize';
import sequelize from './database';

class ProductDescription extends Model {
  public entity_id!: number;
  public value!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProductDescription.init(
  {
    entity_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      allowNull: false,
      field: 'entity_id', // This field name is based on Magento's schema
      references: {
        model: 'catalog_product_entity', // This references the primary product table in Magento's schema
        key: 'entity_id',
      }
    },
    value: {
      type: new DataTypes.TEXT(),
      allowNull: false,
      field: 'value' // This field name is based on Magento's schema for product descriptions
    },
  },
  {
    sequelize,
    tableName: 'catalog_product_entity_text', // Adjusted to Magento's schema for product descriptions
    timestamps: false, // Magento does not use Sequelize's default timestamp fields for product data
  }
);

ProductDescription.sync().then(() => {
  console.log('ProductDescription model sync completed.');
}).catch((error) => {
  console.error('Error syncing ProductDescription model:', error.message, error.stack);
});

export default ProductDescription;