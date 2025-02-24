const express = require('express');
const AdministrationController = require('../controllers/Administration');
const auth = require('../middlewares/jwt');
const router = express.Router();
const multer = require('multer');
const base_dir_config = require('../config.js');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, base_dir_config.base_dir + 'uploads/admin_officer_photo/');
	},
	filename: (req, file, cb) => {
		const timestamp = Date.now();
		const originalFilename = file.originalname;
		const fileExtension = originalFilename.split('.').pop();
		const filename = `${timestamp}.${fileExtension}`;
		cb(null, filename);
	}
});

router.post(
	'/create_administration_office',
	auth,
	AdministrationController.create
);
router.get(
	'/fetchall_administration_office',
	auth,
	AdministrationController.fetchall
);
router.get(
	'/fetch_office_by_condition/:condition/:id',
	auth,
	AdministrationController.fetch_admin_office_by_condition
);
router.get(
	'/delete_administration_office/:id',
	auth,
	AdministrationController.delete
);
router.post(
	'/update_administration_office/:id',
	auth,
	AdministrationController.update
);

// Administration Officer Type Route
router.post(
	'/create_administration_officer_type',
	auth,
	AdministrationController.create_admin_officer_type
);

router.get(
	'/fetchall_administration_officer_type',
	auth,
	AdministrationController.fetchallAdminType
);

router.get(
	'/fetchall_officer_type_by_officeid/:id',
	auth,
	AdministrationController.fetchallAdminTypeById
);
router.put(
	'/update_administration_officer_type/:id',
	auth,
	AdministrationController.updateAdminType
);
router.delete(
	'/delete_administration_officer_type/:id',
	auth,
	AdministrationController.deleteAdminType
);

// Place comment route
router.post(
	'/create_place_comment',
	auth,
	AdministrationController.place_comment_create
);
router.get(
	'/place_comment/:id',
	auth,
	AdministrationController.getplacecommentbyid
);
router.get(
	'/place_comment_by_district/:id',
	auth,
	AdministrationController.getplacecommentbydistrictid
);
router.get(
	'/place_comment_by_division/:id',
	auth,
	AdministrationController.getplacecommentbydivisionid
);
router.get(
	'/all_place_comment',
	auth,
	AdministrationController.getallplacecomment
);
router.get(
	'/place_comment_delete/:id',
	auth,
	AdministrationController.place_comment_delete
);
router.post(
	'/place_comment_update/:id',
	auth,
	AdministrationController.place_comment_update
);

router.post(
	'/create_administration_officer',
	auth,
	multer({ storage }).single('profile_photo'),
	AdministrationController.create_administration_officer
);
router.get(
	'/get_administration_officer/:id',
	auth,
	AdministrationController.getadministration_officerbyplaceid
);
router.get(
	'/get_administration_officer',
	auth,
	AdministrationController.getadministration_officer
);
router.post(
	'/update_administration_officer/:id',
	auth,
	multer({ storage }).single('profile_photo'),
	AdministrationController.update_administration_officerbyid
);
router.get(
	'/delete_administration_officer/:id',
	auth,
	AdministrationController.administration_officer_delete
);

module.exports = router;
