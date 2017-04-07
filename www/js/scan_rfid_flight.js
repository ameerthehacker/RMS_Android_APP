$(function(){
    var station;
    var package_count=0;
    $.ajax({
        url:'http://localhost:8888/rms/ajax.php?action=user_signed_in',
        success:function(response){
            response=jQuery.parseJSON(response);
            if(!response.status){
                window.location="login.html";
            }
            else{
                station=response.station;
                $("#station").text(station);
            }
        }
    });
    var countInfo=$("#count-info");
    var btnGetPackages=$("#btn-get-packages");
    btnGetPackages.on('click',function(){
        var frmScanRfid=$("#frm-scan-rfid");
        frmScanRfid.ajaxSubmit({
            url:'http://localhost:8888/rms/ajax.php?action=get-flight-packages',
            data:{'station':station},
            success:function(response){
                response=jQuery.parseJSON(response);
                package_count=response.length;
                countInfo.text(package_count);
                for(i=0;i<response.length;i++){
                    var current_station="";
                    if(response[i].status=="SCANNED_IN_WRONG_STATION"){
                        current_station=response[i].current_station;
                    }
                    $("#packages-list").append("<tr data-date='" + response[i].sent_date + "' class='danger' id='" + response[i].uid +  "'> <td>" + response[i].uid + "</td><td>" + response[i].source + "</td><td id='status'>" + response[i].status + " " + current_station + " </td></tr>");
                }
            }
        });
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
    socket=new io.connect('http://192.168.1.106:8888');
    socket.on('rfid_read',function(data){
        if($("#"+data.uid).length==0){
            if(confirm("Invalid bag do you want to inform the correct station")){
                $.ajax({
                    url:'http://localhost:8888/rms/ajax.php?action=inform-wrong-station',
                    method:'POST',
                    data:{'uid':data.uid, 'sent_date':date},
                    success:function(response){
                       alert("Notified to correct station");
                    }
                });
            }
        }
        else{
            var date=$("#"+data.uid).attr("data-date");
            $.ajax({
                url:'http://localhost:8888/rms/ajax.php?action=update-package',
                method:'POST',
                data:{'uid':data.uid, 'sent_date':date},
                success:function(response){
                    $("#"+data.uid).attr('class','success');
                    $("#"+data.uid).children("#status").text("RECIEVED");
                    package_count=package_count-1;
                    countInfo.text(package_count);
                    if(package_count==0){
                        countInfo.parent().attr('class','alert alert-success');
                    }
                }
            });
        }
    });    
});