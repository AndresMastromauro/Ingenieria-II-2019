from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='app-home'),

    path('about/', views.about, name='app-about'),
    path('detail_auction/<int:pk>/', views.detail_auction, name='app-detail_auction'),
]
