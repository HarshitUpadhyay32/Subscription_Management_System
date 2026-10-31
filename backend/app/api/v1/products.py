"""
Products router — CRUD for products and their embedded plan variants.
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Any
from app.core.supabase_client import get_service_supabase
from app.api.v1.auth import get_current_user, require_admin

router = APIRouter()


class ProductCreate(BaseModel):
    name: str
    type: str = "service"
    sales_price: float
    cost_price: float = 0.0
    description: Optional[str] = None
    variants: Optional[List[Any]] = []
    is_active: bool = True


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    sales_price: Optional[float] = None
    cost_price: Optional[float] = None
    description: Optional[str] = None
    variants: Optional[List[Any]] = None
    is_active: Optional[bool] = None


@router.get("/")
def list_products(_user=Depends(get_current_user)):
    db = get_service_supabase()
    result = db.table("products").select("*, plans(*)").order("created_at", desc=True).execute()
    return result.data


@router.get("/{product_id}")
def get_product(product_id: str, _user=Depends(get_current_user)):
    db = get_service_supabase()
    result = db.table("products").select("*, plans(*)").eq("id", product_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return result.data


@router.post("/", status_code=201)
def create_product(payload: ProductCreate, _user=Depends(require_admin)):
    db = get_service_supabase()
    result = db.table("products").insert(payload.model_dump()).execute()
    return result.data[0]


@router.patch("/{product_id}")
def update_product(product_id: str, payload: ProductUpdate, _user=Depends(require_admin)):
    db = get_service_supabase()
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    result = db.table("products").update(updates).eq("id", product_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return result.data[0]


@router.delete("/{product_id}", status_code=204)
def delete_product(product_id: str, _user=Depends(require_admin)):
    db = get_service_supabase()
    db.table("products").delete().eq("id", product_id).execute()
    return None
