import importlib
from django.apps import AppConfig

COMMANDS = {}


def loadcmds(modname):
    try:
        path = modname + ".terminal." + "commands"
        mod = importlib.import_module(path)
        cmds = getattr(mod, "COMMANDS")
        return cmds
    except ImportError:
        pass


class TerminalConfig(AppConfig):
    name = 'terminal'
    verbose_name = "Terminal"

    def ready(self):
        global COMMANDS
        from django.conf import settings
        apps = settings.INSTALLED_APPS
        cmds = {}
        for app in apps:
            #print("APP --------------------", app)
            res = loadcmds(app)
            if res is not None:
                cmds[app] = res
        COMMANDS = cmds
