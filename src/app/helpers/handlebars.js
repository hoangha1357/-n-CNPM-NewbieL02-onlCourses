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
        if (image) {
            return 'data:'+type+';charset=uft-8;base64,'+image.toString('base64');
        } else {
            return 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/ISO_C%2B%2B_Logo.svg/800px-ISO_C%2B%2B_Logo.svg.png'
        }
        
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
    displaytime: (timeseconds) =>{
        var minutes = Math.round(timeseconds/60);
        var second = timeseconds%60;
        return `${minutes}:${second}`;
    },
};