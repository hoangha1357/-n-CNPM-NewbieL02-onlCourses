const Handlebars =require('handlebars');

module.exports = {
    //create suport funtion
    sum: (a, b) => a + b,
    mul: (a, b) => a * b,
    sortable: (field,sort, page) => {
        const sortType = field === sort.column ? sort.type : 'default';
        const icons = {
            default: 'oi oi-elevator',
            asc: 'oi oi-sort-ascending',
            desc: 'oi oi-sort-descending',
        };
        const types = {
            default: 'asc',
            asc: 'desc',
            desc: 'asc',
        };
        const href = Handlebars.escapeExpression('?_sort&column='+field+'&type='+types[sortType]+'&page='+page+'');

        const result = '<a href="'+ href +'"><span class="'+icons[sortType]+'"></span></a>';
        return result;
    },
    imageload: (image,type) => {
        return 'data:'+type+';charset=uft-8;base64,'+image.toString('base64');
    },
    paging: (count, currentpage, limit) => {
        const page = Math.ceil(count / limit);
        var result = '<nav aria-label="Page navigation example "> <ul class="pagination justify-content-center">'
        if(currentpage > 1) result+='<li class="page-item"><a class="page-link" href="?page='+(currentpage - 1) +'">Previous</a></li>'
        for(i=currentpage; i<=page; i++) {
            result += '<li class="page-item"><a class="page-link" href="?page='+i+'">'+ i +'</a></li>';
        }
        if(currentpage < page) result+='<li class="page-item"><a class="page-link" href="?page='+(++currentpage)+'">Next</a></li>'
                // =1
                // <li class="page-item"><a class="page-link" href="?page=2">1</a></li>
                // <li class="page-item"><a class="page-link" href="?page=3">Next</a></li>
        result + '</ul></nav>'
        
        return result;
    },
    isMatch: (val1, val2) =>{
        return val1 === val2;
    },
    calcVideotime: (array)=>{
        var Sum = 0;
        for(var i=0; i<array.length; i++){
            Sum += array[i].videotime;
        }
        return Sum;
    },
    displaySumtime: (lessons) =>{
        //
        if(!lessons) return '0:00';
        var seconds = 0;
        for(var i=0; i<lessons.length; i++){
            var arr = lessons[i].videotime;
            var mins, secs;
            mins = arr.slice(2,4);
            mins = parseFloat(mins);
            if(mins<10)secs = arr.slice(4,6);
            else secs = arr.slice(5,7);
            secs = parseFloat(secs)
            seconds = seconds + secs + mins*60
        }
        var hours = Math.round(seconds/3600);
        var mins = Math.round(seconds%3600/60)
        seconds = seconds % 60
        var rs = '';
        if(hours > 0) rs=rs + hours + ":";
        if(mins > 0){
            if(mins < 10) rs = rs+ '0' + mins+':';
            else rs = rs + mins + ":";
        }else{
            rs = rs + '00:';
        }
        if(seconds > 0){
            if(seconds < 10) rs = rs+ '0' + seconds;
            else rs = rs + seconds;
        }else if(hours > 0){
            rs = rs + '00';
        }
        return rs;
    },
    displaytime: (time) =>{
        if(!time){ return '0:00'}
        var arr = time;
        var mins, secs;
        mins = arr.slice(2,4);
        mins = parseFloat(mins);
        if(mins<10)secs = arr.slice(4,6);
        else secs = arr.slice(5,7);
        secs = parseFloat(secs)

        var rs = '';
        rs = mins+':'
        if(secs < 10){
            rs = rs + '0'+ secs;
        }else if(secs >0){
            rs += secs;
        }else{
            rs += secs;
        } 
        return rs;
    },
};