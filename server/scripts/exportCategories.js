const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Category Schema
const FieldSchema = new mongoose.Schema({
  fieldName: { type: String, required: true },
  fieldType: {
    type: String,
    enum: ["text", "number", "date", "boolean"],
    default: "text",
  },
});

const SettingSchema = new mongoose.Schema({
  focus: String,
  tone: String,
  quantity: String,
  contentLenght: Number
});

const CategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  alias: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  type: {
    type: String,
    enum: ["blueprint", "project"],
    default: null,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  description: {
    type: String,
  },
  fields: [FieldSchema],
  level: { type: Number, required: true },
  settings: { type: SettingSchema }
}, {
  timestamps: true,
});

const Category = mongoose.model('Category', CategorySchema);

async function exportCategories() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Fetch all categories
    const categories = await Category.find({}).lean();
    console.log(`📊 Found ${categories.length} categories`);

    // Transform categories for export (convert ObjectIds to strings)
    const categoriesForExport = categories.map(category => ({
      _id: category._id.toString(),
      title: category.title,
      alias: category.alias,
      description: category.description,
      fields: category.fields || [],
      level: category.level || 0,
      type: category.type,
      parentId: category.parentId ? category.parentId.toString() : null,
      settings: category.settings || {},
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    }));

    // Save to JSON file
    const outputPath = path.join(__dirname, 'categories.json');
    fs.writeFileSync(outputPath, JSON.stringify(categoriesForExport, null, 2));
    
    console.log(`💾 Categories exported to ${outputPath}`);
    
    // Show summary
    const rootCategories = categoriesForExport.filter(cat => !cat.parentId);
    const childCategories = categoriesForExport.filter(cat => cat.parentId);
    
    console.log('\n📊 Export Summary:');
    console.log(`- Total categories: ${categoriesForExport.length}`);
    console.log(`- Root categories: ${rootCategories.length}`);
    console.log(`- Child categories: ${childCategories.length}`);
    
    // Group by level
    const categoriesByLevel = {};
    categoriesForExport.forEach(cat => {
      const level = cat.level || 0;
      if (!categoriesByLevel[level]) {
        categoriesByLevel[level] = [];
      }
      categoriesByLevel[level].push(cat);
    });
    
    console.log('\n📋 Categories by level:');
    Object.keys(categoriesByLevel).sort().forEach(level => {
      console.log(`   Level ${level}: ${categoriesByLevel[level].length} categories`);
    });

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error exporting categories:', error);
    process.exit(1);
  }
}

// Check if running directly
if (require.main === module) {
  exportCategories();
}

module.exports = { exportCategories }; 