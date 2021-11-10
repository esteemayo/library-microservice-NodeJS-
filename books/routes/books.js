const express = require('express');

const bookController = require('../controllers/bookController');

const router = express();

router.get('/details/:slug', bookController.getBookBySlug);

router
    .route('/')
    .get(bookController.getAllBooks)
    .post(bookController.createBook);

router
    .route('/:id')
    .get(bookController.getBookById)
    .patch(bookController.updateBook)
    .delete(bookController.deleteBook);

module.exports = router;
