const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
require('colors');

// model
const Book = require('../../models/Book');

dotenv.config({ path: './config.env' });

// database connection string
const db = process.env.DATABASE;

// MongoDB connection
mongoose.connect(db)
    .then(() => console.log(`Connected to MongoDB → ${db}`.gray.bold))
    .catch((err) => console.log(`Could not connect to the database → ${err}`.red.bold));

// read JSON file
const books = JSON.parse(fs.readFileSync(`${__dirname}/books.json`, 'utf-8'));

// import data into database
const importData = async () => {
    try {
        await Book.insertMany(books);
        console.log('👍👍👍👍👍👍👍👍 Done!'.green.bold);
        console.log('Data successfully loaded!'.green.bold);
        process.exit();
    } catch (err) {
        console.log('\n👎👎👎👎👎👎👎👎 Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run blowitallaway\n\n\n'.red.bold);
        console.log(err);
        process.exit();
    }
};

// delete data from database
const deleteData = async () => {
    try {
        console.log('😢😢 Goodbye Data...');
        await Book.deleteMany();
        console.log('Data successfully deleted!'.green.bold);
        console.log('Data Deleted. To load sample data, run\n\n\t npm run sample\n\n'.green.bold);
        process.exit();
    } catch (err) {
        console.log(err);
        process.exit();
    }
};

if (process.argv.includes('--import')) {
    importData();
} else {
    deleteData();
}
