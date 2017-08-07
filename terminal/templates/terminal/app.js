{% load i18n %}
const app = new Vue({
	el: '#app',
	mixins: [vvMixin],
    data () {
        return {
        	cmd: "",
        	input: document.getElementById("command-input"),
        	output: [],
        	lineNum: 0,
        	showInput: true,
        	history: [],
        	historyIndex: 0,
        	commandline: "",
        	viewMode: false,
        	pauseOutput: false,
        	pausedOutput: [],
        }
	},
	methods: {
		print: function(msg) {
			if (this.pauseOutput === false) {
				this.output.push(msg);
			} else {
				this.input.focus();
				//this.pausedOutput.push(msg);
			}
			this.lineNum++;
			window.location.href = "#cmdline";
		},
		msg: function(cmd, mclass) {
			var msg = "";
			if (mclass === "jobstart") {
				msg = "Start working on job "+cmd
			} else if (mclass === "jobend") {
				msg = '[ <span class="succes">Ok</span> ] Job "'+cmd+'" is finished'
			} else if (mclass === "warning") {
				msg = '[ <span class="warning">Warning</span> ] from command '+cmd
			} else if (mclass === "error") {
				msg = '[ <span class="error">Error</span> ] from command '+cmd
			}
			this.output.push(msg);
		},
		dispatch: function() {
			this.cmd = this.getCmd();
			this.runner(false);
		},
		dispatchJob: function() {
			this.runner(this.cmd);
		},
		runner: function(jobcmd) {
			var cmd = this.cmd;
			debug(cmd);
			
			if (cmd === "") {
				this.output.push(">");
				this.cmdEnd();
				return
			} 
			this.showInput = false;
			if (cmd === "clear") {
				this.output = [];
				this.cmdEnd();
				return
			} else if (cmd === "reload") {
				window.location.reload();
			} else if (cmd === "chart") {
				this.chartCmd();
			} else {
				isjob = false;
				if (cmd.startsWith("job ")) {
					isjob = true;
				}
				this.output.push("> "+cmd);
				this.postCmd(jobcmd);
			}
			this.history.push(cmd);
			this.historyIndex = this.history.length-1;
			this.lineNum++;
			this.cmdEnd();
		},
		getCmd: function() {
			var form = this.get("cmd-form");
			var data = this.serializeForm(form);
			return data.command;
		},
		postCmd: function(jobcmd) {
			function error(err) {
				app.msg("HTTP ERROR: can not post data<br />"+err, "error");
				app.cmdEnd();
			}
			function action(response) {
				if (response.data.hasOwnProperty("error") === true) {
					app.msg("ERROR: "+response.data.error, "error");
					app.cmdEnd();
				}
			}
			var form = this.get("cmd-form");
			var data = {};
			var data = this.serializeForm(form);
			data["isjob"] = false;
			if (jobcmd !== false) {
				data.command = jobcmd;
				data.isjob = true;
			}
			var url = "{% url 'terminal-post' %}";
			var token = data.csrfmiddlewaretoken;
			debug(this.str(data));
			this.postForm(url, data, action, error, token);
		},
		cmdEnd: function() {
			this.showInput = true;
			this.clearInput();
			this.input.focus();
		},
		clearInput: function() {
			this.cmd = "";
			this.commandline = "";
			this.input.value = "";
		},
		chartCmd: function() {
			var ifrm = this.get("viewer");
			var url = "{% url 'allmodels-rest-chart' %}";
			this.viewMode = true;
	        ifrm.setAttribute("src", url);
		},
		view: function(url) {
			var h = document.body.scrollHeight;
		},
	},
});

function debug(msg) {
	app.output.push("[ Debug ] "+msg);
}

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
    	app.dispatchJob();
    }
}

