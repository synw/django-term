{% load terminal_tags %}
var term_callbacks = {
	"message": function(dataset) {
		if (instantDebug === true) { console.log('EVENT: '+JSON.stringify(dataset));};
		res = unpack_data(dataset);
		var message = res['message'];
		var event_class = res['event_class'];
		var message_label = res['message_label'];
		var data = res['data'];
		var channel = res['channel'];
		if (event_class === "__job_start__") {
			app.msg(message, 'jobstart');
		} else if (event_class === "__job_end__") {
			app.msg(message, "jobend");
			this.cmdEnd();
		} else if (event_class === "__command_warning__") {
			app.msg(message, "warning");
		} else if (event_class === "__command_error__") {
			app.msg(message, "error");
		} 
		app.print(message);
	},
	{% include "instant/js/join_events.js" %}
}
var dexsubscription = centrifuge.subscribe("{% get_command_channel %}", term_callbacks);