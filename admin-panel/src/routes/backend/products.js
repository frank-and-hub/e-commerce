const express = require('express');
const router = express.Router();
// helpers
const helper = require('../../utils/helper');
// Middleware
const ProductController = require('../../controllers/ProductController');
// permissios check
const checkPermission = require('../../middleware/checkPermission');
const { checkAuth } = require('../../middleware/authMiddleware');
// get filea name
const fileName = __filename.slice(__dirname.length + 1).replace('.js', '');

router.route('/')
    .get(checkAuth, checkPermission(fileName, 'read'), ProductController.index)
    .post(checkAuth, helper.fileImageUpload.single('image'), checkAuth, checkPermission(fileName, 'create'), ProductController.store);

router.route('/:id')
    .get(checkAuth, checkPermission(fileName, 'read'), ProductController.show)
    .patch(checkAuth, checkPermission(fileName, 'edit'), ProductController.update)
    .delete(checkAuth, checkPermission(fileName, 'delete'), ProductController.destroy);

router.post('/:id/image', helper.fileImageUpload.single('image'), checkAuth, checkPermission(fileName, 'edit'), ProductController.image);

// get form
router.route('/get/create').get(checkAuth, checkPermission(fileName, 'create'), ProductController.create);

// get edit details
router.route('/:id/edit').get(checkAuth, checkPermission(fileName, 'edit'), ProductController.edit);

module.exports = router;