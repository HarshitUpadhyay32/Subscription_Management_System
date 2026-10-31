"""
Customers router — Manage the customer database.
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.core.supabase_client import get_service_supabase
from app.api.v1.auth import get_current_user, require_staff_or_admin

router = APIRouter()


class CustomerCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    company_name: Optional[str] = None
    billing_address: Optional[str] = None
    profile_id: Optional[str] = None


class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    company_name: Optional[str] = None
    billing_address: Optional[str] = None


@router.get("/")
def list_customers(_user=Depends(require_staff_or_admin)):
    db = get_service_supabase()
    result = (
        db.table("customers")
        .select("*, subscriptions(id, status), invoices(id, status, total_amount)")
        .order("created_at", desc=True)
        .execute()
    )
    return result.data


@router.get("/{customer_id}")
def get_customer(customer_id: str, _user=Depends(get_current_user)):
    db = get_service_supabase()
    result = (
        db.table("customers")
        .select("*, subscriptions(*), invoices(*)")
        .eq("id", customer_id)
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Customer not found")
    return result.data


@router.post("/", status_code=201)
def create_customer(payload: CustomerCreate, _user=Depends(require_staff_or_admin)):
    db = get_service_supabase()
    result = db.table("customers").insert(payload.model_dump()).execute()
    return result.data[0]


@router.patch("/{customer_id}")
def update_customer(customer_id: str, payload: CustomerUpdate, _user=Depends(require_staff_or_admin)):
    db = get_service_supabase()
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    result = db.table("customers").update(updates).eq("id", customer_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Customer not found")
    return result.data[0]


@router.delete("/{customer_id}", status_code=204)
def delete_customer(customer_id: str, _user=Depends(require_staff_or_admin)):
    db = get_service_supabase()
    db.table("customers").delete().eq("id", customer_id).execute()
    return None
