const mongoose = require('mongoose');

const SupportDetails = require('../models/support_details');

// helper function
const helper = require('../utils/helper');

// config url
const url = require('../config/url');

// base url
const baseurl = `${url.apiUrl}`;
const status_active = `${process.env.STATUS_ACTIVE}`;
const data_limit = `${process.env.DATA_PAGINATION_LIMIT}`;
const constName = 'support_details/';

exports.index = async (req, res, next) => {
    try {

        const page = parseInt(req?.query?.page) || 1;
        const limit = parseInt(req?.query?.limit) || parseInt(data_limit);

        const orderByField = req?.query?.orderby || '_id';
        const orderByDirection = req?.query?.direction === 'asc' ? 1 : -1;

        const filter = { ...req?.query?.filter };

        const skip = (page - 1) * limit;
        const totalCount = await SupportDetails.countDocuments({
            ...filter,
            deleted_at: null
        });

        const query = SupportDetails.find()
            .select('_id call email address hours_start hours_end type week_start week_end updated_by status')
            .where('status').equals(status_active)
            .populate('updated_by', '_id name');

        if (req?.query?.page != 0) {
            query.sort({ [orderByField]: orderByDirection })
                .skip(skip)
                .limit(limit);
        }

        const support_details = await query;

        if (support_details.length === 0) return res.status(200).json({ message: `No support details found`, data: [] });

        const supportDetailsPromises = support_details.map(async (supportDetails) => {
            const { _id, call, email, address, hours_start, hours_end, type, week_start, week_end, updated_by, status } = supportDetails;
            return {
                'id': _id,
                'call': call,
                'email': email,
                'type': type,
                'address': address,
                'hours_start': hours_start,
                'hours_end': hours_end,
                'week_start': week_start,
                'week_end': week_end,
                'status': status,
                'updated_by': updated_by,
                // 'request': { 'method': 'GET', 'url': `${baseurl}${constName}${_id}` }
            }
        });
        const supportDetailsResponses = await Promise.all(supportDetailsPromises);
        res.status(200).json({
            message: `List retrieved successfully`, response: {
                count: totalCount,
                page: page,
                limit: limit,
                totalPages: Math.ceil(totalCount / limit),
                data: supportDetailsResponses
            }, title: 'listing'
        });
    } catch (err) {
        next(err)
    }
}

exports.create = (req, res, next) => {
    try {
        res.status(200).json({
            message: `Create Support details form`,
            body: {
                'call': 'String',
                'email': 'String',
                'type': 'String',
                'address': 'String',
                'hours_start': 'Date',
                'hours_end': 'Time',
                'week_start': 'String',
                'week_end': 'String'
            },
            title: 'Add supportDetails'
        });
    } catch (err) {
        next(err)
    }
}

exports.store = async (req, res, next) => {
    const { call, email, address, hours_start, hours_end, week_start, week_end, type } = req.body;
    try {
        const existsSupportDetails = await SupportDetails.findOne({ call: call, email: email, status: status_active });
        if (existsSupportDetails) return res.status(200).json({ message: 'Support details already exists' });

        const supportDetails = new SupportDetails({
            _id: new mongoose.Types.ObjectId(),
            call, email, address, hours_start, hours_end, type, week_start, week_end
        });
        const newData = await supportDetails.save();
        const response = {
            'id': newData?._id,
            'call': newData?.call,
            'type': newData?.type,
            'email': newData?.email,
            'address': newData?.address,
            'hours_start': newData?.hours_start,
            'hours_end': newData?.hours_end,
            'week_start': newData?.week_start,
            'week_end': newData?.week_end,
        }
        res.status(201).json({ message: `Successfully created`, data: response });
    } catch (err) {
        next(err)
    }
}

exports.show = async (req, res, next) => {
    const { id } = req.params;
    try {
        const supportDetailsData = await this.find_data_by_id(id, res);
        const { _id, call, email, address, hours_start, hours_end, type, week_start, week_end, updated_by, status } = supportDetailsData;

        const result = {
            'id': _id,
            'call': call,
            'email': email,
            'type': type,
            'address': address,
            'hours_start': hours_start,
            'hours_end': hours_end,
            'week_start': week_start,
            'week_end': week_end,
            'status': status,
            'updated_by': updated_by,
        }
        res.status(200).json({ message: `SupportDetails was found`, data: result, title: `View ${call} support details detail` });
    } catch (err) {
        next(err)
    }
}

exports.edit = async (req, res, next) => {
    const { id } = req.params;
    try {
        const supportDetailsData = await this.find_data_by_id(id, res);
        const { _id, call, email, address, hours_start, hours_end, type, week_start, week_end, updated_by } = supportDetailsData;
        const result = {
            'id': _id,
            'call': call,
            'email': email,
            'type': type,
            'address': address,
            'hours_start': hours_start,
            'hours_end': hours_end,
            'updated_by': updated_by,
            'week_start': week_start,
            'week_end': week_end,
        }
        res.status(200).json({ message: `SupportDetails was found`, data: result, title: `Edit ${call} support details detail` });
    } catch (err) {
        next(err)
    }
}

exports.update = async (req, res, next) => {
    const { id } = req.params;
    try {
        const supportDetails = await SupportDetails.findById(id);
        if (!supportDetails) return res.status(404).json({ message: `SupportDetails not found!`, });

        if (!Array.isArray(req.body)) return res.status(400).json({ message: `No details were updated (supportDetails may not exist or the data is the same)` });

        const updateOps = helper.updateOps(req);

        const result = await SupportDetails.updateOne({ _id: id }, { $set: updateOps });

        if (result.modifiedCount > 0) {
            const updatedSupportDetails = await this.find_data_by_id(id, res);
            const { _id, call, email, address, hours_start, hours_end, type, week_start, week_end, updated_by } = updatedSupportDetails;
            const supportDetailsData = {
                'id': _id,
                'call': call,
                'email': email,
                'type': type,
                'address': address,
                'hours_start': hours_start,
                'hours_end': hours_end,
                'week_start': week_start,
                'week_end': week_end,
                'updated_by': updated_by,
            }
            return res.status(200).json({ message: `SupportDetails details updated successfully`, data: supportDetailsData });
        }
        res.status(404).json({ message: `SupportDetails not found or no details to update`, data: [] });
    } catch (err) {
        next(err)
    }
}

exports.destroy = async (req, res, next) => {
    const { id } = req.params;
    try {
        const getSupportDetails = await SupportDetails.findById(id).select('_id').where('status').equals(!status_active);
        if (!getSupportDetails) return res.status(404).json({ message: 'SupportDetails not found' });

        // const supportDetailsData = await SupportDetails.deleteOne({ _id: id });
        // if (supportDetailsData.deletedCount === 1) {

        const supportDetailsData = await SupportDetails.findByIdAndUpdate(id, { deleted_at: new Date() });
        if (supportDetailsData) {
            const response = {
                'method': 'POST',
                'url': `${baseurl}${constName}`,
                'body': {
                    'call': 'String',
                    'email': 'String',
                    'type': 'String',
                    'address': 'String',
                    'hours_start': 'Date',
                    'hours_end': 'Time',
                    'week_start': 'String',
                    'week_end': 'String'
                }
            }
            return res.status(200).json({ message: `Deleted successfully`, request: response });
        }
        res.status(404).json({ message: `SupportDetails not found` });
    } catch (err) {
        next(err)
    }
}

exports.find_data_by_id = async (id, res) => {
    await SupportDetails.findById(id)
        .select('_id call email address hours_start hours_end type week_start week_end updated_by status')
        // .where('status').equals(status_active)
        .populate('updated_by', '_id name');
    if (!supportDetailsData) return res.status(404).json({ message: `SupportDetails not found` });
    return SupportDetails;
}