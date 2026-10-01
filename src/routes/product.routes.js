const router = require('express').Router();
const ctrl = require('../controllers/product.controller');
const validate = require('../middlewares/validate');
const validateObjectId = require('../middlewares/validateObjectId');
const verifyToken = require('../middlewares/verifyToken');
const upload = require('../middlewares/upload');
const { createProductSchema, updateProductSchema, listQuerySchema } = require('../validators/product.validator');

// Public
router.get('/', validate(listQuerySchema, 'query'), ctrl.getAll);
router.get('/:id', validateObjectId, ctrl.getOne);

// Protected: Request -> JWT middleware -> (Multer) -> Joi -> Controller -> Service -> DB
router.post('/', verifyToken, upload.single('image'), validate(createProductSchema), ctrl.create);
router.put('/:id', verifyToken, validateObjectId, upload.single('image'), validate(updateProductSchema), ctrl.update);
router.delete('/:id', verifyToken, validateObjectId, ctrl.remove);

module.exports = router;
