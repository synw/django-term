from instant.producers import publish
from terminal.conf import COMMAND_CHANNEL
from django.conf import settings


class Command:

    def __init__(self, name, runfunc, redirect_url=None):
        self.name = name
        self.runfunc = runfunc

    def run(self, *args):
        try:
            return self.runfunc(*args)
        except Exception as e:
            return str(e)
        return None


def rprint(*args):
    msg = ""
    for output in args:
        msg = msg + " " + str(output)
    if settings.DEBUG:
        print(msg)
    publish(msg, event_class="__command__",
            channel=COMMAND_CHANNEL)


def endcmd():
    publish("COMMAND_END", event_class="__command_end__",
            channel=COMMAND_CHANNEL)
