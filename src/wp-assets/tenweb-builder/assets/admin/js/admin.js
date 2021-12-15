jQuery(document).ready(function () {
  function templates_page() {
    jQuery(document).on('change', function (e) {
      if (jQuery(e.target).attr('id') !== "elementor-new-template__form__template-type") {
        return true;
      }
      if (e.target.value == "twbb_single") {
        jQuery('#twbb-post-type-form-field').show();
      }
      else {
        jQuery('#twbb-post-type-form-field').hide();
      }
    });
  }

  jQuery(document).on("click", "#delete_site", function() {
    var conf = confirm("Are you sure to delete all imported website date.");
    if( !conf ) {
      return;
    }
    jQuery.ajax({
      type: "POST",
      dataType: "json",
      url: twbb_admin.ajax_url,
      data: { 'action' : 'remove_template_ajax' },
      beforeSend: function (xhr) {
        jQuery(".delete_site.spinner").css("visibility","visible");
      }
    }).success(function (data) {
      jQuery(".delete_site.spinner").css("visibility","hidden");
      if( jQuery.trim(data) ) {
        var failmsg = '';
        if( typeof data.message != "string" ) {
          jQuery.each(data.message, function (index, value) {
            failmsg += '<p>' + value + '</p>';
          });
        } else {
          failmsg = '<p>' + data.message + '</p>';
        }

        var message = '<div id="message" class="notice notice-'+data.status+'">'+failmsg+'</div>';
        jQuery(message).insertBefore("#elementor-template-library-tabs-wrapper");
      }
    }).fail(function (xhr, status, error) {
        jQuery(".delete_site.spinner").css("visibility","hidden");
        var errorMessage = xhr.status + ': ' + xhr.statusText;
        var message = '<div id="message" class="notice notice-error"><p>'+errorMessage+'</p></div>';
        jQuery(message).insertBefore("#elementor-template-library-tabs-wrapper");
    });
  });
});
