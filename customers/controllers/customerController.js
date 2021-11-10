const { StatusCodes } = require('http-status-codes');

const Customer = require('../models/Customer');
const catchErrors = require('../utils/catchErrors');
const APIFeatures = require('../utils/apiFeatures');
const NotFoundError = require('../errors/notFound');

exports.getAllCustomers = catchErrors(async (req, res, next) => {
    const features = new APIFeatures(Customer.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const customers = await features.query;

    res.status(StatusCodes.OK).json({
        status: 'success',
        requestedAt: req.requestTime,
        counts: customers.length,
        data: {
            customers,
        },
    });
});

exports.getCustomer = catchErrors(async (req, res, next) => {
    const { id: customerID } = req.params;

    const customer = await Customer.findById(customerID);

    // if (!customer) return res.sendStatus(404);
    if (!customer) {
        return next(new NotFoundError(`No customer found with that ID: ${customerID}`));
    }

    res.status(StatusCodes.OK).json({
        status: 'success',
        data: {
            customer,
        },
    });
});

exports.createCustomer = catchErrors(async (req, res, next) => {
    const customer = await Customer.create({ ...req.body });

    res.status(StatusCodes.CREATED).json({
        status: 'success',
        data: {
            customer,
        },
    });
});

exports.updateCustomer = catchErrors(async (req, res, next) => {
    const { id: customerID } = req.params;

    const customer = await Customer.findByIdAndUpdate(customerID, req.body, {
        new: true,
        runValidators: true,
    });

    // if (!customer) return res.sendStatus(404);
    if (!customer) {
        return next(new NotFoundError(`No customer found with that ID: ${customerID}`));
    }

    res.status(StatusCodes.OK).json({
        status: 'success',
        data: {
            customer,
        },
    });
});

exports.deleteCustomer = catchErrors(async (req, res, next) => {
    const { id: customerID } = req.params;

    const customer = await Customer.findByIdAndDelete(customerID);

    // if (!customer) return res.sendStatus(404);
    if (!customer) {
        return next(new NotFoundError(`No customer found with that ID: ${customerID}`));
    }

    res.status(StatusCodes.NO_CONTENT).json({
        status: 'success',
        data: null,
    });
});
