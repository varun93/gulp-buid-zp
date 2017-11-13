var author_stat = {
  pageViews : function()
  {
    return jQuery.ajax({
            url: "/zencorner/articles/author_stat",
            type: "GET",
            cacheKey     : 'corner_pageviews',  
            localCache : true, 
            cacheTTL  : 2,
            isCacheValid : function() {
              var page_views = window.localStorage.getItem('corner_pageviews');
              if (page_views == null || page_views == undefined) {
                return false;
              }
              else true;
            }
          }).fail(function(data) 
            {
            if ( data.responseCode )
            {
              console.log( data.responseCode );
            }
        
        }).complete(function(data){

        });
  }

}

jQuery(document).ready(function(){
  author_stat.pageViews().done(function(data) {
    if (data != null) {
      var is_root = location.pathname == "/";
    if (is_root) 
    {
      jQuery('#home-pageviews').html(data.total_views+' views');
    }
    else
    {
      for(var post_views in data) 
      {
        jQuery('#'+post_views).append(data[post_views]);
      }
    }
    }
  });
});
