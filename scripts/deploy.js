#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

// Function to get current version
function getCurrentVersion() {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  return packageJson.version;
}

// Function to run command
function runCommand(command) {
  try {
    console.log(`Running: ${command}`);
    const output = execSync(command, { stdio: 'inherit' });
    return output;
  } catch (error) {
    console.error(`Error running command: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

// Function to deploy with versioning
async function deploy() {
  try {
    console.log('Starting deployment process...');
    
    // Get current version
    const currentVersion = getCurrentVersion();
    console.log(`Current version: ${currentVersion}`);
    
    // Run tests (if any)
    console.log('Running tests...');
    // runCommand('npm run test'); // Uncomment when you have tests
    
    // Build the application
    console.log('Building application...');
    runCommand('npm run build');
    
    // Create a git commit for the build
    console.log('Creating git commit...');
    runCommand('git add .');
    runCommand(`git commit -m "Build version ${currentVersion}"`);
    
    // Create a git tag
    console.log('Creating git tag...');
    runCommand(`git tag -a v${currentVersion} -m "Release version ${currentVersion}"`);
    
    // Push to remote repository
    console.log('Pushing to remote repository...');
    runCommand('git push origin main');
    runCommand('git push origin --tags');
    
    console.log('Deployment completed successfully!');
    console.log(`Application version ${currentVersion} deployed`);
    
  } catch (error) {
    console.error('Deployment failed:', error.message);
    process.exit(1);
  }
}

// Function to increment version
function incrementVersion(type) {
  try {
    console.log(`Incrementing ${type} version...`);
    runCommand(`npm version ${type}`);
    
    const newVersion = getCurrentVersion();
    console.log(`New version: ${newVersion}`);
    
    return newVersion;
  } catch (error) {
    console.error(`Failed to increment ${type} version:`, error.message);
    process.exit(1);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node deploy.js [patch|minor|major|deploy]');
    process.exit(1);
  }
  
  const command = args[0];
  
  switch (command) {
    case 'patch':
      incrementVersion('patch');
      break;
    case 'minor':
      incrementVersion('minor');
      break;
    case 'major':
      incrementVersion('major');
      break;
    case 'deploy':
      await deploy();
      break;
    default:
      console.log('Invalid command. Use: patch, minor, major, or deploy');
      process.exit(1);
  }
}

main();