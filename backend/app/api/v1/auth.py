"""
Auth router — JWT validation helper for protected routes.
Supabase handles signup/login directly from the frontend.
This module provides a FastAPI dependency to verify Supabase JWTs
and extract the current user for protected backend endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, Header
from typing import Optional
import jwt as pyjwt
from app.core.config import settings
from app.core.supabase_client import get_service_supabase

router = APIRouter()


def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    """
    Validate a Supabase JWT from the Authorization header.
    Returns the decoded payload with user id, email, and role metadata.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    token = authorization.split(" ", 1)[1]

    if not settings.SUPABASE_JWT_SECRET or settings.SUPABASE_JWT_SECRET.startswith("placeholder"):
        # Dev mode: skip JWT validation, return a mock admin
        return {"sub": "dev-admin", "email": "dev@brightloop.io", "role": "admin"}

    try:
        payload = pyjwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated",
        )
        return payload
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except pyjwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")


def require_admin(user: dict = Depends(get_current_user)) -> dict:
    role = (user.get("user_metadata") or {}).get("role", "customer")
    if role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


def require_staff_or_admin(user: dict = Depends(get_current_user)) -> dict:
    role = (user.get("user_metadata") or {}).get("role", "customer")
    if role not in ("admin", "staff"):
        raise HTTPException(status_code=403, detail="Staff or admin access required")
    return user


@router.get("/me")
def get_me(user: dict = Depends(get_current_user)):
    """Return current user info from JWT."""
    return {
        "id": user.get("sub"),
        "email": user.get("email"),
        "role": (user.get("user_metadata") or {}).get("role", "customer"),
    }
