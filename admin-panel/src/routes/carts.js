const express = require('express');
const router = express.Router();
const CartController = require('../controllers/CartController');
const { checkAuth } = require('../middleware/authMiddleware');
// permissios check
const checkPermission = require('../middleware/checkPermission');
// get filea name
const fileName = __filename.slice(__dirname.length + 1).replace('.js', '');

router.route('/')
    .get(checkAuth, checkPermission(fileName, 'read'), CartController.index)
    .post(checkAuth, checkPermission(fileName, 'create'), CartController.store);

router.route('/:id')
    .get(checkAuth, checkPermission(fileName, 'read'), CartController.show)
    .delete(checkAuth, checkPermission(fileName, 'delete'), CartController.destroy);

// get form
router.route('/get/create').get(checkAuth, checkPermission(fileName, 'create'), CartController.create);

// get edit details
router.route('/:id/edit').get(checkAuth, checkPermission(fileName, 'edit'), CartController.edit);

module.exports = router;