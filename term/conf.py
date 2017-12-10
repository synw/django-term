from django.conf import settings


SITE_SLUG = getattr(settings, "SITE_SLUG")
COMMAND_CHANNEL = getattr(
    settings, "TERM_COMMAND_CHANNEL", "$" + SITE_SLUG + "_terminal")
