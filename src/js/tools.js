(function($){

var SelectedDates = {};
var months_in_words = {1:'Jan',2:'Feb',3:'March',4:'Apr',5:'May',6:'Jun',7:'Jul',8:'Aug',9:'Sep',10:'Oct',11:'Nov',12:'Dec'};
var weightTrackerData = [{"id":"1","month":"0","gender":"boy","weight":"2.5 - 4.3"},{"id":"2","month":"1","gender":"boy","weight":"3.4 - 5.7"},{"id":"3","month":"2","gender":"boy","weight":"4.4 - 7.0"},{"id":"4","month":"3","gender":"boy","weight":"5.1 - 7.9"},{"id":"5","month":"4","gender":"boy","weight":"5.6 - 8.6"},{"id":"6","month":"5","gender":"boy","weight":"6.1 - 9.2"},{"id":"7","month":"6","gender":"boy","weight":"6.4 - 9.7"},{"id":"8","month":"7","gender":"boy","weight":"6.7 - 10.2"},{"id":"9","month":"8","gender":"boy","weight":"7.0 - 10.5"},{"id":"10","month":"9","gender":"boy","weight":"7.2 - 10.9"},{"id":"11","month":"10","gender":"boy","weight":"7.5 - 11.2"},{"id":"12","month":"11","gender":"boy","weight":"7.4 - 11.5"},{"id":"13","month":"12","gender":"boy","weight":"7.8 - 11.8"},{"id":"14","month":"13","gender":"boy","weight":"8.0 - 12.1"},{"id":"15","month":"14","gender":"boy","weight":"8.2 - 12.4"},{"id":"16","month":"15","gender":"boy","weight":"8.4 - 12.7"},{"id":"17","month":"16","gender":"boy","weight":"8.5 - 12.9"},{"id":"18","month":"17","gender":"boy","weight":"8.7 - 13.2"},{"id":"19","month":"18","gender":"boy","weight":"8.9 - 13.5"},{"id":"20","month":"19","gender":"boy","weight":"9.0 - 13.7"},{"id":"21","month":"20","gender":"boy","weight":"9.2 - 14.0"},{"id":"22","month":"21","gender":"boy","weight":"9.3 - 14.3"},{"id":"23","month":"22","gender":"boy","weight":"9.5 - 14.5"},{"id":"24","month":"23","gender":"boy","weight":"9.7 - 14.8"},{"id":"25","month":"24","gender":"boy","weight":"9.8 - 15.1"},{"id":"26","month":"0","gender":"girl","weight":"2.4 - 4.2"},{"id":"27","month":"1","gender":"girl","weight":"3.2 - 5.4"},{"id":"28","month":"2","gender":"girl","weight":"4.0 - 6.5"},{"id":"29","month":"3","gender":"girl","weight":"4.6 - 7.4"},{"id":"30","month":"4","gender":"girl","weight":"5.1 - 8.1"},{"id":"31","month":"5","gender":"girl","weight":"5.5 - 8.7"},{"id":"32","month":"6","gender":"girl","weight":"5.8 - 9.2"},{"id":"33","month":"7","gender":"girl","weight":"6.1 - 9.6"},{"id":"34","month":"8","gender":"girl","weight":"6.3 - 10.0"},{"id":"35","month":"9","gender":"girl","weight":"6.6 - 10.4"},{"id":"36","month":"10","gender":"girl","weight":"6.8 - 10.7"},{"id":"37","month":"11","gender":"girl","weight":"7.0 - 11.0"},{"id":"38","month":"12","gender":"girl","weight":"7.1 - 11.3"},{"id":"39","month":"13","gender":"girl","weight":"7.3 - 11.6"},{"id":"40","month":"14","gender":"girl","weight":"7.5 - 11.9"},{"id":"41","month":"15","gender":"girl","weight":"7.7 - 12.2"},{"id":"42","month":"16","gender":"girl","weight":"7.8 - 12.5"},{"id":"43","month":"17","gender":"girl","weight":"8.0 - 12.7"},{"id":"44","month":"18","gender":"girl","weight":"8.2 - 13.0"},{"id":"45","month":"19","gender":"girl","weight":"8.3 - 13.3"},{"id":"46","month":"20","gender":"girl","weight":"8.5 - 13.5"},{"id":"47","month":"21","gender":"girl","weight":"8.7 - 13.8"},{"id":"48","month":"22","gender":"girl","weight":"8.8 - 14.1"},{"id":"49","month":"23","gender":"girl","weight":"9.0 - 14.3"},{"id":"50","month":"24","gender":"girl","weight":"9.2 - 14.6"}];

var DueDateCalculator = { 
  dispDate : function(dateObj) {
    month = dateObj.getMonth()+1;
    month = (month < 10) ? "0" + month : month;

    day   = dateObj.getDate();
    day = (day < 10) ? "0" + day : day;

    year  = dateObj.getYear();
    if (year < 2000) year += 1900;

    return (month + "/" + day + "/" + year);
  },
calculateDueDate : function()  {

    var menstrual = new Date(); // creates new date objects
    var ovulation = new Date();
    var duedate = new Date();
    var today = new Date();
    var cycle = 0; // sets variables to invalid state ==> 0

    var lastmenstrualdate = $("#menstrual").val();
    var avg_length_of_cycles = $("#cycle").val();

    menstrualinput = new Date(lastmenstrualdate);
    menstrual.setTime(menstrualinput.getTime());


    cycle = (avg_length_of_cycles == "" ? 28 : avg_length_of_cycles); // defaults to 28
    
    // add validations for the date

    if(ValidationUtils.isFieldEmpty(lastmenstrualdate))
    {
      toastr.error("Please Enter a valid date");
      return false;
    }

    // validates cycle range, from 22 to 45
    if (avg_length_of_cycles != "" && (avg_length_of_cycles < 22 || avg_length_of_cycles > 45)) 
    {
      toastr.error("Your cycle length is either too short or too long for");
      return false;
    }

    ovulation.setTime(menstrual.getTime() + (cycle*86400000) - (14*86400000));

    // sets due date to ovulation date plus 266 days
    duedate.setTime(ovulation.getTime() + 266*86400000);
    $('#due-date-display span').text(DueDateCalculator.dispDate(duedate));
    return true; // form should never submit, returns false
},

calculateOvulationDate : function()  {

    var menstrual = new Date(); // creates new date objects
    var ovulation_start1 = new Date();
    var ovulation_end1 = new Date();
    var ovulation_start2 = new Date();
    var ovulation_end2 = new Date();
    var ovulation_start3 = new Date();
    var ovulation_end3 = new Date();
    var ovulation_start4 = new Date();
    var ovulation_end4 = new Date();
    var today = new Date();
    var cycle = 0; // sets variables to invalid state ==> 0

    var lastmenstrualdate = $("#menstrual").val();
    var avg_length_of_cycles = $("#cycle").val();
    var email = $("#email_signup").val();

    menstrualinput = new Date(lastmenstrualdate);
    menstrual.setTime(menstrualinput.getTime());


    cycle = (avg_length_of_cycles == "" ? 28 : avg_length_of_cycles); // defaults to 28
    
    // add validations for the date

    if(ValidationUtils.isFieldEmpty(lastmenstrualdate))
    {
      toastr.error("Please Enter a valid date");
      return false;
    }

    // validates cycle range, from 20 to 45
    if(!ValidationUtils.validateCycleLength(avg_length_of_cycles))
    {
      toastr.error("Cycle length should be in range of 20-45");
      return false;
    }

    if(typeof email !== 'undefined' && email != "")
    {
      if (!ValidationUtils.validateEmail(email)) 
      {
        toastr.error("Please Enter a valid Email");
        return false;
      }
      else
      {
        if(!ValidationUtils.validateLastMenstrualPeriod(lastmenstrualdate) ) {
          toastr.error("Enter valid last menstrual period");
          return false;
        }

        var formdata = {'email':email,'date' : lastmenstrualdate,'stage_of_parenting' :'trying','cycle_length' :avg_length_of_cycles};
        ZP_Commons.post_details({url : '/user/register',data : formdata,type:'POST'}).done(function(response){
          var message = response.message;
          if (response.success) {
            toastr.success('Successfully subscribed for trying newsletter');
          }
          else
          {
            toastr.error(message);
          }
        });
      }
     
    }

    ovulation_end1.setTime(menstrual.getTime() + (cycle*86400000) - (14*86400000));
    ovulation_start1.setTime(ovulation_end1.getTime() - (5*86400000));

    menstrual.setTime(menstrual.getTime()+(cycle*86400000));

    ovulation_end2.setTime(menstrual.getTime() + (cycle*86400000) - (14*86400000));
    ovulation_start2.setTime(ovulation_end2.getTime() - (5*86400000));

    menstrual.setTime(menstrual.getTime()+(cycle*86400000));

    ovulation_end3.setTime(menstrual.getTime() + (cycle*86400000) - (14*86400000));
    ovulation_start3.setTime(ovulation_end3.getTime() - (5*86400000));

    menstrual.setTime(menstrual.getTime()+(cycle*86400000));

    ovulation_end4.setTime(menstrual.getTime() + (cycle*86400000) - (14*86400000));
    ovulation_start4.setTime(ovulation_end4.getTime() - (5*86400000));

    $('#ovulation-date-display span').html(DueDateCalculator.dispDate(ovulation_start1)+' - '+DueDateCalculator.dispDate(ovulation_end1)+ '<br />'+ DueDateCalculator.dispDate(ovulation_start2)+' - '+DueDateCalculator.dispDate(ovulation_end2)+ '<br />'+ DueDateCalculator.dispDate(ovulation_start3)+' - '+DueDateCalculator.dispDate(ovulation_end3)+ '<br />'+ DueDateCalculator.dispDate(ovulation_start4)+' - '+DueDateCalculator.dispDate(ovulation_end4));
    return true; // form should never submit, returns false
},

reset : function()
{
  $("#menstrual").val("");
  $("#cycle").val("28");
}
};

function fetch_reminders(endpoint,formdata)
{

  return $.ajax({
    url : endpoint,
    data : formdata
  });

}


function fetch_tests(endpoint,formdata)
{

  return $.ajax({
    url : endpoint,
    data : formdata
  });

}



function populateTests()
{

  var endpoint = '/reminder/get_user_tests';



  fetch_tests(endpoint,{}).done(function(response){

    var tests_template = '<a href="{test_link}"><div class="appointment-card"><div class="appointment-date"><p>{reminder_date}</p></div><div class="appointment-title"><p>{reminder_title}</p></div></div></a>';
    var tests_div = $("<div>",{"id":"test-holder"});

    if(response.user_tests.length)
    {
      $("#tests").show();
    }

    $.each(response.user_tests,function(index,user_test){

      var week_number = user_test['current_week_number'];
      var test_title = user_test['test_title'];
      var test_description = user_test['test_excerpt'];
      var test_link = user_test['test_link'];

      var test_date = "WEEK " + week_number;
      
      var test = tests_template.replace('{reminder_date}',test_date);
      test = test.replace('{test_link}',test_link);
      test = test.replace('{reminder_title}',test_title);
      tests_div.append(test); 


    });

    $("#tests").append(tests_div);

  });


}


function populateReminders(current_month,current_year)
{

var formdata = {'current_month' : current_month,'current_year': current_year};
var endpoint = '/reminder/get_reminders' 

fetch_reminders(endpoint,formdata).done(function(response)
{


  var appointments_div = $("#appointment-holder");

  if(appointments_div.length)
  {
    appointments_div.html("");
  }
  else
  {
    appointments_div = $("<div>",{"class" : "col-xs-12","id": "appointment-holder"});
  }


  if(!response.length)
  {
     var info = $("<div>",{"class":"col-xs-12 alert alert-info text-center","text":"No appointments for the month"});
     appointments_div.append(info);
     return;
  }
  

  var appointment_template = '<a href="{reminder-link}"><div class="appointment-card"><div class="appointment-date"><p>{reminder_date}</p></div><div class="appointment-title"><p>{reminder_title}</p></div></div></a>';
  
  $.each(response,function(index,reminder){

      var reminder_id = reminder['reminder_id'];
      var reminder_time = reminder['reminder_date'];
      var reminder_title = reminder['reminder_title'];
      var reminder_description = reminder['reminder_description'];
      var day = parseInt(reminder['day']);
      var month = parseInt(reminder['month']);
      var year = parseInt(reminder['year']);
        
      var month_number = month;

      if(month < 10)
        {
          month = "0"+month;
        }
      if(day < 10)
        {
          day = "0"+day;
        }

        var date = year + "-" + month + "-" + day;
      // SelectedDates[new Date(year,month-1,day)] = new Date(year,month-1,day);

      var appointment = appointment_template.replace('{reminder_date}',day + " " + months_in_words[month_number]);
      appointment = appointment.replace('{reminder_title}',reminder_title);
      appointment = appointment.replace('{reminder-link}',"/calendar-add?date="+date+"&title="+reminder_title+"&description="+reminder_description+"&id="+reminder_id);
      appointments_div.append(appointment); 
      

    });

  $("#appointments").append(appointments_div);

                    

});


}
function calculaterashi(day,month,year,hour,minute)  {
      // globals
    d2r = Math.PI/180;
    r2d = 180/Math.PI;
    var ra,dc;  // right ascension, declination
    var pln,plt; // parallax longitude and latitude

    if(ValidationUtils.isFieldEmpty(day))
    {
      toastr.error("Please select a valid day");
      return false;
    }
    if(ValidationUtils.isFieldEmpty(month))
    {
      toastr.error("Please select a valid month");
      return false;
    }
    if(ValidationUtils.isFieldEmpty(year))
    {
      toastr.error("Please select a valid year");
      return false;
    }
    if(ValidationUtils.isFieldEmpty(hour))
    {
      toastr.error("Please select a valid hour");
      return false;
    }
    if(ValidationUtils.isFieldEmpty(minute))
    {
      toastr.error("Please select a valid minute");
      return false;
    }
    var zodiac = zodiacsignFinder(day,month,year,hour,minute);
    var rashienglishname= zodiac.split(' ')[0];
    var names = matchingletter(rashienglishname);
    var imagepath= resources.path_image;
    var rashi_template = '<div class="rashi-image"><img height="100" width="100" src="{sign}" alt="rashisign"></div><div class="rashi-description text-center" ><div class="rashi-details"> <div class="discription">{rashi}</div><div class="discription"><a href="/baby-names/{rashi_link}-rashi-baby-names" target="_blank">{rashiLinkName}</a></div> <div class="discription">'+resources.namesTitle+'</div><div class="discription">{names}</div> </div></div>';
    var rashi = rashi_template.replace('{rashi}',zodiac);
    var rashinames=rashienglishname.toLowerCase();
    rashi = rashi.replace('{rashiLinkName}',resources.rashiLinkStart+' '+zodiac+ ' '+resources.rashiLinkEnd);
    rashi = rashi.replace('{rashi_link}',rashinames);
    rashi = rashi.replace('{sign}',imagepath+rashienglishname+".png");
    rashi = rashi.replace('{names}',names);
    $('#rashi-display').append(rashi);
    return true; 
}

function zodiacsignFinder(day,month,year,hour,minute){
  d2r = Math.PI/180;
  r2d = 180/Math.PI;
  var ra,dc;  // right ascension, declination
  var pln,plt; // parallax longitude and latitude

  with(Math){
    var day = floor(parseInt(day));
    var mon = floor(parseInt(month));
    var year= floor(parseInt(year));
    var hr= floor(parseInt(hour));
    hr  += floor(parseInt(minute))/60;
    var tz= floor(document.LunarCalc.ZHour.value);
    tz += floor(document.LunarCalc.ZMin.value)/60;
    var ln= floor(77+12)/60;
    var la= floor(28+36)/60;
  }
  // checks for checked DST, East, South
  //var dst = document.LunarCalc.DST;
  var dst="DST";
  var eln = "East";
  var sla = "South";
  
  if(eln.checked)ln = -ln;
  if(sla.checked)la = -la;
  if(dst.checked){
    if(ln < 0.0)tz++;
    else tz--;
  }

  jd = mdy2julian(mon,day,year);
  if(ln < 0.0)f = hr - tz;
  else f = hr + tz;
  t = (jd - 2451545 - 0.5)/36525;
  gst = ut2gst(t,f);
  t = ((jd - 2451545) + f/24 - 0.5)/36525;
  ay = calcayan(t);

  ob = 23.452294 - 0.0130125 * t; //  Obliquity of Ecliptic
  
  // Calculate Moon longitude, latitude, and distance using truncated Chapront algorithm
  
  // Moon mean longitude
  l = (218.3164591 + 481267.88134236 * t);
  // Moon mean elongation
  d = (297.8502042 + 445267.1115168 * t); 
  // Sun's mean anomaly
  m = (357.5291092 + 35999.0502909 * t);
  // Moon's mean anomaly
  mm = (134.9634114 + 477198.8676313 * t);
  // Moon's argument of latitude
  f = (93.2720993 + 483202.0175273 * t);

  d *= d2r; m *= d2r; mm *= d2r; f *= d2r;

  e = 1 - 0.002516 * t - 0.0000074 * t * t;

  with(Math){ 
  p =   6.288774 * sin(mm) 
      + 1.274027 * sin(d*2-mm)
      + 0.658314 * sin(d*2)   
      + 0.213618 * sin(2*mm)  
      - 0.185116 * e * sin(m) 
      - 0.114332 * sin(f*2);

  p +=    0.058793 * sin(d*2 - mm * 2)
      + 0.057066 * e * sin(d*2 - m - mm)
      + 0.053322 * sin(d*2 + mm)
      + 0.045758 * e * sin(d*2 - m) 
      - 0.040923 * e * sin(m - mm) 
      - 0.034720 * sin(d)
      - 0.030383 * e * sin(m + mm);

  p +=    0.015327 * sin(d*2 - f*2)
      - 0.012528 * sin(mm + f*2)
      + 0.010980 * sin(mm - f*2)
      + 0.010675 * sin(d * 4 - mm)
      + 0.010034 * sin(3 * mm);

  p +=    0.008548 * sin(d * 4 - mm * 2)
      - 0.007888 * e * sin(d * 2 + m - mm)
      - 0.006766 * e * sin(d * 2 + m)
      - 0.005163 * sin(d - mm)
      + 0.004987 * e * sin(d + m)
      + 0.004036 * e * sin(d*2 - m + mm)
      + 0.003994 * sin(d * 2 + mm * 2);

  b =     5.128122 * sin(f)
      + 0.280602 * sin(mm+f)
      + 0.277693 * sin(mm-f)
      + 0.173237 * sin(d*2-f)
      + 0.055413 * sin(d*2-mm+f)
      + 0.046271 * sin(d*2-mm-f);

  b +=    0.032573 * sin(2*d + f)
      + 0.017198 * sin(2*mm + f)
      + 0.009266 * sin(2*d + mm - f)
      + 0.008823 * sin(2*mm - f)
      + 0.008247 * e * sin(2*d - m - f)
      + 0.004324 * sin(2*d - f - 2*mm);

  b +=    0.004200 * sin(2*d +f+mm)
      + 0.003372 * e * sin(f - m - 2 * d)
      + 0.002472 * e * sin(2*d+f-m-mm)
      + 0.002222 * e * sin(2*d + f - m)
      + 0.002072 * e * sin(2*d-f-m-mm)
      + 0.001877 * e * sin(f-m+mm);

  b +=    0.001828 * sin(4*d-f-mm)
      - 0.001803 * e * sin(f+m)
      - 0.001750 * sin(3*f)
      + 0.001570 * e * sin(mm-m-f)
      - 0.001487 * sin(f+d)
      - 0.001481 * e * sin(f+m+mm);

  
  r =   0.950724 + 0.051818  * cos(mm)
      + 0.009531 * cos(2*d - mm)
      + 0.007843 * cos(2*d)
      + 0.002824 * cos(2*mm)
      + 0.000857 * cos(2*d + mm)
      + 0.000533 * e * cos(2*d - m);

  r +=  0.000401 * e * cos(2*d-m-mm)
      + 0.000320 * e * cos(mm-m)
      - 0.000271 * cos(d)
      - 0.000264 * e * cos(m+mm)
      - 0.000198 * cos(2*f - mm)
      + 0.000173 * cos(3 * mm);

  r +=  0.000167 * cos(4*d - mm)
      - 0.000111 * e * cos(m)
      + 0.000103 * cos(4*d - 2*mm)
      - 0.000084 * cos(2*mm - 2*d)
      - 0.000083 * e * cos(2*d + m)
      + 0.000079 * cos(2*d + 2*mm)
      + 0.000072 * cos(4*d); 

  }

  l += p;
  while(l < 0.0)l += 360.0;
  while(l > 360.0)l -= 360.0;
  
  
  ecl2equ(l,b,ob);
  ln = -ln; // flip sign of longitude
  ln /= 15;
  ln += gst;
  while(ln < 0.0)ln += 24;
  while(ln > 24.0)ln -= 24;
  h = (ln - ra) * 15;
  with(Math){
    // calc observer latitude vars
    u = atan(0.996647 * tan(d2r *la));
    // hh = alt/6378140; // assume sea level
    s = 0.996647 * sin(u); // assume sealevel
    c = cos(u); // + hh * cos(d2r(la)); // cos la' -- assume sea level
    r = 1/sin(d2r * r);
    dlt = atan2(c * sin(d2r*h),r * cos(d2r * dc) - c * cos(d2r* h));
    dlt *= r2d; 
    hh = h + dlt;
    dlt /= 15;
    ra -= dlt;
    dc = atan(cos(d2r * hh) * ((r * sin(d2r * dc) - s)/
      (r * cos(d2r *dc) * cos(d2r*h) - c)) );
    dc *= r2d;
  }
  equ2ecl(ra,dc,ob);
  l += ay;
  if(l < 0.0)l += 360.0;
  var zodiac = lon2dmsz(l);
  return zodiac;
  
}

// Calculate Ayanamsa using J2000 Epoch
function calcayan(t)
{
        // globals
    d2r = Math.PI/180;
  with(Math){
    ln = 125.0445550 - 1934.1361849 * t + 0.0020762 * t * t; // Mean lunar node
    off = 280.466449 + 36000.7698231 * t + 0.00031060 * t * t; // Mean Sun  
    off = 17.23*sin(d2r * ln)+1.27*sin(d2r * off)-(5025.64+1.11*t)*t;
    off = (off- 85886.27)/3600.0;  
  }
  return off;
}

function ut2gst(t,ut)
{
  t0 = 6.697374558 + (2400.051336 * t) + (0.000025862 * t * t);
  ut *= 1.002737909;
  t0 += ut;
  while(t0 < 0.0)t0 += 24;
  while(t0 > 24.0)t0 -= 24;
  return t0;
}

function ecl2equ(ln,la,ob)
{
        // globals
    d2r = Math.PI/180;
    r2d = 180/Math.PI;
    var ra,dc;  // right ascension, declination
    var pln,plt; // parallax longitude and latitude
  with(Math){
    y = asin(sin(d2r *la ) * cos(d2r * ob ) + cos(d2r *la ) * sin(d2r *ob ) * sin(d2r * ln));
    dc = r2d * y;
    y = sin(d2r *ln ) * cos(d2r * ob) - tan(d2r * la) * sin(d2r * ob);
    x = cos(d2r * ln);
    x = atan2(y,x);
    x = r2d * x;
    if(x < 0.0)x += 360;
    ra = x/15;
  }
}

function equ2ecl(ra,dc,ob)
{
        // globals
    d2r = Math.PI/180;
    r2d = 180/Math.PI;
    var ra,dc;  // right ascension, declination
    var pln,plt; // parallax longitude and latitude
  ra *= 15;
  with(Math){
    y = sin(d2r *ra) * cos(d2r * ob) + tan(d2r *dc) * sin(d2r * ob);  
    x = cos(d2r * ra);
    x = atan2(y,x); 
    x *= r2d;
    if(x < 0)x += 360;
    pln = x;
    y = asin(sin(d2r * dc) * cos(d2r * ob) - cos(d2r * dc) * sin(d2r * ob) * sin(d2r * ra));
    pla = r2d * y;
  }
}

// build string with degrees, minutes, seconds and zodiac sign from longitude
function lon2dmsz(x)
{
    var zn = [  "Mesha / मेष",  "Vrishabha / वृषभ", "Mithun / मिथुन", "Karka / कर्क", "Simha / सिंह", "Kanya / कन्या", "Tula / तुला", "Vruschika / वृश्चिक",
  "Dhanu / धनु","Makar / मकर" , "Kumbha / कुंभ", "Meena / मीन"];
  with(Math){
    var d,m,s;
    x = abs(x);
    d = floor(x);
    z = floor(d/30);
    str =  zn[floor(z)];
  }
  return str;
}
// calculate Julian Day from Month, Day and Year
function mdy2julian(m,d,y)
{
  with(Math){
    im = 12 * (y + 4800) + m - 3;
    j = (2 * (im - floor(im/12) * 12) + 7 + 365 * im)/12;
    j = floor(j) + d + floor(im/48) - 32083;
    if(j > 2299171)j += floor(im/4800) - floor(im/1200) + 38;
    return j; 
  }
}

function matchingletter(rashi)
{
  var names = "";
  switch(rashi) {
    case "Makar":
        names = "kha, ja  (ख, ज)";
        break;
    case "Kumbha":
        names = "ga, sa, sha, Sh  (ग, स, श, ष)";
        break;
    case "Meena":
        names = "da, cha, tha, jha  (द, च, थ, झ)";
        break;
    case "Mesha":
        names = "A, L, E  (अ, ल, ई)";
        break;
    case "Vrishabha":
        names = "Ba, Va, U  (ब, व, ऊ)";
        break;
    case "Mithun":
        names = "Ka, Gha  (क, छ, घ)";
        break;
    case "Karka":
        names = "Da, Ha (ड, ह)";
        break;
    case "Simha":
        names = "Ma, Ta (म, ट)";
        break;
    case "Kanya":
        names = "Pa, Tha  (प, ठ, ण)";
        break;
    case "Tula":
        names = "Ra, ta (र, त)";
        break;
    case "Vruschika":
        names = "na, ya (न, य)";
        break;
    case "Dhanu":
        names = "bha, dha, pha, dha (भ, ध, फ, ढ)";
        break;
  }

  return names;
}

function getWeightTrackingData(gender,month){
   
  var row = weightTrackerData.filter(function(data){
    return (data.month == month) && (data.gender == gender);
  });

  return row.length > 0 ? row[0] : {};

}

function BabyWeightTracker(kg,gram,gender){
    var currentweight =kg + '.' + gram;
    var gendertext = $("label[for='" + gender + "']").text();
    var month = $("#month").val();
     if(ValidationUtils.isFieldEmpty(kg))
    {
      toastr.error("Please select a valid kg weight");
      return false;
    }
     if(ValidationUtils.isFieldEmpty(gram))
    {
      toastr.error("Please select a valid gram weight");
      return false;
    }
    if(ValidationUtils.isFieldEmpty(gender))
    {
      toastr.error("Please select a gender");
      return false;
    }
    if(ValidationUtils.isFieldEmpty(month))
    {
      toastr.error("Please select a valid month");
      return false;
    }
    
    var data = getWeightTrackingData(gender,month);
    var weight = data.weight;
    var idelweight=weight.split(/\s*\-\s*/g);
    var idealminweight= idelweight[0].replace(/ +/g, "");
    var idealmaxweight= idelweight[1].replace(/ +/g, "");
    var weighttracker_template = '<table class="table_view"><tr><td width="50%">'+weightTracker.Gender+'</td><td>{gender}</td></tr><tr><td>'+weightTracker.Age+'</td><td>{month}</td></tr><tr><td>'+weightTracker.CurrentWeight+'</td><td>{currentweight} kg</td></tr><tr><td>'+weightTracker.IdealWeight+'</td><td>{Weight} kg</td></tr></table><div class="tracker_reult" {bg_color}><div class="discription">{weight_result}</div></div>';
    var weighttracker = weighttracker_template.replace('{gender}',gendertext);
    weighttracker = weighttracker.replace('{currentweight}',currentweight);
    weighttracker = weighttracker.replace('{month}',month+' '+weightTracker.month);
    weighttracker = weighttracker.replace('{Weight}',weight);
      if (parseFloat(idealminweight) > parseFloat(currentweight) || parseFloat(idealmaxweight) < parseFloat(currentweight)) {
        if(parseFloat(idealminweight) > parseFloat(currentweight)){
            weighttracker = weighttracker.replace('{weight_result}',weightTracker.underweight);
            weighttracker = weighttracker.replace('{bg_color}','style="background:#fbb03b;"');
        }
        else{
            weighttracker = weighttracker.replace('{weight_result}',weightTracker.overweight);
            weighttracker = weighttracker.replace('{bg_color}','style="background:#d73c46;"');
        }
      }
      else {
          weighttracker = weighttracker.replace('{weight_result}',weightTracker.normalweight);
          weighttracker = weighttracker.replace('{bg_color}','style="background:#39b54a;"');
      }
      $('#BabyWeight-display').append(weighttracker);
      return true; 

  return true; 
}

$(document).ready(function(){


        populateReminders(current_month=null,current_year=null);
        populateTests();

   
        $("#back-button").click(function(){

          window.location.replace("/tools");

        });
        
       
      // Click Actions for due date

        $('#calculate-due-date').click(function(){
  
              var success = true;

              if($(this).hasClass('calculate'))
              {
                success = DueDateCalculator.calculateDueDate();

                if(success) 
                {
                  $(this).text('RECALCULATE');
                }
              }
              else if($(this).hasClass('recalculate'))
              {
                DueDateCalculator.reset();
                $(this).text('CALCULATE');
              }

              if(success)
              {
                $('.recalculate-view').toggleClass('hide');
                $('.calculate-view').toggleClass('hide');
                $(this).toggleClass('calculate');
                $(this).toggleClass('recalculate');
                $('.pregnancy-calculator-description').toggle();
              }
      });

        $('#calculate-ovulation-date').click(function(){

  
              var success = true;

              if($(this).hasClass('calculate'))
              {
                success = DueDateCalculator.calculateOvulationDate();
                 

                if(success) 
                {
                  $(this).text('RECALCULATE');
                }
              }
              else if($(this).hasClass('recalculate'))
              {
                DueDateCalculator.reset();
                $(this).text('CALCULATE');
              }

              if(success)
              {
                $('.recalculate-view').toggleClass('hide');
                $('.calculate-view').toggleClass('hide');
                $(this).toggleClass('calculate');
                $(this).toggleClass('recalculate');
                $('.pregnancy-calculator-description').toggle();
              }
      });

      $('#rashi-calculator').click(function(){
          var day = $("#day").val();
          var month = $("#month").val();
          var year = $("#year").val();
          var hour = $("#hour").val();
          var minute = $("#minute").val();
          $('#rashi-display').html("");
          var success = true;
          var submitvalue = $(this).text();
            if(submitvalue=='RECALCULATE'){
              $(this).text('CALCULATE');
              $('option').removeAttr('disabled');
              success = false;
              $('option:selected').prop("selected", false);
              $('.rashi-finder').toggleClass('hide');
            }
            else{

              success = calculaterashi(day,month,year,hour,minute);

            }
          if(success==true)
          {
            $(this).text('RECALCULATE');
            $('option:not(:selected)').attr('disabled', true);
            $('.rashi-finder').toggleClass('hide');
          }

      });

      $('#find-baby-weight').click(function(){
            var kg = $("#kg").val();
            var gram = $("#gram").val();
            var gender = $('input[name=sex]:checked').val();
            $('#BabyWeight-display').html("");
            var success = true;
            var submitvalue = $(this).text();
          if(submitvalue=='RECALCULATE'){
            $(this).text('CALCULATE');
            $('option,#name').removeAttr('disabled');
            success = false;
            $("#weight_finder").trigger('reset');
            $('.weight_tracker').toggleClass('hide');
          }
          else{

              success = BabyWeightTracker(kg,gram,gender);

          }

              if(success==true)
              {
                $(this).text('RECALCULATE');
                $('option:not(:selected),#name').attr('disabled', true);
                $('.weight_tracker').toggleClass('hide');
              }

      });

      $('#user_signup').click(function() {

        var email= $('#email').val();
        if (!ValidationUtils.validateEmail(email)) 
        {
          toastr.error("Please Enter a valid Email");
          return false;
        }
          var data = {'email':email};
          var endpoint = '/user/register';
          ZP_Commons.post_details({'data' : data ,'url' : endpoint}).then(function(response){

            var status = parseInt(response.success);
            var message = response.message;   
            var userDetails = response.userDetails;
           
            if(status){ 
              signupLoginCallback('signup',userDetails);          
            }
            else {
              toastr.error(message);
            }

          });

      });
      

    });



})(jQuery);
