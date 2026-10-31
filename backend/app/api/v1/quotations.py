"""
Quotations router — Create quotation templates and convert to subscriptions.
"""
import uuid
from datetime import date, timedelta
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from app.core.supabase_client import get_service_supabase
from app.api.v1.auth import get_current_user, require_staff_or_admin

router = APIRouter()


class QuotationItemCreate(BaseModel):
    product_id: str
    plan_id: str
    quantity: int = 1
    unit_price: float
    total: float


class QuotationCreate(BaseModel):
    customer_id: str
    items: List[QuotationItemCreate]
    subtotal: float
    discount_percentage: float = 0.0
    discount_amount: float = 0.0
    tax_percentage: float = 18.0
    tax_amount: float = 0.0
    total_amount: float
    notes: Optional[str] = None
    expiry_date: Optional[str] = None


def _gen_quotation_number(db) -> str:
    settings_row = db.table("system_settings").select("quotation_prefix").limit(1).execute().data
    prefix = settings_row[0]["quotation_prefix"] if settings_row else "BL-QT-"
    return f"{prefix}{str(uuid.uuid4().int)[:4]}"


@router.get("/")
def list_quotations(_user=Depends(require_staff_or_admin)):
    db = get_service_supabase()
    return (
        db.table("quotations")
        .select("*, customers(name, email)")
        .order("created_at", desc=True)
        .execute()
        .data
    )


@router.get("/{qid}")
def get_quotation(qid: str, _user=Depends(get_current_user)):
    db = get_service_supabase()
    result = db.table("quotations").select("*, customers(*)").eq("id", qid).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Quotation not found")
    return result.data


@router.post("/", status_code=201)
def create_quotation(payload: QuotationCreate, _user=Depends(require_staff_or_admin)):
    db = get_service_supabase()
    data = payload.model_dump()
    data["quotation_number"] = _gen_quotation_number(db)
    data["issue_date"] = date.today().isoformat()
    data["status"] = "draft"
    if not data.get("expiry_date"):
        data["expiry_date"] = (date.today() + timedelta(days=30)).isoformat()
    result = db.table("quotations").insert(data).execute()
    return result.data[0]


@router.patch("/{qid}/send")
def send_quotation(qid: str, _user=Depends(require_staff_or_admin)):
    db = get_service_supabase()
    result = db.table("quotations").update({"status": "sent"}).eq("id", qid).execute()
    return result.data[0]


@router.patch("/{qid}/approve")
def approve_quotation(qid: str, _user=Depends(require_staff_or_admin)):
    db = get_service_supabase()
    result = db.table("quotations").update({"status": "approved"}).eq("id", qid).execute()
    return result.data[0]


@router.delete("/{qid}", status_code=204)
def delete_quotation(qid: str, _user=Depends(require_staff_or_admin)):
    db = get_service_supabase()
    db.table("quotations").delete().eq("id", qid).execute()
    return None
