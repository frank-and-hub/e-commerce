const express = require('express');
const router = express.Router();
// helpers
const helper = require('../utils/helper');
// Middleware
const ProjectController = require('../controllers/ProjectController');
// permissios check
const checkPermission = require('../middleware/checkPermission');
const { checkAuth } = require('../middleware/authMiddleware');
// get filea name
const fileName = __filename.slice(__dirname.length + 1).replace('.js', '');

router.route('/')
    .get(checkAuth, checkPermission(fileName, 'read'), ProjectController.index)
    .post(checkAuth, helper.fileImageUpload.single('image'), checkAuth, checkPermission(fileName, 'create'), ProjectController.store);

router.route('/:id')
    .get(checkAuth, checkPermission(fileName, 'read'), ProjectController.show)
    .patch(checkAuth, checkPermission(fileName, 'edit'), ProjectController.update)
    .delete(checkAuth, checkPermission(fileName, 'delete'), ProjectController.destroy);

router.post('/:id/image', helper.fileImageUpload.single('image'), checkAuth, checkPermission(fileName, 'edit'), ProjectController.image);

// get form
router.route('/get/create').get(checkAuth, checkPermission(fileName, 'create'), ProjectController.create);

// get edit details
router.route('/:id/edit').get(checkAuth, checkPermission(fileName, 'edit'), ProjectController.edit);

module.exports = router;