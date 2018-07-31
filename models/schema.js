var mongoose=require('mongoose');
//Schema
var Schema=mongoose.Schema({
    originalname:{
        type:String,
        required:true
    }
});

var Module=module.exports=mongoose.model('Module',Schema);

module.exports.addModule=function(module,callback){
    Module.create(module,callback);
};

module.exports.getModule=function(callback,limit){
    Module.find(callback).limit(limit);
};

module.exports.deleteModule=function(originalname,callback){
    var query={originalname:originalname};
    Module.findOneAndRemove(query,callback);
};
