const express = require('express');
const router = express.Router();
const UnitController = require('../controllers/UnitController');
const { checkAuth } = require('../middleware/authMiddleware');
// permissios check
const checkPermission = require('../middleware/checkPermission');
// get filea name
const fileName = __filename.slice(__dirname.length + 1).replace('.js', '');

router.route('/')
    .get(checkAuth, checkPermission(fileName, 'read'), UnitController.index)
    .post(checkAuth, checkPermission(fileName, 'create'), UnitController.store);

router.route('/:id')
    .get(checkAuth, checkPermission(fileName, 'read'), UnitController.show)
    .patch(checkAuth, checkPermission(fileName, 'edit'), UnitController.update)
    .delete(checkAuth, checkPermission(fileName, 'delete'), UnitController.destroy);

// get form
router.route('/get/create').get(checkAuth, checkPermission(fileName, 'create'), UnitController.create);

// get edit details
router.route('/:id/edit').get(checkAuth, checkPermission(fileName, 'edit'), UnitController.edit);

module.exports = router;