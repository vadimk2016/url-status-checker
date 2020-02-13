var interval = 5;
var intervalId;

$(document).ready(function(){
    console.log(interval);
    startInterval();
});

function startInterval() {
  intervalId = setInterval(function() {
        $.ajax({
        url: '/update/',
        success: function (data) {
            var urls = $.parseJSON(data['urls']);
            $.each(urls, function () {
                $("#url_status_"+this['pk']).text(this['fields']['status']);
                if (this['fields']['state'] === true) {
                    $("#url_check_" + this['pk']).text('Stop');
                } else {
                    $("#url_check_" + this['pk']).text('Start');
                }
            });
        }
    })
  }, interval*1000);
}

function setCheckInterval() {
    interval = $('#interval')[0].value;
    clearInterval(intervalId);
    startInterval(interval);
    console.log(interval);
}

function switch_state(url_id) {
    $.ajax({
        url: '/state/',
        type: 'POST',
        data: {'id': url_id},
        success: function (data) {
            var element = $('#url_check_' + url_id);
            if (data === 'True') {
                element.text('Stop')
            } else {
                element.text('Start')
            }
        },
    })
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});