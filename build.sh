#!/usr/bin/env bash
set -o errexit

# Activate virtualenv — adjust path if yours is different
source /home/ubuntu/lumiere/venv/bin/activate

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Collecting static files..."
python manage.py collectstatic --no-input

echo "Running migrations..."
python manage.py migrate

echo "Setting up superuser..."
python manage.py shell << END
from django.contrib.auth import get_user_model
import os
import sys

User = get_user_model()
username = os.getenv('DJANGO_SUPERUSER_USERNAME')
email = os.getenv('DJANGO_SUPERUSER_EMAIL')
password = os.getenv('DJANGO_SUPERUSER_PASSWORD')

if not all([username, email, password]):
    print("SKIPPING SUPERUSER: Environment variables not set.")
    sys.exit(0)

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
    print(f"CREATED SUPERUSER: {username}")
else:
    u = User.objects.get(username=username)
    u.set_password(password)
    u.is_staff = True
    u.is_superuser = True
    u.save()
    print(f"UPDATED SUPERUSER: {username}")
END

echo "Deploy complete."