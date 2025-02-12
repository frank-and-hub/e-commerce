const express = require('express');
const router = express.Router();
const PlanController = require('../controllers/PlanController');
const { checkAuth } = require('../middleware/authMiddleware');
// permissios check
const checkPermission = require('../middleware/checkPermission');
// get filea name
const fileName = __filename.slice(__dirname.length + 1).replace('.js', '');

router.route('/')
    .get(checkAuth, checkPermission(fileName, 'read'), PlanController.index)
    .post(checkAuth, checkPermission(fileName, 'create'), PlanController.store);

router.route('/:id')
    .get(checkAuth, checkPermission(fileName, 'read'), PlanController.show)
    .patch(checkAuth, checkPermission(fileName, 'edit'), PlanController.update)
    .delete(checkAuth, checkPermission(fileName, 'delete'), PlanController.destroy);

// get form
router.route('/get/create').get(checkAuth, checkPermission(fileName, 'create'), PlanController.create);

// get edit details
router.route('/:id/edit').get(checkAuth, checkPermission(fileName, 'edit'), PlanController.edit);

module.exports = router;