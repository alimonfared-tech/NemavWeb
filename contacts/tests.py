from django.test import TestCase
from .models import ContactRequest

URL = "/api/contact/"
VALID = {"name": "علی تست", "phone": "09121234567", "project_type": "web", "message": "سلام", "website": ""}


class ContactAPITests(TestCase):
    def test_valid_creates(self):
        r = self.client.post(URL, VALID)
        self.assertEqual(r.status_code, 201)
        self.assertEqual(ContactRequest.objects.count(), 1)

    def test_missing_name(self):
        r = self.client.post(URL, {**VALID, "name": ""})
        self.assertEqual(r.status_code, 400)

    def test_short_name(self):
        r = self.client.post(URL, {**VALID, "name": "ع"})
        self.assertEqual(r.status_code, 400)

    def test_bad_phone(self):
        r = self.client.post(URL, {**VALID, "phone": "12345"})
        self.assertEqual(r.status_code, 400)

    def test_persian_digits_normalized(self):
        r = self.client.post(URL, {**VALID, "phone": "۰۹۱۲ ۱۲۳ ۴۵۶۷"})
        self.assertEqual(r.status_code, 201)
        self.assertEqual(ContactRequest.objects.first().phone, "09121234567")

    def test_honeypot_silent_drop(self):
        r = self.client.post(URL, {**VALID, "website": "http://spam"})
        self.assertEqual(r.status_code, 201)
        self.assertEqual(ContactRequest.objects.count(), 0)

    def test_long_message(self):
        r = self.client.post(URL, {**VALID, "message": "x" * 1001})
        self.assertEqual(r.status_code, 400)

    def test_xss_stored_raw(self):
        r = self.client.post(URL, {**VALID, "name": "<script>alert(1)</script>"})
        self.assertEqual(r.status_code, 201)  # escape هنگام نمایش، خودکار توسط جنگو

    def test_get_not_allowed(self):
        r = self.client.get(URL)
        self.assertEqual(r.status_code, 405)

    def test_rate_limit(self):
        for _ in range(3):
            self.client.post(URL, VALID)
        r = self.client.post(URL, VALID)
        self.assertEqual(r.status_code, 429)