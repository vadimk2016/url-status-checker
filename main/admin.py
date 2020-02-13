from django.contrib import admin
from main.models import UrlModel


class UrlModelAdmin(admin.ModelAdmin):
    model = UrlModel


admin.site.register(UrlModel, UrlModelAdmin)
