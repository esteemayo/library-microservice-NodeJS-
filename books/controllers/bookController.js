/* eslint-disable */
const { StatusCodes } = require('http-status-codes');

const Book = require('../models/Book');
const catchErrors = require('../utils/catchErrors');
const APIFeatures = require('../utils/apiFeatures');
const NotFoundError = require('../errors/notFound');

exports.getAllBooks = catchErrors(async (req, res, next) => {
    const features = new APIFeatures(Book.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const books = await features.query;

    res.status(StatusCodes.OK).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: books.length,
        data: {
            books,
        },
    });
});

exports.getBookById = catchErrors(async (req, res, next) => {
    const { id: bookID } = req.params;

    const book = await Book.findById(bookID);

    // if (!book) return res.sendStatus(404);
    if (!book) {
        return next(new NotFoundError(`No book found with that ID: ${bookID}`));
    }

    res.status(StatusCodes.OK).json({
        status: 'success',
        data: {
            book,
        },
    });
});

exports.getBookBySlug = catchErrors(async (req, res, next) => {
    const { slug } = req.params;

    const book = await Book.findOne({ 'slug': slug });

    // if (!book) return res.sendStatus(404);
    if (!book) {
        return next(new NotFoundError(`No book found with that SLUG: ${slug}`));
    }

    res.status(StatusCodes.OK).json({
        status: 'success',
        data: {
            book,
        },
    });
});

exports.createBook = catchErrors(async (req, res, next) => {
    const book = await Book.create({ ...req.body });

    res.status(StatusCodes.CREATED).json({
        status: 'success',
        data: {
            book,
        },
    });
});

exports.updateBook = catchErrors(async (req, res, next) => {
    const { id: bookID } = req.params;

    if (req.body === '') {
        // return next()
    }

    const book = await Book.findByIdAndUpdate(bookID, req.body, {
        new: true,
        runValidators: true,
    });

    // if (!book) return res.sendStatus(404);
    if (!book) {
        return next(new NotFoundError(`No book found with that ID: ${bookID}`));
    }

    res.status(StatusCodes.OK).json({
        status: 'success',
        data: {
            book,
        },
    });
});

exports.deleteBook = catchErrors(async (req, res, next) => {
    const { id: bookID } = req.params;

    const book = await Book.findByIdAndDelete(bookID);

    // if (!book) return res.sendStatus(404);
    if (!book) {
        return next(new NotFoundError(`No book found with that ID: ${bookID}`));
    }

    res.status(StatusCodes.NO_CONTENT).json({
        status: 'success',
        data: null,
    });
});
