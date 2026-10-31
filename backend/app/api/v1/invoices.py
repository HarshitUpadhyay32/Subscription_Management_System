"""
Invoices router — Generate, confirm, cancel invoices.
Prevents duplicate invoices for the same subscription + billing period.
"""
import uuid
from datetime import date, timedelta
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from app.core.supabase_client import get_service_supabase
from app.api.v1.auth import get_current_user, require_staff_or_admin

router = APIRouter()


class InvoiceItemCreate(BaseModel):
    description: str
    quantity: int = 1
    unit_price: float
    total_price: float


class InvoiceCreate(BaseModel):
    subscription_id: Optional[str] = None
    customer_id: str
    billing_period_start: str
    billing_period_end: str
    subtotal: float
    tax: float = 0.0
    discount: float = 0.0
    total_amount: float
    due_date: Optional[str] = None
    items: Optional[List[InvoiceItemCreate]] = []


def _generate_invoice_number(db) -> str:
    settings_row = (
        db.table("system_settings").select("invoice_prefix").limit(1).execute().data
    )
    prefix = settings_row[0]["invoice_prefix"] if settings_row else "BL-INV-"
    today = date.today()
    short = str(uuid.uuid4().int)[:3]
    return f"{prefix}{today.year}-{short}"


@router.get("/")
def list_invoices(
    status: Optional[str] = None,
    customer_id: Optional[str] = None,
    _user=Depends(require_staff_or_admin),
):
    db = get_service_supabase()
    q = db.table("invoices").select(
        "*, customers(name, email, company_name), subscriptions(subscription_number), invoice_items(*)"
    )
    if status:
        q = q.eq("status", status)
    if customer_id:
        q = q.eq("customer_id", customer_id)
    return q.order("created_at", desc=True).execute().data


@router.get("/{invoice_id}")
def get_invoice(invoice_id: str, _user=Depends(get_current_user)):
    db = get_service_supabase()
    result = (
        db.table("invoices")
        .select("*, customers(*), subscriptions(*), invoice_items(*), payments(*)")
        .eq("id", invoice_id)
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return result.data


@router.post("/", status_code=201)
def create_invoice(payload: InvoiceCreate, _user=Depends(require_staff_or_admin)):
    db = get_service_supabase()

    # Check for duplicate billing period
    if payload.subscription_id:
        dupe = (
            db.table("invoices")
            .select("id")
            .eq("subscription_id", payload.subscription_id)
            .eq("billing_period_start", payload.billing_period_start)
            .eq("billing_period_end", payload.billing_period_end)
            .execute()
            .data
        )
        if dupe:
            raise HTTPException(
                status_code=409,
                detail="An invoice already exists for this subscription and billing period."
            )

    invoice_data = payload.model_dump(exclude={"items"})
    invoice_data["invoice_number"] = _generate_invoice_number(db)
    if not invoice_data.get("due_date"):
        invoice_data["due_date"] = (date.today() + timedelta(days=7)).isoformat()

    result = db.table("invoices").insert(invoice_data).execute()
    invoice = result.data[0]

    # Insert line items
    if payload.items:
        items = [{"invoice_id": invoice["id"], **item.model_dump()} for item in payload.items]
        db.table("invoice_items").insert(items).execute()

    return invoice


@router.patch("/{invoice_id}/confirm")
def confirm_invoice(invoice_id: str, _user=Depends(require_staff_or_admin)):
    db = get_service_supabase()
    result = db.table("invoices").update({"status": "confirmed"}).eq("id", invoice_id).execute()
    return result.data[0]


@router.patch("/{invoice_id}/cancel")
def cancel_invoice(invoice_id: str, _user=Depends(require_staff_or_admin)):
    db = get_service_supabase()
    result = db.table("invoices").update({"status": "cancelled"}).eq("id", invoice_id).execute()
    return result.data[0]
