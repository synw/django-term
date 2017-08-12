from django.conf import settings
from django.utils.html import strip_tags
from instant.producers import publish
from terminal.conf import COMMAND_CHANNEL


class Command:

    def __init__(self, name, runfunc, thelp):
        self.name = name
        self.runfunc = runfunc
        self.help = thelp

    def run(self, request, cmd_args=[]):
        try:
            err = self.runfunc(request, cmd_args)
            self.end()
            return err
        except Exception as e:
            err = str(e)
            cmderr(err)
            return err
        return None

    def end(self):
        publish("COMMAND_END", event_class="__command_end__",
                channel=COMMAND_CHANNEL)


def cmderr(err):
    publish(err, event_class="__command_error__",
            channel=COMMAND_CHANNEL)
    if settings.DEBUG is True:
        print(err)


def rprint(*args):
    msg = ""
    for output in args:
        msg = msg + " " + str(output)
    if settings.DEBUG is True:
        print("[Remote terminal]", strip_tags(msg))
    publish(msg, event_class="__command__",
            channel=COMMAND_CHANNEL)
