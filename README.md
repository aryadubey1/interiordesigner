# Lumière — Interior Design Website

A refined, full-stack interior design portfolio website built with Django, Django Templates, and Tailwind CSS (CDN). Designed to be deployed on Render with a hosted PostgreSQL database.

---

## ✦ Pages

| Page | URL | Description |
|---|---|---|
| Home | `/` | Hero, featured projects, services preview, CTA |
| About | `/about/` | Philosophy, values, team, testimonials |
| Services | `/services/` | Service list with process steps |
| Portfolio | `/portfolio/` | Filterable project grid |
| Project Detail | `/portfolio/<slug>/` | Full project with gallery |
| Contact | `/contact/` | Contact form + studio info |

---

## ✦ Models

- **Project** — portfolio items with image, category, location, year
- **ProjectImage** — gallery images for each project
- **Category** — project categories for filtering
- **Service** — services offered
- **Testimonial** — client testimonials
- **ContactMessage** — submitted contact forms (admin-only)

---

## ✦ Local Setup

### 1. Clone and create environment

```bash
git clone <your-repo>
cd interior_designer
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Run migrations and start server

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Visit `http://127.0.0.1:8000` — the site is live.  
Admin panel: `http://127.0.0.1:8000/admin/`

---

## ✦ Adding Content

All content is managed via the Django admin panel at `/admin/`:

1. **Categories** → Add project categories (e.g. Residential, Commercial, Hospitality)
2. **Services** → Add your service offerings with icons and descriptions
3. **Projects** → Add portfolio items — mark `is_featured=True` for homepage display
4. **Testimonials** → Add client testimonials
5. **Contact Messages** → View incoming enquiries

---

## ✦ Deploying to Render

### Prerequisites
- Render account
- PostgreSQL database already provisioned on Render
- Your code pushed to GitHub/GitLab

### Step-by-step

1. **Create a Web Service** on Render, connected to your repository

2. **Set Build Command:**
   ```
   ./build.sh
   ```

3. **Set Start Command:**
   ```
   gunicorn config.wsgi:application
   ```

4. **Add Environment Variables** in Render dashboard:

   | Variable | Value |
   |---|---|
   | `SECRET_KEY` | Generate a long random string |
   | `DEBUG` | `False` |
   | `ALLOWED_HOSTS` | `your-app.onrender.com` |
   | `DATABASE_URL` | Your Render Postgres connection string |
   | `DJANGO_SUPERUSER_USERNAME` | `admin` |
   | `DJANGO_SUPERUSER_EMAIL` | `admin@example.com` |
   | `DJANGO_SUPERUSER_PASSWORD` | A secure password |

5. **Deploy** — Render will run `build.sh` which installs deps, collects static, migrates, and creates the superuser automatically.

---

## ✦ Tech Stack

- **Backend:** Python 3.11+, Django 4.2
- **Templating:** Django Templates
- **CSS:** Tailwind CSS (CDN — no build step required)
- **Fonts:** Cormorant Garamond + DM Sans (Google Fonts)
- **Static Files:** WhiteNoise
- **Database:** PostgreSQL (via dj-database-url)
- **Server:** Gunicorn
- **Hosting:** Render

---

## ✦ Design System

- **Primary:** Ivory `#F8F5F0`
- **Accent:** Gold `#C9A96E`  
- **Dark:** Charcoal `#1A1A1A`
- **Display Font:** Cormorant Garamond
- **Body Font:** DM Sans
- **Animations:** CSS scroll-reveal, custom cursor, page load transitions

---

## ✦ Generating a SECRET_KEY

```python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```