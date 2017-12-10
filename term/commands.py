from goerr import err
from django.conf import settings
from django.utils.html import strip_tags
from instant.producers import publish
from term.conf import COMMAND_CHANNEL


class Command:

    def __init__(self, name, runfunc, thelp):
        self.name = name
        self.runfunc = runfunc
        self.help = thelp

    def run(self, request, cmd_args=[]):
        try:
            self.runfunc(request, cmd_args)
            self.end()
            return
        except Exception as e:
            exc = str(e)
            if err.exists:
                err.new(Command.run, "Can not run command")
            cmderr(exc)

    def end(self):
        publish("COMMAND_END", event_class="__command_end__",
                channel=COMMAND_CHANNEL)

    def __repr__(self):
        return "<Term command: %s>" % self.name


def cmderr(exc):
    publish(exc, event_class="__command_error__",
            channel=COMMAND_CHANNEL)
    if err.exists:
        err.report()


def rprint(*args):
    msg = ""
    for output in args:
        msg = msg + " " + str(output)
    if settings.DEBUG is True:
        print("[Remote terminal]", strip_tags(msg))
    try:
        publish(msg, event_class="__command__",
                channel=COMMAND_CHANNEL)
    except Exception as e:
        err.new(e, rprint, "Can not publish message for remote print")
        err.throw()
