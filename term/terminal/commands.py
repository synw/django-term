from term.commands import Command, rprint


def thelp(request, cmd_args):
    from term.apps import ALLCMDS

    for appname in ALLCMDS:
        cmds = ALLCMDS[appname]
        for cmd in cmds:
            if cmd.name != "help":
                rprint("<em>", cmd.name, "</em>:", cmd.help)


def ping(request, cmd_args):
    rprint("PONG")


c0 = Command("help", thelp, "Terminal help")
c1 = Command("ping", ping, "Ping server")

COMMANDS = [c0, c1]
