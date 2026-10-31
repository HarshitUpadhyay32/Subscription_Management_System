"""
Brightloop FastAPI — Shared Supabase client dependency.
Provides both anon-key client (for user-scoped requests) and
service-role client (for admin operations that bypass RLS).
"""
from functools import lru_cache
from supabase import create_client, Client
from app.core.config import settings


@lru_cache(maxsize=1)
def get_supabase() -> Client:
    """Anon-key Supabase client — respects RLS."""
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


@lru_cache(maxsize=1)
def get_service_supabase() -> Client:
    """Service-role Supabase client — bypasses RLS (admin only)."""
    if not settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_SERVICE_ROLE_KEY.startswith("placeholder"):
        # Fall back to anon key if service key not configured
        return get_supabase()
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
