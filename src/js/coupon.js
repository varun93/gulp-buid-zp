(function($){

    // keep user email, user phone, first name keep it global

    function make_payment()
    {

        var formdata = {};

        var coupon_type =  $('#payment-modes').attr('data-coupon-type');
        var coupon_id = $('#payment-modes').attr('data-coupon-id');
        var coupon_code = $('#payment-modes').attr('data-coupon-code');

        var phone_number = $('.'+coupon_type+'-coupon-user-details #phone_number').val();  
        var first_name = $('.'+coupon_type+'-coupon-user-details #first_name').val();
        var user_email = $('.'+coupon_type+'-coupon-user-details #user_email').val();

        var payment_mode = $(this).hasClass('online-payment-continue') ? 'instamojo' : $(this).hasClass('phone-payment-continue') ? 'ipayy' : 'free';
        
        if(ValidationUtils.isFieldEmpty(first_name)) 
        {
            toastr.error(couponCheckoutToasts.firstNameCannotEmpty);
            return false;
        }
        if(ValidationUtils.isFieldEmpty(user_email) || !ValidationUtils.validateEmail(user_email)) 
        {
            toastr.error(couponCheckoutToasts.couponEnterValidMail);
            return false;
        }
        if(ValidationUtils.isFieldEmpty(phone_number) || !ValidationUtils.validatePhoneNumber(phone_number)) 
        {
            toastr.error(couponCheckoutToasts.invalidPhone);
            return false;
        }
      
        formdata['payment_mode'] = payment_mode;
        formdata['coupon_id'] = coupon_id;
        formdata['coupon_code'] = coupon_code;
        formdata['coupon_type'] = coupon_type;
        // User Details
        formdata['first_name'] = first_name;
        formdata['user_email'] = user_email;
        formdata['phone_number'] = phone_number;

        if(coupon_type == 'service')
        {
            formdata['coupon_type'] = 'service';
        }
        else
        {
           
            var last_name = $('#last_name').val();
            var street_address = $('#street_address').val();
            var house_number = $('#house_number').val();
            var state = $('#state').val();
            var city = $('#city').val();
            var pincode = '';

            if(ValidationUtils.isFieldEmpty(house_number) && ValidationUtils.isFieldEmpty(street_address)) 
            {
                toastr.error(couponCheckoutToasts.address);
                return false;
            }

            formdata['coupon_type'] = 'product';
            formdata['last_name'] = last_name;
            formdata['street_address'] = street_address;
            formdata['house_number'] = house_number;
            formdata['state'] = state;
            formdata['city'] = city;

        }

        clevertap.event.push("Payment Made",{"mode" : payment_mode,"coupon_id" : coupon_id,"coupon_code" : coupon_code});

        ZP_Commons.post_details({url : '/coupon/make_payment',data : formdata,type:'POST'}).done(function(response){
            
        var status = parseInt(response.status);
        var message = response.message;
        var redirect_url = response.redirect_url;
           
        if(status)
        {
            clevertap.event.push("Coupon Charged",{"Payment mode" : payment_mode,"Charged ID" : coupon_code +"|"+coupon_id});
            window.location.replace(redirect_url); 
        }   
        else
        {
            toastr.error(message);
        }

        });
    

    }

    $(document).ready(function($){

        $("button.checkout-btn").click(function(){

            var collapsible_div = $(this).next();
            var id = collapsible_div.attr('data-payment-mode');
            
            $('.payment-toggle').not('#' + id).each(function(){

                   if($(this).hasClass('in'))
                   {
                        $(this).collapse('hide');
                   }
                
            });

            var coupon_type = collapsible_div.closest("#payment-modes").attr("data-coupon-type")
            var user_details_class =  "." + coupon_type + "-coupon-user-details";
            var user_details = $(user_details_class);
                

            if(!collapsible_div.children(user_details_class).length){
                collapsible_div.prepend(user_details);
            }

            collapsible_div.find(user_details_class).removeClass('hide');
            collapsible_div.collapse('toggle');

        });

        $('button.continue').on('click',make_payment);

       
});


})(jQuery);

    