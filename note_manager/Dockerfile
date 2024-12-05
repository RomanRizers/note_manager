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
