$(function(){
    $.ajax({
        url:'http://localhost:8888/rms/ajax.php?action=user_signed_in',
        success:function(response){
            response=jQuery.parseJSON(response);
            if(response.status){
                window.location="index.html";
            }
        }
    });
    var frmLogin=$("#frm-login");
    var btnLogin=$("#btn-login");
    
    btnLogin.on('click',function(){
        frmLogin.ajaxForm();
        frmLogin.ajaxSubmit({
            url:'http://localhost:8888/rms/auth.php?action=login',
            success:function(response){
                response=jQuery.parseJSON(response);
                if(response.error){
                    $("#error-panel").css({visibility:'visible',display:'block'});
                    $("#error-message").text(response.message);                    
                }
                else{
                    if(response.type=='p_user'){
                        window.location="create_post_rfid.html";                        
                    }
                    else{
                        window.location="index.html";                        
                    }
                }
            },
            error:function(error){
                $.each(error,function(index,value){
                    console.log(index + ":" + value);
                });
            }
        });
        
    });
});