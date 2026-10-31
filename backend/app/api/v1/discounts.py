"""
Discounts router — Admin-only discount code management.
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.core.supabase_client import get_service_supabase
from app.api.v1.auth import get_current_user, require_admin

router = APIRouter()


class DiscountCreate(BaseModel):
    code: str
    type: str  # fixed | percentage
    value: float
    min_purchase: float = 0.0
    min_quantity: int = 0
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    max_usage: int = 0
    is_active: bool = True


class DiscountValidate(BaseModel):
    code: str
    amount: float
    quantity: int = 1


@router.get("/")
def list_discounts(_user=Depends(get_current_user)):
    db = get_service_supabase()
    return db.table("discounts").select("*").order("created_at", desc=True).execute().data


@router.post("/", status_code=201)
def create_discount(payload: DiscountCreate, _user=Depends(require_admin)):
    db = get_service_supabase()
    result = db.table("discounts").insert(payload.model_dump()).execute()
    return result.data[0]


@router.post("/validate")
def validate_discount(payload: DiscountValidate, _user=Depends(get_current_user)):
    """Validate a discount code and return the applicable discount amount."""
    from datetime import date as d
    db = get_service_supabase()
    result = db.table("discounts").select("*").eq("code", payload.code).eq("is_active", True).single().execute()
    discount = result.data
    if not discount:
        raise HTTPException(status_code=404, detail="Discount code not found or inactive")

    today = d.today().isoformat()
    if discount.get("start_date") and discount["start_date"] > today:
        raise HTTPException(status_code=400, detail="Discount code is not yet active")
    if discount.get("end_date") and discount["end_date"] < today:
        raise HTTPException(status_code=400, detail="Discount code has expired")
    if discount.get("max_usage") and discount["used_count"] >= discount["max_usage"]:
        raise HTTPException(status_code=400, detail="Discount code usage limit reached")
    if payload.amount < (discount.get("min_purchase") or 0):
        raise HTTPException(status_code=400, detail=f"Minimum purchase of ₹{discount['min_purchase']} required")
    if payload.quantity < (discount.get("min_quantity") or 0):
        raise HTTPException(status_code=400, detail=f"Minimum quantity of {discount['min_quantity']} required")

    if discount["type"] == "percentage":
        discount_amount = round(payload.amount * discount["value"] / 100, 2)
    else:
        discount_amount = min(discount["value"], payload.amount)

    return {"valid": True, "discount_amount": discount_amount, "discount": discount}


@router.patch("/{discount_id}/toggle")
def toggle_discount(discount_id: str, _user=Depends(require_admin)):
    db = get_service_supabase()
    current = db.table("discounts").select("is_active").eq("id", discount_id).single().execute().data
    if not current:
        raise HTTPException(status_code=404, detail="Discount not found")
    result = db.table("discounts").update({"is_active": not current["is_active"]}).eq("id", discount_id).execute()
    return result.data[0]


@router.delete("/{discount_id}", status_code=204)
def delete_discount(discount_id: str, _user=Depends(require_admin)):
    db = get_service_supabase()
    db.table("discounts").delete().eq("id", discount_id).execute()
    return None
