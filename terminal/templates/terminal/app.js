{% load i18n %}
const app = new Vue({
	el: '#app',
	mixins: [vvMixin],
    data () {
        return {
        	cmd: "",
        	output: [],
        	lineNum: 0,
        	showInput: true,
        }
	},
	methods: {
		print: function(msg) {
			this.output.push(msg);
			this.lineNum++;
			window.location.href = "#cmdline";
		},
		startCmd: function() {
			this.showInput = false;
		},
		dispatch: function() {
			this.startCmd();
			this.cmd = this.getCmd();
			if (this.cmd === "") {
				this.output.push(">");
				return
			} else if (this.cmd === "clear") {
				this.output = [];
			} else if (this.cmd == "reload") {
				window.location.reload();
			} else {
				this.output.push("> "+this.cmd);
				this.postCmd();
			}
			this.clearInput();
			this.lineNum++;
		},
		getCmd: function() {
			var form = this.get("cmd-form");
			var data = this.serializeForm(form);
			return data.command;
		},
		postCmd: function() {
			function error(err) {
				app.output.push("NETWORK ERROR", err)
			}
			function action(response) {
				if (response.data.hasOwnProperty("error") === true) {
					app.output.push("ERROR: "+response.data.error)
					app.cmdEnd()
				}
			}
			var form = this.get("cmd-form");
			var data = this.serializeForm(form);
			var url = "{% url 'terminal-post' %}";
			var token = data.csrfmiddlewaretoken;
			this.postForm(url, data, action, error, token);
		},
		cmdEnd: function() {
			this.showInput = true;
			this.clearInput();
		},
		clearInput: function() {
			var input = this.get("command-input");
			this.cmd = "";
			input.value = "";
			input.focus();
		},
	},
});
