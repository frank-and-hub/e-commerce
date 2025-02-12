const express = require('express');
const router = express.Router();

// helpers
const helper = require('../utils/helper');

const { checkAuth } = require('../middleware/authMiddleware');
const TestimonialController = require('../controllers/TestimonialController');
// permissios check
const checkPermission = require('../middleware/checkPermission');
// get filea name
const fileName = __filename.slice(__dirname.length + 1).replace('.js', '');

router.route('/')
    .get(checkAuth, checkPermission(fileName, 'read'), TestimonialController.index)
    .post(checkAuth, helper.fileImageUpload.single('image'), checkPermission(fileName, 'create'), TestimonialController.store);

router.route('/:id')
    .get(checkAuth, checkPermission(fileName, 'read'), TestimonialController.show)
    .patch(checkAuth, helper.fileImageUpload.single('image'), checkPermission(fileName, 'edit'), TestimonialController.update)
    .delete(checkAuth, checkPermission(fileName, 'delete'), TestimonialController.destroy);

// get form
router.route('/get/create').get(checkAuth, checkPermission(fileName, 'create'), TestimonialController.create);

// get edit details
router.route('/:id/edit').get(checkAuth, checkPermission(fileName, 'edit'), TestimonialController.edit);

module.exports = router;