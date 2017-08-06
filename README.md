# Django Terminal

In browser terminal for Django that enables custom commands

## Install

Dependencies: 

- [Django Instant](https://github.com/synw/django-instant) 
for the websockets: [install doc](http://django-instant.readthedocs.io/en/latest/src/install.html)

- [Django Introspection](https://github.com/synw/django-introspection) for the basic commands

Clone and add to installed apps:

   ```
   "introspection",
   "terminal",
   ```

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

## Commands
 
`ping`: ping the server

`inspect`: gives infos about an app or model. Params: `appname` or `appname.Modelname`: ex: `inspect auth.User`
 
## Create a command
 
 Create a `terminal` folder in any app. Create a `commands.py` file inside this directory:
 
   ```python
   from terminal.commands import Command, rprint
  
   def run_hello(request, cmd_args):
      rprint("Hello world")
    
   # Args are the command name, the runner function and the help text
   c1 = Command("hello", run_hello, "Hello world command")
   COMMANDS = [c1]
   ```
    
Your command will be detected at startup and enabled in the terminal