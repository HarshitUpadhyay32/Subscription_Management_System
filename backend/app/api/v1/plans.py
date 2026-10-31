"""
Plans router — Manage subscription plans for products.
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.core.supabase_client import get_service_supabase
from app.api.v1.auth import get_current_user, require_admin

router = APIRouter()


class PlanCreate(BaseModel):
    product_id: str
    name: str
    price: float
    billing_cycle: str  # daily | weekly | monthly | yearly
    min_quantity: int = 1
    availability_start: Optional[str] = None
    availability_end: Optional[str] = None
    auto_close: bool = False
    allow_early_closing: bool = True
    allow_pause: bool = True


class PlanUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    billing_cycle: Optional[str] = None
    min_quantity: Optional[int] = None
    availability_start: Optional[str] = None
    availability_end: Optional[str] = None
    auto_close: Optional[bool] = None
    allow_early_closing: Optional[bool] = None
    allow_pause: Optional[bool] = None


@router.get("/")
def list_plans(product_id: Optional[str] = None, _user=Depends(get_current_user)):
    db = get_service_supabase()
    q = db.table("plans").select("*, products(name)")
    if product_id:
        q = q.eq("product_id", product_id)
    return q.order("created_at", desc=True).execute().data


@router.get("/{plan_id}")
def get_plan(plan_id: str, _user=Depends(get_current_user)):
    db = get_service_supabase()
    result = db.table("plans").select("*, products(name)").eq("id", plan_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Plan not found")
    return result.data


@router.post("/", status_code=201)
def create_plan(payload: PlanCreate, _user=Depends(require_admin)):
    db = get_service_supabase()
    result = db.table("plans").insert(payload.model_dump()).execute()
    return result.data[0]


@router.patch("/{plan_id}")
def update_plan(plan_id: str, payload: PlanUpdate, _user=Depends(require_admin)):
    db = get_service_supabase()
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    result = db.table("plans").update(updates).eq("id", plan_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Plan not found")
    return result.data[0]


@router.delete("/{plan_id}", status_code=204)
def delete_plan(plan_id: str, _user=Depends(require_admin)):
    db = get_service_supabase()
    db.table("plans").delete().eq("id", plan_id).execute()
    return None
