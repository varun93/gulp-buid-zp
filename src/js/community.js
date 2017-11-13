jQuery(document).ready(function($){ 
  
    // Put this under groups
    Groups.fetchGroups().done(function(data) {

      var recommended_groups = data.recommended_groups;
      var joined_groups = data.joined_groups;
      var expert_chats =  data.expert_chats;

      if(expert_chats.length)
      {
        Groups.renderExpertChatGroups(expert_chats,'#community .expert-chats');
      }

      if(recommended_groups.length){
        Groups.renderRecommendedGroups(recommended_groups,'#community .recommended-groups');
      }

       if(joined_groups.length){
         Groups.renderJoinedGroups(joined_groups,'#community .subscribed-groups');
       }
     
      });

});
