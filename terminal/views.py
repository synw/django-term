import json
from django.views.generic.base import TemplateView, View
from django.http.response import Http404
from django.http import JsonResponse
from django.conf import settings
from terminal.apps import COMMANDS


def get_command(name):
    for app in COMMANDS:
        cmds = COMMANDS[app]
        for cmd in cmds:
            if cmd.name == name:
                return cmd, app
    return None, None


class TermView(TemplateView):
    template_name = 'terminal/index.html'

    def dispatch(self, request, *args, **kwargs):
        if not self.request.user.is_superuser:
            raise Http404
        return super(TermView, self).dispatch(request, *args, **kwargs)


class PostCmdView(View):

    def post(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return JsonResponse({})
        data = json.loads(self.request.body.decode('utf-8'))
        cmdline = data["command"]
        cmdname = cmdline
        cargs = []
        if " " in cmdline:
            cmdname = cmdline.split(" ")[0]
            cargs = cmdline.split(" ")[1:]
        cmd, _ = get_command(cmdname)
        if cmd is None:
            return JsonResponse({"error": "Command " + cmdname + " not found"})
        argslist = ""
        numargs = len(cargs)
        if numargs > 0:
            for arg in cargs:
                argslist = argslist + " " + arg
        if settings.DEBUG is True:
            print("=> Command", cmdname + argslist,
                  "received from remote terminal")
        err = cmd.run(request, cargs)
        if err is not None:
            return JsonResponse({"error": err})
        return JsonResponse({"ok": 1})
