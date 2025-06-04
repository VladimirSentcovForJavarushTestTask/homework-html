const fs = require('fs');
const path = require('path');

/**
 * Initializes the database by copying db_example.json to db.json if it doesn't exist
 */
function initDatabase() {
  const exampleDbPath = path.join(__dirname, '..', 'db_example.json');
  const dbPath = path.join(__dirname, '..', 'db.json');

  // Check if db.json already exists
  if (fs.existsSync(dbPath)) {
    console.log('db.json already exists, skipping initialization');
    return;
  }

  // Check if db_example.json exists
  if (!fs.existsSync(exampleDbPath)) {
    console.error('Error: db_example.json not found');
    process.exit(1);
  }

  try {
    // Copy db_example.json to db.json
    fs.copyFileSync(exampleDbPath, dbPath);
    console.log('Successfully initialized db.json from db_example.json');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run the initialization
initDatabase(); 