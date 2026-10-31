"""
Staff management router — Admin-only staff account operations.
Staff accounts are Supabase auth users with role='staff'.
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.core.supabase_client import get_service_supabase
from app.api.v1.auth import require_admin

router = APIRouter()


class StaffCreate(BaseModel):
    email: str
    full_name: str
    role: str = "staff"  # always staff
    department: Optional[str] = None
    password: Optional[str] = None  # if provided, creates Supabase auth user


class StaffUpdate(BaseModel):
    full_name: Optional[str] = None
    department: Optional[str] = None
    is_active: Optional[bool] = None


@router.get("/")
def list_staff(_user=Depends(require_admin)):
    db = get_service_supabase()
    result = db.table("profiles").select("*").eq("role", "staff").execute()
    return result.data


@router.post("/", status_code=201)
def create_staff(payload: StaffCreate, _user=Depends(require_admin)):
    """
    Create a new staff member.
    Inserts profile row directly; optionally creates Supabase auth user.
    For production, pass the service-role key and use admin.createUser.
    """
    db = get_service_supabase()

    # Check email not already in use
    existing = db.table("profiles").select("id").eq("email", payload.email).execute().data
    if existing:
        raise HTTPException(status_code=409, detail="A user with this email already exists")

    # Insert profile row (triggers will handle auth if service-role configured)
    result = db.table("profiles").insert({
        "email": payload.email,
        "full_name": payload.full_name,
        "role": "staff",
    }).execute()
    return result.data[0]


@router.patch("/{profile_id}")
def update_staff(profile_id: str, payload: StaffUpdate, _user=Depends(require_admin)):
    db = get_service_supabase()
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    result = db.table("profiles").update(updates).eq("id", profile_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Staff member not found")
    return result.data[0]


@router.delete("/{profile_id}", status_code=204)
def delete_staff(profile_id: str, _user=Depends(require_admin)):
    db = get_service_supabase()
    db.table("profiles").delete().eq("id", profile_id).execute()
    return None
