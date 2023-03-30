const express = require('express');
const NgoJotController = require('../controllers/NgoJotController');
const auth = require('../middlewares/jwt');
const router = express.Router();
const multer = require('multer');
const base_dir_config = require('../config.js');
// router.post('/create',auth, NgoJotController.create);
router.post('/create', NgoJotController.create);
router.put('/update/:id', NgoJotController.update);
router.get('/get_details/:id', NgoJotController.get_details);
router.get('/get_details', NgoJotController.get_detailsAll);
router.delete('/delete/:id', NgoJotController.delete);
router.get('/get_ngojot_list_by_place/:id', NgoJotController.fetchall_ngojot_by_place);
module.exports = router;