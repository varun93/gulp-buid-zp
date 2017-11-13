var page_type = data.page_type; 
var user_details = data.user_details || {};
var is_user_logged_in = data.is_user_logged_in; 
var is_dataSynced = window.sessionStorage.getItem('data_sync');

if(is_user_logged_in && ValidationUtils.isFieldEmpty(is_dataSynced)){
      
    try{

        var user_id = user_details.id;
        var first_name = user_details.first_name;
        var user_email =  user_details.user_email;
        var stage_of_parenting = user_details.stage_of_parenting;
        var date_of_birth = user_details.dob;
        var due_date = user_details.due_date;
        var language_preference = user_details.language_preference;
        var signup_completion_level = 'one';
      

        if(!ValidationUtils.isFieldEmpty(stage_of_parenting) && (!ValidationUtils.isFieldEmpty(date_of_birth) || !ValidationUtils.isFieldEmpty(due_date))){
          signup_completion_level = 'done'; 
        }

        if(!ValidationUtils.isFieldEmpty(user_id) && !ValidationUtils.isFieldEmpty(first_name) && !ValidationUtils.isFieldEmpty(user_email)) {

           var user_data = { "Site": {
             "Identity": user_id,
             "Name": first_name,      
             "Email" : user_email,
             "StageOfParenting" : stage_of_parenting,
             "DateOfBirth" : date_of_birth,
             "DueDate" : due_date,
             "LanguagePreference" : language_preference,
             "SignupCompletionLevel" : signup_completion_level,
             "MSG-email": true,
             "MSG-push": true
             }
            };

          clevertap.profile.push(user_data);
    
    }
   
     window.sessionStorage.setItem('data_sync','1'); 

    } 
    catch(e){
      //console.log(e);
    }

}

//record the page view event


try{

    var referrer = document.referrer;
    var current_page = window.location.pathname.substr(0,100);
    var source = "";

    if(referrer.trim().length) {

      try {
        referrer =  new URL(referrer);
        referrer = referrer.pathname;
      }
      catch(err) {
        referrer = document.referrer;
      }

   }
   else {
    referrer = 'direct';
   }

   var fb_campaign = ZP_Commons.getUrlParameter("S");
   
   if(fb_campaign !== undefined && fb_campaign.length) {
      source = fb_campaign;
   } 

   referrer = referrer.substr(0,100);
   clevertap.event.push("Page Viewed Event",{'page_viewed' : current_page,'referrer' : referrer,'source' : source});

}
catch(e){
  console.log(e);
}

