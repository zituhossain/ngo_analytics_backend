const {News_event} = require("../models");
const secret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const apiResponse = require("../helpers/apiResponse")

exports.create_news_event = async(req,res) => {
    try{
        const filePath = `uploads/news_event/${req.file.filename}`;
        req.body.image = filePath;
    }catch(err){

    }
    try{
        const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
        req.body.created_by = userId;

        if(req.body){
            await News_event.create(req.body);
            return apiResponse.successResponse(res,"data successfully saved.")
        }else{
            return apiResponse.ErrorResponse(res,"Value missing.")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

exports.update_news_event = async(req,res) => {
    const news_event_id = req.params.id;
    try{
        const filePath = `uploads/news_event/${req.file.filename}`;
        req.body.image = filePath;
    }catch(err){

    }
    try{
        const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, secret);
		const userId = decodedToken._id;
        req.body.updated_by = userId;
        const news_event_data = await News_event.findAll({where: {id : news_event_id}});
        if(news_event_data.length > 0){
            if(req.body){
                await News_event.update(req.body,{where:{id:news_event_id}});
                return apiResponse.successResponse(res,"data successfully updated.")
            }else{
                return apiResponse.ErrorResponse(res,"Value missing.")
            }
        }else{
            return apiResponse.ErrorResponse(res,"No data found!!!")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

exports.fetch_news_event_by_id = async(req,res) => {
    try{
        const place_id = req.params.id;
        const value_name = req.params.value;
        let arr = []
        if(value_name=='place'){
            arr.push({place_id: place_id})
        }else if(value_name=='district'){
            arr.push({district_id: place_id})
        }else if(value_name=='division'){
            arr.push({division_id: place_id})
        }
        
        const news_event_data = await News_event.findAll({
            where: arr
        });
        if(news_event_data.length > 0){
            return apiResponse.successResponseWithData(res,"Data fetch successfull.",news_event_data)

        }else{
            return apiResponse.ErrorResponse(res,"No data found!!!")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}
exports.fetch_all_news = async(req,res) => {
    try{
        
        const news_event_data = await News_event.findAll();
        if(news_event_data.length > 0){
            return apiResponse.successResponseWithData(res,"Data fetch successfull.",news_event_data)

        }else{
            return apiResponse.ErrorResponse(res,"No data found!!!")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}

exports.delete_by_id = async(req,res) => {
    const news_event_id = req.params.id;
    try{
        const news_event_data = await News_event.findAll({where: {id : news_event_id}});
        if(news_event_data.length > 0){
            await News_event.destroy({where:{id:news_event_id}})
            return apiResponse.successResponse(res,"Data deleted successfully.")

        }else{
            return apiResponse.ErrorResponse(res,"No data found!!!")
        }

    }catch(err){
        return apiResponse.ErrorResponse(res,err.message)
    }
}
