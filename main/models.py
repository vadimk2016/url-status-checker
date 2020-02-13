from django.db import models


class UrlModel(models.Model):
    url = models.URLField()
    status = models.SmallIntegerField(default=404, editable=False)
    state = models.BooleanField(default=True, editable=False)

    def __str__(self):
        return self.url
