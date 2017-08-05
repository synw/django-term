from terminal.commands import Command, rprint, endcmd
from django.conf import settings


def show(cmd_args):
    if len(cmd_args) == 0:
        return "Not enough arguments: ex: show apps"
    if cmd_args[0] == "apps":
        return show_apps()
    if cmd_args[0] == "app":
        return show_app(cmd_args)
    a = "arguments"
    if len(cmd_args) == 1:
        a = "argument"
    argslist = " ".join(cmd_args)
    err = "Unknown " + a + " " + argslist
    endcmd()
    return err


def show_app(cmd_args):
    if len(cmd_args) != 2:
        return "Two arguments are required: ex: show app auth"
    appname = cmd_args[1]
    rprint(appname)
    endcmd()
    return None


def show_apps():
    apps = settings.INSTALLED_APPS
    rprint("Found", len(apps), "apps")
    for app in apps:
        rprint(app)
    endcmd()
    return None


def ping(cmd_args):
    rprint("PONG")
    endcmd()


c1 = Command("show", show)
c2 = Command("ping", ping)

COMMANDS = [c1, c2]
