const mongoose = require('mongoose');
const slugify = require('slugify');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A book must have a title'],
    },
    slug: String,
    author: {
        type: String,
        required: [true, 'A book must belong to an author'],
    },
    numberPages: {
        type: Number,
    },
    publisher: {
        type: String,
        required: [true, 'A book must have a publisher']
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

bookSchema.pre('save', async function (next) {
    if (!this.isModified('title')) return next();

    this.slug = slugify(this.title, { lower: true });

    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    const bookWithSlug = await this.constructor.find({ slug: slugRegEx });

    if (bookWithSlug.length) {
        this.slug = `${this.slug}-${bookWithSlug.length + 1}`;
    }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
