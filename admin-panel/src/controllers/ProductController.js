const mongoose = require('mongoose');

const Tag = require('../models/tag');
const User = require('../models/user');
const File = require('../models/file');
const Brand = require('../models/brand');
const Product = require('../models/product');
const Discount = require('../models/discount');
const Category = require('../models/category');

// helper function
const helper = require('../utils/helper');

// config url
const url = require('../config/url');

// base url
const baseurl = `${url.apiUrl}`;
const apiBaseUrl = `${url.apiBaseUrl}`;
const status_active = `${process.env.STATUS_ACTIVE}`;
const data_limit = `${process.env.DATA_PAGINATION_LIMIT}`;
const constName = 'products/';

exports.index = async (req, res, next) => {
    try {

        const page = parseInt(req?.query?.page) || 1;
        const limit = parseInt(req?.query?.limit) || parseInt(data_limit);

        const orderByField = req?.query?.orderby || '_id';
        const orderByDirection = req?.query?.direction === 'asc' ? 1 : -1;

        const filter = {};
        const { user_id, status, type, search } = req.query;

        if (user_id) filter.user = user_id;
        if (type) filter.type = type;
        if (status) filter.status = status;

        if (search) {
            const trimmedSearch = search.trim();
            filter.$or = [
                { name: { $regex: trimmedSearch, $options: "i" } },
                { url: { $regex: trimmedSearch, $options: "i" } },
                { description: { $regex: trimmedSearch, $options: "i" } },
            ];
        }

        const skip = (page - 1) * limit;
        const totalCount = await Product.countDocuments({
            ...filter,
            deleted_at: null
        });

        const query = Product.find(filter)
            .select('_id name description url image user type status updated_by')
            .populate('image', '_id name path')
            .populate('user', '_id name')
            .populate('updated_by', '_id name');

        if (req?.query?.page != 0) {
            query.sort({ [orderByField]: orderByDirection })
                .skip(skip)
                .limit(limit);
        }

        const products = await query;

        if (products.length === 0) return res.status(200).json({ message: `No products found`, data: [] });

        const productPromises = products.map(async (product) => {
            const { _id, name, description, url, image, user, type, status } = product;
            return {
                'id': _id,
                'name': name,
                'url': url,
                'user': user,
                'type': type,
                'description': description,
                'image': image,
                'status': status,
                // 'updated_by': updated_by
                // 'request': { 'method': 'GET', 'url': `${baseurl}${constName}${_id}` }
            }
        });
        const productResponses = await Promise.all(productPromises);
        res.status(200).json({
            message: `List retrieved successfully`, response: {
                count: totalCount,
                page: page,
                limit: limit,
                totalPages: Math.ceil(totalCount / limit),
                data: productResponses
            }, title: 'listing'
        });
    } catch (err) {
        next(err)
    }
}

exports.create = (req, res, next) => {
    try {
        res.status(200).json({
            message: `Create product form`,
            body: {
                'name': 'String',
                'description': 'String',
                'url': 'Url',
                'type': 'Boolean',
            },
            title: 'Add product'
        });
    } catch (err) {
        next(err)
    }
}

exports.store = async (req, res, next) => {
    const { name, description, specification, price, discount_id, brand_id, tags, categories } = req.body;
    const file = req.file;
    try {
        const userId = req?.userData?.id;

        const existingProduct = await Product.findOne({ name, description, specification, discount_id, brand_id, tags, categories });
        if (existingProduct) return res.status(409).json({ message: `Product already exists` });

        const user = await User.findById(userId).select('_id name').where('status').equals(status_active);
        if (!user) return res.status(404).json({ message: `User not found` });

        const discount = await Discount.findById(discount_id).select('_id name').where('status').equals(status_active);
        if (!user) return res.status(404).json({ message: `Discount not found` });

        const brand = await Brand.findById(brand_id).select('_id name').where('status').equals(status_active);
        if (!brand) return res.status(404).json({ message: `Brand not found` });

        const foundTags = await Tag.find({ _id: { $in: tags }, status: status_active }).select('_id name');
        if (foundTags.length !== tags.length) return res.status(404).json({ message: 'One or more active tags not found' });

        const foundCategories = await Category.find({ _id: { $in: categories }, status: status_active }).select('_id name');
        if (foundCategories.length !== categories.length) return res.status(404).json({ message: 'One or more active categories not found' });

        // if (!file) return res.status(400).json({ message: `No file uploaded` });

        let savedFile = {};

        if (file) {
            const newFile = new File({
                _id: new mongoose.Types.ObjectId(),
                name: file.filename,
                path: `${apiBaseUrl}/file/${file.filename}`,
            });
            savedFile = await newFile.save();
        }

        const newProduct = new Product({
            _id: new mongoose.Types.ObjectId(),
            name, description, specification, price,
            discount: discount._id,
            brand: brand._id,
            tags: foundTags.map(p => p._id),
            categories: foundCategories.map(p => p._id),
            image: savedFile?._id ?? null,
            user: user._id,
        });
        const newData = await newProduct.save();
        const response = {
            'id': newData._id,
            'name': newData.name,
            'description': newData.description,
            'brand': brand.name,
            'discount': discount.name,
            'user': user.name,
            'image': savedFile?.path ?? null,
            'tags': foundTags.map(perm => ({
                'id': perm._id,
                'name': perm.name
            })),
            'categories': foundCategories.map(perm => ({
                'id': perm._id,
                'name': perm.name
            }))
        }
        res.status(201).json({ message: `Product created successfully`, data: response });
    } catch (err) {
        next(err)
    }
}

exports.show = async (req, res, next) => {
    const { id } = req.params;
    try {
        const productData = await this.find_data_by_id(id, res);
        const { _id, name, description, url, image, user, type, updated_by, status } = productData;
        const result = {
            'id': _id,
            'name': name,
            'description': description,
            'url': url,
            'image': image,
            'user': user,
            'type': type,
            'status': status,
            'updated_by': updated_by
        }
        res.status(200).json({ message: `Product was found`, data: result, title: `View ${name} product detail` });
    } catch (err) {
        next(err)
    }
}

exports.edit = async (req, res, next) => {
    const { id } = req.params;
    try {
        const productData = await this.find_data_by_id(id, res);
        const { _id, name, description, url, image, user, type, updated_by, status } = productData;
        const result = {
            'id': _id,
            'name': name,
            'description': description,
            'url': url,
            'image': image,
            'user': user,
            'type': type,
            'status': status,
            'updated_by': updated_by
        }
        res.status(200).json({ message: `Product was found`, data: result, title: `Edit ${name} product detail` });
    } catch (err) {
        next(err)
    }
}

exports.update = async (req, res, next) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id).select('_id');
        if (!product) return res.status(404).json({ message: `Product not found!`, });

        if (!Array.isArray(req.body)) return res.status(400).json({ message: `No details were updated (product may not exist or the data is the same)` });

        const updateOps = helper.updateOps(req);

        if (updateOps['user']) {
            const userData = await User.findById(updateOps['user']).where('status').equals(status_active);
            if (!userData) return res.status(401).json({ message: `User not found!`, data: response });
        }

        const result = await Product.updateOne({ _id: id }, { $set: updateOps });
        if (result.modifiedCount > 0) {
            const updatedProduct = await this.find_data_by_id(id, res);
            const { _id, name, description, url, image, user, type } = updatedProduct;
            const response = {
                'id': _id,
                'name': name,
                'description': description,
                'url': url,
                'image': image,
                'user': user,
                'type': type,
            }
            return res.status(200).json({ message: `Product details updated successfully`, data: response });
        }
        res.status(404).json({ message: `Product not found or no details to update`, data: [] });
    } catch (err) {
        next(err)
    }
}

exports.destroy = async (req, res, next) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id).select('_id').where('status').equals(!status_active);
        if (!product) return res.status(404).json({ message: `Product not found!`, });

        // const productData = await Product.deleteOne({ _id: id });
        // if (productData.deletedCount === 1) {

        const productData = await Product.findByIdAndUpdate(id, { deleted_at: new Date() });
        if (productData) {
            const response = {
                'method': 'POST',
                'url': `${baseurl}${constName}`,
                'body': {
                    'name': 'String',
                    'description': 'String',
                    'specification': 'String',
                    'price': 'Number',
                    'image': 'file',
                    'user': 'SchemaId',
                    'discount': 'SchemaId',
                    'brand': 'SchemaId',
                    'tags': 'array of SchemaID',
                    'categories': 'array of SchemaID',
                    'product_images': 'array of SchemaID'
                }
            }
            return res.status(200).json({ message: `Deleted successfully`, request: response });
        }
        res.status(404).json({ message: `Product not found` });
    } catch (err) {
        next(err)
    }
}

exports.image = async (req, res, next) => {
    const { id } = req.params;
    const file = req.file;
    try {
        const getProductData = await Product.findById(id).select('_id').where('status').equals(status_active);
        if (!getProductData) return res.status(404).json({ message: `Product not found` });

        const newFile = new File({
            _id: new mongoose.Types.ObjectId(),
            name: file.filename,
            path: `${apiBaseUrl}/file/${file.filename}`,
        });

        // const savedPath = await resizeImage(req.file.buffer, filename);

        const newData = await newFile.save();
        const result = await Product.updateOne({ _id: id }, { $set: { image: newData._id } });
        if (result.modifiedCount > 0) return res.status(200).json({ message: `Product image updated` });
        res.status(404).json({ message: `Product not found or no image to update`, data: [] });
    } catch (err) {
        next(err)
    }
}

exports.find_data_by_id = async (id, res) => {
    const productData = await Product.findById(id)
        .select('_id name description specification price discount brand tags categories image product_images user updated_by status')
        // .where('status').equals(status_active)
        .populate('discount', '_id name')
        .populate('brand', '_id name')
        .populate('user', '_id name')
        .populate('image', '_id name path')
        .populate({
            path: 'tags',
            select: '_id name'
        })
        .populate({
            path: 'categories',
            select: '_id name'
        })
        .populate({
            path: 'product_images',
            select: '_id name path'
        })
        .populate('updated_by', '_id name');

    if (!productData) return res.status(404).json({ message: `Product not found` });

    return productData;
}