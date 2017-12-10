from django.conf.urls import url
from term.views import TermView, PostCmdView


urlpatterns = [
    url(r'^post/$', PostCmdView.as_view(), name="terminal-post"),
    url(r'^', TermView.as_view(), name="terminal-index")
]
