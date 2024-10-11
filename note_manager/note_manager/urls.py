from django.contrib import admin
from django.urls import include, path
from notes.views import home
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),
    path('api/', include('notes.urls')),
]
