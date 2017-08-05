# Django Terminal

In browser terminal for Django that enables custom commands

## Install

Dependency: [Django Instant](https://github.com/synw/django-instant) 
for the websockets: [install doc](http://django-instant.readthedocs.io/en/latest/src/install.html)

Clone and add `"terminal",` to installed apps

Set the urls

   ```python
   url('^terminal/', include('terminal.urls')),
   ```

 Go to `/terminal/`
 
 Type a command: `ping`
 
 ## Create a command
 
 Create a `terminal` folder in any app. Create a `commands.py` file inside this directory:
 
   ```python
   from terminal.commands import Command, rprint, endcmd
  
   def run_hello(cmd_args):
      rprint("Hello world")
      endcmd()
    
   # Args are the command name and the runner function
   c1 = Command("hello", run_hello)
   COMMANDS = [c1]
   ```
    
Your command will be detected at startup and enabled in the terminal