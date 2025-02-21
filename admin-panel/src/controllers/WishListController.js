const mongoose = require('mongoose');

const User = require('../models/user');
const Product = require('../models/product');
const WishList = require('../models/wish_list');

// base url
const status_active = `${process.env.STATUS_ACTIVE}`;
const data_limit = `${process.env.DATA_PAGINATION_LIMIT}`;

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
        const totalCount = await WishList.countDocuments({
            ...filter,
            deleted_at: null
        });

        const query = WishList.find(filter)
            .select('_id product user status updated_by')
            .populate('user', '_id name')
            .populate('product', '_id name')
            .populate('updated_by', '_id name');

        if (req?.query?.page != 0) {
            query.sort({ [orderByField]: orderByDirection })
                .skip(skip)
                .limit(limit);
        }

        const wishLists = await query;

        if (wishLists.length === 0) return res.status(200).json({ message: `wish lists is empty!!`, data: [] });

        const wishListPromises = wishLists.map(async (wishList) => {
            const { _id, product, status } = wishList;
            return {
                'id': _id,
                'product': product,
                'status': status
            }
        });
        const wishListResponses = await Promise.all(wishListPromises);
        res.status(200).json({
            message: `List retrieved successfully`, response: {
                count: totalCount,
                page: page,
                limit: limit,
                totalPages: Math.ceil(totalCount / limit),
                data: wishListResponses
            }, title: 'listing'
        });
    } catch (err) {
        next(err)
    }
}

exports.create = (req, res, next) => {
    try {
        res.status(200).json({
            message: `Create wishList form`,
            body: {
                'product': 'SchemaId',
                'userId': 'SchemaId'
            },
            title: 'Add wishList'
        });
    } catch (err) {
        next(err)
    }
}

exports.store = async (req, res, next) => {
    const { product_id } = req.body;
    try {
        console.log(req.body);
        let userId = req?.userData?.id;
        const userData = await User.findById(userId).select('_id name').where('status').equals(status_active);
        if (!userData) return res.status(401).json({ message: `User not found!`, data: [] });

        const productData = await Product.findById(product_id).select('_id name').where('status').equals(status_active);
        if (!productData) return res.status(401).json({ message: `Product not found!`, data: [] });

        const existsWishList = await WishList.findOne({ product: product, user: userData._id, status: status_active });
        if (existsWishList) {
            const wishListData = await WishList.deleteOne({ _id: existsWishList._id });
            if (wishListData.deletedCount === 1) {
                res.status(201).json({ message: `Deleted successfully`, data: [] });
            }
        };

        const wishList = new WishList({
            _id: new mongoose.Types.ObjectId(),
            user: userData._id,
            product: productData._id
        });

        const newData = await wishList.save();
        const response = {
            'id': newData?._id,
            'product': productData?.name,
            'user': userData?.name
        }
        res.status(201).json({ message: `Successfully created`, data: response });
    } catch (err) {
        next(err)
    }
}