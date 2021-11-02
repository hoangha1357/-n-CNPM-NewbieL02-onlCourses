const Handlebars =require('handlebars');

module.exports = {
    //create suport funtion
    sum: (a, b) => a + b,
    mul: (a, b) => a * b,
    sortable: (field,sort) => {
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
        const href = Handlebars.escapeExpression('?_sort&column='+field+'&type='+types[sortType]+'');

        const result = '<a href="'+ href +'"><span class="'+icons[sortType]+'"></span></a>';
        return result;
    },
    imageload: (image,type) => {
        return 'data:'+type+';charset=uft-8;base64,'+image.toString('base64');
    },
    paging: (count, currentpage) => {
        const limit = 6;
        const page = Math.ceil(count / limit);
        var result = '<div class=""> <nav aria-label="Page navigation example "> <ul class="pagination justify-content-center">'
        if(currentpage > 1) result+='<li class="page-item"><a class="page-link" href="?page='+(currentpage - 1) +'">Previous</a></li>'
        for(i=currentpage; i<=page; i++) {
            result += '<li class="page-item"><a class="page-link" href="?page='+i+'">'+ i +'</a></li>';
        }
        if(currentpage < page) result+='<li class="page-item"><a class="page-link" href="?page='+(++currentpage)+'">Next</a></li>'
                // =1
                // <li class="page-item"><a class="page-link" href="?page=2">1</a></li>
                // <li class="page-item"><a class="page-link" href="?page=3">Next</a></li>
        result + '</ul></nav></div>'
        
        return result;
    }
};