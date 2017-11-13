  // array of channel names, updation logic for view changes
  // remove hardcoding of the groups
  // chatroom.setActiveChannel

   var Chatroom = function(group_id,active_user) {
    
    this.pusher = new Pusher(PUSER_API_KEY, 
      {
        cluster: 'ap1',
        encrypted: true,
        authEndpoint: '/chatroom/auth',
      });

      this.users = [];
      this.messages = [];
      this.active_user = active_user;
      this.group_id = group_id;
      this.load_more = true;
      this.initial_load = true;
      this.new_message_count = 0; 


      this.populateGroupInfo();
      this.retrieveHistory();
      this.recordLastActivity();

      var channel_name = 'chat_group_'+this.group_id;
      this.chatroom = this.pusher.subscribe(channel_name);

      this.chatroom.bind('pusher:subscription_succeeded',function() {
         this.retrieveHistory();
      },this);

      this.chatroom.bind('new_message',function(message){
         
         var scroll = false;

         if(jQuery("textarea").is(":focus")) {
            scroll = true;
         }
         if(message.user_id == this.active_user){
             scroll = true;
         }
         else{
          this.resetNewMessageCount();
         }

        this.render(message,true,scroll);
        
        
      },this);

 };

  //works well for multiple channels 
  Chatroom.prototype.messageExists = function(message) {
    
    var getId = function(e) { return e.id; };
    var ids = this.messages.map(getId);
    return ids.indexOf(message.id) !== -1;

  };

  Chatroom.prototype.populateGroupBanner = function() {
    
    jQuery('.group-img-banner > img').attr('src',this.group_image);
    jQuery('#group-info-name').text(this.group_name);

  };

  
  Chatroom.prototype.recordLastActivity = function() {  

    if(this.group_id !== undefined && this.group_id) {
      var group_id = this.group_id; 
      jQuery.post('/chatroom/record_last_activity', {group_id : group_id}).success(function(data){
      }).complete(function(){
          setTimeout(this.recordLastActivity.bind(this),45000);
      }.bind(this));
    }

   };


  Chatroom.prototype.populateUsers = function(){

       jQuery.get('/chatroom/list_members', {group_id: this.group_id}).success(function(response){
        
          var users = [];
          users = users.concat(response);
          this.users = users;
          this.updateUsers();
        
        }.bind(this));

  };

   Chatroom.prototype.updateUsers = function() {

    this.clearUsers();

    var user_layout = '<li id="{user_id}" class="group-member invisible-card"><div class="member-img"><img src="{user_img}" alt="" class="img-circle"></div><div class="member-info"><div class="member-title"><span>{user_name}</span></div></div></li>';
    var users = this.users;

    var user_list =  jQuery("<ul>", {id: "user-list"});

    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        var user_id = user.user_id;
        var user_name = user.user_name;
        var user_avatar = user.user_avatar;
        var user_item = '';
        
        user_item = user_layout.split('{user_id}').join(user_id);
        user_item = user_item.split('{user_img}').join(user_avatar);
        user_item = user_item.split('{user_name}').join(user_name);
        user_list.append(user_item);
   };

   jQuery('#group-participants').append(user_list);

  };

  Chatroom.prototype.resetNewMessageCount = function(){

    var scrollTop = jQuery(document).scrollTop();
    var documentHeight = jQuery(document).height();
    var windowHeight = jQuery(window).height();
    var scrollPercentage = scrollTop*100/(documentHeight-windowHeight);

    if(scrollPercentage < 98){
      //get the underlying value, increment it
      var message_count = parseInt(jQuery('#new-messages').text().trim());
      message_count = message_count + 1;
      jQuery('#new-messages').text(message_count);
      jQuery('#scroll-to-bottom').show();
      jQuery('#new-messages').show();
      // console.log("Value Incremented " + message_count);
    }


  };


  Chatroom.prototype.populateGroupInfo = function()  {
    //populate the Group Info
    
    jQuery.get('/chatroom/get_group_info', {group_id: this.group_id}).success(function(response) {
        this.group_name = response.post_title;
        this.channel_name = response.pusher_channel_name;
        this.group_description = response.post_excerpt;
        this.group_image = response.attachment_url;
        this.updateGroupInfo();

    }.bind(this));

  };



  Chatroom.prototype.updateGroupInfo = function(){
    // update the group info
    jQuery("#group-name").text(this.group_name);
    jQuery("#group-description").text(this.group_description);
    jQuery("#group-image").attr("src",this.group_image);

  };

  Chatroom.prototype.clearUsers = function(){
   jQuery("#group-participants").html("");
  };

  Chatroom.prototype.clearChatroom = function(){
    jQuery('#chat-messages').html("");
  };

  Chatroom.prototype.getChatMessages = function(direction){

    var self = this;
    var message_id = jQuery('.message').length ? jQuery('.message').first().attr('data-message-id') : 0;
    var group_id = this.group_id
    var requestSent = false;

    if(group_id)
    {
      return jQuery.ajax({
        url : '/chatroom/list_messages',
        beforeSend : function(){
          if(requestSent)
          {
            return false;
          }
          else
          {
            requestSent = true;
          }
        },
        data : {group_id: group_id,direction:direction,message_id:message_id},
        cache : false
      }).complete(function(){

        requestSent = false;

      });
    }
  };

  // this is by usual retrieve history
  Chatroom.prototype.retrieveHistory = function(){
  
    var direction = '>';
    this.getChatMessages(direction).done(function(response){
      this.clearChatroom();
      this.render(response,true,true);
    }.bind(this));  

  };

  // load_more intent
  Chatroom.prototype.loadMore = function(){

    var direction = '<';

    this.getChatMessages(direction).done(function(response){
     
       var number_of_items = response.length;

       if(number_of_items == 0 || number_of_items < 25){
        this.load_more = false;
       }
       else{
        this.load_more = true;
       }

       if(number_of_items){
         this.render(response,false,true);
       }
      
      }.bind(this));  

   };


  Chatroom.prototype.sendMessage = function(formData){

      var self = this;
      var requestSent = false;

      formData.append("group_id",self.group_id);
   
      jQuery.ajax({
        url : '/chatroom/post_message',
        data : formData,
        cache : false,
        beforeSend: function()
        { 
          if(requestSent)
          {
            return false;
          }
          else
          {
            requestSent = true;
          }
          jQuery("#ajax-loader").show(); 
        },
        contentType: false,
        processData: false,
        type : 'POST',
        complete:function()
        { 
          requestSent = false; 
          jQuery("#ajax-loader").hide();
          jQuery("#preview-image").hide(); 
        },
        success : function(data)
        { 
           
           if(data['status'] == 1)
           {
             var input = document.getElementById('message');
             input.value = "";
             clevertap.event.push("Message Sent",{'group_name' : self.group_name});
           }
           else
           {

            // unable to internationlize 
              var errors = data['errors'];
              jQuery.each(errors,function(index,error){
                toastr.error(error);
              });

           }
       
        }

      });


  };



  Chatroom.prototype.leave = function(){

    var self = this;
    var group_id = this.group_id;

    jQuery.post('/chatroom/leave',  {group_id : group_id}).done(function(data){

     clevertap.event.push('Group Left',{'group_name' : self.group_name});
     window.localStorage.removeItem('member_groups');
     toastr.success(chatRoomToasts.unjoin);
     window.location.href = "/community";
    });


  };


  Chatroom.prototype.messageAdapter = function(messages){
    
    return messages.map(function(message){
    
     var payload = message.chat_payload;
     var payload_type = message.payload_type;
     var user_name = message.user_name;
     var user_id = message.user_id;
     var avatar = message.user_avatar; 

     if(avatar === undefined || !avatar.length){
      avatar = "https://placehold.it/100X100";
     }
      
     if(payload_type == 'text'){
        payload = payload.replace(/\\'/g, '\'');
        
        var urlify =  function(text) {
            var urlRegex = /(https?:\/\/[^\s]+)/g;
            return text.replace(urlRegex, function(url) {
                return '<a id="permalink_section" target="_blank" href="' + url + '">' + url + '</a>';
            })
        };

        payload = urlify(payload); 

      }


      var message_id = parseInt(message.id);
      var time = parseInt(message.time);
      var date = new Date(time*1000);
      var date_formatted = date.toLocaleDateString();
      var time_formatted = date.toLocaleTimeString();

      var message_layout = '<li data-message-id={message_id} class="message"><div class="message-outer-box {self}"><div class="author-box"><img src="{author_img}" alt="{author} profile photo" class="img-circle author-image"></div><div class="message-box"><span class="message-author">{author}</span><span class="message-text">{message}</span><span class="message-time">{timestamp}</span></div></div><div class="clear"></li>';

      var message = '';
      message = message_layout.split('{author_img}').join(avatar);
      message = message.split('{author}').join(user_name);
      message = message.split('{message_id}').join(message_id);
      message = message.split('{message}').join(payload_type=='text'?payload:'<img class="message_image" src="'+payload+'">');
      message = message.split('{self}').join(this.active_user == user_id?'self':'');//can be done
      message = message.split('{timestamp}').join(date_formatted + ' ' + time_formatted);

      return message;

    }).join('');


  }

  //called on on subscription
  Chatroom.prototype.render = function(messages,append_to,should_scroll){

    messages = jQuery.isArray(messages) ? messages : [messages];
    
    messages.sort(function(a, b) {
      return (b.time < a.time) ? 1 : (b.time > a.time) ? -1 : 0;
    });
    
    var messages = this.messageAdapter(messages);
    var message_list = jQuery('#message-list').length ? jQuery('#message-list') : jQuery("<ul>", {id: "message-list"});
    var chat_messages = jQuery('#chat-messages');  
    var new_scroll_position = jQuery(document).height();

    if(append_to){
       // this.clearChatroom();
       message_list.append(messages);
       chat_messages.append(message_list);
       new_scroll_position = chat_messages.prop("scrollHeight");
    }else{
      var previous_message_number = jQuery('.message').length;
      message_list.prepend(messages);
      var new_message_number = jQuery('.message').length;
      var percentage = (new_message_number - previous_message_number)/new_message_number;
      new_scroll_position = (jQuery(document).height()-120)*percentage;
    }

    if(should_scroll){
      jQuery(document).scrollTop(new_scroll_position);  
    }
  
    message_list = null;
};


function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            jQuery('#img-preview').attr('src', e.target.result);
            jQuery('#preview-image').show();
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function resize_group_info_window_mobile() {
    document.getElementById("chat-group-info").style.left = '0%';
}

function close_group_info_window_mobile() {
    document.getElementById("chat-group-info").style.left = '100%';
}

function resize_group_info_window() {
    document.getElementById("chat-messages").style.width = '60%';
    document.getElementById("chat-group-info").style.width = '40%';
}

function close_group_info_window() {
    document.getElementById("chat-messages").style.width = '100%';
    document.getElementById("chat-group-info").style.width = '0%';
}

function open_group_info() {
    resize_group_info_window();
}
