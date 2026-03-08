#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input

# Drop all core tables and migration history, then remigrate cleanly
python manage.py shell << END
from django.db import connection
with connection.cursor() as cursor:
    cursor.execute("""
        DROP TABLE IF EXISTS core_projectimage CASCADE;
        DROP TABLE IF EXISTS core_project CASCADE;
        DROP TABLE IF EXISTS core_service CASCADE;
        DROP TABLE IF EXISTS core_testimonial CASCADE;
        DROP TABLE IF EXISTS core_contactmessage CASCADE;
        DROP TABLE IF EXISTS core_category CASCADE;
        DELETE FROM django_migrations WHERE app = 'core';
    """)
    print("Dropped all core tables and cleared migration history")
END

python manage.py migrate

# Create superuser
python manage.py shell << END
from django.contrib.auth import get_user_model
import os, sys

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