# Note Manager — Веб-приложение на Django

Приложение для создания, просмотра, редактирования и удаления заметок.
<p align="center">
  <img src="screenshots/7.png" alt="Note" />
</p>

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

## Теория и структура Django проекта

Django — это высокоуровневый веб-фреймворк на Python, который позволяет разрабатывать веб-приложения быстро и с минимальным количеством кода. Он следует принципу "DRY" (Don't Repeat Yourself) и использует архитектуру MVT (Model-View-Template).

### Основные компоненты Django проекта:
1. Проект — верхний уровень структуры, содержащий настройки и конфигурацию веб-приложения.
2. Приложения (Apps) — отдельные модули внутри проекта, каждый из которых отвечает за конкретную функциональность и может быть использован в других проектах.

### Стандартная структура Django проекта:
<p align="center">
  <img src="screenshots/8.png" alt="Note" />
</p>

### Описание основных файлов и директорий

- **manage.py** — Скрипт для взаимодействия с проектом. Используется для выполнения команд, таких как запуск сервера, миграции и управление базой данных.
- **settings.py** — Файл настроек, где указываются параметры базы данных, установленные приложения, конфигурации безопасности и другие глобальные настройки.
- **urls.py** — Маршрутизация запросов внутри проекта. Определяет, какой view будет обрабатывать определенный URL.
- **models.py** — Файл для определения моделей данных. Модели описывают структуру базы данных.
- **views.py** — В этом файле находится логика обработки запросов и отправки ответов. Это могут быть как обычные представления (view), так и API endpoints.
- **admin.py** — Настройки административной панели Django.
- **serializers.py** — Используется при работе с Django REST Framework для преобразования данных (например, из объектов модели в JSON и обратно).
- **static/** — Папка для хранения статических файлов, таких как CSS, JavaScript и изображения. Статические файлы могут быть как глобальными для всего проекта, так и специфичными для определенного приложения.
- **templates/** — Папка для хранения HTML-шаблонов, используемых для рендеринга данных в браузере.

### MVT Архитектура

- **Model** — Определяет структуру базы данных. Django автоматически создает таблицы на основе моделей.
- **View** — Обрабатывает запросы и возвращает ответ, будь то HTML или JSON данные для API.
- **Template** — Определяет, как информация отображается пользователю. В Django используются шаблоны HTML для рендеринга данных.

## Этапы создания
### Шаг 1: Настройка проекта Django

1. Создадим и активируем виртуальное окружение (при необходимости):
```
python -m venv venv
.\env\Scripts\activate.bat
```
<p align="center">
  <img src="screenshots/1.png" alt="Note" />
</p>

2. Установим Django и Django REST Framework:
```
pip install django djangorestframework
```
<p align="center">
  <img src="screenshots/2.png" alt="Note" />
</p>

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
```python
INSTALLED_APPS = [
    ...,
    'rest_framework',
    'notes',
]
```
Добавляет приложение notes и rest_framework в список установленных приложений для активации функционала.
<p align="center">
  <img src="screenshots/9.png" alt="Note" />
</p>

### Шаг 2: Создание модели заметки

1. Откроем файл notes/models.py и создадим модель Note:
```python
from django.db import models

class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
```
Создает модель Note с полями заголовка, содержимого и временных меток для создания и обновления.
2. Создадим миграции и применим их:
```python
python manage.py makemigrations
python manage.py migrate
```
<p align="center">
  <img src="screenshots/10.png" alt="Note" />
</p>

### Шаг 3: Создание сериализатора для заметок

Сериализатор в Django REST Framework используется для преобразования данных между сложными типами (например, объектами Django моделей) и форматами, которые можно легко преобразовать в JSON, XML или другие типы данных, подходящие для API запросов. Он позволяет контролировать, как данные передаются между клиентом и сервером.

1. Создадим файл notes/serializers.py и добавим следующий код:
```python
from rest_framework import serializers
from .models import Note

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'
```
Создает сериализатор, который преобразует модель Note в формат JSON для передачи через API.

### Шаг 4: Создание представлений для REST API

Создание представлений для REST API необходим для того, чтобы определить, как ваше Django-приложение будет обрабатывать HTTP-запросы к вашему API и возвращать ответы. Представления (views) — это логика, которая связывает клиентские запросы с данными, хранящимися на сервере

1. Откроем файл notes/views.py и добавим следующие представления:
```python
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
Создает представление для отображения домашней страницы и API для получения и создания заметок.

### Шаг 5: Настройка URL для REST API

Добавим маршруты приложения в основной файл URL проекта (note_manager/urls.py):
```python
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),
    path('api/', include('notes.urls')),
]
```
Определяет маршруты для доступа к админке, главной странице и API приложения.

Определим маршруты в notes/urls.py
```python
urlpatterns = [
    path('notes/', NoteListCreate.as_view(), name='note-list-create'),
    path('notes/<int:pk>/', NoteDetail.as_view(), name='note-detail'),
]
```
Определяет маршруты API для получения списка заметок и взаимодействия с отдельными заметками по их идентификатору.

### Шаг 6: Создание фронтенда
Теперь создадим простую HTML-страницу для работы с нашим API. Мы будем использовать JavaScript для выполнения запросов к API.

1. Создадим папку tamplates в корне нашего проекта и создадим в ней файл index.py:
```html
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

### Шаг 7: Настройка templates
Настройка settings.py: В файле settings.py добавим путь к нашему шаблону:
```python
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
### Шаг 8: Запуск сервера
Запустим сервер и убедимся в работе:
<p align="center">
  <img src="screenshots/3.png" alt="Note" />
</p>

Отлично, наже приложение заработало. Теперь попробуем добавить пару записе:
<p align="center">
  <img src="screenshots/4.png" alt="Note" />
</p>

### Пример работы API

Получение всех заметок:

При отправке GET-запроса на http://127.0.0.1:8000/api/notes/, метод NoteListCreate.get() будет вызван, и API вернет список всех заметок в формате JSON.
Создание новой заметки:

При отправке POST-запроса с данными заметки на http://127.0.0.1:8000/api/notes/, метод NoteListCreate.post() будет вызван, и новая заметка будет создана в базе данных.
Обновление заметки:

При отправке PUT-запроса на http://127.0.0.1:8000/api/notes/<id>/ с данными обновленной заметки, метод NoteDetail.put() обновит заметку с указанным идентификатором.
Удаление заметки:

При отправке DELETE-запроса на http://127.0.0.1:8000/api/notes/<id>/, метод NoteDetail.delete() удалит заметку с указанным идентификатором.

<p align="center">
  <img src="screenshots/5.png" alt="Note" />
</p>
<p align="center">
  <img src="screenshots/6.png" alt="Note" />
</p>

### Шаг 9: Оптимизация и разделение frontend-части приложения.

Обычно фронтенд часть разделяют на HTML (шаблоны), CSS (стили), JavaScipt (логика поведения). В папке templates хранятся html шаблоны, а в папки static хранятся css и js файлы. Создадим папку static, а в ней style.css и scripts.js.

style.css:
```css
body {
    padding: 20px;
    background-color: #f8f9fa;
}
.note {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
    background-color: white;
}
```
Определяет стили для общего оформления страницы и отдельных заметок.

scripts.js:
```js
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
            <button class="btn btn-danger" onclick="deleteNote(${note.id})">Удалить</button>
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
    fetchNotes();
}

async function deleteNote(id) {
    await fetch(`${apiUrl}${id}/`, {
        method: 'DELETE',
    });
    fetchNotes(); 
}

fetchNotes();
```
Создает JavaScript-функцию для получения заметок из API и отображения их на странице.

После этого, в файле settings.py добавим настройку статический файлов:
```python
STATIC_URL = '/static/'

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]
```
Также, немного изменим наш html шаблон для более красивой реализации:
```html
<!DOCTYPE html>
{% load static %}
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Менеджер записей</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="{% static 'css/styles.css' %}">
</head>
<body>
    <div class="container">
        <h1 class="text-center">Менеджер записей</h1>
        <div class="mb-4">
            <h2>Создать запись</h2>
            <input type="text" id="note-title" class="form-control" placeholder="Заголовок">
            <textarea id="note-content" class="form-control mt-2" placeholder="Содержимое"></textarea>
            <button class="btn btn-primary mt-2" onclick="createNote()">Создать запись</button>
        </div>
        <div id="notes"></div>
    </div>

    <script src="{% static 'js/scripts.js' %}"></script>
</body>
</html>
```
Создает HTML-шаблон для главной страницы с заголовком и контейнером для отображения заметок.
Ну и наконец, запустим наше приложение и посмотрим на результат:
<p align="center">
  <img src="screenshots/7.png" alt="Note" />
</p>

## Итоги:

В нашем проекте "Менеджер записей" взаимодействие между бэкендом (Django) и фронтендом (HTML, CSS, JavaScript) осуществляется через API, который предоставляет RESTful интерфейс для работы с данными заметок. Вот как это происходит:

1. **API на стороне бэкенда**  
   **Создание API:**  
   В `views.py` определены классы `NoteListCreate` и `NoteDetail`, которые наследуют от `generics.ListCreateAPIView` и `generics.RetrieveUpdateDestroyAPIView` соответственно. Эти классы обрабатывают запросы к API.  
   - `NoteListCreate` отвечает за получение списка заметок и создание новой заметки.  
   - `NoteDetail` предоставляет возможность получать, обновлять и удалять конкретную заметку по ее идентификатору.  

2. **Настройка маршрутов**  
   **Маршруты API:**  
   В `notes/urls.py` определены маршруты, которые связывают URL-адреса с соответствующими представлениями:
   ```python
   urlpatterns = [
       path('notes/', NoteListCreate.as_view(), name='note-list-create'),
       path('notes/<int:pk>/', NoteDetail.as_view(), name='note-detail'),
   ]
    ```

3. **Запросы с фронтенда**
   **JavaScript-функции:**

   Во фронтенд-коде, в частности в файле `scripts.js`, определены функции для работы с API:

  - **`fetchNotes()`**: 
    - Выполняет GET-запрос к API для получения списка заметок и отображает их в интерфейсе.
    - Использует `fetch()` для отправки запроса и обработки ответа, обновляя содержимое элемента `div` с `id notes`.

  - **`createNote()`**: 
    - Выполняет POST-запрос для создания новой заметки.
    - Собирает данные из полей ввода, отправляет их в формате JSON и очищает поля после успешного создания.

- **`deleteNote(id)`**: 
  - Выполняет DELETE-запрос для удаления заметки по ее идентификатору.

4. **Обработка ответов**
   **Отображение данных:**
   После выполнения запросов данные, полученные от API, используются для обновления интерфейса:
     - При вызове `fetchNotes()` заметки извлекаются из JSON-ответа и отображаются на странице, создавая динамический интерфейс.
     - При создании или удалении заметок интерфейс также обновляется, чтобы отразить изменения, вызывая повторный запрос к API.

5. **Статическиек файлы**
   **HTML и CSS:**
   Основной HTML-шаблон (`index.html`) загружает статические файлы, такие как CSS и JavaScript, с помощью `{% static %}`.  
   CSS отвечает за оформление, а JavaScript обеспечивает интерактивность и динамическое взаимодействие с API.

6. **Полный цикл взаимодействия**

    1. **Пользователь создает новую заметку:**
       - Пользователь вводит заголовок и содержание заметки и нажимает кнопку "Создать запись".
       - Функция `createNote()` собирает данные и отправляет их на сервер через POST-запрос.

    2. **Бэкенд обрабатывает запрос:**
       - Сервер принимает запрос, создает новую запись в базе данных и возвращает ответ.

    3. **Фронтенд обновляет интерфейс:**
       - После успешного создания заметки функция `fetchNotes()` вызывается для обновления списка заметок на странице.

    4. **Пользователь удаляет заметку:**
       - Пользователь нажимает кнопку "Удалить" рядом с заметкой, вызывается функция `deleteNote(id)`, которая отправляет DELETE-запрос на сервер.

    5. **Сервер обрабатывает удаление:**
       - Сервер удаляет указанную заметку из базы данных и возвращает ответ.

    6. **Фронтенд снова обновляет список заметок:**
       - После удаления заметки интерфейс обновляется для отражения изменений.


## Deploy:

### Шаг 1:

Для начала нужно скачать Docker Desktop с официального сайте: https://www.docker.com/products/docker-desktop/.

Для корректной работы нужно пройти регистрацию.

### Шаг 2:

Создадим файл зависимостей (если его нет еще):

Вариант 1 (если вы изначально создавали виртуальное окружение для проекта):
В терминале пропишите: 
```bash
pip freeze > requirements.txt
```
Вариант 2. Просто создайте файл **`requirements.txt`** в корневой директории проекта
Выглядеть должен примерно так (если вы не использовали сторонние библиотеки):
```txt
Django==5.1.2
djangorestframework==3.15.2
```

### Шаг 3:

Создадим файл с именем **`Dockerfile`** в корневой директории проекта:


Dockerfile. Это файл для предварительной работы, набор инструкций, который нужен для записи образа. В нем описывается,
что должно находиться в образе, какие команды, зависимости и процессы он будет содержать.

```dockerfile
# Используем официальный образ Python
FROM python:3.11-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY requirements.txt .

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем весь проект в контейнер
COPY . .

# Открываем порт, на котором будет работать сервер
EXPOSE 8000

# Команда для запуска сервера разработки
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# Копируем базу данных SQLite
COPY db.sqlite3 /note_manager/db.sqlite3
```

### Шаг 4:

Создадим файл docker-compose.yml в корневой директории проекта:
```yaml
version: '3.8'

services:
  web:
    build: .
    command: python manage.py runserver 0.0.0.0:8000
    ports:
      - "8000:8000"
    volumes:
      - .:/app
    environment:
      - DEBUG=True
```

 1. `version: '3.8'` - указывает версию Docker Compose файла. Использование версии `3.8` позволяет использовать современные функции Docker Compose.

 2. `services` - раздел, в котором определяются все сервисы (контейнеры) вашего приложения. В данном случае у нас только один сервис — `web`.

3. `web` - имя сервиса, которое используется для обращения к контейнеру в командной строке и для связывания с другими сервисами.

4. `build: .` - указывает путь к директории с `Dockerfile`. В данном случае указывается текущая директория, где находится `docker-compose.yml`. Docker Compose использует этот путь для сборки образа контейнера.

5. `command: python manage.py runserver 0.0.0.0:8000` - команда, которая будет выполнена при запуске контейнера. В данном случае это запуск Django-сервера разработки, который будет слушать на всех интерфейсах (`0.0.0.0`) и на порту `8000`.

6. `ports: "8000:8000"` - связывает порт 8000 контейнера с портом 8000 хоста. Это позволяет обращаться к приложению на `http://localhost:8000`.

 7. `volumes: .:/app` - монтирует текущую директорию (где находится `docker-compose.yml`) в директорию `/app` контейнера. Это позволяет синхронизировать файлы между локальной машиной и контейнером

8. `environment: - DEBUG=True` - устанавливает переменную окружения `DEBUG` в значение `True`. Это включает режим отладки в Django, что полезно при разработке, так как выводит подробные сообщения об ошибках.


### Шаг 5:

В корневой директории проекта откроем терминал и выполним команду, чтобы построить образ и запустить контейнер:
```bash
docker-compose up --build
```
Перейдем по адресу http://localhost:8000. Скорее всего, как и у меня, запросы не будут отправлятся к серверу.
Если мы в браузере откроем режим разработчика (F12), то увидим ошибку:
```
Access to fetch at 'http://127.0.0.1:8000/api/notes/' from origin 'http://localhost:8000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.Understand this errorAI
127.0.0.1:8000/api/notes/:1
```
Ошибка связана с CORS (Cross-Origin Resource Sharing) — политикой безопасности веб-браузеров,
которая ограничивает доступ к ресурсам между разными источниками (домены).


В данном случае, ваш фронтенд работает на http://localhost:8000,
а ваш бэкенд Django (API) работает на http://127.0.0.1:8000, и из-за этого браузер блокирует запросы, так как они происходят с разных источников.

### Решение:

Остановим контейнер.

Установим пакет **`django-cors-headers`**:
```bash
pip install django-cors-headers
```

Добавим **`corsheaders`*** в **`INSTALLED_APPS`** в **`settings.py`**

Это должно выглядеть примерно так:
```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders', # вот оно
    'notes',
]
```

Теперь добавим **`CorsMiddleware`** в **`MIDDLEWARE`** (лучше вставить его перед **`django.middleware.common.CommonMiddleware`**)

Должно быть примерно так:
```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware', # вот оно
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

Далее добавим разрешение CORS в наш файл **`settings.py`**:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]
```

Обновим наш файл **`requirements.txt`**

Должно быть примерно так:
```txt
Django==5.1.2
djangorestframework==3.15.2
django-cors-headers==3.13.0
```

Перезапустим наш контейер. После этого http://localhost:8000 должен заработать.
