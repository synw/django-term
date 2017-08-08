from django.contrib.auth.models import User
from terminal.commands import rprint


def run():
    for user in User.objects.all():
        rprint(user.username)