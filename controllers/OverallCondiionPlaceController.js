const apiResponse = require('../helpers/apiResponse');
const {overall_condition_place , overall_condition , Place} = require('../models');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;


exports.fetchallovealllcondition = async(req,res) => {
    const allOverallCondition = await overall_condition_place.findAll({
        include: [Place,overall_condition]
    });
    if(allOverallCondition){
        return apiResponse.successResponseWithData(res,"overall_condition_place fetch successfully.",allOverallCondition)
    }else{
        return apiResponse.ErrorResponse(res,"No data found")
    }
}

exports.getoverallconditionbyid = async(req,res) => {
    try{
        const condition_id = req.params.id;
        const condition_data = await overall_condition_place.findOne({include: [Place,overall_condition] ,where:{id: condition_id}});
        if(condition_data){
            return apiResponse.successResponseWithData(res,"Data successfully fetched.",condition_data)
        }else{
            return apiResponse.ErrorResponse(res,"No matching query found")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

exports.getoverallconditionbyplaceid = async(req,res) => {
    try{
        const condition_id = req.params.placeid;
        const condition_data = await overall_condition_place.findAll({include: [Place,overall_condition] ,where:{place_id: condition_id}});
        if(condition_data){
            return apiResponse.successResponseWithData(res,"Data successfully fetched.",condition_data)
        }else{
            return apiResponse.ErrorResponse(res,"No matching query found")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}


exports.createoverallcondition = async(req,res) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
        req.body.createdby = userId;
        if(Object.keys(req.body).length === 0){
            return apiResponse.ErrorResponse(res,'place/condtion missing')
        }else{
            await overall_condition_place.create(req.body);
            return apiResponse.successResponse(res,'condition saved successfully.')
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}


exports.updateoverallconditionbyid = async(req,res) => {
    try{
        const condition_id = req.params.id;
        const condition_data = await overall_condition_place.findOne({where:{id: condition_id}});
        if(condition_data){
            if(req.body.place_id){
                await overall_condition_place.update(req.body, { where: { id: condition_id } });
                return apiResponse.successResponse(res,"Data successfully updated.")
            }else{
                return apiResponse.ErrorResponse(res,'place/condition missing')
            }
        }else{
            return apiResponse.ErrorResponse(res,"No matching query found")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}