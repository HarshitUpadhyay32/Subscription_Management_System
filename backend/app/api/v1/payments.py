"""
Payments router — Record and track payments against invoices.
Marks invoice as paid when total collected >= invoice total.
"""
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.core.supabase_client import get_service_supabase
from app.api.v1.auth import get_current_user, require_staff_or_admin

router = APIRouter()


class PaymentCreate(BaseModel):
    invoice_id: str
    amount: float
    payment_method: str  # upi | bank_transfer | cash | other
    payment_date: Optional[str] = None
    notes: Optional[str] = None


@router.get("/")
def list_payments(invoice_id: Optional[str] = None, _user=Depends(require_staff_or_admin)):
    db = get_service_supabase()
    q = db.table("payments").select(
        "*, invoices(invoice_number, total_amount, customer_id, customers(name))"
    )
    if invoice_id:
        q = q.eq("invoice_id", invoice_id)
    return q.order("payment_date", desc=True).execute().data


@router.get("/{payment_id}")
def get_payment(payment_id: str, _user=Depends(get_current_user)):
    db = get_service_supabase()
    result = (
        db.table("payments")
        .select("*, invoices(*)")
        .eq("id", payment_id)
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Payment not found")
    return result.data


@router.post("/", status_code=201)
def record_payment(payload: PaymentCreate, _user=Depends(require_staff_or_admin)):
    db = get_service_supabase()

    # Get the invoice to check current balance
    invoice = (
        db.table("invoices")
        .select("id, total_amount, paid_amount, status")
        .eq("id", payload.invoice_id)
        .single()
        .execute()
        .data
    )
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    if invoice["status"] == "cancelled":
        raise HTTPException(status_code=400, detail="Cannot record payment for a cancelled invoice")

    # Insert payment record
    payment_data = payload.model_dump()
    payment_data["payment_date"] = payload.payment_date or datetime.utcnow().isoformat()
    result = db.table("payments").insert(payment_data).execute()
    payment = result.data[0]

    # Update paid_amount on invoice
    new_paid = float(invoice.get("paid_amount") or 0) + payload.amount
    new_status = "paid" if new_paid >= float(invoice["total_amount"]) else "confirmed"
    db.table("invoices").update({"paid_amount": new_paid, "status": new_status}).eq("id", payload.invoice_id).execute()

    return {"payment": payment, "invoice_status": new_status, "total_paid": new_paid}
