const mongoose = require('mongoose');

const User = require('../models/user');
const Contact = require('../models/contact');

// helper function
const helper = require('../utils/helper');

// config url
const url = require('../config/url');

// base url
const baseurl = `${url.apiUrl}`;
const status_active = `${process.env.STATUS_ACTIVE}`;
const data_limit = `${process.env.DATA_PAGINATION_LIMIT}`;

const constName = 'contacts/';

exports.index = async (req, res, next) => {
    try {

        const page = parseInt(req?.query?.page) || 1;
        const limit = parseInt(req?.query?.limit) || parseInt(data_limit);

        const orderByField = req?.query?.orderby || '_id';
        const orderByDirection = req?.query?.direction === 'asc' ? 1 : -1;

        const filter = {};
        const { status, search, user_id } = req.query;

        if (status) filter.status = status;
        if (user_id) filter.user = user_id;

        if (search) {
            const trimmedSearch = search.trim();
            filter.$or = [
                { name: { $regex: trimmedSearch, $options: "i" } },
                { email: { $regex: trimmedSearch, $options: "i" } },
                { message: { $regex: trimmedSearch, $options: "i" } },
            ];
        }

        const skip = (page - 1) * limit;
        const totalCount = await Contact.countDocuments({
            ...filter,
            deleted_at: null
        });

        const query = Contact.find(filter)
            .select('_id name email message updated_by status user')
            .populate('user', '_id name')
            .populate('updated_by', '_id name');

        if (req?.query?.page != 0) {
            query.sort({ [orderByField]: orderByDirection })
                .skip(skip)
                .limit(limit);
        }
        const contacts = await query;

        if (contacts.length === 0) return res.status(200).json({ message: `No contacts found`, data: [] });

        const contactPromises = contacts.map(async (contact) => {
            const { _id, name, email, message, updated_by, status } = contact
            return {
                'id': _id,
                'name': name,
                'email': email,
                'message': message,
                'updated_by': updated_by,
                'status': status
                // 'request': { 'method': 'GET', 'url': `${baseurl}${constName}${_id}` }
            }
        });
        const contactResponses = await Promise.all(contactPromises);
        res.status(200).json({
            message: `List retrieved successfully`, response: {
                count: totalCount,
                page: page,
                limit: limit,
                totalPages: Math.ceil(totalCount / limit),
                data: contactResponses
            }, title: 'listing'
        });
    } catch (err) {
        next(err)
    }
}

exports.create = (req, res, next) => {
    try {
        res.status(200).json({
            message: `Create contact form`,
            body: {
                'name': 'String',
                'email': 'String',
                'message': 'String',
                'userId': 'User phone number'
            },
            title: 'Add contact'
        });
    } catch (err) {
        next(err)
    }
}

exports.store = async (req, res, next) => {
    const { name, email, message, userId } = req.body;
    try {

        const userData = await User.findById(userId).select('_id name phone').where('status').equals(status_active);
        if (!userData) return res.status(404).json({ message: `User not found` });

        const existsContact = await Contact.findOne({ name: name, email: email, status: status_active });
        if (existsContact) return res.status(200).json({ message: 'Contact already exists' });

        const contact = new Contact({
            _id: new mongoose.Types.ObjectId(),
            name,
            email,
            message,
            user: userData?._id,
        });
        const newData = await contact.save();
        const response = {
            'id': newData?._id,
            'name': newData?.name,
            'email': newData?.email,
            'message': newData?.message
        }
        res.status(201).json({ message: `Your message is received Successfully`, data: response });
    } catch (err) {
        next(err)
    }
}

exports.show = async (req, res, next) => {
    const { id } = req.params;
    try {
        const contactData = await this.find_data_by_id(id, res);
        const { _id, name, email, message, updated_by, status } = contactData;
        const result = {
            'id': _id,
            'name': name,
            'email': email,
            'message': message,
            'status': status,
            'updated_by': updated_by
        }
        res.status(200).json({ message: `Contact was found`, data: result, title: `View ${name} contact detail` });
    } catch (err) {
        next(err)
    }
}

exports.edit = async (req, res, next) => {
    const { id } = req.params;
    try {
        const contactData = await this.find_data_by_id(id, res);
        const { _id, name, email, message } = contactData;
        const result = {
            'id': _id,
            'name': name,
            'email': email,
            'message': message
        }
        res.status(200).json({ message: `Contact was found`, data: result, title: `Edit ${name} contact detail` });
    } catch (err) {
        next(err)
    }
}

exports.update = async (req, res, next) => {
    const { id } = req.params;
    try {
        const contact = await Contact.findById(id).select('_id');
        if (!contact) return res.status(404).json({ message: `Contact not found!`, });

        if (!Array.isArray(req.body)) return res.status(400).json({ message: `No details were updated (contact may not exist or the data is the same)` });

        const updateOps = helper.updateOps(req);

        const result = await Contact.updateOne({ _id: id }, { $set: updateOps });
        if (result.modifiedCount > 0) {
            const updatedContact = await this.find_data_by_id(id, res);
            const { _id, name, email, message } = updatedContact;
            const contactData = {
                'id': _id,
                'name': name,
                'email': email,
                'message': message
            }
            return res.status(200).json({ message: `Contact details updated successfully`, data: contactData });
        }
        res.status(404).json({ message: `Contact not found or no details to update`, data: [] });
    } catch (err) {
        ``
        next(err)
    }
}

exports.destroy = async (req, res, next) => {
    const { id } = req.params;
    try {
        const getContact = await Contact.findById(id).select('_id').where('status').equals(!status_active);
        if (!getContact) return res.status(404).json({ message: 'Contact not found' });

        // const contactData = await Contact.deleteOne({ _id: id });
        // if (contactData.deletedCount === 1) {

        const contactData = await Contact.findByIdAndUpdate(id, { deleted_at: new Date() });
        if (contactData) {
            const response = {
                'method': 'POST',
                'url': `${baseurl}${constName}`,
                'body': {
                    'name': 'String',
                    'email': 'String',
                    'message': 'String'
                }
            }
            return res.status(200).json({ message: `Deleted successfully`, request: response });
        }
        res.status(404).json({ message: `Contact not found` });
    } catch (err) {
        next(err)
    }
}

exports.find_data_by_id = async (id, res) => {
    const contactData = await Contact.findById(id)
        .select('_id name email message status')
        // .where('status').equals(status_active)
        .populate('updated_by', '_id name');

    if (!contactData) return res.status(404).json({ message: `Contact not found` });

    return contactData;
}