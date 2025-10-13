const fs = require('fs');
const path = require('path');

// Check if required Tailwind directives exist in globals.css
const globalsCssPath = path.join(__dirname, 'src', 'app', 'globals.css');
const globalsCssContent = fs.readFileSync(globalsCssPath, 'utf8');

const requiredDirectives = [
  '@tailwind base;',
  '@tailwind components;',
  '@tailwind utilities;'
];

console.log('=== Tailwind CSS Fix Verification ===\n');

let allDirectivesFound = true;
console.log('1. Checking globals.css for required Tailwind directives:');
requiredDirectives.forEach(directive => {
  if (globalsCssContent.includes(directive)) {
    console.log(`   ✅ ${directive}`);
  } else {
    console.log(`   ❌ ${directive} (MISSING)`);
    allDirectivesFound = false;
  }
});

if (allDirectivesFound) {
  console.log('   🎉 All required Tailwind directives found!\n');
} else {
  console.log('   ⚠️  Some required Tailwind directives are missing!\n');
}

// Check PostCSS configuration
const postcssConfigPath = path.join(__dirname, 'postcss.config.js');
const postcssConfigContent = fs.readFileSync(postcssConfigPath, 'utf8');

console.log('2. Checking PostCSS configuration:');
if (postcssConfigContent.includes('@tailwindcss/postcss') && postcssConfigContent.includes('autoprefixer')) {
  console.log('   ✅ PostCSS configuration uses both @tailwindcss/postcss and autoprefixer plugins\n');
} else {
  console.log('   ❌ PostCSS configuration may be missing required plugins\n');
}

// Check if build directories were removed
console.log('3. Checking build cache directories:');
const nextDirExists = fs.existsSync(path.join(__dirname, '.next'));
const turboDirExists = fs.existsSync(path.join(__dirname, '.turbo'));
const cacheDirExists = fs.existsSync(path.join(__dirname, 'node_modules', '.cache'));

if (!nextDirExists && !turboDirExists && !cacheDirExists) {
  console.log('   ✅ Build cache directories have been cleared\n');
} else {
  console.log('   ⚠️  Some build cache directories still exist');
  if (nextDirExists) console.log('      - .next directory still exists');
  if (turboDirExists) console.log('      - .turbo directory still exists');
  if (cacheDirExists) console.log('      - node_modules/.cache directory still exists');
  console.log('');
}

// Check Tailwind configuration
const tailwindConfigPath = path.join(__dirname, 'tailwind.config.ts');
const tailwindConfigContent = fs.readFileSync(tailwindConfigPath, 'utf8');

console.log('4. Checking Tailwind configuration:');
if (tailwindConfigContent.includes('darkMode: \'class\'')) {
  console.log('   ✅ Dark mode support is enabled\n');
} else {
  console.log('   ⚠️  Dark mode support may not be enabled\n');
}

if (tailwindConfigContent.includes('#5C4033') && tailwindConfigContent.includes('#FFD54F')) {
  console.log('   ✅ Brand colors (Deep Brown and Mustard Gold) are defined\n');
} else {
  console.log('   ⚠️  Brand colors may not be properly defined\n');
}

console.log('5. Test page verification:');
console.log('   Please visit http://localhost:3004/test-css to verify that Tailwind classes are working properly.');
console.log('   Look for:');
console.log('   - Red background on "bg-red-500" elements');
console.log('   - Proper spacing on elements with padding classes');
console.log('   - Responsive layouts changing on different screen sizes');
console.log('   - Dark mode functionality');

console.log('\n=== Verification Complete ===');