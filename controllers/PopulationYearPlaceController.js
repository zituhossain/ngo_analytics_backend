const apiResponse = require('../helpers/apiResponse');
const { population_year_place, years,Place } = require('../models');
const secret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");


exports.fetchall = async (req, res) => {
    const allOverallTitle = await population_year_place.findAll({
        include:[years , Place]
    });
    if (allOverallTitle) {
        return apiResponse.successResponseWithData(res, "population_year_place fetch successfully.", allOverallTitle)
    } else {
        return apiResponse.ErrorResponse(res, "No data found")
    }
}

exports.getbyid = async (req, res) => {
    try {
        const title_id = req.params.id;
        const title_data = await population_year_place.findOne({ where: { id: title_id }, include:[years] });
        if (title_data) {
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", title_data)
        } else {
            return apiResponse.ErrorResponse(res, "No matching query found")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}

exports.getbyYear = async (req, res) => {
    try {
        // const title_id = req.params.year; 

        const place = req.params.place;
        const title_data = await population_year_place.findAll({ where: {  place_id: place },include:[years] });
        // return
        if (title_data) {
            return apiResponse.successResponseWithData(res, "Data successfully fetched.", title_data)
        } else {
            return apiResponse.ErrorResponse(res, "No matching query found ashik")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}

exports.getbyDisId = async (req, res) => {
    try {
        // const title_id = req.params.year; 

        const disId = req.params.disId;
    try {
        
        const [results, metadata] = await population_year_place.sequelize.query('select sum(pyp.total_population) as tota_population,sum(pyp.male) as total_male,sum(pyp.female) as total_female from population_year_places pyp left join Places on Places.id = pyp.place_id where Places.district_id = '+disId+' and year_id = (select max(id) as year_id from years)');

        return apiResponse.successResponseWithData(res,"Data successfully fetched.",results)
    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}

exports.getbyPlaceId = async (req, res) => {
    try {
        // const title_id = req.params.year; 

        const placeId = req.params.placeId;
    try {
        
        const [results, metadata] = await population_year_place.sequelize.query('select sum(pyp.total_population) as tota_population,sum(pyp.male) as total_male,sum(pyp.female) as total_female from population_year_places pyp left join Places on Places.id = pyp.place_id where Places.id = '+placeId+' and year_id = (select max(id) as year_id from years)');

        return apiResponse.successResponseWithData(res,"Data successfully fetched.",results)
    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}
exports.getMinoritybyPlaceId = async (req, res) => {
    try {
        // const title_id = req.params.year; 

        const placeId = req.params.placeId;
    try {
        
        const [results, metadata] = await population_year_place.sequelize.query('select sum(pyp.minority) as total_minority from population_year_places pyp left join Places on Places.id = pyp.place_id where Places.id = '+placeId+' and year_id = (select max(id) as year_id from years)');

        return apiResponse.successResponseWithData(res,"Data successfully fetched.",results)
    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}

exports.getbyDivId = async (req, res) => {
    try {
        // const title_id = req.params.year; 

        const divId = req.params.divId;
    try {
        
        const [results, metadata] = await population_year_place.sequelize.query('select sum(pyp.total_population) as tota_population, sum(pyp.minority) as total_minority,sum(pyp.male) as total_male,sum(pyp.female) as total_female from population_year_places pyp left join Places on Places.id = pyp.place_id where division_id = '+divId+' and year_id = (select max(id) as year_id from years)');

        return apiResponse.successResponseWithData(res,"Data successfully fetched.",results)
    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}


exports.create = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, secret);
        const userId = decodedToken._id;
        req.body.created_by = userId;
        console.log("req.body", req.body)
        const get_data = await population_year_place.findOne({ where: { place_id: req.body.place_id , year_id : req.body.year_id} });
        // console.log("get_data", get_data)
        // return
        if (!get_data) {
            if (Object.keys(req.body).length === 0) {
                return apiResponse.ErrorResponse(res, 'description missing')
            } else {
                await population_year_place.create(req.body);
                return apiResponse.successResponse(res, 'population_year_place saved successfully.')
            }
        }else{
            return apiResponse.ErrorResponse(res, "Same Year Same Place Failed") 
        }
    } catch (err) {
        console.log(err.message)
        return apiResponse.ErrorResponse(res, err.message)
    }
}


exports.updatebyid = async (req, res) => {
    try {
        const condition_id = req.params.id;
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, secret);
        const userId = decodedToken._id;
        req.body.updated_by = userId;
        const condition_data = await population_year_place.findOne({ where: { id: condition_id } });
        if (condition_data) {
            if (req.body.place_id) {
                await population_year_place.update(req.body, { where: { id: condition_id } });
                return apiResponse.successResponse(res, "Data successfully updated.")
            } else {
                return apiResponse.ErrorResponse(res, 'heading missing')
            }
        } else {
            return apiResponse.ErrorResponse(res, "No matching query found")
        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message)
    }
}