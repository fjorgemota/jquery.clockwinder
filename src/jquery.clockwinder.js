(function($) {
  $.fn.clockwinder = function(opts) {
    var options = $.extend({
      postfix:decodeURIComponent('atr%C3%A1s'),
      interval:1000,
      alwaysRelative:false,
      attr:'datetime'
    }, opts);
  
    var elements = $(this).selector;
	$(elements).live("clockwinder.update",function(){
		$.clockwinder.update(this,options)
	});
    setInterval(function() {
      $(elements).trigger("clockwinder.update");
    }, options.interval);
  	$(elements).trigger("clockwinder.update");
    return this;
  }

  $.clockwinder = {
    update:function(elements, options) {
      $(elements).each(function() {
        var newTime = $.clockwinder.compute($(this).data(options.attr), options);
        if(!newTime){
			return false;
		}
        if (options.displayFunction) {
          options.displayFunction.call(this, newTime, options);
        } else {
          $(this).text(newTime, options);
        }
        
        $(this).trigger('clockwinder.updated');
      });
    },
  
    compute:function(then, opts) {
		
      var options = opts || {};
      var today = new Date();
if(!then){
			return false;
		}
      distance_in_milliseconds = today - then;
      distance_in_minutes = Math.round(Math.abs(distance_in_milliseconds / 60000));

      if (distance_in_minutes < 1440 || options.alwaysRelative){
       return $.clockwinder.time_ago_in_words(then) + (options.postfix ? ' ' + options.postfix : '');
      }

      then = new Date(then);

      var hour = parseInt(then.getHours());
      var minutes = then.getMinutes() + '';
      var ampm = hour < 12 ? 'am' : 'pm';

      if (hour > 12) { hour = hour - 12; }
      if (hour == 0) { hour = 12; }

      if (minutes.length == 1) { minutes = '0' + minutes; }

      var time = hour + ':' + minutes + ' ' + ampm;

      if (distance_in_minutes > 1440 && distance_in_minutes < 2160) {
        return 'ontem às ' + time;
      }

      var year = then.getFullYear().substr(2);
      var month = then.getMonth() + 1;
      var day = then.getDate() + '';

      if (day.length == 1) { day = '0' + day };

      return [month, day, year].join('/') + ' at ' + time;
    },
  
    time_ago_in_words:function(from) {
     return $.clockwinder.distance_of_time_in_words(new Date().getTime(), from) 
    },

    distance_of_time_in_words:function(to, from) {
      seconds_ago = Math.floor((to  - from) / 1000);
      minutes_ago = Math.floor(seconds_ago / 60)

      if(minutes_ago == 0) { return seconds_ago + " segundos";}
      if(minutes_ago == 1) { return "um minuto";}
      if(minutes_ago < 45) { return minutes_ago + " minutos";}
      if(minutes_ago < 90) { return "uma hora";}
      hours_ago  = Math.round(minutes_ago / 60);
      if(minutes_ago < 1440) { return hours_ago + " horas";}
      if(minutes_ago < 2880) { return "um dia";}
      days_ago  = Math.round(minutes_ago / 1440);
      if(minutes_ago < 43200) { return days_ago + " dias";}
      if(minutes_ago < 86400) { return "um mês";}
      months_ago  = Math.round(minutes_ago / 43200);
      if(minutes_ago < 525960) { return months_ago + " meses";}
      if(minutes_ago < 1051920) { return "um ano";}
      years_ago  = Math.round(minutes_ago / 525960);
      return years_ago + " anos" 
    }
  }
})(jQuery);