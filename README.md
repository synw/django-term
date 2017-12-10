# Django Term

In browser terminal for Django that enables custom commands

## Install

Dependency: [Django Instant](https://github.com/synw/django-instant) 
for the websockets: [install doc](http://django-instant.readthedocs.io/en/latest/src/install.html)

   ```
   pip install django-term
   ```

Add `"term",` to installed apps:

Set the urls

   ```python
   from instant.views import instant_auth
   
   urlpatterns = [
      url('^terminal/', include('term.urls')),
      url('^instant/', include('instant.urls')),
      url('^centrifuge/auth/$', instant_auth, name='instant-auth'),
   ]
   ```

Add to settings.py:

   ```python
   SITE_SLUG = "mysite"
   INSTANT_SUPERUSER_CHANNELS = ("$" + SITE_SLUG + "_terminal",)
   ```


Create a `templates/instant/extra_clients.js` whith this content:

   ```django
   {% if user.is_superuser and request.path|slice:'9' == "/terminal" %}
      {% include "term/client.js" %}
   {% endif %}
   ```

Run the websockets server and go to `/terminal/`

## Commands

Note: to use the commands from third-party apps your must have these apps installed

`help`: display info about the available commands
 
`ping`: ping the server

From [Django Introspection](https://github.com/synw/django-introspection):

`inspect`: gives infos about an app or model. Params: `appname` or `appname.Modelname`: ex: `inspect auth.User`

From [Django Dex](https://github.com/synw/django-dex):

`replicatedb`: replicates the 'default' db into a sqlite 'replica' db
 
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

### Apps that have terminal commands:

[django-introspection](https://github.com/synw/django-introspection): get infos about Django objects

[django-dex](https://github.com/synw/django-dex): database export tools

[django-jobrunner](https://github.com/synw/django-jobrunner): experimental asynchronous jobs runner

## Customize the ui

To customize the colors use the `terminal/colors.css` template

## Screenshot

![Terminal](https://github.com/synw/django-terminal/blob/master/docs/img/screenshot.png)
