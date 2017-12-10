from django import template
from term.conf import COMMAND_CHANNEL

register = template.Library()


@register.simple_tag
def get_command_channel():
    return COMMAND_CHANNEL
