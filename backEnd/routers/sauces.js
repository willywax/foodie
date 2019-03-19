const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceController = require('../controllers/sauces');

router.get('/', auth, sauceController.getAll);
router.post('/', auth,multer, sauceController.saveOne);
router.get('/:id', auth, sauceController.getOne);
router.put('/:id', auth, multer, sauceController.updateOneThing);
router.delete('/:id', auth, sauceController.deleteOne);
router.post('/:id/like',auth, sauceController.likeSauce);


module.exports = router;