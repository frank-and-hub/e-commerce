const mongoose = require('mongoose');

const Designation = require('../models/designation');
const User = require('../models/user');

// helper function
const helper = require('../utils/helper');

// config url
const url = require('../config/url');

// base url
const baseurl = `${url.apiUrl}`;
const status_active = `${process.env.STATUS_ACTIVE}`;
const data_limit = `${process.env.DATA_PAGINATION_LIMIT}`;
const constName = 'designation/';

exports.index = async (req, res, next) => {
    try {

        const page = parseInt(req?.query?.page) || 1;
        const limit = parseInt(req?.query?.limit) || parseInt(data_limit);

        const orderByField = req?.query?.orderby || '_id';
        const orderByDirection = req?.query?.direction === 'asc' ? 1 : -1;

        const filter = {};
        const { user_id, status, search } = req.query;

        if (user_id) filter.user = user_id;
        if (status) filter.status = status;

        if (search) {
            const trimmedSearch = search.trim();
            filter.$or = [
                { name: { $regex: trimmedSearch, $options: "i" } },
                { url: { $regex: trimmedSearch, $options: "i" } },
            ];
        }

        const skip = (page - 1) * limit;
        let userId = req?.userData?.id;

        const totalCount = await Designation.countDocuments({
            ...filter,
            deleted_at: null
        });

        const userData = await User.findById(userId).select('_id').where('status').equals(status_active);
        if (!userData) return res.status(401).json({ message: `User not found!`, data: response });

        const query = Designation.find(filter)
            .select('_id name updated_by status')
            .populate('updated_by', '_id name');

        if (req?.query?.page != 0) {
            query.sort({ [orderByField]: orderByDirection })
                .skip(skip)
                .limit(limit);
        }

        const designations = await query;

        if (designations.length === 0) return res.status(200).json({ message: `No designations found`, data: [] });

        const designationPromises = designations.map(async (designation) => {
            const { _id, name, updated_by, status } = designation;
            return {
                'id': _id,
                'name': name,
                'updated_by': updated_by,
                'status': status,
                // 'request': { 'method': 'GET', 'url': `${baseurl}${constName}${_id}` }
            }
        });
        const designationResponses = await Promise.all(designationPromises);
        res.status(200).json({
            message: `List retrieved successfully`, response: {
                count: totalCount,
                page: page,
                limit: limit,
                totalPages: Math.ceil(totalCount / limit),
                data: designationResponses
            }, title: 'listing'
        });
    } catch (err) {
        next(err)
    }
}

exports.create = (req, res, next) => {
    try {
        res.status(200).json({
            message: `Create designation form`,
            body: {
                'name': 'String',
            },
            title: 'Add designation'
        });
    } catch (err) {
        next(err)
    }
}

exports.store = async (req, res, next) => {
    const { name, url, icon } = req.body;
    try {

        const existsDesignation = await Designation.findOne({ name: name, status: status_active });
        if (existsDesignation) return res.status(200).json({ message: 'Designation already exists' });

        const designation = new Designation({
            _id: new mongoose.Types.ObjectId(),
            name
        });
        const newData = await designation.save();
        const response = {
            'id': newData?._id,
            'name': newData?.name
        }
        res.status(201).json({ message: `Successfully created`, data: response });
    } catch (err) {
        next(err)
    }
}

exports.show = async (req, res, next) => {
    const { id } = req.params;
    try {
        const designationData = await this.find_data_by_id(id, res);
        const { _id, name, status, updated_by } = designationData;
        const result = {
            'id': _id,
            'name': name,
            'status': status,
            'updated_by': updated_by
        }
        res.status(200).json({ message: `Designation was found`, data: result, title: `View ${name} designation` });
    } catch (err) {
        next(err)
    }
}

exports.edit = async (req, res, next) => {
    const { id } = req.params;
    try {
        const designationData = await this.find_data_by_id(id, res);
        const { _id, name } = designationData;
        const result = {
            'id': _id,
            'name': name
        }
        res.status(200).json({ message: `Designation was found`, data: result, title: `Edit ${name} designation` });
    } catch (err) {
        next(err)
    }
}

exports.update = async (req, res, next) => {
    const { id } = req.params;
    try {
        const designation = await Designation.findById(id).select('_id');
        if (!designation) return res.status(404).json({ message: `Designation not found!`, });

        if (!Array.isArray(req.body)) return res.status(400).json({ message: `No details were updated (designation may not exist or the data is the same)` });

        const updateOps = helper.updateOps(req);

        const result = await Designation.updateOne({ _id: id }, { $set: updateOps });
        if (result.modifiedCount > 0) {
            const updatedDesignation = await this.find_data_by_id(id, res);
            const { _id, name, status } = updatedDesignation;
            const designationData = {
                'id': _id,
                'name': name,
                'status': status
            }
            return res.status(200).json({ message: `Designation details updated successfully`, data: designationData });
        }
        res.status(404).json({ message: `Designation not found or no details to update`, data: [] });
    } catch (err) {
        next(err)
    }
}

exports.destroy = async (req, res, next) => {
    const { id } = req.params;
    try {
        const getDesignation = await Designation.findById(id).select('_id').where('status').equals(!status_active);
        if (!getDesignation) return res.status(404).json({ message: 'Designation not found' });

        // const designationData = await Designation.deleteOne({ _id: id });
        // if (designationData.deletedCount === 1) {

        const designationData = await Designation.findByIdAndUpdate(id, { deleted_at: new Date() });
        if (designationData) {
            const response = {
                'method': 'POST',
                'url': `${baseurl}${constName}`,
                'body': {
                    'name': 'String'
                }
            }
            return res.status(200).json({ message: `Deleted successfully`, request: response });
        }
        res.status(404).json({ message: `Designation not found` });
    } catch (err) {
        next(err)
    }
}

exports.find_data_by_id = async (id, res) => {
    const designationData = await Designation.findById(id)
        .select('_id name updated_by status')
        // .where('status').equals(status_active)
        .populate('updated_by', '_id name');

    if (!designationData) return res.status(404).json({ message: `Designation not found` });

    return designationData;
}