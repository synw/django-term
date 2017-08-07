import logging
from django.conf import settings
from django.utils.html import strip_tags
from instant.producers import publish
from terminal.conf import COMMAND_CHANNEL


LOGGER = logging.getLogger(__name__)


class Command:

    def __init__(self, name, runfunc, thelp):
        self.name = name
        self.runfunc = runfunc
        self.help = thelp

    def runjob(self, request, job, cmd_args=[]):
        self.jobstart()
        try:
            err = self.runfunc(request, cmd_args)
            if err is not None:
                self.err(err)
                return err
            self.jobend()
            return None
        except Exception as e:
            err = str(e)
            self.err(err)
            return err
        return None

    def run(self, request, cmd_args=[]):
        try:
            err = self.runfunc(request, cmd_args)
            if err is not None:
                self.err(err)
                return err
            return None
        except Exception as e:
            err = str(e)
            self.err(err)
            return err
        return None

    def jobend(self):
        publish(self.name, event_class="__job_end__",
                channel=COMMAND_CHANNEL)

    def jobstart(self):
        publish(self.name, event_class="__job_start__",
                channel=COMMAND_CHANNEL)

    def warning(self, err):
        global LOGGER
        LOGGER.warning(err)
        publish(err, event_class="__command_warning__",
                channel=COMMAND_CHANNEL)

    def err(self, err):
        global LOGGER
        LOGGER.error(err)
        publish(err, event_class="__command_error__",
                channel=COMMAND_CHANNEL)


def rprint(*args):
    msg = ""
    for output in args:
        msg = msg + " " + str(output)
    if settings.DEBUG is True:
        print("[Remote terminal]", strip_tags(msg))
    publish(msg, event_class="__command__",
            channel=COMMAND_CHANNEL)


def jprint(*args):
    msg = ""
    print(args)
    for output in args:
        msg = msg + " " + str(output)
    if settings.DEBUG is True:
        print("[Remote job]", strip_tags(msg))
    publish(msg, event_class="__job__",
            channel=COMMAND_CHANNEL)
