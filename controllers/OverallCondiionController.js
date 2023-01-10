const apiResponse = require('../helpers/apiResponse');
const {overall_condition} = require('../models');



exports.fetchallovealllcondition = async(req,res) => {
    const allOverallCondition = await overall_condition.findAll();
    if(allOverallCondition){
        return apiResponse.successResponseWithData(res,"overall_condition fetch successfully.",allOverallCondition)
    }else{
        return apiResponse.ErrorResponse(res,"No data found")
    }
}

exports.getoverallconditionbyid = async(req,res) => {
    try{
        const condition_id = req.params.id;
        const condition_data = await overall_condition.findOne({where:{id: condition_id}});
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
        if(Object.keys(req.body).length === 0){
            return apiResponse.ErrorResponse(res,'description missing')
        }else{
            await overall_condition.create(req.body);
            return apiResponse.successResponse(res,'condition saved successfully.')
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}


exports.updateoverallconditionbyid = async(req,res) => {
    try{
        const condition_id = req.params.id;
        const condition_data = await overall_condition.findOne({where:{id: condition_id}});
        if(condition_data){
            if(req.body.description){
                await overall_condition.update(req.body, { where: { id: condition_id } });
                return apiResponse.successResponse(res,"Data successfully updated.")
            }else{
                return apiResponse.ErrorResponse(res,'description missing')
            }
        }else{
            return apiResponse.ErrorResponse(res,"No matching query found")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}