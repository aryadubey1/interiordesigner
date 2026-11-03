from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from .models import Project, Service, Testimonial, Category, TeamMember, StudioImage
from .forms import ContactForm


def _showcase(limit=5):
    """Featured projects first, then the rest, so the home grid is never half empty."""
    featured = list(Project.objects.filter(is_featured=True))
    others = list(Project.objects.filter(is_featured=False))
    return (featured + others)[:limit]


def home(request):
    featured_projects = _showcase()
    services = Service.objects.filter(is_active=True)[:4]
    testimonials = Testimonial.objects.filter(is_active=True)[:3]
    studio_images = list(StudioImage.objects.filter(is_active=True)[:3])
    context = {
        'featured_projects': featured_projects,
        'studio_images': studio_images,
        'hero_image': studio_images[0] if studio_images else None,
        'services': services,
        'testimonials': testimonials,
        'page': 'home',
    }
    return render(request, 'core/home.html', context)


def about(request):
    testimonials = Testimonial.objects.filter(is_active=True)
    team = TeamMember.objects.filter(is_active=True)
    studio_images = StudioImage.objects.filter(is_active=True)[:3]
    context = {
        'testimonials': testimonials,
        'team': team,
        'studio_images': studio_images,
        'page': 'about',
    }
    return render(request, 'core/about.html', context)


def services(request):
    all_services = Service.objects.filter(is_active=True)
    # Placeholder for template when DB is empty
    
    context = {
        'services': all_services,
        'head_project': Project.objects.filter(is_featured=True).first() or Project.objects.first(),
        'page': 'services',
    }
    return render(request, 'core/services.html', context)


def portfolio(request):
    categories = Category.objects.all()
    category_slug = request.GET.get('category')
    projects = Project.objects.all()
    active_category = None

    if category_slug:
        active_category = get_object_or_404(Category, slug=category_slug)
        projects = projects.filter(category=active_category)

    context = {
        'projects': projects,
        'categories': categories,
        'active_category': active_category,
        'page': 'portfolio',
    }
    return render(request, 'core/portfolio.html', context)


def project_detail(request, slug):
    project = get_object_or_404(Project, slug=slug)
    related_projects = Project.objects.filter(
        category=project.category
    ).exclude(pk=project.pk)[:3]
    context = {
        'project': project,
        'related_projects': related_projects,
        'page': 'portfolio',
    }
    return render(request, 'core/project_detail.html', context)


def contact(request):
    form = ContactForm()
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(
                request,
                "Thank you for reaching out. We'll be in touch within 24 hours."
            )
            return redirect('contact')
    context = {
        'form': form,
        'head_image': StudioImage.objects.filter(is_active=True).first(),
        'page': 'contact',
    }
    return render(request, 'core/contact.html', context)