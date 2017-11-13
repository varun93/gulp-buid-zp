$(document).ready(function(argument) {
    
     if(homepage_data.is_user_logged_in && (homepage_data.stage_of_parenting == 'trying')) {
      jQuery("#circular-progress-bar").tryingProgressBar({
            fertile_start: homepage_data.fertile_start,
            fertile_end: homepage_data.fertile_end,
            current_location: homepage_data.current_location,
            days_left: homepage_data.days_left,
            next_period: homepage_data.next_period,
            next_fertile_window: homepage_data.next_fertile_window,
            day_in_cycle: homepage_data.day_in_cycle
        });
    }    

});
   