var terms = taxo_terms;
var enpoint = '';
var push_history_count = 0;
var cornerUtils = {
  select_tag: function(parent_id,tag_name = null)
              {
                var shown_tags = '';
                var taxonomy = '';
                if (tag_name != null) {
                  jQuery('#selected-tags').append('<span>'+tag_name+'<button type="button" onclick="cornerUtils.remove_tag('+parent_id+')" class="close">&times;</button></span>');
                }
                for (var i = 0; i < terms.length; i++) {
                  if (terms[i].parent == parent_id) {
                    shown_tags += '<span onclick="cornerUtils.select_tag('+terms[i].term_id+','+'\''+terms[i].name+'\''+')">'+terms[i].name+'</span>';
                  }
                }
                jQuery('#zencorner-tags').html(shown_tags);
                if (shown_tags == '') {
                  jQuery('button[value="future"]').show();
                  taxonomy = jQuery('#selected-tags').text();
                  jQuery('#taxonomy').val(taxonomy);
                }    
              },
  remove_tag: function(child_id)
              {
                var tag_name = '';
                var parent_id = '';
                for (var i = 0; i < terms.length; i++) {
                    if (terms[i].term_id == child_id) {
                      parent_id = terms[i].parent;
                      cornerUtils.select_tag(parent_id);
                    }
                  }
                  jQuery('#selected-tags').empty();
                  while(parent_id != 0)
                  {
                    for (var i = 0; i < terms.length; i++) {
                      if (terms[i].term_id == parent_id) {
                        tag_name = terms[i].name;
                        jQuery('#selected-tags').prepend('<span>'+tag_name+'<button type="button" onclick="cornerUtils.remove_tag('+parent_id+')" class="close">&times;</button></span>');
                        parent_id = terms[i].parent;
                        break;
                      }
                    }
                  }
                  jQuery('button[value="future"]').hide();
              },
  readURL: function(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                jQuery('#image-preview').show().attr('src', e.target.result);
               }
                reader.readAsDataURL(input.files[0]);
               }
            },
  save_draft: function() {
                tinymce.triggerSave();
                var postData = jQuery('#zencorner-form').serializeArray();
                jQuery.ajax({
                  url: '/zencorner/articles/save_draft',
                  type: 'POST',
                  data: postData,
                  dataType: 'json'
                }).done(function(data) {
                  if (data.error == false) {
                    jQuery('#post-id').val(data.post_id);
                    if (push_history_count === 0) {
                      if (typeof (window.history.pushState) != 'undefined') { window.history.pushState("","",'/zencorner/articles/edit/'+data.post_id); }
                      push_history_count++;
                    }
                  }
                }).complete(function(){
                  setTimeout(cornerUtils.save_draft,30000);
                });
  }

};

jQuery(document).ready(function(){

  cornerUtils.select_tag(0);
  setTimeout(cornerUtils.save_draft,30000);

 jQuery('#submit-btn').click(function(){
  endpoint = '/zencorner/articles/submit';
});

jQuery('#draft-btn').click(function(){
  endpoint = '/zencorner/articles/save_draft';
});

tinymce.init({
  selector: 'textarea#content',
  menubar: false,
  plugins: [
    'advlist autolink lists link image charmap print preview anchor',
    'searchreplace visualblocks code fullscreen',
     'paste'
  ],
  toolbar: 'styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
  content_css: '//www.tinymce.com/css/codepen.min.css',
  statusbar: false,
  setup: function(editor){
    editor.on('keyup',function(e){
      jQuery('#draft-btn').show();
    });
  }
});

jQuery("#zencorner-form").submit(function(event)
{
  tinymce.triggerSave();
  var postData = jQuery(this).serializeArray();
  var formURL = endpoint;

  ZP_Commons.post_details({url: formURL, data: postData, dataType: "json"}).done(function(data){
    if (data.error == false)
    {
      jQuery('#post-id').val(data.post_id);
      if (endpoint == '/zencorner/articles/submit') {
        window.location = '/zencorner/articles/submission';
      }
      else
      {
        toastr.success(data.message);
      }
    }
    else
    {
      toastr.error(data.message);
    }

  }).fail(function(){
    toastr.error('Submission failed!');
  });

  event.preventDefault(); //STOP default action
});

jQuery('#uploadImage-form').submit(function(event)
{
  var postData = new FormData(this);
  var formURL = '/zencorner/articles/upload';
  ZP_Commons.post_details({url: formURL, data: postData, contentType: false,  processData: false}).done(function(data){
    if (data.success === 1)
    {
      jQuery('#featuredImage-id').val(data.feature_image_id);
      var filename = data.filepath.substring(data.filepath.lastIndexOf('/')+1);
      filename = filename.substring(5);
      jQuery('#upload-notification').html(filename+'&#10003;').removeAttr('style');
      toastr.success('Image uploaded successfully!');
      jQuery('#uploadModal').modal('hide');
    }
    else
    {
      toastr.error(data.errors);
    }
  }).fail(function(){
    toastr.error('Upload failed!');
  });

  event.preventDefault(); //STOP default action
});

});
