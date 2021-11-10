const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Types.ObjectId,
        required: [true, 'An order must belong to a customer'],
    },
    bookId: {
        type: mongoose.Types.ObjectId,
        required: [true, 'An order must belong to a book'],
    },
    initialDate: {
        type: Date,
        required: [true, 'An order must have initial date'],
    },
    deliveryDate: {
        type: Date,
        required: [true, 'An order must have a delivery date'],
    },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
