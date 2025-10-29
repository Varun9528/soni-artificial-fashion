const { translateToHindi } = require('./src/lib/translation/service');

// Test translation
console.log('Testing translation service:');
console.log('English: "Gold Pendant" -> Hindi:', translateToHindi('Gold Pendant'));
console.log('English: "Beautiful Jewelry" -> Hindi:', translateToHindi('Beautiful Jewelry'));
console.log('English: "Handmade Craft" -> Hindi:', translateToHindi('Handmade Craft'));