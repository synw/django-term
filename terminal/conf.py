from django.conf import settings
import importlib

COMMANDS = {}


def loadcmds(modname):
    try:
        path = modname + ".terminal." + "commands"
        mod = importlib.import_module(path)
        cmds = getattr(mod, "COMMANDS")
        return cmds
    except ImportError:
        pass


def set_commands(self):
    global COMMANDS
    from django.conf import settings
    apps = settings.INSTALLED_APPS
    cmds = {}
    for app in apps:
        #print("APP --------------------", app)
        res = loadcmds(app)
        if res is not None:
            cmds[app] = res
    print(cmds)
    COMMANDS = cmds
    print("CMDS", COMMANDS)


SITE_SLUG = getattr(settings, "SITE_SLUG")
COMMAND_CHANNEL = getattr(
    settings, "TERM_COMMAND_CHANNEL", "$" + SITE_SLUG + "_command")
COMMANDS = {}
