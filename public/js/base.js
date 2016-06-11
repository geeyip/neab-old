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

function $info(str){
    $message({msg: str, type:'info'});
}
function $error(str){
    $message({msg: str, type:'danger'});
}
function $success(str){
    $message({msg: str, type:'success'});
}
function $warning(str){
    $message({msg: str, type:'warning'});
}
function $message(obj){
    var output = '<div class="fade in alert alert-'+obj.type+'"><button class="close" type="button" data-dismiss="alert">×</button><ul><li>'+obj.msg+'</li></ul></div>';
    $('#messages').html(output);
}