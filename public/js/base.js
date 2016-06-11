window.$.fn.serializeObject=function(){
    var convertArray=function (arr) {
        var i=arr.length, obj = {};
        while (i--){
            if(typeof obj[arr[i].name]=='undefined')
                obj[arr[i].name] = arr[i].value;
            else
                obj[arr[i].name] += ','+arr[i].value;
        }
        return obj;
    };
    return function(){
        return convertArray(this.serializeArray());
    };
}();