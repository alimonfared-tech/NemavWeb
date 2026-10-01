from django.db import models


class ContactRequest(models.Model):
    PROJECT_TYPES = [
        ("web", "طراحی وب‌سایت"),
        ("shop", "فروشگاه اینترنتی"),
        ("landing", "لندینگ پیج"),
        ("dashboard", "داشبورد/پنل"),
        ("admin", "خدمات کامپیوتری و اداری"),
        ("other", "سایر"),
    ]
    STATUS = [
        ("new", "جدید"),
        ("contacted", "تماس گرفته شد"),
        ("done", "انجام شد"),
    ]

    name = models.CharField("نام", max_length=100)
    phone = models.CharField("شماره تماس", max_length=20)
    project_type = models.CharField("نوع پروژه", max_length=20, choices=PROJECT_TYPES, default="other")
    message = models.TextField("توضیح کوتاه پروژه", blank=True, max_length=1000)
    status = models.CharField("وضعیت", max_length=10, choices=STATUS, default="new")
    created_at = models.DateTimeField("تاریخ ثبت", auto_now_add=True)
    ip = models.GenericIPAddressField("آی‌پی", blank=True, null=True)
    
    class Meta:
        ordering = ["-created_at"]
        verbose_name = "درخواست تماس"
        verbose_name_plural = "درخواست‌های تماس"

    def __str__(self):
        return f"{self.name} — {self.get_project_type_display()}"