const mongoose = require('mongoose');

const Plan = require('../models/plan');
const User = require('../models/user');


// helper function
const helper = require('../utils/helper');

// config url
const url = require('../config/url');

// base url
const baseurl = `${url.apiUrl}`;
const status_active = `${process.env.STATUS_ACTIVE}`;
const data_limit = `${process.env.DATA_PAGINATION_LIMIT}`;
const constName = 'plans/';

exports.index = async (req, res, next) => {
    try {

        const page = parseInt(req?.query?.page) || 1;
        const limit = parseInt(req?.query?.limit) || parseInt(data_limit);

        const orderByField = req?.query?.orderby || '_id';
        const orderByDirection = req?.query?.direction === 'asc' ? 1 : -1;

        const filter = {};

        const { status, user, method, type } = req.query;

        if (status) filter.status = status;
        if (user) filter.user = user;
        if (method) filter.payment_method = method;
        if (type) filter.payment_type = type;

        const skip = (page - 1) * limit;
        const totalCount = await Plan.countDocuments({
            ...filter,
            deleted_at: null
        });

        const query = Plan.find(filter)
            .select('_id name description price currency payment_method payment_type user status updated_by')
            .populate('user', '_id name')
            .populate('updated_by', '_id name');

        if (req?.query?.page != 0) {
            query.sort({ [orderByField]: orderByDirection })
                .skip(skip)
                .limit(limit);
        }

        const plans = await query;

        if (plans.length === 0) return res.status(200).json({ message: `No plans found`, data: [] });

        const planPromises = plans.map(async (plan) => {
            const { _id, name, description, price, currency, payment_method, payment_type, user, status } = plan;

            return {
                'id': _id,
                'name': name,
                'price': price,
                'currency': currency,
                'method': payment_method,
                'type': payment_type,
                'user': user,
                'description': description,
                'status': status,
                // 'updated_by': updated_by,
            }
        });
        const planResponses = await Promise.all(planPromises);
        res.status(200).json({
            message: `Plans list retrieved successfully`, response: {
                count: totalCount,
                page: page,
                limit: limit,
                totalPages: Math.ceil(totalCount / limit),
                data: planResponses
            }, title: 'listing'
        });
    } catch (err) {
        next(err)
    }
}

exports.create = (req, res, next) => {
    try {
        res.status(200).json({
            message: `Create plan form`,
            body: {
                'name': 'String',
                'description': 'String',
                'price': 'Number',
                'user': 'SchemaId',
                'currency': 'String',
                'payment_method': 'String',
                'payment_type': 'String',
            },
            title: 'Add plan'
        });
    } catch (err) {
        next(err)
    }
}

exports.store = async (req, res, next) => {
    const { name, description, price, currency, payment_method, payment_type } = req.body;
    try {
        let userId = req?.userData?.id;

        const userData = await User.findById(userId).select('_id').where('status').equals(status_active);
        if (!userData) return res.status(401).json({ message: `User not found!`, data: response });

        const existsPlan = await Plan.findOne({ name: name, status: status_active, user: userData._id });
        if (existsPlan) return res.status(200).json({ message: 'Plan already exists' });

        const plan = new Plan({
            _id: new mongoose.Types.ObjectId(),
            user: userData._id,
            name, description, price, currency, payment_method, payment_type
        });
        const newPlan = await plan.save();
        const response = {
            'id': newPlan?._id,
            'name': newPlan?.name,
            'description': newPlan?.description,
            'price': newPlan?.price,
            'user': userData?.name,
            'currency': userData?.currency,
            'payment_method': newPlan?.payment_method,
            'payment_type': newPlan?.payment_type,
        }
        res.status(201).json({ message: `Successfully created`, data: response });
    } catch (err) {
        next(err)
    }
}

exports.show = async (req, res, next) => {
    const { id } = req.params;
    try {
        const planData = await this.find_data_by_id(id, res);
        const { _id, name, user, description, price, currency, payment_method, payment_type, updated_by, status } = planData;
        const result = {
            'id': _id,
            'name': name,
            'description': description,
            'user': user,
            'price': price,
            'currency': currency,
            'payment_method': payment_method,
            'payment_type': payment_type,
            'status': status,
            'updated_by': updated_by
        }
        res.status(200).json({ message: `Plan was found`, data: result, title: `View ${name} plan detail` });
    } catch (err) {
        next(err)
    }
}

exports.edit = async (req, res, next) => {
    const { id } = req.params;
    try {
        const planData = await this.find_data_by_id(id, res);
        const { _id, name, user, description, price, currency, payment_method, payment_type, updated_by, status } = planData;
        const result = {
            'id': _id,
            'name': name,
            'description': description,
            'user': user,
            'price': price,
            'currency': currency,
            'payment_method': payment_method,
            'payment_type': payment_type,
            'status': status,
            'updated_by': updated_by
        }
        res.status(200).json({ message: `Plan was found`, data: result, title: `Edit ${name} plan detail` });
    } catch (err) {
        next(err)
    }
}

exports.update = async (req, res, next) => {
    const { id } = req.params;
    try {

        const plan = await Plan.findById(id).select('_id');
        if (!plan) return res.status(404).json({ message: `Plan not found!`, });

        if (!Array.isArray(req.body)) return res.status(400).json({ message: `No details were updated (plan may not exist or the data is the same)` });

        const updateOps = helper.updateOps(req);

        if (updateOps['user']) {
            const userData = await User.findById(updateOps['user']).select('_id').where('status').equals(status_active);
            if (!userData) return res.status(401).json({ message: `User not found!`, data: response });
        }

        const result = await Plan.updateOne({ _id: id }, { $set: updateOps });
        if (result.modifiedCount > 0) {
            const updatedPlan = await this.find_data_by_id(id, res);
            const { _id, name, user, description, price, currency, payment_method, payment_type, updated_by, status } = updatedPlan;
            const response = {
                'id': _id,
                'name': name,
                'description': description,
                'user': user,
                'price': price,
                'currency': currency,
                'payment_method': payment_method,
                'payment_type': payment_type,
                'status': status,
                'updated_by': updated_by
            }
            return res.status(200).json({ message: `Plan details updated successfully`, data: response });
        }
        res.status(404).json({ message: `Plan not found or no details to update`, data: [] });
    } catch (err) {
        next(err)
    }
}

exports.destroy = async (req, res, next) => {
    const { id } = req.params;
    try {
        const getPlan = await Plan.findById(id).select('_id').where('status').equals(!status_active);
        if (!getPlan) return res.status(404).json({ message: 'Plan not found' });

        // const planData = await Plan.deleteOne({ _id: id });
        // if (planData.deletedCount === 1) {

        const planData = await Plan.findByIdAndUpdate(id, { deleted_at: new Date() });
        if (planData) {
            const response = {
                'method': 'POST',
                'url': `${baseurl}${constName}`,
                'body': {
                    'name': 'String',
                    'description': 'String',
                    'price': 'Number',
                    'user': 'SchemaId',
                    'currency': 'String',
                    'payment_method': 'String',
                    'payment_type': 'String',
                }
            }
            return res.status(200).json({ message: `Deleted successfully`, request: response });
        }
        res.status(404).json({ message: `Plan not found` });
    } catch (err) {
        next(err)
    }
}

exports.find_data_by_id = async (id, res) => {
    const planData = await Plan.findById(id)
        .select('_id user name description price currency payment_method payment_type updated_by status')
        // .where('status').equals(status_active)
        .populate('user', '_id name')
        .populate('updated_by', '_id name');

    if (!planData) return res.status(404).json({ message: `Plan not found` });

    return planData;
}