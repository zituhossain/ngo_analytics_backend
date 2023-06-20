const apiResponse = require('../helpers/apiResponse');
const { local_influencer, Place } = require('../models');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const checkUserRoleByPlace = require('./globalController');

exports.fetchalllocalinfluencer = async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		let roleByplace = await checkUserRoleByPlace(token);
		let arr = [];
		if ((roleByplace.division.length > 0 && roleByplace.district.length > 0 && roleByplace.place.length > 0) || roleByplace.place.length > 0) {
			arr.push({ place_id: roleByplace.place });
		} else if ((roleByplace.division.length > 0 && roleByplace.district.length > 0) || roleByplace.district.length > 0) {
			const places = await Place.findAll({
				attributes: ['id'],
				where: {
					district_id: roleByplace.district
				}
			});

			const placeIds = places.map(place => place.id);
			arr.push({ place_id: placeIds });

		} else if (roleByplace.division.length > 0) {
			const places = await Place.findAll({
				attributes: ['id'],
				where: {
					division_id: roleByplace.division
				}
			});

			const placeIds = places.map(place => place.id);
			arr.push({ place_id: placeIds });
		}
		const allLocalInfluencer = await local_influencer.findAll({
			include: [Place],
			where: arr,
		});
		if (allLocalInfluencer) {
			return apiResponse.successResponseWithData(
				res,
				'local_influencer fetch successfully.',
				allLocalInfluencer
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No data found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getlocalinfluencerbyid = async (req, res) => {
	try {
		const influencer_id = req.params.id;
		const influencer_data = await local_influencer.findOne({
			include: [Place],
			where: { id: influencer_id },
		});
		if (influencer_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				influencer_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getlocalinfluencerbyplaceid = async (req, res) => {
	try {
		const influencer_id = req.params.placeid;
		const influencer_data = await local_influencer.findAll({
			include: [Place],
			where: { place_id: influencer_id },
		});
		if (influencer_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				influencer_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
const { Op } = require('sequelize');

// exports.getlocalinfluencerbyplaceid = async (req, res) => {
// 	try {
// 		const influencer_id = req.params.placeid;
// 		const token = req.headers.authorization.split(' ')[1];
// 		const roleByplace = await checkUserRoleByPlace(token);

// 		let authorizedPlaceIds = [];

// 		if (roleByplace.division.length > 0) {
// 			const places = await Place.findAll({
// 				attributes: ['id'],
// 				where: {
// 					division_id: roleByplace.division,
// 				},
// 			});
// 			authorizedPlaceIds = places.map((place) => place.id);
// 		} else {
// 			const places = await Place.findAll({
// 				attributes: ['id'],
// 			});
// 			authorizedPlaceIds = places.map((place) => place.id);
// 		}

// 		const influencer_data = await local_influencer.findAll({
// 			include: [Place],
// 			where: {
// 				[Op.and]: [
// 					{ place_id: influencer_id },
// 					{ place_id: authorizedPlaceIds },
// 				],
// 			},
// 		});

// 		if (influencer_data.length > 0) {
// 			return apiResponse.successResponseWithData(
// 				res,
// 				'Data successfully fetched.',
// 				influencer_data
// 			);
// 		} else {
// 			return apiResponse.ErrorResponse(res, 'No data found');
// 		}
// 	} catch (err) {
// 		return apiResponse.ErrorResponse(res, err.message);
// 	}
// };



exports.getlocalinfluencerbydistrictid = async (req, res) => {
	try {
		const district_id = req.params.districtid;
		let influencer_id = [];
		const get_place_by_district = await Place.findAll({
			where: {
				district_id: district_id,
			},
		});

		for (i = 0; i < get_place_by_district.length; i++) {
			influencer_id.push(get_place_by_district[i].id);
		}
		const influencer_data = await local_influencer.findAll({
			include: [Place],
			where: { place_id: influencer_id },
		});

		if (influencer_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				influencer_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
exports.getlocalinfluencerbydivisionid = async (req, res) => {
	try {
		const division_id = req.params.divisionid;
		let influencer_id = [];
		const get_place_by_division = await Place.findAll({
			where: {
				division_id: division_id,
			},
		});

		for (i = 0; i < get_place_by_division.length; i++) {
			influencer_id.push(get_place_by_division[i].id);
		}
		const influencer_data = await local_influencer.findAll({
			include: [Place],
			where: { place_id: influencer_id },
		});

		if (influencer_data) {
			return apiResponse.successResponseWithData(
				res,
				'Data successfully fetched.',
				influencer_data
			);
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.createlocalinfluencer = async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
		req.body.createdby = userId;
		if (Object.keys(req.body).length === 0) {
			return apiResponse.ErrorResponse(
				res,
				'place/name/type/designation/organization missing'
			);
		} else {
			await local_influencer.create(req.body);
			return apiResponse.successResponse(
				res,
				'local influencer saved successfully.'
			);
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.updatelocalinfluencerbyid = async (req, res) => {
	try {
		const influencer_id = req.params.id;
		const influencer_data = await local_influencer.findOne({
			where: { id: influencer_id },
		});
		if (influencer_data) {
			if (req.body.place_id) {
				await local_influencer.update(req.body, {
					where: { id: influencer_id },
				});
				return apiResponse.successResponse(res, 'Data successfully updated.');
			} else {
				return apiResponse.ErrorResponse(res, 'place/condition missing');
			}
		} else {
			return apiResponse.ErrorResponse(res, 'No matching query found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
