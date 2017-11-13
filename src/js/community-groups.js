var is_commmunity = data.is_commmunity;
var is_user_logged_in = data.is_user_logged_in;

//This has to be modified, should take the parent selector as an input?
//pagination yet to be done
 
var Groups = (function()
{

  var generateChatTemplateFromObject = function(group,boiler_template){

      var group_id = group.post_id;
      var group_name = group.post_title;
      var group_description = group.post_excerpt;
      var group_image = group.attachment_url;
      var unread_count = group.unread_messages_count;
      var chatroom_url = group.permalink;

      var template = boiler_template.split('{group-id}').join(group_id);
      template = template.split('{chatroom_url}').join(chatroom_url);
      template = template.split('{group_image}').join(group_image);  
      template = template.split('{group_name}').join(group_name);
      template = template.split('{group_description}').join(group_description);
      template = template.split('{unread_count}').join(unread_count);  

      return jQuery(template);

  }

  var getRecommendedGroupTemplate = function(){

      var group_template = '';

      if(!is_user_logged_in)
      {
        group_template += '<a href="{chatroom_url}">'; 
      }
      
      group_template += '<div class="card group-item" data-group-link={chatroom_url}  data-group-id="{group-id}"><div class="group-img"><img src="{group_image}" alt="" class="img-circle center-block"></div><div class="group-info"><div class="group-title"><span>{group_name}</span></div><div class="group-description"><span>{group_description}</span></div></div>';

     if(is_user_logged_in)
      {
        group_template += '<div class="group-join"><span>'+communityGroupToasts.join+'</span></div>';
      }

      group_template += '<div class="clear"></div></div>';

      if(!is_user_logged_in)
      {
        group_template += "</a>";
      }

      return group_template;


  };

  var getJoinedGroupTemplate = function(){
    
    var group_template = '<a href="{chatroom_url}"><div class="card group-item"><div class="group-img"><img src="{group_image}" alt="" class="img-circle"></div><div class="group-info"><div class="group-title"><span>{group_name}</span></div><div class="group-description"><span>{group_description}</span></div></div><div class="group-meta-info"><div class="group-unread-count"><span class="badge">{unread_count}</span></div></div><div class="clear"></div></div></a>';
    return group_template;

  };

  var getExpertChatTemplate = function(){

    var expert_chat_template = '<a href="{chatroom_url}"><div class="card group-item"><div class="brand-tag" style="float: left;"><img src="https://res.cloudinary.com/dooujtlec/image/upload/v1484481135/expert_chat_icon_mkfm23.svg" style=" height: 35px;width: 30px;margin-top: -10px;margin-left: -15px;"></div><div class="group-img"><img alt="" src="{group_image}"></div><div class="group-info"><div class="group-title"><span>{group_name}</span></div><div class="group-description"><span>{group_description}</span></div></div><div class="group-meta-info"><div class="group-unread-count"><span class="badge">{unread_count}</span></div></div><div class="clear"></div></div></a>';
    return expert_chat_template;

  }

  // TODO : the below functions can be handled in a switch statement,

  var getExpertChatTemplateItem = function(group){

      var group_template = getExpertChatTemplate();
      var template_item = generateChatTemplateFromObject(group,group_template);
      return template_item;

  };

  var getJoinedGroupTemplateItem = function(group){

      var group_template = getJoinedGroupTemplate();
      var template_item = generateChatTemplateFromObject(group,group_template);
      return template_item;

  };

  var getRecommendedGroupTemplateItem = function(group){

      var group_template = getRecommendedGroupTemplate();
      var template_item = generateChatTemplateFromObject(group,group_template);
      return template_item;

  };
  
  return {

    // TODO : can be handled all in one functions

    renderCombinedGroups : function(recommended_groups,joined_groups,appendTo) {

      var group_list = jQuery("<div>");

      jQuery.each(joined_groups,function(index,group)
      {
        var item = getJoinedGroupTemplateItem(group);
        group_list.append(item);
      });

      jQuery.each(recommended_groups,function(index,group)
      {
        var item = getRecommendedGroupTemplateItem(group);
        group_list.append(item);
      });

      jQuery(appendTo+':first').append(group_list);

    },
    
    renderRecommendedGroups : function(recommended_groups,appendTo) {

    var group_list = jQuery("<div>"); 

    jQuery.each(recommended_groups,function(index,group)
    {
      
      var item = getRecommendedGroupTemplateItem(group);
      group_list.append(item);

    });

    jQuery(appendTo+':first').append(group_list);

   },

    renderExpertChatGroups : function(expert_groups,appendTo){

      var group_list = jQuery("<div>"); 

      jQuery.each(expert_groups,function(index,group)
      {
        var item = getExpertChatTemplateItem(group);
        group_list.append(item);
      });

      jQuery(appendTo+':first').append(group_list);
    
    },

    renderJoinedGroups : function(joined_groups,appendTo){
    
      var group_list = jQuery("<div>"); 

      jQuery.each(joined_groups,function(index,group){
        
        var item = getJoinedGroupTemplateItem(group);
        group_list.append(item);

      });

      jQuery(appendTo+':first').append(group_list);

    },

   fetchGroups : function(){ 

     return jQuery.ajax({
            url: "/chatroom/list_groups",
            type: "GET",
            cacheKey     : 'member_groups',  
            localCache : true, 
            cacheTTL  : 1, 
            isCacheValid : function(){  

              var member_groups = window.localStorage.getItem('member_groups');

              if(member_groups !== null && member_groups !== undefined)
              {
                 member_groups = JSON.parse(member_groups);
                 var recommended_groups = member_groups.recommended_groups;
                 var joined_groups =  member_groups.joined_groups;
                 
                 if(!recommended_groups.length && !joined_groups.length){
                  return false;
                 }

                 return true;

              }
              else
              {
                return false;
              }
            }
          }).fail(function(data) {
            if(data.responseCode){
              console.log( data.responseCode );
            }
        }).complete(function(data){

          
      });

   },

   joinGroup : function(group_id){
      var formData = {group_id : group_id};
      var requestSent = false;

      return jQuery.ajax({
      
        url : '/chatroom/join',
        data : formData,
        type : 'post',
        beforeSend : function() { 
        if(!requestSent) {
          requestSent = true;
          jQuery("#ajax-loader").show();
        }
        else{
        return false;  
      }
       
    },
  });
},

    pastExpertChat : function(){
      return jQuery.ajax({
        url: "/chatroom/getNonActiveExpertChat",
        type: "GET",
      }).done(function(data){
        Groups.renderExpertChatGroups(data,'.expert-chats');
      })
    }

  };

})();


jQuery(document).on('click','.group-join',function() {

  var group_id = jQuery(this).closest(".group-item").attr('data-group-id');
  var group_link = jQuery(this).closest(".group-item").attr('data-group-link');

  Groups.joinGroup(group_id).done(function(data){

    data = parseInt(data);

    if(data){
      clevertap.event.push('Group Joined',{'group_name' : group_link});
        
      try{
        window.localStorage.removeItem('member_groups');  
      }
      catch(e){
        ///
      }
      
      window.location.href = group_link;  
      toastr.success(communityGroupToasts.successJoin);
    }
    else{
      console.log("Failed");
    }
   
  });

});
jQuery(document).ready(function(){
  jQuery("#past-chat-btn").on('click',function(){
    jQuery(this).hide();
    Groups.pastExpertChat();
  })
})
