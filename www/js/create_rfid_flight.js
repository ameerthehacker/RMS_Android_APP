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
    var btnGetDestinations=$("#btn-get-destination");
    var btnCreateRFID=$("#btn-create-rfid");
    var frmCreateTag=$("#frm-create-tag");
    btnCreateRFID.on('click',function(){
        frmCreateTag.ajaxSubmit({
            url:'http://localhost:8888/rms/ajax.php?action=insert-rfid',
            data: {'mode':'AIR','departure_time':'10:30'},
            success:function(response){
                response=jQuery.parseJSON(response);
                alert("Tag Created");
            }
        });
    });
    btnLogout.on('click',function(evt){
        evt.preventDefault();
        $.ajax({
            url:'http://localhost:8888/rms/auth.php?action=logout',
            success:function(response){
                window.location="login.html";
            }
        })
    });
    
    socket=new io.connect('http://192.168.1.106:8888');
    socket.on('rfid_read',function(data){
        $("#rfid-number").val(data.uid);
        $("#destinations").val("");
    });            
            
            
   
});