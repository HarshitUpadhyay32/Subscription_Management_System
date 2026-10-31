"""
Analytics router — Revenue metrics and dashboard KPIs.
All data is computed live from Supabase for accuracy.
"""
from fastapi import APIRouter, Depends
from app.core.supabase_client import get_service_supabase
from app.api.v1.auth import require_staff_or_admin
from datetime import date, timedelta
from collections import defaultdict

router = APIRouter()


@router.get("/dashboard")
def dashboard_metrics(_user=Depends(require_staff_or_admin)):
    """Return all KPIs needed for the admin/staff dashboard."""
    db = get_service_supabase()

    # Active subscriptions
    subs = db.table("subscriptions").select("id, status, total_amount, plan_id, plans(billing_cycle)").execute().data
    active_subs = [s for s in subs if s["status"] == "active"]
    total_subs = len(subs)
    active_count = len(active_subs)

    # MRR — sum of monthly-equivalent amounts for active subs
    cycle_to_months = {"daily": 1/30, "weekly": 1/4, "monthly": 1, "yearly": 12}
    mrr = 0.0
    for s in active_subs:
        cycle = (s.get("plans") or {}).get("billing_cycle", "monthly")
        months = cycle_to_months.get(cycle, 1)
        mrr += float(s.get("total_amount") or 0) / months

    # Invoices
    invoices = db.table("invoices").select("id, status, total_amount, paid_amount, due_date").execute().data
    total_invoices = len(invoices)
    paid_invoices = [i for i in invoices if i["status"] == "paid"]
    pending_invoices = [i for i in invoices if i["status"] == "confirmed"]
    today = date.today().isoformat()
    overdue_invoices = [
        i for i in invoices
        if i["status"] in ("confirmed", "draft") and (i.get("due_date") or "") < today
    ]
    total_revenue = sum(float(i.get("paid_amount") or 0) for i in invoices)
    outstanding = sum(
        float(i.get("total_amount") or 0) - float(i.get("paid_amount") or 0)
        for i in invoices if i["status"] != "paid"
    )

    # Customers
    customers = db.table("customers").select("id").execute().data
    total_customers = len(customers)

    # Subscription status distribution
    status_dist = defaultdict(int)
    for s in subs:
        status_dist[s["status"]] += 1

    return {
        "total_revenue": round(total_revenue, 2),
        "mrr": round(mrr, 2),
        "total_active_subscriptions": active_count,
        "total_subscriptions": total_subs,
        "total_customers": total_customers,
        "total_invoices": total_invoices,
        "paid_invoices": len(paid_invoices),
        "pending_invoices": len(pending_invoices),
        "overdue_invoices": len(overdue_invoices),
        "outstanding_amount": round(outstanding, 2),
        "subscription_status_distribution": dict(status_dist),
    }


@router.get("/revenue-trend")
def revenue_trend(months: int = 6, _user=Depends(require_staff_or_admin)):
    """Return monthly revenue for the last N months."""
    db = get_service_supabase()
    invoices = db.table("invoices").select("paid_amount, invoice_date, status").execute().data

    today = date.today()
    monthly = {}
    for i in range(months - 1, -1, -1):
        d = today.replace(day=1) - timedelta(days=30 * i)
        key = d.strftime("%b %Y")
        monthly[key] = 0.0

    for inv in invoices:
        if inv["status"] == "paid" and inv.get("invoice_date"):
            d = date.fromisoformat(inv["invoice_date"])
            key = d.strftime("%b %Y")
            if key in monthly:
                monthly[key] += float(inv.get("paid_amount") or 0)

    return [{"month": k, "revenue": round(v, 2)} for k, v in monthly.items()]
