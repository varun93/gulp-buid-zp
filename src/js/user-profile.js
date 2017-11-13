(function($) 
    {

      var avatar_action = "";
      
      // common functions
      //dont touch this
      function upload_new_profile_photo() {
            document.getElementById('profile-photo-input').click();
            return false;
        }

        // dont touch this
        function readURL(input) {
         if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#modal-img-preview').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
         }
        }
        // success callbacks

        function updateDetails(stageOfParenting,date,cycleLength,firstName){

            var validationStatus =  FormValidation.validateUserUpdateDetails(null,stageOfParenting, date, cycleLength,"update-profile");
            // validate

            if (!validationStatus) {
              return;
            }

            var formdata = {first_name : firstName,'date' : date,'stage_of_parenting' : stageOfParenting,'cycle_length' : cycleLength};
            var endpoint = '/user/update_profile';

            ZP_Commons.post_details({url : endpoint,data : formdata,type:'POST'}).done(function(response){
                
              var userDetails = response.userDetails;

              ZP_Commons.clearGroupsCache();
              //clevertap profile sync action
              ZP_Commons.clevertapSyncUserProfile(userDetails);
              //
              window.location.href = "/";

            });
          }


         function upload_photo()
          {
            var file = $('#profile-photo-input')[0].files[0];
            var formData = new FormData();
            
             if(file &&  file !== undefined)
             {
              formData.append('user_avatar', file);
             }

              formData.append('avatar_action',avatar_action);
            
              ZP_Commons.post_details({url : '/user/update_profile_image',data : formData,type:'POST','cache':false,'contentType':false,'processData':false}).done(function(response){

                var status = parseInt(response.success);
                        
                if(status)
                {
                    $('#image-preview').modal('toggle');  
                    $('#profile-image').attr('src',response.message);  
                    $('#user-avatar').attr('src',response.message);
                }
                else
                {
                    console.log(response);
                }


                });  

            }



        $(document).ready(function() {
        
         // listener for back buton
         $(".back-button").click(function() {
            window.location.replace("/"); //not the best solution for going back but works
          });


        $("#edit-profile").click(function () {
        
            $('#first-name').addClass('sudoinput').attr('contenteditable', 'true');
            $('#stage-of-parenting').addClass('sudoinput').removeAttr('disabled');
            $('#date').addClass('sudoinput').removeAttr('disabled');
            $('#cycle-length').addClass('sudoinput').removeAttr('disabled');
            $('#save-details').removeClass("hide");
            $(this).hide();
        });
         
        $('ul#profile-picture-options-dropdown').on('click', 'li', function(){
              switch($(this).attr('id'))
              {
                case 'upload-new-photo' :
                 avatar_action = 'update';
                 upload_new_profile_photo();
                 break;
                case 'remove-photo' : 
                 avatar_action = 'remove';
                break;
                default : break;
              }
        });

        $('#stage-of-parenting').change(function(){

            var stage_of_parenting = $("#stage-of-parenting").val();
            var label = "Due Date";
            
            if (stage_of_parenting === 'parent') {
                label = "Date of Birth";
                $('#cycle-length-field').hide();
            }
            else if (stage_of_parenting === 'trying'){
                label = "Last Menstrual Period";
                $('#cycle-length-field').show();

            }
            else if (stage_of_parenting === 'pregnant'){
                label = "Due Date";
                $('#cycle-length-field').hide();
            }

            $('#date-label').text(label);
        });

        $("#profile-photo-input").change(function (){
            readURL(this);
            $('#image-preview').modal();
        });

        $("label").click(function (e) {
            if($(this).closest('.panel').find('.panel-collapse').hasClass('in')){
                e.stopPropogation();
                return false;
            }

            $('.collapse').collapse('hide');
            $(this).closest('.panel').find('.panel-collapse').collapse('toggle');
        });

      //get a response url from backend 
      $("#upload-photo").click(upload_photo);

      $('#logout').click(function(e){

          e.preventDefault();

          clevertap.event.push("Logout");
          clevertap.logout();
              
          ZP_Commons.post_details({url : '/user/logout',type:'POST'}).done(function(){
             
              try{
                window.localStorage.removeItem('member_groups');
                window.localStorage.removeItem('user_detils');  
              }
              catch(e){
                console.log(e);
              }

              window.location.href = "/";
          
          });


      });

      $('#update-details').click(function(e){

            e.preventDefault();

            var stageOfParenting = $('input:radio[name=userType]:checked');
            var date = null;
            var cycleLength = null;

            date = stageOfParenting.closest('.panel').find('input[type=date]').val();
            cycleLength = $("#cycle-length").val();
            stageOfParenting = stageOfParenting.val();
             
            updateDetails(stageOfParenting,date,cycleLength);

      });

     // update profile
      $('#save-details').click(function(e){

            e.preventDefault();

            var stageOfParenting = $('#stage-of-parenting').val();
            var cycleLength = $('#cycle-length').val();
            var firstName = $('#first-name').text();
            var date = $("#date").val();

          
            $('#first-name').removeClass('sudoinput').attr('contenteditable', 'false');
            $('#stage-of-parenting').removeClass('sudoinput').attr('contenteditable', 'false');
            $('#date').removeClass('sudoinput').attr('disabled', 'disabled');
            $('#cycle-length').removeClass('sudoinput').attr('disabled', 'disabled');
            $(this).addClass("hide");
            $("#edit-profile").show();
            
            // make the request
            
            updateDetails(stageOfParenting,date,cycleLength,firstName);

        });


 });

       
})(jQuery);
