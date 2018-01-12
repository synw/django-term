{% load i18n %}
const app = new Vue({
	el: '#app',
	mixins: [vvMixin],
    data () {
        return {
        	cmd: "",
        	async_cmd: false,
        	output: [],
        	lineNum: 0,
        	showInput: true,
        	history: [],
        	historyIndex: 0,
        	commandline: "",
        	pauseOutput: false,
        }
	},
	methods: {
		msg: function(msg) {
			this.print(msg)
		},
		/*print: function(msg) {
			this.output.push(msg);
			this.lineNum++;
			window.location.href = "#cmdline";
		},*/
		print: function(msg) {
			if (this.pauseOutput === false) {
				this.output.push(msg);
			} else {
				var input = this.get("command-input");
				input.focus();
				//this.pausedOutput.push(msg);
			}
			this.lineNum++;
			window.location.href = "#cmdline";
		},
		startCmd: function() {
			this.showInput = false;
		},
		dispatch: function() {
			this.startCmd();
			if (this.async_cmd === false) {
				this.cmd = this.getCmd();
			}
			if (this.cmd === "") {
				this.output.push(">");
				this.cmdEnd()
				return
			} else if (this.cmd === "clear") {
				this.output = [];
				this.cmdEnd()
			} else if (this.cmd == "reload") {
				window.location.reload();
			} else {
				this.output.push("> "+this.cmd);
				this.postCmd();
			}
			this.history.push(this.cmd);
			this.historyIndex = this.history.length-1;
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
				app.output.push("NETWORK ERROR : can not reach "+err.config.url+" using "+err.config.method+" method");
				app.cmdEnd()
			}
			function action(response) {
				if (response.data.hasOwnProperty("error") === true) {
					app.output.push("ERROR: "+response.data.error)
					app.cmdEnd()
				}
			}
			var form = this.get("cmd-form");
			var formdata = this.serializeForm(form);
			var token = formdata.csrfmiddlewaretoken;
			if (this.async_cmd === false) {
				var data = formdata;
			} else {
				var data = {"csrfmiddlewaretoken": token, "command": this.cmd};
			}
			var url = "{% url 'terminal-post' %}";
			this.postForm(url, data, action, error, token);
		},
		cmdEnd: function() {
			this.showInput = true;
			this.cmd = "";
			this.async_cmd = false;
			this.clearInput();
		},
		clearInput: function() {
			var input = this.get("command-input");
			this.commandline = "";
			input.value = "";
			input.focus();
		},
	},
});

document.onkeydown = checkKey;

function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '38') {
    	e.preventDefault();  
    	key = 0;
    	if (app.historyIndex > 0) {
    		key = app.historyIndex-1;
    	}
    	app.historyIndex = key;
    	app.commandline = app.history[key]
    } else if (e.keyCode == '40') {
    	e.preventDefault();  
    	key = app.historyIndex.length-1;
    	if (app.historyIndex < key) {
    		key = app.historyIndex+1;
    	}
    	app.historyIndex = key;
    	app.commandline = app.history[key]
    } else if (e.keyCode == '87' && e.altKey) {
    	if (app.pauseOutput) {
    		app.pauseOutput = false;
    		return
    	}
    	app.pauseOutput = true;
    } else if (e.keyCode == '67' && e.altKey) {
    	var res = prompt("Command", "help");
    	app.cmd = res;
    	app.async_cmd = true;
    	app.dispatch();
    }
}

