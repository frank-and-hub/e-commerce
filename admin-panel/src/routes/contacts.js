const express = require('express');
const router = express.Router();
const { checkAuth } = require('../middleware/authMiddleware');
const ContactController = require('../controllers/ContactController');
// permissios check
const checkPermission = require('../middleware/checkPermission');
// get filea name
const fileName = __filename.slice(__dirname.length + 1).replace('.js', '');

router.route('/')
    .get(checkAuth, checkPermission(fileName, 'read'), ContactController.index)
    // .post(checkAuth, checkPermission(fileName, 'create'), ContactController.store);
    .post(ContactController.store);

router.route('/:id')
    .get(checkAuth, checkPermission(fileName, 'read'), ContactController.show)
    // .patch(checkAuth, checkPermission(fileName, 'edit'), ContactController.update)
    .delete(checkAuth, checkPermission(fileName, 'delete'), ContactController.destroy);

// get form
router.route('/get/create').get(checkAuth, checkPermission(fileName, 'create'), ContactController.create);

// get edit details
router.route('/:id/edit').get(checkAuth, checkPermission(fileName, 'edit'), ContactController.edit);

module.exports = router;