import re
from django import forms
from .models import ContactRequest

# تبدیل ارقام فارسی/عربی به لاتین
FA_DIGITS = str.maketrans("۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩", "01234567890123456789")


class ContactForm(forms.ModelForm):
    website = forms.CharField(required=False)  # honeypot: فقط ربات‌ها پر می‌کنند

    class Meta:
        model = ContactRequest
        fields = ["name", "phone", "project_type", "message"]

    def clean_name(self):
        name = self.cleaned_data["name"].strip()
        if len(name) < 3:
            raise forms.ValidationError("نام باید حداقل ۳ حرف باشد.")
        return name

    def clean_phone(self):
        phone = self.cleaned_data["phone"].translate(FA_DIGITS).replace(" ", "").replace("-", "")
        if not re.fullmatch(r"09\d{9}", phone):
            raise forms.ValidationError("شمارهٔ موبایل معتبر نیست (مثل ۰۹۱۲۱۲۳۴۵۶۷).")
        return phone

    def clean_message(self):
        msg = self.cleaned_data.get("message", "").strip()
        if len(msg) > 1000:
            raise forms.ValidationError("توضیح پروژه حداکثر ۱۰۰۰ نویسه است.")
        return msg
    
    def clean_website(self):
        website = self.cleaned_data.get("website", "")
        if website:
            raise forms.ValidationError("اسپم تشخیص داده شد.")
        return website