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
		/*print: function(msg) {
			if (this.pauseOutput === false) {
				this.output.push(msg);
			} else {
				this.input.focus();
				//this.pausedOutput.push(msg);
			}
			this.lineNum++;
			window.location.href = "#cmdline";
		},*/
		msg: function(cmd, mclass) {
			var msg = cmd;
			if (mclass === "jobstart") {
				msg = "Start working on job "+cmd
			} else if (mclass === "jobend") {
				msg = '[ <span class="success">Ok</span> ] Job "'+cmd+'" is finished'
			} else if (mclass === "warning") {
				msg = '[ <span class="warning">Warning</span> ] '+cmd
			} else if (mclass === "error") {
				msg = '[ <span class="error">Error</span> ] '+cmd
			} else if (mclass === "debug") {
				msg = '[ <span class="debug">Debug</span> ] '+cmd
			}
			this.scrollDown();
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
				this.msg("BYE, reloading ...", "success")
				window.location.reload();
				return
			} else if (cmd === "chart") {
				this.chartCmd();
			} else {
				jobcmd = false;
				if (cmd.startsWith("job ")) {
					jobcmd = cmd;
				}
				this.output.push("> "+cmd);
				this.postCmd(jobcmd);
			}
			this.history.push(cmd);
			this.historyIndex = this.history.length-1;
			this.lineNum++;
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
					app.msg(response.data.error, "error");
					//app.cmdEnd();
				}
			}
			var form = this.get("cmd-form");
			var data = {};
			var data = this.serializeForm(form);
			data["jobid"] = "";
			if (jobcmd !== false) {
				data.command = jobcmd;
				data.jobid = getId();
			}
			var url = "{% url 'terminal-post' %}";
			var token = data.csrfmiddlewaretoken;
			this.postForm(url, data, action, error, token);
		},
		cmdEnd: function() {
			this.scrollDown();
			this.clearInput();
			this.showInput = true;
			this.input.focus();
		},
		scrollDown: function() {
			window.scrollTo(0,document.body.scrollHeight);
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
		debug: function(msg) {
			app.msg(msg, "debug");
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
    	app.dispatchJob();
    }
}

function getId () { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

