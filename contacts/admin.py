from django.contrib import admin
from .models import ContactRequest


@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    list_display = ("name", "phone", "project_type", "status", "created_at")
    list_editable = ("status",)
    list_filter = ("status", "project_type")
    search_fields = ("name", "phone", "message")
    readonly_fields = ("created_at",)