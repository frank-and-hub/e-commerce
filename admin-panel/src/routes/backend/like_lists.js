const express = require('express');
const router = express.Router();
const LikeListController = require('../../controllers/LikeListController');

// permissios check
const checkPermission = require('../../middleware/checkPermission');
// get filea name
const fileName = __filename.slice(__dirname.length + 1).replace('.js', '');

router.route('/')
    .get(checkPermission(fileName, 'read'), LikeListController.index)
    .post(checkPermission(fileName, 'create'), LikeListController.store);

router.route('/:id')
    .get(checkPermission(fileName, 'read'), LikeListController.show)
    .patch(checkPermission(fileName, 'edit'), LikeListController.update)
    .delete(checkPermission(fileName, 'delete'), LikeListController.destroy);

// get form
router.route('/get/create').get(checkPermission(fileName, 'create'), LikeListController.create);

// get edit details
router.route('/:id/edit').get(checkPermission(fileName, 'edit'), LikeListController.edit);

module.exports = router;