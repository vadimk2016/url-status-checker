import queue
import threading

from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from django.views.decorators.http import require_http_methods
import requests

from main.models import UrlModel


def status_check(url):
    try:
        url.status = requests.get(url.url).status_code
    except requests.exceptions.ConnectionError:
        pass


@login_required
@require_http_methods(["GET"])
def index(request):
    urls = UrlModel.objects.all()
    context = {'urls': urls}
    return render(request, 'base.html', context)


@login_required
@require_http_methods(["GET"])
def update(request):
    urls = UrlModel.objects.filter(state=True)

    def worker():
        while True:
            url_object = q.get()
            status_check(url_object)
            q.task_done()

    q = queue.Queue()
    for i in range(100):
        t = threading.Thread(target=worker)
        t.daemon = True
        t.start()

    for url in urls:
        q.put(url)

    q.join()

    UrlModel.objects.bulk_update(urls, ['status'])
    dict_obj = serializers.serialize('json', urls)
    data = {'urls': dict_obj}
    return JsonResponse(data)


@login_required
@require_http_methods(["POST"])
def state(request):
    url = UrlModel.objects.get(id=request.POST['id'])
    url.state = False if url.state else True
    url.save()
    return HttpResponse(url.state)
