function UserActions(userId){

	var actions = [];
	var $ = jQuery;
	var requestSent = false;

	// some utils
	var getPageTitle =  function(){

		var title = document.title;
		title = title.substr(0,100);
		return title;
	};

	var storeActions = function(actions){

		actions = JSON.stringify(actions);
		
		try{
			window.localStorage.setItem('actions',actions);
		}
		catch(e){
			console.log(e);
		}
		
	};

	var clearActions = function(){

		try{
			window.localStorage.removeItem('actions');
		}
		catch(e){
			//failed, do something
		}

	};

	var getActions = function(){

		var actions = null;

		try{
			actions = window.localStorage.actions;
			actions = JSON.parse(actions);
		}
		catch(e){
			
		}
		
		return actions || {};
	};

	//not a pure function, the existingData input is modified
	var mergeData = function(existingData,action,key){

		var found = false;

		// can use forEach, maybe more elegant but cant break out of the loop :(
		for(var i=0;i<existingData.length;i++){
			var dataItem = existingData[i];
			if(action.data[key]  == dataItem.data[key]) {
				found = true;
				break;
			}
		}
			
		if(!found){
			existingData.push(action);
		}
	
		return existingData;
	}


	var addAction = function(action){

		// get the actions 
		var actions = getActions();
	
		// action attributes
		var actionName = action['name'];
		var existingData = actions[actionName] || [];

		// now delete the name
		delete action['name'];

		if(actionName == 'POST_LIKED' || actionName == 'POST_BOOKMARKED'){
			mergeData(existingData,action,'post_id');
		}

		if(actionName == 'GROUP_JOINED'){
			mergeData(existingData,action,'group_id');
		}
		
		if(actionName == 'USER_INTERESTS_UPDATED'){
			mergeData(existingData,action,'interests');	
		}

		// put the action back to the store
		actions[actionName] = existingData;

		//now store the action
		storeActions(actions);

	};

	var saveUserLikes = function(postId,operation){

		// unavoidable depedency on ZPCommons 
		var userLikes = ZP_Commons.getUserLikes();
		
		if(operation == '+'){
			userLikes = userLikes.concat(postId);	
		}
		if(operation == '-'){
			userLikes = userLikes.filter(function(id){
				return  postId != id;
			});
		}
		
		userLikes = JSON.stringify(userLikes);

		try{
			window.localStorage.setItem('likes',userLikes);
		}
		catch(e){
			//handle it if needed 
		}

	};

	var promptLogin = function(){
		$("#subscribePopup").modal('toggle');
	};


	this.login = function(){

		var options = {};

		//validations
		//use toastr

		$.post(options).then(function(response){

			// clear any caches, //group members
			// clevertap sync and events
			// event signup complete
			//

		});
		
	}



	this.replay = function(){
		

		var actions = getActions();
		var promises = [];

		for(actionName in actions){

			var options = actions[actionName];

			options.forEach(function(option){
				promises.push($.post(option));
			});
				
		}

		return $.when.apply($, promises).then(function(response){
				return response;
			}.bind(this)).fail(function(err){
					//how to handle this
			}).always(function(){
				//clear all the actions
				clearActions();
			});

	};


	this.joinGroup = function(groupId){
				
		return $.Deferred(function(deferred){

			try{
				clevertap.event.push("Group Joined",{title : getPageTitle()});
			}
			catch(e){
				// handle exception  
			}

			var options = {name: "GROUP_JOINED",url : "/chatroom/join",data : {group_id : groupId}};

			if(userId){			
				$.post(options).then(function(response){
					  // remove the cached groups
			          try{
			           window.localStorage.member_groups && window.localStorage.removeItem('member_groups');  
			          }
			          catch(e){
			            ///
			          }
			          //refresh the page
			          window.location.reload();
					  
					  deferred.resolve(response);
				
				});
			}else{
				addAction(options);		
				deferred.reject({notLoggedIn : true});
				promptLogin();
			}	

		}).promise();

	};

	this.updateUserInterests = function(interests){

		return $.Deferred(function(deferred){

			// store the action
			try{
				clevertap.event.push('Interests Updated',{interests : interests});
			}
			catch(e){
				//
			}

			var options = {name : 'USER_INTERESTS_UPDATED',url : '/api/updateUserInterests', data : {interests : interests }};

			if(userId){
				
				options = $.extend(options,{
					beforeSend : function(){ 
						if(!requestSent){
        					requestSent = true;
					        $("#ajax-loader").show();
      					}
      					else{
					        return false;  
      					}
       				}

				});
				$.post(options).then(function(response){
					requestSent = false;
					deferred.resolve(response);
				});
			}
			else{
				// not the best way to do but works 
				addAction(options);
				deferred.reject({notLoggedIn : true});
				var intent = 'signup';
				setModalActiveTab(intent);
			}

		}).promise();

		
	};


	this.likePost = function(postId,operation){

			if(operation == '+'){

				try{
					clevertap.event.push('Post Liked',{post_id : postId,title : getPageTitle()});	
					ga('send', 'event', 'Post Liked', getPageTitle());
				}
				catch(e){
					//handle the exception
				}

			}

			var options = {data : {post_id : postId,operation : operation},url : '/blog/likePost'};

			$.post(options).then(function(response){
				saveUserLikes(postId,operation);
			});

	};

	
 	this.bookmarkPost = function(postId){

		return $.Deferred(function(deferred){

			// record the clevertap event

			try{
				clevertap.event.push('Post Bookmarked',{post_id : postId,title : getPageTitle()});	
				ga('send', 'event', 'Post Bookmarked', getPageTitle());
			}
			catch(e){
				// handle the exception
			}

			var options = {name : 'POST_BOOKMARKED',data : {post_id : postId},url : '/api/bookmarkPost' };
			
			if(userId){
				$.post(options).then(function(response){
					deferred.resolve(response);
				});
			}
			else{
				addAction(options);
				$('#user-interest').modal('toggle');
				deferred.reject({notLoggedIn : true});
				promptLogin();
			}


		}).promise();
		
	};

	// always triggered by a logged in user
	this.unbookmarkPost = function(postId,element){

		var options = {data : {post_id : postId},url : '/api/unbookmarkPost'};

		return $.post(options).then(function(response){
			return response;
		});
	
	};

	//when the user tries to create a new zencorner post
	this.createZencornerPost = function(url){
		
		if(userId){
			window.location.href = url;
		}
		else{
			promptLogin();
		}

	};

};