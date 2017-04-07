$(function(){
    var destinations=[];
    var apiJSON={};
    $.ajax({
        url:'http://localhost:8888/rms/ajax.php?action=user_signed_in',
        success:function(response){        
            response=jQuery.parseJSON(response);
            if(!response.status){
                window.location="login.html";
            }
            else{
                $("#station").text(response.station);
            }
        }
    });
    var btnLogout=$("#btn-logout");
    btnLogout.on('click',function(evt){
        evt.preventDefault();
        $.ajax({
            url:'http://localhost:8888/rms/auth.php?action=logout',
            success:function(response){
                window.location="login.html";
            }
        })
    });
    var btnCreatePostRFID=$("#btn-create-post-rfid");
    var frmCreateTag=$("#frm-create-tag");
    btnCreatePostRFID.on('click',function(){
        frmCreateTag.ajaxSubmit({
            url:'http://localhost:8888/rms/ajax.php?action=insert-post-rfid',
            success:function(response){
                response=jQuery.parseJSON(response);
                alert("Tag created");
            }
        });
    });
    
    
    socket=new io.connect('http://192.168.1.106:8888');
    socket.on('rfid_read',function(data){
        $("#rfid-number").val(data.uid);
        $("#destinations").val("");        
    });            
            
            
   
});