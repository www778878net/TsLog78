const shell = require('shelljs');

console.log('Pre-push hook starts executing');

// Get current branch name
const currentBranch = shell.exec('git rev-parse --abbrev-ref HEAD', { silent: true }).stdout.trim();

if (currentBranch === 'develop') {
    console.log('Current branch is develop. Running npm run main...');
    const mergeResult = shell.exec('npm run main');

    if (mergeResult.code !== 0) {
        console.error('Merge to main failed, push aborted');
        shell.exit(1);
    }
    console.log('Merge to main completed successfully');
} else {
    console.log(`Current branch is ${currentBranch}. Skipping npm run main.`);
}

// Run tests
console.log('Running tests...');
const testResult = shell.exec('npm test');

if (testResult.code !== 0) {
    console.error('Tests failed, push aborted');
    shell.exit(1);
}

console.log('Tests passed');
//console.log('Pre-push hook execution completed');