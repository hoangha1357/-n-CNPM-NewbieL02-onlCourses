const request = require('request');
module.exports = function getytdata(req, res, next) {
    var url = 'https://www.googleapis.com/youtube/v3/videos?id='
    var key = '&key='+process.env.Youtube_API+'&part=contentDetails'
    if(req.body.lesson){
        if(Object.keys(req.body.lesson[0]).length > 1){
            for(var videoid in req.body.lessonVideo){
                url+= String(req.body.lessonVideo[videoid])
                if(req.body.lessonVideo[videoid+1] !== null){
                    url+=','
                }
            }
        }else{
            url+=req.body.lessonVideo
        }
        //res.json(req.body.lessonVideo)
        // console.log(url+key)
        request(url+key, function (error, response, body) {
            var data = JSON.parse(body);
            req.body.datalog = data.items; 
            next();
            //res.json(datalog);
        })
    }
    else{
        next();
    }
    
    
}

