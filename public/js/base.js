function socketTest(){
    var socket = io.connect();
    socket.emit('sendMsg', '我是天才');
    socket.on('receiveMsg', function(data){
       console.log(data);
    });
}

function addPermissionRow(id, res){
    var html = '<tr>\
                <td><input type="text" name="permissionKey" class="form-control" required="" /></td>\
                <td><input type="text" name="permissionName" class="form-control" required=""/></td>\
                <td><a href="#" onclick="deletePermissionRow(this)"> <i class="glyphicon glyphicon-minus"></i></a></td>\
                </tr>';
    $('#'+id).append(html);
}

function deletePermissionRow(obj){
    $(obj).parent().parent().remove();
}

function checkResource(obj){
    var flag = $(obj).prop('checked');
    var key = $(obj).val();
    if(flag){
        $('.permission_'+key).prop('disabled', false);
    }else{
        $('.permission_'+key).prop('disabled', true);
        $('.permission_'+key).prop('checked', false);
    }
}