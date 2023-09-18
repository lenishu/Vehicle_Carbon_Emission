from django.urls import path
from . import views

urlpatterns = [
    path("", views.getData),
    path("setData/", views.setPredictedData),
]

# path("predictedData/", views.getPredictedData),
