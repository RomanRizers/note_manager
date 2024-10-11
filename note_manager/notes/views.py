from rest_framework import generics
from .models import Note
from .serializers import NoteSerializer
from django.shortcuts import render

def home(request):
    return render(request, 'note/index.html')

class NoteListCreate(generics.ListCreateAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

class NoteDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
