from django import forms
from .models import ContactMessage


class ContactForm(forms.ModelForm):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'phone', 'subject', 'message']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Your full name',
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-input',
                'placeholder': 'your@email.com',
            }),
            'phone': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': '+1 (555) 000-0000',
            }),
            'subject': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'How can we help?',
            }),
            'message': forms.Textarea(attrs={
                'class': 'form-input',
                'placeholder': 'Tell us about your project…',
                'rows': 5,
            }),
        }