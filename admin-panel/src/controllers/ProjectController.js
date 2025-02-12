const mongoose = require('mongoose');

const User = require('../models/user');
const File = require('../models/file');
const Project = require('../models/project');

// helper function
const helper = require('../utils/helper');

// config url
const url = require('../config/url');

// base url
const baseurl = `${url.apiUrl}`;
const apiBaseUrl = `${url.apiBaseUrl}`;
const status_active = `${process.env.STATUS_ACTIVE}`;
const data_limit = `${process.env.DATA_PAGINATION_LIMIT}`;
const constName = 'projects/';

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
        const totalCount = await Project.countDocuments({
            ...filter,
            deleted_at: null
        });

        const query = Project.find(filter)
            .select('_id name description url image user type status updated_by')
            .populate('image', '_id name path')
            .populate('user', '_id name')
            .populate('updated_by', '_id name');

        if (req?.query?.page != 0) {
            query.sort({ [orderByField]: orderByDirection })
                .skip(skip)
                .limit(limit);
        }

        const projects = await query;

        if (projects.length === 0) return res.status(200).json({ message: `No projects found`, data: [] });

        const projectPromises = projects.map(async (project) => {
            const { _id, name, description, url, image, user, type, status } = project;
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
        const projectResponses = await Promise.all(projectPromises);
        res.status(200).json({
            message: `List retrieved successfully`, response: {
                count: totalCount,
                page: page,
                limit: limit,
                totalPages: Math.ceil(totalCount / limit),
                data: projectResponses
            }, title: 'listing'
        });
    } catch (err) {
        next(err)
    }
}

exports.create = (req, res, next) => {
    try {
        res.status(200).json({
            message: `Create project form`,
            body: {
                'name': 'String',
                'description': 'String',
                'url': 'Url',
                'type': 'Boolean',
            },
            title: 'Add project'
        });
    } catch (err) {
        next(err)
    }
}

exports.store = async (req, res, next) => {
    const { name, description, url, type } = req.body;
    const file = req.file;
    const userId = req?.userData?.id;
    try {
        const user = await User.findById(userId).select('_id name').where('status').equals(status_active);
        if (!user) return res.status(404).json({ message: `User not found` });

        const existingProject = await Project.findOne({ name, type, url });
        if (existingProject) return res.status(409).json({ message: `Project already exists` });

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

        const newProject = new Project({
            _id: new mongoose.Types.ObjectId(),
            name,
            description,
            url,
            type,
            image: savedFile?._id ?? null,
            user: user._id,
        });
        const newData = await newProject.save();
        const response = {
            'id': newData._id,
            'name': newData.name,
            'description': newData.description,
            'url': newData.url,
            'type': newData.type,
            'image': savedFile?.path ?? null,
            'user': user.name
        }
        res.status(201).json({ message: `Project created successfully`, data: response });
    } catch (err) {
        next(err)
    }
}

exports.show = async (req, res, next) => {
    const { id } = req.params;
    try {
        const projectData = await this.find_data_by_id(id, res);
        const { _id, name, description, url, image, user, type, updated_by, status } = projectData;
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
        res.status(200).json({ message: `Project was found`, data: result, title: `View ${name} project detail` });
    } catch (err) {
        next(err)
    }
}

exports.edit = async (req, res, next) => {
    const { id } = req.params;
    try {
        const projectData = await this.find_data_by_id(id, res);
        const { _id, name, description, url, image, user, type } = projectData;
        const result = {
            'id': _id,
            'name': name,
            'description': description,
            'url': url,
            'image': image,
            'user': user?._id,
            'type': type
        }
        res.status(200).json({ message: `Project was found`, data: result, title: `Edit ${name} project detail` });
    } catch (err) {
        next(err)
    }
}

exports.update = async (req, res, next) => {
    const { id } = req.params;
    try {
        const project = await Project.findById(id).select('_id');
        if (!project) return res.status(404).json({ message: `Project not found!`, });

        if (!Array.isArray(req.body)) return res.status(400).json({ message: `No details were updated (project may not exist or the data is the same)` });

        const updateOps = helper.updateOps(req);

        if (updateOps['user']) {
            const userData = await User.findById(updateOps['user']).where('status').equals(status_active);
            if (!userData) return res.status(401).json({ message: `User not found!`, data: response });
        }

        const result = await Project.updateOne({ _id: id }, { $set: updateOps });
        if (result.modifiedCount > 0) {
            const updatedProject = await this.find_data_by_id(id, res);
            const { _id, name, description, url, image, user, type } = updatedProject;
            const response = {
                'id': _id,
                'name': name,
                'description': description,
                'url': url,
                'image': image,
                'user': user,
                'type': type,
            }
            return res.status(200).json({ message: `Project details updated successfully`, data: response });
        }
        res.status(404).json({ message: `Project not found or no details to update`, data: [] });
    } catch (err) {
        next(err)
    }
}

exports.destroy = async (req, res, next) => {
    const { id } = req.params;
    try {
        const project = await Project.findById(id).select('_id').where('status').equals(!status_active);
        if (!project) return res.status(404).json({ message: `Project not found!`, });

        // const projectData = await Project.deleteOne({ _id: id });
        // if (projectData.deletedCount === 1) {

        const projectData = await Project.findByIdAndUpdate(id, { deleted_at: new Date() });
        if (projectData) {
            const response = {
                'method': 'POST',
                'url': `${baseurl}${constName}`,
                'body': {
                    'name': 'String',
                    'description': 'String',
                    'url': 'String',
                    'image': 'file',
                    'user': 'User Id',
                    'type': [
                        'web', 'app', 'graphic'
                    ]
                }
            }
            return res.status(200).json({ message: `Deleted successfully`, request: response });
        }
        res.status(404).json({ message: `Project not found` });
    } catch (err) {
        next(err)
    }
}

exports.image = async (req, res, next) => {
    const { id } = req.params;
    const file = req.file;
    try {
        const getProjectData = await Project.findById(id).select('_id').where('status').equals(status_active);
        if (!getProjectData) return res.status(404).json({ message: `Project not found` });

        const newFile = new File({
            _id: new mongoose.Types.ObjectId(),
            name: file.filename,
            path: `${apiBaseUrl}/file/${file.filename}`,
        });

        // const savedPath = await resizeImage(req.file.buffer, filename);

        const newData = await newFile.save();

        const result = await Project.updateOne({ _id: id }, { $set: { image: newData._id } });

        if (result.modifiedCount > 0) return res.status(200).json({ message: `Project image updated` });

        res.status(404).json({ message: `Project not found or no image to update`, data: [] });
    } catch (err) {
        next(err)
    }
}

exports.find_data_by_id = async (id, res) => {
    const projectData = await Project.findById(id)
        .select('_id name description url image user type updated_by status')
        // .where('status').equals(status_active)
        .populate('user', '_id name')
        .populate('updated_by', '_id name')
        .populate('image', '_id name path');

    if (!projectData) return res.status(404).json({ message: `Project not found` });

    return projectData;
}