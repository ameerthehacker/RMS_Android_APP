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
    var btnGetDestinations=$("#btn-get-destination");
    var btnCreateRFID=$("#btn-create-rfid");
    var frmCreateTag=$("#frm-create-tag");
    var departure_time="";
    btnCreateRFID.on('click',function(){
        var found=false;
        $.each(apiJSON.train.route,function(index, value){
            if(value.station.name==$("#destinations").val()){
                found=true;
                departure_time=value.departure_time;
                return;                
            }
        });
        if(found){
            frmCreateTag.ajaxSubmit({
                url:'http://localhost:8888/rms/ajax.php?action=insert-rfid',
                data: {'mode':'RAIL','departure_time': departure_time},
                success:function(response){
                    response=jQuery.parseJSON(response);
                    alert("Tag created");
                }
            });
        }
        else{
            alert("error");            
        }
    });
    
    btnGetDestinations.on('click',function(evt){
        destinations=[];
        evt.preventDefault();
        $.get("http://localhost:8888/rms/ajax.php?action=get-destinations&train_no=" + $("#train-search").val(),function(response){
            response=jQuery.parseJSON(response);
            apiJSON=response;
            $.each(response.train.route,function(index, value){
                destinations.push(value.station.name);
                console.log(value.station.name);
              
            });
            $("#destinations").autocomplete({source:destinations});
        });
    });
    
    socket=new io.connect('http://192.168.1.106:8888');
    socket.on('rfid_read',function(data){
        $("#rfid-number").val(data.uid);
        $("#destinations").val("");        
    });            
            
            
   
});