# Django Terminal

In browser terminal for Django that enables custom commands

## Install

Dependency: [Django Instant](https://github.com/synw/django-instant) 
for the websockets: [install doc](http://django-instant.readthedocs.io/en/latest/src/install.html)

Clone and add `"terminal",` to installed apps

Set the urls

   ```python
   from instant.views import instant_auth
   
   urlpatterns = [
      url('^terminal/', include('terminal.urls')),
      url('^instant/', include('instant.urls')),
      url('^centrifuge/auth/$', instant_auth, name='instant-auth'),
   ]
   ```

Create a `templates/instant/extra_clients.js` whith this content:

   ```django
   {% if user.is_superuser and request.path|slice:'9' == "/terminal" %}
      {% include "terminal/client.js" %}
   {% endif %}
   ```

Run the websockets server and go to `/terminal/`
 
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