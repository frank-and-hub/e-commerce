const mongoose = require('mongoose');

const Cart = require('../models/cart');
const User = require('../models/user');

// helper function
const helper = require('../utils/helper');

// config url
const url = require('../config/url');

// base url
const baseurl = `${url.apiUrl}`;
const status_active = `${process.env.STATUS_ACTIVE}`;
const data_limit = `${process.env.DATA_PAGINATION_LIMIT}`;
const constName = 'carts/';

exports.index = async (req, res, next) => {
    try {

        const page = parseInt(req?.query?.page) || 1;
        const limit = parseInt(req?.query?.limit) || parseInt(data_limit);

        const orderByField = req?.query?.orderby || '_id';
        const orderByDirection = req?.query?.direction === 'asc' ? 1 : -1;

        const filter = {};
        let userId = req?.userData?.id;
        const { status, search } = req.query;

        if (status) filter.status = status;
        if (userId) filter.user = userId;

        if (search) {
            const trimmedSearch = search.trim();
            filter.$or = [
                { product: { $regex: trimmedSearch, $options: "i" } },
            ];
        }

        const skip = (page - 1) * limit;
        const totalCount = await Cart.countDocuments({
            ...filter,
            deleted_at: null
        });

        const query = Cart.find(filter)
            .select('_id product user status updated_by')
            .populate('user', '_id name')
            .populate('product', '_id name')
            .populate('updated_by', '_id name');

        if (req?.query?.page != 0) {
            query.sort({ [orderByField]: orderByDirection })
                .skip(skip)
                .limit(limit);
        }

        const carts = await query;

        if (carts.length === 0) return res.status(200).json({ message: `No carts found`, data: [] });

        const cartPromises = carts.map(async (cart) => {
            const { _id, product, status, user } = cart;
            return {
                'id': _id,
                'product': product,
                'status': status
            }
        });
        const cartResponses = await Promise.all(cartPromises);
        res.status(200).json({
            message: `List retrieved successfully`, response: {
                count: totalCount,
                page: page,
                limit: limit,
                totalPages: Math.ceil(totalCount / limit),
                data: cartResponses
            }, title: 'listing'
        });
    } catch (err) {
        next(err)
    }
}

exports.create = (req, res, next) => {
    try {
        res.status(200).json({
            message: `Create cart form`,
            body: {
                'product': 'SchemaId',
                'user': 'SchemaId'
            },
            title: 'Add cart'
        });
    } catch (err) {
        next(err)
    }
}

exports.store = async (req, res, next) => {
    const { product_id, quantity } = req.body;
    try {
        let userId = req?.userData?.id;
        const userData = await User.findById(userId).select('_id').where('status').equals(status_active);
        if (!userData) return res.status(401).json({ message: `User not found!`, data: [] });

        const productData = await Product.findById(product_id).select('_id').where('status').equals(status_active);
        if (!productData) return res.status(401).json({ message: `Product not found!`, data: [] });

        const existsCart = await Cart.findOne({
            user: userData._id,
            status: status_active,
            'products.product': productData._id,
        });

        if (existsCart) {
            const CartData = await Cart.updateOne({ _id: existsCart._id }, { $pull: { products: { product: productData._id } } });
            if (CartData.modifiedCount > 0) {
                res.status(201).json({ message: `Product removed from cart`, data: [] });
            }
        };

        const cart = new Cart({
            _id: new mongoose.Types.ObjectId(),
            user: userData._id,
            products: [{
                product: productData._id,
                quantity: quantity || 1
            }]
        });

        const newData = await cart.save();
        const response = {
            'id': newData?._id,
            'products': {
                'product': productData._id,
                'quantity': quantity
            },
            'quantity': quantity,
            'user': userData?.name
        }
        res.status(201).json({ message: `Successfully created`, data: response });
    } catch (err) {
        next(err)
    }
}

exports.show = async (req, res, next) => {
    const { id } = req.params;
    try {
        const cartData = await this.find_data_by_id(id, res);
        const { _id, products, user, updated_by, status } = cartData;
        const result = {
            'id': _id,
            'status': status,
            'user': user,
            'products': products.map(p => ({
                'product': p.product,
                'quantity': p.quantity
            }))
        }
        res.status(200).json({ message: `Cart was found`, data: result, title: `View ${user.name} cart detail` });
    } catch (err) {
        next(err)
    }
}

exports.edit = async (req, res, next) => {
    const { id } = req.params;
    try {
        const cartData = await this.find_data_by_id(id, res);
        const { _id, products, user, updated_by, status } = cartData;
        const result = {
            'id': _id,
            'user': user,
            'status': status,
            'updated_by': updated_by,
            'products': products.map(p => ({
                product: p.product,
                quantity: p.quantity
            }))
        }
        res.status(200).json({ message: `Cart was found`, data: result, title: `Edit ${user.name} cart detail` });
    } catch (err) {
        next(err)
    }
}

exports.destroy = async (req, res, next) => {
    const { id } = req.params;
    try {
        const getCart = await Cart.findById(id).select('_id').where('status').equals(!status_active);
        if (!getCart) return res.status(404).json({ message: 'Cart not found' });

        // const cartData = await Cart.deleteOne({ _id: id });
        // if (cartData.deletedCount === 1) {

        const cartData = await Cart.findByIdAndUpdate(id, { deleted_at: new Date() });
        if (cartData) {
            const response = {
                'method': 'POST',
                'url': `${baseurl}${constName}`,
                'body': {
                    'product': 'SchemaId',
                    'user': 'SchemaId',
                }
            }
            return res.status(200).json({ message: `Deleted successfully`, request: response });
        }
        res.status(404).json({ message: `Cart not found` });
    } catch (err) {
        next(err)
    }
}

exports.find_data_by_id = async (id, res) => {
    const cartData = await Cart.findById(id)
        .select('_id products user updated_by status')
        // .where('status').equals(status_active)
        .populate('user', '_id name')
        .populate('updated_by', '_id name')
        .populate('products.product', '_id name price');

    if (!cartData) return res.status(404).json({ message: `Cart not found` });

    return cartData;
}