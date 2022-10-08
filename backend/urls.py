from re import template
from django.contrib import admin
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views
from backend import views
from django.views.generic import TemplateView

urlpatterns = [
    path('test/',views.locationList.as_view()),
    path('test/<str:pk>', views.hospitalDetail.as_view()),
    path('test/<str:lon>/<str:lat>', views.searchEmergency.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
