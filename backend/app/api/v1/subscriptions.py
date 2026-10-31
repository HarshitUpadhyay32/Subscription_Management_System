"""
Subscriptions router — Full lifecycle management.
Draft → Quotation → Confirmed → Active → Paused / Closed
"""
import uuid
from datetime import date, timedelta
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.core.supabase_client import get_service_supabase
from app.api.v1.auth import get_current_user, require_staff_or_admin

router = APIRouter()


class SubscriptionCreate(BaseModel):
    customer_id: str
    plan_id: str
    start_date: str
    expiry_date: Optional[str] = None
    payment_terms: str = "Due on receipt"
    subtotal: float
    tax_amount: float = 0.0
    discount_amount: float = 0.0
    total_amount: float
    status: str = "draft"


class SubscriptionUpdate(BaseModel):
    status: Optional[str] = None
    expiry_date: Optional[str] = None
    payment_terms: Optional[str] = None
    discount_amount: Optional[float] = None
    tax_amount: Optional[float] = None
    total_amount: Optional[float] = None


def _generate_subscription_number(db) -> str:
    """Generate unique subscription number like BL-SUB-1001."""
    settings_row = (
        db.table("system_settings")
        .select("subscription_prefix")
        .limit(1)
        .execute()
        .data
    )
    prefix = settings_row[0]["subscription_prefix"] if settings_row else "BL-SUB-"
    short_id = str(uuid.uuid4().int)[:4]
    return f"{prefix}{short_id}"


@router.get("/")
def list_subscriptions(
    status: Optional[str] = None,
    customer_id: Optional[str] = None,
    _user=Depends(require_staff_or_admin),
):
    db = get_service_supabase()
    q = db.table("subscriptions").select(
        "*, customers(name, email, company_name), plans(name, billing_cycle, price), subscription_items(*)"
    )
    if status:
        q = q.eq("status", status)
    if customer_id:
        q = q.eq("customer_id", customer_id)
    return q.order("created_at", desc=True).execute().data


@router.get("/{sub_id}")
def get_subscription(sub_id: str, _user=Depends(get_current_user)):
    db = get_service_supabase()
    result = (
        db.table("subscriptions")
        .select("*, customers(*), plans(*), subscription_items(*), invoices(id, status, total_amount, due_date)")
        .eq("id", sub_id)
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return result.data


@router.post("/", status_code=201)
def create_subscription(payload: SubscriptionCreate, _user=Depends(require_staff_or_admin)):
    db = get_service_supabase()
    data = payload.model_dump()
    data["subscription_number"] = _generate_subscription_number(db)
    result = db.table("subscriptions").insert(data).execute()
    return result.data[0]


@router.patch("/{sub_id}")
def update_subscription(sub_id: str, payload: SubscriptionUpdate, _user=Depends(require_staff_or_admin)):
    db = get_service_supabase()
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    result = db.table("subscriptions").update(updates).eq("id", sub_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return result.data[0]


@router.post("/{sub_id}/activate")
def activate_subscription(sub_id: str, _user=Depends(require_staff_or_admin)):
    db = get_service_supabase()
    result = db.table("subscriptions").update({"status": "active"}).eq("id", sub_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return {"message": "Subscription activated", "data": result.data[0]}


@router.post("/{sub_id}/pause")
def pause_subscription(sub_id: str, _user=Depends(require_staff_or_admin)):
    db = get_service_supabase()
    result = db.table("subscriptions").update({"status": "paused"}).eq("id", sub_id).execute()
    return {"message": "Subscription paused", "data": result.data[0]}


@router.post("/{sub_id}/close")
def close_subscription(sub_id: str, _user=Depends(require_staff_or_admin)):
    db = get_service_supabase()
    result = db.table("subscriptions").update({"status": "closed"}).eq("id", sub_id).execute()
    return {"message": "Subscription closed", "data": result.data[0]}


@router.post("/{sub_id}/renew")
def renew_subscription(sub_id: str, _user=Depends(require_staff_or_admin)):
    """Extend expiry date by one billing cycle and re-activate."""
    db = get_service_supabase()
    sub = db.table("subscriptions").select("*, plans(billing_cycle)").eq("id", sub_id).single().execute().data
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")

    cycle = (sub.get("plans") or {}).get("billing_cycle", "monthly")
    expiry = date.fromisoformat(sub.get("expiry_date") or date.today().isoformat())
    delta_map = {"daily": 1, "weekly": 7, "monthly": 30, "yearly": 365}
    new_expiry = expiry + timedelta(days=delta_map.get(cycle, 30))

    result = db.table("subscriptions").update({
        "expiry_date": new_expiry.isoformat(),
        "status": "active",
    }).eq("id", sub_id).execute()
    return {"message": "Subscription renewed", "new_expiry": new_expiry.isoformat(), "data": result.data[0]}
