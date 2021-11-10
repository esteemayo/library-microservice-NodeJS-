const axios = require('axios');
const { StatusCodes } = require('http-status-codes');

const Order = require('../models/Order');
const catchErrors = require('../utils/catchErrors');
const APIFeatures = require('../utils/apiFeatures');
const NotFoundError = require('../errors/notFound');

exports.getAllOrders = catchErrors(async (req, res, next) => {
    const features = new APIFeatures(Order.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const orders = await features.query;

    res.status(StatusCodes.OK).json({
        status: 'success',
        requestedAt: req.requestTime,
        nbHits: orders.length,
        data: {
            orders,
        },
    });
});

exports.getOrder = catchErrors(async (req, res, next) => {
    const { id: orderID } = req.params;

    const order = await Order.findById(orderID);

    // if (!order) return res.sendStatus(404);
    if (!order) {
        return next(new NotFoundError(`No order found with that ID: ${orderID}`));
    }

    const { data: { data: customerData } } = await axios.get(`http://localhost:8888/api/v1/customers/${order.customerId}`);

    const { data: { data: bookData } } = await axios.get(`http://localhost:7777/api/v1/books/${order.bookId}`);

    const orderObj = {
        customerName: customerData.customer.name,
        bookTitle: bookData.book.title,
    };

    res.status(StatusCodes.OK).json({
        status: 'success',
        data: {
            orderObj,
        },
    });
});

exports.createOrder = catchErrors(async (req, res, next) => {
    const order = await Order.create({ ...req.body });

    res.status(StatusCodes.CREATED).json({
        status: 'success',
        data: {
            order,
        },
    });
});

exports.updateOrder = catchErrors(async (req, res, next) => {
    const { id: orderID } = req.params;

    const order = await Order.findByIdAndUpdate(orderID, req.body, {
        new: true,
        runValidators: true,
    });

    // if (!order) return res.sendStatus(404);
    if (!order) {
        return next(new NotFoundError(`No order found with that ID: ${orderID}`));
    }

    res.status(StatusCodes.OK).json({
        status: 'success',
        data: {
            order,
        },
    });
});

exports.deleteOrder = catchErrors(async (req, res, next) => {
    const { id: orderID } = req.params;

    const order = await Order.findByIdAndDelete(orderID);

    // if (!order) return res.sendStatus(404);
    if (!order) {
        return next(new NotFoundError(`No order found with that ID: ${orderID}`));
    }

    res.status(StatusCodes.NO_CONTENT).json({
        status: 'success',
        data: null,
    });
});
