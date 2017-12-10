{% load terminal_tags %}
var term_callbacks = {
	"message": function(dataset) {
		// the debug variable is set via INSTANT_DEBUG = True in settings.py
		if (instantDebug === true) { console.log('EVENT: '+JSON.stringify(dataset));};
		res = unpack_data(dataset);
		var message = res['message'];
		var event_class = res['event_class'];
		var message_label = res['message_label'];
		var data = res['data'];
		var channel = res['channel'];
		if ( data.hasOwnProperty('my_field') ) {
			my_field = data['myfield'];
		}
		if (event_class === "__command_end__") {
			app.cmdEnd();
		} else {
			app.print(message);
		}
	},
	{% include "instant/js/join_events.js" %}
}
var subscription = centrifuge.subscribe("{% get_command_channel %}", term_callbacks);