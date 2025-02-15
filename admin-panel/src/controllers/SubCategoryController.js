const mongoose = require('mongoose');

const SubCategory = require('../models/sub_category');
const User = require('../models/user');

// helper function
const helper = require('../utils/helper');

// config url
const url = require('../config/url');

// base url
const baseurl = `${url.apiUrl}`;
const status_active = `${process.env.STATUS_ACTIVE}`;
const data_limit = `${process.env.DATA_PAGINATION_LIMIT}`;
const constName = 'sub-sub_categories/';

exports.index = async (req, res, next) => {
    try {

        const page = parseInt(req?.query?.page) || 1;
        const limit = parseInt(req?.query?.limit) || parseInt(data_limit);

        const orderByField = req?.query?.orderby || '_id';
        const orderByDirection = req?.query?.direction === 'asc' ? 1 : -1;

        const filter = {};
        const { status, search, category } = req.query;

        if (status) filter.status = status;
        if (category) filter.category = category;

        if (search) {
            const trimmedSearch = search.trim();
            filter.$or = [
                { name: { $regex: trimmedSearch, $options: "i" } },
                { description: { $regex: trimmedSearch, $options: "i" } },
            ];
        }

        const skip = (page - 1) * limit;
        const totalCount = await SubCategory.countDocuments({
            ...filter,
            deleted_at: null
        });

        const query = SubCategory.find(filter)
            .select('_id name icon description user status updated_by category')
            .populate('user', '_id name')
            .populate('category', '_id name')
            .populate('updated_by', '_id name');

        if (req?.query?.page != 0) {
            query.sort({ [orderByField]: orderByDirection })
                .skip(skip)
                .limit(limit);
        }

        const sub_categories = await query;

        if (sub_categories.length === 0) return res.status(200).json({ message: `No sub categories found`, data: [] });

        const sub_categoryPromises = sub_categories.map(async (sub_category) => {
            const { _id, name, icon, description, status, user, category } = sub_category;
            return {
                'id': _id,
                'name': name,
                'icon': icon,
                'description': description,
                'status': status,
                'user': user,
                'category': category,
            }
        });
        const sub_categoryResponses = await Promise.all(sub_categoryPromises);
        res.status(200).json({
            message: `List retrieved successfully`, response: {
                count: totalCount,
                page: page,
                limit: limit,
                totalPages: Math.ceil(totalCount / limit),
                data: sub_categoryResponses
            }, title: 'listing'
        });
    } catch (err) {
        next(err)
    }
}

exports.create = (req, res, next) => {
    try {
        res.status(200).json({
            message: `Create sub_category form`,
            body: {
                'name': 'String',
                'description': 'String',
                'icon': 'String',
                'user': 'SchemaId',
                'category': 'SchemaId'
            },
            title: 'Add sub_category'
        });
    } catch (err) {
        next(err)
    }
}

exports.store = async (req, res, next) => {
    const { name, description, icon, category } = req.body;
    try {
        let userId = req?.userData?.id;

        const userData = await User.findById(userId).select('_id name').where('status').equals(status_active);
        if (!userData) return res.status(401).json({ message: `User not found!`, data: response });

        const categoryData = await Category.findById(category).select('_id name').where('status').equals(status_active);
        if (!categoryData) return res.status(401).json({ message: `Category not found!`, data: response });

        const existsSubCategory = await SubCategory.findOne({ name: name, status: status_active, user: userData._id });
        if (existsSubCategory) return res.status(200).json({ message: 'Sub category already exists' });

        const sub_category = new SubCategory({
            _id: new mongoose.Types.ObjectId(),
            name,
            icon,
            description,
            user: userData._id,
            category: categoryData._id
        });
        const newData = await sub_category.save();
        const response = {
            'id': newData?._id,
            'name': newData?.name,
            'icon': newData?.icon,
            'description': newData?.description,
            'user': userData?.name,
            'category': categoryData?.name
        }
        res.status(201).json({ message: `Successfully created`, data: response });
    } catch (err) {
        next(err)
    }
}

exports.show = async (req, res, next) => {
    const { id } = req.params;
    try {
        const sub_categoryData = await this.find_data_by_id(id, res);
        const { _id, name, icon, description, user, updated_by, status, category } = sub_categoryData;
        const result = {
            'id': _id,
            'name': name,
            'icon': icon,
            'description': description,
            'status': status,
            'user': user,
            'category': category,
            'updated_by': updated_by,
        }
        res.status(200).json({ message: `Sub category was found`, data: result, title: `View ${name} sub_category detail` });
    } catch (err) {
        next(err)
    }
}

exports.edit = async (req, res, next) => {
    const { id } = req.params;
    try {
        const sub_categoryData = await this.find_data_by_id(id, res);
        const { _id, name, icon, description, user, category, status } = sub_categoryData;
        const result = {
            'id': _id,
            'name': name,
            'icon': icon,
            'description': description,
            'status': status,
            'user': user?._id,
            'category': category?._id
        }
        res.status(200).json({ message: `Sub category was found`, data: result, title: `Edit ${name} sub category detail` });
    } catch (err) {
        next(err)
    }
}

exports.update = async (req, res, next) => {
    const { id } = req.params;
    try {
        const sub_category = await SubCategory.findById(id).select('_id');
        if (!sub_category) return res.status(404).json({ message: `Sub category not found!`, });

        if (!Array.isArray(req.body)) return res.status(400).json({ message: `No details were updated (sub category may not exist or the data is the same)` });

        const updateOps = helper.updateOps(req);

        if (updateOps['user']) {
            const userData = await User.findById(updateOps['user']).select('_id name').where('status').equals(status_active);
            if (!userData) return res.status(401).json({ message: `User not found!`, data: response });
        }

        if (updateOps['category']) {
            const categoryData = await Category.findById(updateOps['category']).select('_id name').where('status').equals(status_active);
            if (!categoryData) return res.status(401).json({ message: `Category not found!`, data: response });
        }

        const result = await SubCategory.updateOne({ _id: id }, { $set: updateOps });
        if (result.modifiedCount > 0) {
            const updatedSubCategory = await this.find_data_by_id(id, res);
            const { _id, name, description, icon, user, category } = updatedSubCategory;
            const response = {
                'id': _id,
                'name': name,
                'description': description,
                'icon': icon,
                'user': user,
                'category': category
            }
            return res.status(200).json({ message: `Sub category details updated successfully`, data: response });
        }
        res.status(404).json({ message: `Sub category not found or no details to update`, data: [] });
    } catch (err) {
        next(err)
    }
}

exports.destroy = async (req, res, next) => {
    const { id } = req.params;
    try {
        const getSubCategory = await SubCategory.findById(id).select('_id').where('status').equals(!status_active);
        if (!getSubCategory) return res.status(404).json({ message: 'Sub category not found' });

        // const sub_categoryData = await SubCategory.deleteOne({ _id: id });
        // if (sub_categoryData.deletedCount === 1) {

        const sub_categoryData = await SubCategory.findByIdAndUpdate(id, { deleted_at: new Date() });
        if (sub_categoryData) {
            const response = {
                'method': 'POST',
                'url': `${baseurl}${constName}`,
                'body': {
                    'name': 'String',
                    'description': 'String',
                    'icon': 'String',
                    'user': 'SchemaId',
                    'category': 'SchemaId'
                }
            }
            return res.status(200).json({ message: `Deleted successfully`, request: response });
        }
        res.status(404).json({ message: `Sub category not found` });
    } catch (err) {
        next(err)
    }
}

exports.find_data_by_id = async (id, res) => {
    const sub_categoryData = await SubCategory.findById(id)
        .select('_id name icon description user category updated_by status')
        // .where('status').equals(status_active)
        .populate('user', '_id name')
        .populate('category', '_id name')
        .populate('updated_by', '_id name');

    if (!sub_categoryData) return res.status(404).json({ message: `Sub category not found` });

    return sub_categoryData;
}