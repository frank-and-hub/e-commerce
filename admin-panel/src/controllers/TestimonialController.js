const mongoose = require('mongoose');

const Testimonial = require('../models/testimonial');
const User = require('../models/user');
const File = require('../models/file');

// helper function
const helper = require('../utils/helper');

// config url
const url = require('../config/url');

// base url
const baseurl = `${url.apiUrl}`;
const apiBaseUrl = `${url.apiBaseUrl}`;
const status_active = `${process.env.STATUS_ACTIVE}`;
const data_limit = `${process.env.DATA_PAGINATION_LIMIT}`;

const constName = 'testimonials/';

exports.index = async (req, res, next) => {
    try {
        const page = parseInt(req?.query?.page) || 1;
        const limit = parseInt(req?.query?.limit) || parseInt(data_limit);

        const orderByField = req?.query?.orderby || '_id';
        const orderByDirection = req?.query?.direction === 'asc' ? 1 : -1;

        const filter = {};
        const { status, search } = req.query;

        if (status) filter.status = status;

        if (search) {
            const trimmedSearch = search.trim();
            filter.$or = [
                { name: { $regex: trimmedSearch, $options: "i" } },
                { title: { $regex: trimmedSearch, $options: "i" } },
                { description: { $regex: trimmedSearch, $options: "i" } },
            ];
        }

        const skip = (page - 1) * limit;
        const totalCount = await Testimonial.countDocuments({
            ...filter,
            deleted_at: null
        });

        const query = Testimonial.find(filter)
            .select('_id name title description image user updated_by status')
            .populate('user', '_id name')
            .populate('image', '_id name path')
            .populate('updated_by', '_id name');

        if (req?.query?.page != 0) {
            query.sort({ [orderByField]: orderByDirection })
                .skip(skip)
                .limit(limit);
        }

        const testimonials = await query;

        if (testimonials.length === 0) return res.status(200).json({ message: `No testimonials found`, data: [] });

        const testimonialPromises = testimonials.map(async (testimonial) => {
            const { _id, name, title, description, image, status } = testimonial;
            return {
                'id': _id,
                'name': name,
                'title': title,
                'description': description,
                'image': image,
                'status': status
                // 'request': { 'method': 'GET', 'url': `${baseurl}${constName}${_id}` }
            }
        });
        const testimonialResponses = await Promise.all(testimonialPromises);
        res.status(200).json({
            message: `List retrieved successfully`, response: {
                count: totalCount,
                page: page,
                limit: limit,
                totalPages: Math.ceil(totalCount / limit),
                data: testimonialResponses
            }, title: 'listing'
        });
    } catch (err) {
        next(err)
    }
}

exports.create = (req, res, next) => {
    try {
        res.status(200).json({
            message: `Create Testimonial form`,
            body: {
                'name': 'String',
                'title': 'String',
                'description': 'String',
                'image': 'image|file'
            },
            title: 'Add testimonial'
        });
    } catch (err) {
        next(err)
    }
}

exports.store = async (req, res, next) => {
    const { name, title, description, image } = req.body;
    try {
        let userId = req?.userData?.id;
        const file = req.file;
        const userData = await User.findById(userId).select('_id').where('status').equals(status_active);
        if (!userData) return res.status(401).json({ message: `User not found!`, data: response });

        const existsTestimonial = await Testimonial.findOne({ name: name, title: title, status: status_active });
        if (existsTestimonial) return res.status(200).json({ message: 'Testimonial already exists' });

        let newData = {};
        if (file) {
            const newFile = new File({
                _id: new mongoose.Types.ObjectId(),
                name: file.filename,
                path: `${apiBaseUrl}/file/${file.filename}`,
            });
            newData = await newFile.save();
        }

        const testimonial = new Testimonial({
            _id: new mongoose.Types.ObjectId(),
            user: userData?._id,
            name,
            title,
            image: newData?._id,
            description,
        });
        const newTestimonial = await testimonial.save();
        const response = {
            'id': newTestimonial?._id,
            'user': userData?.name,
            'name': newTestimonial?.name,
            'title': newTestimonial?.title,
            'image': newData?.path,
            'description': newTestimonial?.description,
        }
        res.status(201).json({ message: `Successfully created`, data: response });
    } catch (err) {
        next(err)
    }
}

exports.show = async (req, res, next) => {
    const { id } = req.params;
    try {
        const testimonialData = await this.find_data_by_id(id, res);

        const { _id, name, title, description, user, image, updated_by, status } = testimonialData;
        const result = {
            'id': _id,
            'name': name,
            'title': title,
            'user': user,
            'description': description,
            'image': image,
            'status': status,
            'updated_by': updated_by
        }
        res.status(200).json({ message: `Testimonial was found`, data: result, title: `View ${name} testimonial detail` });
    } catch (err) {
        next(err)
    }
}

exports.edit = async (req, res, next) => {
    const { id } = req.params;
    try {
        const testimonialData = await this.find_data_by_id(id, res);

        const { _id, name, title, description, image, user, status } = testimonialData;
        const result = {
            'id': _id,
            'name': name,
            'title': title,
            'user': user,
            'image': image,
            'description': description,
            'status': status,
        }
        res.status(200).json({ message: `Testimonial was found`, data: result, title: `Edit ${name} testimonial detail` });
    } catch (err) {
        next(err)
    }
}

exports.update = async (req, res, next) => {
    const { id } = req.params;
    try {
        const file = req.file;

        const testimonial = await Testimonial.findById(id);
        if (!testimonial) return res.status(404).json({ message: `Testimonial not found!`, });

        if (!Array.isArray(req.body)) return res.status(400).json({ message: `No details were updated (testimonial may not exist or the data is the same)` });

        const updateOps = helper.updateOps(req);

        if (file) {
            const newFile = new File({
                _id: new mongoose.Types.ObjectId(),
                name: file.filename,
                path: `${apiBaseUrl}/file/${file.filename}`,
            });
            const newData = await newFile.save();
            if (newData?._id) {
                updateOps['image'] = newData._id;
            }
        }

        const result = await Testimonial.updateOne({ _id: id }, { $set: updateOps });

        if (result.modifiedCount > 0) {
            const updatedTestimonial = await this.find_data_by_id(id, res);
            const { _id, name, title, description, user, image } = updatedTestimonial;

            const testimonialData = {
                'id': _id,
                'name': name,
                'title': title,
                'user': user,
                'image': image,
                'description': description
            }
            return res.status(200).json({ message: `Testimonial details updated successfully`, data: testimonialData });
        }
        res.status(404).json({ message: `Testimonial not found or no details to update`, data: [] });
    } catch (err) {
        next(err)
    }
}

exports.destroy = async (req, res, next) => {
    const { id } = req.params;
    try {
        const getTestimonial = await Testimonial.findById(id).select('_id').where('status').equals(!status_active);
        if (!getTestimonial) return res.status(404).json({ message: 'Testimonial not found' });

        // const testimonialData = await Testimonial.deleteOne({ _id: id });
        // if (testimonialData.deletedCount === 1) {

        const testimonialData = await Testimonial.findByIdAndUpdate(id, { deleted_at: new Date() });
        if (testimonialData) {
            const response = {
                'method': 'POST',
                'url': `${baseurl}${constName}`,
                'body': {
                    'name': 'String',
                    'title': 'String',
                    'description': 'String'
                }
            }
            return res.status(200).json({ message: `Deleted successfully`, request: response });
        }
        res.status(404).json({ message: `Testimonial not found` });
    } catch (err) {
        next(err)
    }
}

exports.find_data_by_id = async (id, res) => {
    const testimonialData = await Testimonial.findById(id)
        .select('_id name title description user image updated_by status')
        // .where('status').equals(status_active)
        .populate('user', '_id name')
        .populate('image', '_id name path')
        .populate('updated_by', '_id name');
    if (!testimonialData) return res.status(404).json({ message: `Testimonial not found` });

    return testimonialData;
}