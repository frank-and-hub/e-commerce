const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
    address: { type: Object, default: {} },
    price: { type: Number, required: true },
    status: {
        type: String, default: 'placed',
        enum: [
            'placed',         // Order has been placed
            'pending',        // Order is awaiting confirmation or processing
            'paymentFailed',  // Payment failed
            'readyToShip',    // Ready for shipping
            'shipped',        // Order has been dispatched
            'dispatched',     // Order has been sent out for delivery
            'outofDelivery',  // Order is out for delivery
            'delivered',      // Order has been delivered successfully
            'cancelled',      // Order was cancelled by the user or system
            'returned',       // Order has been returned by the customer
            'refunded',       // Payment was refunded
            'outOfStock'      // Product is out of stock and can't be fulfilled
        ]
    },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deleted_at: { type: Date, default: null }
}, {
    timestamps: true
});

OrderSchema.pre(/^find/, function (next) {
    this.where({ deleted_at: null });
    next();
});

OrderSchema.index({ cart: 1, user: 1, deleted_at: 1 });

// Export the model
module.exports = mongoose.model('Order', OrderSchema);