import logging

from django.core.exceptions import ValidationError
from django.core.validators import validate_ipv46_address
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.http import require_POST

from .forms import ContactForm
from .models import ContactRequest

logger = logging.getLogger(__name__)


def get_client_ip(request):
    xff = request.META.get("HTTP_X_FORWARDED_FOR", "")
    ip = xff.split(",")[0].strip() if xff else request.META.get("REMOTE_ADDR", "")
    try:
        validate_ipv46_address(ip)
    except ValidationError:
        return None
    return ip


@require_POST
def contact_api(request):
    ip = get_client_ip(request)

    # ربات‌ها: جواب موفقِ الکی، بدون ذخیره
    if request.POST.get("website"):
        logger.info("Honeypot triggered from IP: %s", ip)
        return JsonResponse({"ok": True}, status=201)

    # محدودیت نرخ: حداکثر ۳ درخواست در دقیقه از هر آی‌پی
    since = timezone.now() - timezone.timedelta(seconds=60)
    if ContactRequest.objects.filter(ip=ip, created_at__gte=since).count() >= 3:
        logger.warning("Rate limit exceeded for IP: %s", ip)
        return JsonResponse({"ok": False, "error": "تعداد درخواست‌ها زیاد است؛ کمی صبر کنید."}, status=429)

    form = ContactForm(request.POST)
    if not form.is_valid():
        return JsonResponse({"ok": False, "errors": form.errors}, status=400)

    req = form.save(commit=False)
    req.ip = ip
    req.save()
    return JsonResponse({"ok": True}, status=201)