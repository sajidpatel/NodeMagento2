import { Model, DataTypes } from 'sequelize';
import sequelize from './database';

class ProductCategory extends Model {
  public entityId!: number; // Adjusted to Magento's schema for category ID
  // Restoring and adjusting handling for the 'name' field to reflect Magento's EAV structure might be necessary in a joined query rather than directly in this model.

  // Considering the possibility of timestamps being present in some deployments, these fields are commented out for optional inclusion
  // public readonly createdAt!: Date;
  // public readonly updatedAt!: Date;
}

ProductCategory.init({
  entityId: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    field: 'entity_id', // Direct mapping to Magento's category ID field
  },
  // Since Magento uses an EAV model, direct mapping for 'name' isn't included here. Handling Magento's EAV structure for category names might require additional logic outside this model.
}, {
  sequelize,
  tableName: 'catalog_category_entity', // Direct mapping to Magento's category entity table
  timestamps: false, // Reflecting typical Magento schema; adjust based on actual deployment
  modelName: 'ProductCategory'
});

// Note: Handling Magento's EAV structure for category names typically requires joining this model with the appropriate attribute value table based on Magento's setup.

ProductCategory.sync().then(() => {
  console.log("ProductCategory model was synchronized successfully.");
}).catch((error) => {
  console.error("Error synchronizing ProductCategory model:", error.message, error.stack);
});

export default ProductCategory;