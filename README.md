# Note Manager — Веб-приложение на Django

Приложение для создания, просмотра, редактирования и удаления заметок.

## Описание проекта

Это учебное веб-приложение на Django с использованием Django REST Framework для работы с заметками через API. Интерфейс предоставляет возможности для создания новых заметок, редактирования существующих, а также удаления заметок.

## Стек технологий

- Python 3.11
- Django 5.1.2
- Django REST Framework 3.15.2
- SQLite (встроенная база данных)

## Основные возможности

- Создание, просмотр, редактирование и удаление заметок
- REST API для работы с заметками
- Простое управление через веб-интерфейс
- Статическая подача контента

## Этапы создания
## Шаг 1: Настройка проекта Django

1. Создадим и активируем виртуальное окружение:
```
python -m venv venv
.\env\Scripts\activate.bat
```
2. Установим Django и Django REST Framework:
```
pip install django djangorestframework
```
3. Создадим новый проект Django:
```
django-admin startproject note_manager
cd note_manager
```
4. Создадим новое приложение для заметок
```
python manage.py startapp notes
```
5. Добавим приложение и REST Framework в файл settings.py
```
INSTALLED_APPS = [
    ...,
    'rest_framework',
    'notes',
]
```

## Шаг 2: Создание модели заметки

1. Откроем файл notes/models.py и создадим модель Note:
```
from django.db import models

class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
```
2. Создадим миграции и применим их:
```
python manage.py makemigrations
python manage.py migrate
```

## Шаг 3: Создание сериализатора для заметок

Сериализатор в Django REST Framework используется для преобразования данных между сложными типами (например, объектами Django моделей) и форматами, которые можно легко преобразовать в JSON, XML или другие типы данных, подходящие для API запросов. Он позволяет контролировать, как данные передаются между клиентом и сервером.

1. Создадим файл notes/serializers.py и добавим следующий код:
```
from rest_framework import serializers
from .models import Note

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'
```

## Шаг 4: Создание представлений для REST API

Создание представлений для REST API необходим для того, чтобы определить, как ваше Django-приложение будет обрабатывать HTTP-запросы к вашему API и возвращать ответы. Представления (views) — это логика, которая связывает клиентские запросы с данными, хранящимися на сервере

1. Откроем файл notes/views.py и добавим следующие представления:
```
from rest_framework import generics
from .models import Note
from .serializers import NoteSerializer

class NoteListCreate(generics.ListCreateAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

class NoteDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
```

## Шаг 5: Настройка URL для REST API

1. Создадим файл notes/urls.py и добавьте следующие маршруты:
```
from django.urls import path
from .views import NoteListCreate, NoteDetail

urlpatterns = [
    path('notes/', NoteListCreate.as_view(), name='note-list-create'),
    path('notes/<int:pk>/', NoteDetail.as_view(), name='note-detail'),
]
```
2. Добавим маршруты приложения в основной файл URL проекта (note_manager/urls.py):
```
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('notes.urls')),
]
```

## Шаг 6: Создание фронтенда
Теперь создадим простую HTML-страницу для работы с нашим API. Мы будем использовать JavaScript для выполнения запросов к API.

1. Создадим папку tamplates в корне нашего проекта и создадим в ней файл index.py:
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Note Manager</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        h1 {
            text-align: center;
        }
        .note {
            border: 1px solid #ccc;
            padding: 10px;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <h1>Note Manager</h1>
    <div>
        <h2>Create Note</h2>
        <input type="text" id="note-title" placeholder="Title">
        <textarea id="note-content" placeholder="Content"></textarea>
        <button onclick="createNote()">Create Note</button>
    </div>
    <div id="notes"></div>

    <script>
        const apiUrl = 'http://127.0.0.1:8000/api/notes/';

        async function fetchNotes() {
            const response = await fetch(apiUrl);
            const notes = await response.json();
            const notesDiv = document.getElementById('notes');
            notesDiv.innerHTML = '';
            notes.forEach(note => {
                notesDiv.innerHTML += `<div class="note">
                    <h3>${note.title}</h3>
                    <p>${note.content}</p>
                    <button onclick="deleteNote(${note.id})">Delete</button>
                </div>`;
            });
        }

        async function createNote() {
            const title = document.getElementById('note-title').value;
            const content = document.getElementById('note-content').value;

            await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content }),
            });

            document.getElementById('note-title').value = '';
            document.getElementById('note-content').value = '';
            fetchNotes();  // Обновляем список заметок
        }

        async function deleteNote(id) {
            await fetch(`${apiUrl}${id}/`, {
                method: 'DELETE',
            });
            fetchNotes();  // Обновляем список заметок
        }

        // Загружаем заметки при загрузке страницы
        fetchNotes();
    </script>
</body>
</html>
```

## Шаг 7: Настройка templates
Настройка settings.py: В файле settings.py добавим путь к нашему шаблону:
```
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'notes', 'templates')],  # Добавим этот путь
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
```
## Шаг 8: Запуск сервера
Запустим сервер и убедимся в работе:
<p align="center">
  <img src="screenshots/3.png" alt="Note" />
</p>

Отлично, наже приложение заработало. Теперь попробуем добавить пару записе:
<p align="center">
  <img src="screenshots/4.png" alt="Note" />
</p>

## Пример работы API

Получение всех заметок:

При отправке GET-запроса на http://127.0.0.1:8000/api/notes/, метод NoteListCreate.get() будет вызван, и API вернет список всех заметок в формате JSON.
Создание новой заметки:

При отправке POST-запроса с данными заметки на http://127.0.0.1:8000/api/notes/, метод NoteListCreate.post() будет вызван, и новая заметка будет создана в базе данных.
Обновление заметки:

При отправке PUT-запроса на http://127.0.0.1:8000/api/notes/<id>/ с данными обновленной заметки, метод NoteDetail.put() обновит заметку с указанным идентификатором.
Удаление заметки:

При отправке DELETE-запроса на http://127.0.0.1:8000/api/notes/<id>/, метод NoteDetail.delete() удалит заметку с указанным идентификатором.
