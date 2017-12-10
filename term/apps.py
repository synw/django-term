import importlib
from django.apps import AppConfig

ALLCMDS = {}


def loadcmds(modname):
    try:
        path = modname + ".terminal." + "commands"
        mod = importlib.import_module(path)
        cmds = getattr(mod, "COMMANDS")
        return cmds
    except ImportError:
        pass
    except Exception as e:
        raise(e)


class TermConfig(AppConfig):
    name = 'term'
    verbose_name = "Terminal"

    def ready(self):
        global ALLCMDS
        from django.conf import settings
        apps = settings.INSTALLED_APPS
        cmds = {}
        for app in apps:
            res = loadcmds(app)
            if res is not None:
                cmds[app] = res
        ALLCMDS = cmds
