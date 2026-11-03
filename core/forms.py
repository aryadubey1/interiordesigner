from django import forms
from .models import ContactMessage


class ContactForm(forms.ModelForm):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'phone', 'subject', 'message']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'field', 'autocomplete': 'name',
                'placeholder': 'Ananya Mehta',
            }),
            'email': forms.EmailInput(attrs={
                'class': 'field', 'autocomplete': 'email', 'spellcheck': 'false',
                'placeholder': 'you@example.com',
            }),
            'phone': forms.TextInput(attrs={
                'class': 'field', 'type': 'tel', 'inputmode': 'tel', 'autocomplete': 'tel',
                'placeholder': '+1 212 555 0199',
            }),
            'subject': forms.TextInput(attrs={
                'class': 'field', 'autocomplete': 'off',
                'placeholder': 'A new home, a restaurant, a single room…',
            }),
            'message': forms.Textarea(attrs={
                'class': 'field resize-y', 'autocomplete': 'off',
                'placeholder': 'Tell us about the space, your timeline and budget…',
                'rows': 5,
            }),
        }