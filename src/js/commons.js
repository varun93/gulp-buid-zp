var page_type = data.page_type; 
var is_user_logged_in = data.is_user_logged_in;
var user_id = parseInt(data.user_id);
var post_id = data.post_id;
var userActions = new UserActions(user_id);
var $ = jQuery;

//validation                      
var ValidationUtils = (function(){

  return {

    isFieldEmpty : function(value){
      return (value === null || value === undefined || value.length === 0 || !value);
    },

    validateEmail : function(email){
        var email_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        if (email_regex.test(email)) {
          return true;
        }

        return false;

    },

    validatePassword : function(password)
    {
        return true;
    },

    validatePhoneNumber : function(phone_number)
    {

      var phoneno_regex = /^\d{10}$/;  
      phone_number = phone_number.trim();
      return phone_number.match(phoneno_regex);

    },

    validateDueDate : function(due_date)
    {
        
        var eod = new Date(due_date);
        var current_time = Date.now();
        var timeDiff = current_time - eod.getTime();
        var day_Diff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (timeDiff < 0 && day_Diff > -280) 
        {
           return true;
        }

        return false;

    },
    validateLastMenstrualPeriod : function(date)
    {
       var date = new Date(date);
       var current_time = Date.now();
        if (date.getTime() < current_time) 
        {
          var timeDiff = current_time - date.getTime();
          var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
           if(diffDays<=45)
           {
              return true;
           }
           return false;
        }
        return false;
    },

    validateTestDate : function(test_date)
    {
       var test_date = new Date(test_date);
       var current_time = Date.now();
       var timeDiff = current_time - test_date.getTime();
       return timeDiff <= 0;

    },

    validateDateOfBirth : function(dob)
    {
       var dob = new Date(dob);
       var current_time = Date.now();
       var timeDiff = current_time - dob.getTime();
       return timeDiff >= 0;
    },
    confirmPassword : function(pass_a,pass_b)
    {

        if(pass_a && pass_a === pass_b)
        {
          return true;
        }
        return false;
    },
    validateCycleLength : function(cycle_length)
    {
      if (cycle_length == "" || cycle_length < 20 || cycle_length > 45) 
      {
        return false;
      }
      return true;
    }


  };


})();

var ZP_Commons = {

  post_details : function(options)
  {
  var requestSent = false;

   options = jQuery.extend({
    url : '',
    data : {},
    beforeSend : function()
    { 
      if(!requestSent)
      {
        requestSent = true;
        jQuery("#ajax-loader").show();
      }
      else
      {
        return false;  
      }
       
    },
    type : 'POST'

  },options);

   return jQuery.ajax(options).fail(function(data) {

         if(data.responseCode){
            console.log(data.responseCode);
          }
      
      }).complete(function(){

        requestSent = false;
        jQuery("#ajax-loader").hide();

      });

  },

  slugify : function(Text){
    return Text
        .toLowerCase()
        .replace(/ /g,'-')
        .replace(/[^\w-]+/g,'');
  },

  userDetails : function(){
      return {loggedIn : is_user_logged_in, userId : user_id};
  },

  getLocation : function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
  },

  getUrlParameter : function(sParam)
  {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : sParameterName[1];
      }
    }
  },

  getCookie : function (name) 
  {
    
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();

  },
  // create Cookie
  createCookie  :  function(name,value, days)
  {
    var expires = "";
    if (days) 
    {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } 
   
    document.cookie = name + "=" + value + expires + "; path=/";

  },

  get_query_arg : function(purl, key){
      if(purl.indexOf(key+'=')>-1){
          
          var regexS = "[?&]"+key + "=.+";
          var regex = new RegExp(regexS);
          var regtest = regex.exec(purl);
          
          if(regtest != null){
              var splitterS = regtest[0];
              if(splitterS.indexOf('&')>-1){
                  var aux = splitterS.split('&');
                  splitterS = aux[0];
              }
          
              var splitter = splitterS.split('=');
              return splitter[1];

          }
          //$('.zoombox').eq
      }
    },

    add_query_arg  : function(url, param, value) {
       param = encodeURIComponent(param);
       var r = "([&?]|&amp;)" + param + "\\b(?:=(?:[^&#]*))*";
       var a = document.createElement('a');
       var regex = new RegExp(r);
       var str = param + (value ? "=" + encodeURIComponent(value) : ""); 
       a.href = url;
       var q = a.search.replace(regex, "$1"+str);
       if (q === a.search) {
          a.search += (a.search ? "&" : "") + str;
       } else {
          a.search = q;
       }
       return a.href;
  },

  clearGroupsCache : function(){
      
      try {
        window.localStorage.removeItem('member_groups');
      }
      catch(e){
        // console.log(e);
      }
 },

  update_user_preferences : function() {
    var language = ZP_Commons.getCookie('lang');

    jQuery.ajax({
        url : "/blog/record_user_preference",
        method : "POST",
        data : {"language" : language,"user_id" : user_id, "post_id":post_id}
      });

  },

  record_ga_event : function(event_category,event_action,event_label){
    ga('send', 'event', event_category,event_action, event_label);
  },

  isProfileComplete : function(userDetails){

    var stageOfParenting = userDetails.stage_of_parenting;
    return !ValidationUtils.isFieldEmpty(stageOfParenting);

  },

  redirectionUrl : function(userDetails){

    var isProfileComplete = this.isProfileComplete(userDetails);

    var redirectionUrl = '';

    if(!isProfileComplete){
      redirectionUrl = '/signup-final-stage';
    }
    else{

        var pathnameParts = window.location.pathname.split('/');
        
        // currently harcoded to zencorner, has to be extended to other cases too 
        if(pathnameParts.length > 0){
         if(pathnameParts[1] == "zencorner"){
           redirectionUrl = "/zencorner/articles/create";
         }
      }

    }

    return redirectionUrl;


  },


  getUserInterests : function(){

      return jQuery.ajax({
            url: "/user/interests",
            type: "GET",
            cacheKey    : 'user_interests',  
            localCache : true, 
            cacheTTL  : 1, 
        });
    },

  getUserLikes : function(){

    var likes = [];

    try{
      
        likes = window.localStorage.likes;

        if(likes == undefined){
          likes = [];
        }
        else{
          likes = JSON.parse(likes);
        } 
    }
    catch(e){
      //handle it if needed
    }
      
    return likes; 
  
  },


  resetSubscribePopupFlag : function(){

    try{
      window.sessionStorage.subscribePopupShown = 0;
    }
    catch(e){

    }

  },

  clevertapSyncUserProfile : function(userDetails){

      userDetails = userDetails || {};

      try {
        
        //
        var user_id = userDetails.id;
        var first_name = userDetails.first_name || '';
        var user_email =  userDetails.user_email || '';
        var stage_of_parenting = userDetails.stage_of_parenting || '';
        var date_of_birth = userDetails.dob || '';
        var due_date = userDetails.due_date || '';
        var language_preference = userDetails.language_preference || '';
        var signup_completion_level = 'done';

        var userData = { "Site": {
           Identity: user_id,
           Name: first_name,      
           Email : user_email,
           StageOfParenting : stage_of_parenting,
           DateOfBirth : date_of_birth,
           DueDate : due_date,
           LanguagePreference : language_preference,
           SignupCompletionLevel : signup_completion_level,
           "MSG-email" :  true,
           "MSG-push" : true
           }
          };

          clevertap.profile.push(userData);
          window.localStorage.setItem('user_details',JSON.stringify(userDetails));

      } catch(e) {
        // statements
        console.log(e);
      }
      
}

};
// end of utils


//userAuth variable
var FormValidation = {

  validateUserUpdateDetails : function(email, stage_of_parenting, date, cycle_length,intent) {

   if(intent=="signup" && (ValidationUtils.isFieldEmpty(email) || !ValidationUtils.validateEmail(email))) {
        toastr.error("Please enter a valid email address");
        return false;
    }

    if(ValidationUtils.isFieldEmpty(stage_of_parenting)) {
        toastr.error("Please choose Stage Of Parenting");
        return false;
    }

    if(stage_of_parenting == 'parent' && (ValidationUtils.isFieldEmpty(date) || !ValidationUtils.validateDateOfBirth(date))) {     
          toastr.error("Enter valid child birthday date");
          return false;
    }
    else if(stage_of_parenting == "trying") {
      if(ValidationUtils.isFieldEmpty(cycle_length) || !ValidationUtils.validateCycleLength(cycle_length)) {
          toastr.error("Cycle length should be in range of 27-32");
          return false;
      }           
      if(ValidationUtils.isFieldEmpty(date) || !ValidationUtils.validateLastMenstrualPeriod(date) ) {
        toastr.error("Enter valid last menstrual period");
        return false;
      }                     
    }
    else if (stage_of_parenting == 'pregnant') {      
      if ( ValidationUtils.isFieldEmpty(date) || !ValidationUtils.validateDueDate(date)) {
        toastr.error("Enter valid due date");
        return false;
      }
      
    }
    return true;

  },

  validateLoginForm : function(email,password){

    if(ValidationUtils.isFieldEmpty(email) || !ValidationUtils.validateEmail(email)) {
        toastr.error("Please enter a valid email address");
        return false;
    }
    
    if(ValidationUtils.isFieldEmpty(password)) {
        toastr.error("Password field cannot be empty");
        return false;
    }

    return true;
  
  }

};
//end of userAuth


jQuery(document).ready(function($) {

 if (is_user_logged_in && post_id != 0) {
  ZP_Commons.update_user_preferences();
 }

 // ========================= SVG DESKTOP ICONS =============================
 $('img.svg').each(function() {
      var $img = $(this);
      var imgID = $img.attr('id');
      var imgClass = $img.attr('class');
      var imgURL = $img.attr('src');

      $.get(imgURL, function(data) {
          // Get the SVG tag, ignore the rest
          var $svg = $(data).find('svg');

          // Add replaced image's ID to the new SVG
          if (typeof imgID !== 'undefined') {
              $svg = $svg.attr('id', imgID);
          }
          // Add replaced image's classes to the new SVG
          if (typeof imgClass !== 'undefined') {
              $svg = $svg.attr('class', imgClass + ' replaced-svg');
          }

          // Remove any invalid XML tags as per http://validator.w3.org
          $svg = $svg.removeAttr('xmlns:a');

          // Replace image with new SVG
          $img.replaceWith($svg);

      }, 'xml');

});
// end of icons


//============================ LANGUAGE CHANGE =================================
$('#language-change li > a').click(function(){

  var language = '';

  if($(this).hasClass("english")){
    language = "English";
  }
  if($(this).hasClass("hindi")){
    language = "Hindi";
  }

  ZP_Commons.createCookie('lang',language,365);

  if(is_user_logged_in){
        ZP_Commons.update_user_preferences();
        // update user properties
        clevertap.profile.push({
         "Site": {
           "Identity": user_id, 
           "LanguagePreference" : language
        }
      });

  }

  ZP_Commons.clearGroupsCache();
  window.location.reload();

});

//================================== END OF LANGUAGE CHANGE =================================

});

// set the active tab
function setModalActiveTab(intent){

      var $ = jQuery;
      var selector = $('#Login');
      
      switch(intent){

        case 'signup' : 
          selector = $('#Registration');
          break;

        case 'forgot-password' : 
          selector = $('#Forgot');
          break;

        case 'update-interests' : 
          selector = $("#UserInterests");
          break;

      }

      //set everything to inactive
      $("#user-modals").find(".tab-pane").each(function(){
          $(this).removeClass("active");
      });

      // set the active interests screen
      selector.addClass("active");

};


function signupLoginCallback(intent,userDetails){

    var userId = userDetails.id;
    var message = '';

    switch(intent){
      case 'login' : 
        message = 'Successfully Logged In';
        clevertap.event.push('User Logged In');
        break;
      case 'signup':
        message = 'Successfully Registered!';
        clevertap.event.push('Signup Completed');
      break;   
    }

    ZP_Commons.resetSubscribePopupFlag();
    //clear group cache
    ZP_Commons.clearGroupsCache();
    //analytics events fired
    ZP_Commons.record_ga_event('Popup Subscription','Popup Subscription','_url_'+window.location.href);
    //clevertap profile sync action
    ZP_Commons.clevertapSyncUserProfile(userDetails);
    // user actions
    userActions.replay().then(function(){

    var redirectionUrl = ZP_Commons.redirectionUrl(userDetails);

    toastr.success(message);
        // set redirection 
    if(redirectionUrl.length){
      window.location.href = redirectionUrl;
    }
    else{
      window.location.reload();
    }
  });
}


// 
jQuery(document).ready(function($){

// ================================== FORM SUBMITS ========================================== 
  
//=================================== LOGIN ACTION ==========================================

 $('#login-form').submit(function(e){

    e.preventDefault();

    var email =  $('#login_email').val();
    var password = $('#login_password').val();
    
    var isFormValid = FormValidation.validateLoginForm(email,password);

    if(!isFormValid){
      return;
    }

    var data = {'username' : email,'password' : password};
    var endpoint = '/user/login';

    // End of ajax call
    ZP_Commons.post_details({'data' : data ,'url' : endpoint}).then(function(response){

        var status = parseInt(response.success);
        var message = response.message; 
        var userId = response.user_id;   
        var userDetails = response.userDetails;
       
        if(status){ 
          signupLoginCallback('login',userDetails);          
        }
        else {
          toastr.error(message);
        }

    });

});
//======================== END OF LOGIN ACTIONS ===================================

//======================== SIGNUP ACTION ==========================================

$('#Registration-form').submit(function(e){

    e.preventDefault();

    allFormData = this.elements;

    var email =  allFormData['parent_email'].value;
    var date = allFormData['popup_date'].value;
    var stage_of_parenting = allFormData['stage_of_parenting'].value;
    var cycle_length = allFormData['cycle_length'].value;

    var validationStatus = FormValidation.validateUserUpdateDetails(email, stage_of_parenting, date, cycle_length,"signup");

    if (!validationStatus) {
      return;
    }

    var data = {'email' : email,'date' : date,'stage_of_parenting' : stage_of_parenting, 'cycle_length' : cycle_length};     
    var endpoint = '/user/register';

    // End of ajax call
    ZP_Commons.post_details({'data' : data ,'url' : endpoint}).then(function(response){

        var status = parseInt(response.success);
        var message = response.message; 
        var userId = response.user_id;   
        var userDetails = response.userDetails;
       
        if(status){ 
          signupLoginCallback('signup',userDetails);          
        }
        else {
          toastr.error(message);
        }

    });
  
});
//============================== END OF signup =============================== 


//======================= FORGOT PASSWORD ====================================
$('#forgotPassword').submit(function(e){

    e.preventDefault();

    var email =  $('#user_email').val();
    var forgotPassword = $('#forgot-password').val();
    if(ValidationUtils.isFieldEmpty(email) || !ValidationUtils.validateEmail(email)) {
        toastr.error("Please enter a valid email address");
        return false;
    }

    var data = {'user_email' : email,'forgot-password': forgotPassword};
    var endpoint = '/user/forgot_password';
    // End of ajax call
    ZP_Commons.post_details({'data' : data ,'url' : endpoint}).done(function(response){

        var status = parseInt(response.status);
        var message = response.message;
        if(status==1){
              toastr.success(message);
              $("#subscribePopup").modal('toggle');
              $('.modal-backdrop').removeClass('fade in').addClass( "fade out" );
          } else{
            toastr.error(message);
          }

    });
  

});
//================ END OF FORGOT PASSWORD =====================

// =============== END OF FORM SUBMITS ===================================

});

// =============== New commons JS  ============================
$(document).ready(function($){

  // header related
  var searchHeader = $(".header-search");
  $(".search span").click(function(){
    var $this = $(this); 
    searchHeader.toggleClass("hide");
    $this.toggleClass('glyphicon-search');
    $this.toggleClass('glyphicon-remove');

  });

  var secondaryHeaderYOffset = $('.secondary-header').offset().top;
  var header = $('#header');
  // scroll events
  $(document).scroll(function(){
    var scrollTop  = $(window).scrollTop();
    if(scrollTop > secondaryHeaderYOffset){
      header.addClass('collapsed');
    }
    else{
      header.removeClass('collapsed');
    }

  });
  // end of header related

});

// ======== end of commons

//============================= POPUP RELATED SCRIPTS =======================================
jQuery(document).ready(function($){


      var userLikes = ZP_Commons.getUserLikes();

      // POPULATING LIKES
      var currentPageId = (function(){
          var re = /postid-(\d+)/;
          var bodyClasses = $("body").attr("class");
          if(re.test(bodyClasses)){
            var matchedParts = re.exec(bodyClasses);
            return matchedParts[1];  
          }
          return 0;
        })();

        // for single article
        if(!ValidationUtils.isFieldEmpty(currentPageId)){

          if(userLikes.indexOf(currentPageId) !== -1){
            $('#share-bar .like-section').addClass('liked');
          }

        }


      // mark the default state
      $('.article-list .card-item').each(function(){

        var $this = $(this);
        var postId = $this.data('post-id');

        if(userLikes.indexOf(postId) !== -1){
          $this.find('.like-section').addClass('liked');
        }

      });
  
   //========================= CLICK LISTENERRS ======================================

      $('.stage_of_parenting').click(function(){

          var stage_of_parenting = $(this).val();
          $('#register_date').removeClass("hide");
          if (stage_of_parenting === 'parent'){ 
              $("input#popup_date").attr("placeholder", "Child's Birthday");
              $('#menstrual_length').addClass("hide");
          }
          else if (stage_of_parenting === 'pregnant'){
              $('#menstrual_length').addClass("hide");
              $("input#popup_date").attr("placeholder", "Due Date");
          }
          else if (stage_of_parenting === 'trying') {
              $('#menstrual_length').removeClass("hide");
              $("input#popup_date").attr("placeholder", "Last Menstrual Period");
          }
        });

        // global login button
        $('.Login').click(function(){
              var intent = 'login';
              setModalActiveTab(intent);
        });

        // get user interests click action
        $('#add-user-interests').click(function(){

              var intent = 'update-interests';
              setModalActiveTab(intent);
              $("#subscribePopup").modal('toggle');

          });


      // Like Click Action
      $('.like-section').click(function(){

          var $this = $(this);
          var postId = $this.closest('.card').data('post-id') || currentPageId;
          var liked = $this.hasClass('liked') ? true : false;
          var likesCountDom = $this.find('.likes-count');
          var likeIcon = $this.find('.like-icon');
          var likesCount =  parseInt(likesCountDom.text());
          var operation = '+';

          if(liked){
            likesCount && --likesCount;
            operation = '-';
          }
          else{
            ++likesCount;
          }

          userActions.likePost(postId,operation);
          likesCountDom.text(likesCount);
          $this.toggleClass('liked');

      });
    //End of like action


    // coupon click actions
    $(".coupon-item").click(function(event) {
      event.preventDefault();
      clevertap.event.push("Coupon Clicked",{'logged_in' : is_user_logged_in});
      var coupon_link = $(this).attr('href');
      window.location.href = coupon_link;

    });


    $("#buy-coupon").click(function(){

      clevertap.event.push("Coupon Buy Action");
      var link = $(this).attr("href");
      window.location.replace(link);
      return false;
    
    });

    // end of coupon click actions

    $('#btn-zencorner-scheme').click(function(e){
        var $collapsible = $('#zencorner-scheme');
        if(!$collapsible.hasClass('clicked')){
          $collapsible.addClass('clicked');
          ZP_Commons.record_ga_event('Links','ZencornerSchemeClick');
        }

      });

    $('#corner-btn').click(function(e){
        e.preventDefault();
        var $this = $(this);
        var link = $this.attr("href");
        userActions.createZencornerPost('/zencorner/articles/create');
    });

    // interest buttons
    $(".interest").click(function() {
        var $this = $(this);
        var interest_slug = $this.attr('data-term');
        $this.toggleClass("selected-interest");
        $('[data-slug="'+interest_slug+'"]').toggleClass("unselected-interest");    
    });

    // listener for saving user interess
    $("#save-interest").click(function() {
  
        var userInterests = $(".selected-interest").map(function() {
            return $(this).data("term");
        });
  
        if(userInterests.length < 3){
          toastr.error("Please select atleast three interests");
          return;
        } 
        else{

            userInterests = userInterests.get().join();
            // this id has to be generated dynamically
            userActions.updateUserInterests(userInterests).then(function(response){
              if(response.success && response.data){
                var interests = response.data.interests;
                interests = (interests && interests.length && $.isArray(interests)) ? interests : [];
                
                try{
                    var user_details = JSON.parse(window.localStorage.user_details);
                    user_details['interests'] = interests;
                    window.localStorage.setItem('user_details',JSON.stringify(user_details));
                }
                catch(e){
                  // 
                }
                window.location.reload();
              }

            });
        }   
    });    

  });
  //end of document ready


//=================== POPUP RELATED SCRIPTS END =================================== 


// ================= Populate Card Articles Like and like Action =================

  jQuery(document).ready(function($) {

  // ========================= AUTOMATIC TRIGGER SIGNUP POPUP ===============================================
  
  var path = '';

     try{
       path = ZP_Commons.getLocation(window.location.href).pathname;
     }
     catch(e){
      //handle it
     }

    if(path.indexOf('dear-swine-flu-stay-away-from-my-kids') === -1 && page_type != 'chatroom' && page_type != 'login' && page_type != 'quiz'){

        setTimeout(function(){


            var user_details = {};
            var showPopup = false;
            var intent = 'signup';
            var popupShown = false;

            try{
              popupShown = parseInt(window.sessionStorage.subscribePopupShown);
            }
            catch(e){

            }

            try{
              var userDetails = window.localStorage.getItem('user_details');
              if(userDetails){
                userDetails = JSON.parse(userDetails);   
              }
             
            }
            catch(e){
              console.log(e);
            }

            if(is_user_logged_in){

              var userInterests =  (userDetails && userDetails.interests && $.isArray(userDetails.interests)) ? userDetails.interests : [];

              if(userInterests.length == 0){
                intent = 'update-interests';
                showPopup = true;
              }

            }
            else{

              if(ValidationUtils.isFieldEmpty(userDetails)) {
                showPopup = true;
              }

            }

            if(popupShown){
                showPopup = false;
              }

           if(showPopup){
              
              setModalActiveTab(intent);

              $('#subscribePopup').modal('show');

              try{
                window.sessionStorage.subscribePopupShown = 1;
              }
              catch(e){

              }
              
           }
           
      
      },10000);

    }

   // ========= END OF AUTOMATIC POPUP TRIGGER ====================
  
});
// end of document ready
//  
