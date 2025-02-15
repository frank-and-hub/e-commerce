const express = require('express');
const router = express.Router();

// helpers
const helper = require('../utils/helper');

const { checkAuth } = require('../middleware/authMiddleware');
const BrandController = require('../controllers/BrandController');
// permissios check
const checkPermission = require('../middleware/checkPermission');
// get filea name
const fileName = __filename.slice(__dirname.length + 1).replace('.js', '');

router.route('/')
    .get(checkAuth, checkPermission(fileName, 'read'), BrandController.index)
    .post(checkAuth, helper.fileImageUpload.single('image'), checkPermission(fileName, 'create'), BrandController.store);

router.route('/:id')
    .get(checkAuth, checkPermission(fileName, 'read'), BrandController.show)
    .patch(checkAuth, helper.fileImageUpload.single('image'), checkPermission(fileName, 'edit'), BrandController.update)
    .delete(checkAuth, checkPermission(fileName, 'delete'), BrandController.destroy);

// get form
router.route('/get/create').get(checkAuth, checkPermission(fileName, 'create'), BrandController.create);

// get edit details
router.route('/:id/edit').get(checkAuth, checkPermission(fileName, 'edit'), BrandController.edit);

module.exports = router;