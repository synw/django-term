import importlib
from django.apps import AppConfig

ALLCMDS = {}


def loadcmds(modname, debug_model=None):
    try:
        path = modname + ".terminal." + "commands"
        mod = importlib.import_module(path)
        cmds = getattr(mod, "COMMANDS")
        return cmds
    except ImportError as e:
        if debug_model is not None:
            if modname == debug_model:
                raise(e)
    except Exception as e:
        raise(e)


class TermConfig(AppConfig):
    name = 'term'
    verbose_name = "Terminal"

    def ready(self):
        global ALLCMDS
        from django.conf import settings
        from .conf import DEBUG_MODEL
        apps = settings.INSTALLED_APPS
        cmds = {}
        cmds_str = ""
        for app in apps:
            res = loadcmds(app, DEBUG_MODEL)
            if res is not None:
                cmds_str += "# " + app + ":\n"
                cmds[app] = res
                for cmd in res:
                    cmds_str += "- " + cmd.name + "\n"
        ALLCMDS = cmds
        if settings.INSTANT_DEBUG == True:
            print("Django Term found commands:")
            print(cmds_str)
