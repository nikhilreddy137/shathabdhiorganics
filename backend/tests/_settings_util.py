"""Helper to inspect / clear / restore the shopify settings doc during testing."""
import json
import sys

from dotenv import dotenv_values
from pymongo import MongoClient

env = dotenv_values("/app/backend/.env")
db = MongoClient(env["MONGO_URL"])[env["DB_NAME"]]

cmd = sys.argv[1]
if cmd == "show":
    doc = db.settings.find_one({"_id": "shopify"})
    if doc:
        doc = {k: (v[:6] + "***" if isinstance(v, str) and "token" in k else v) for k, v in doc.items()}
    print(json.dumps(doc, default=str))
elif cmd == "clear":
    db.settings.delete_one({"_id": "shopify"})
    print("cleared")
elif cmd == "restore":
    db.settings.update_one(
        {"_id": "shopify"},
        {"$set": {"domain": "c33fcd-d5.myshopify.com", "admin_access_token": "shpat_placeholder_invalid"}},
        upsert=True,
    )
    print(json.dumps(db.settings.find_one({"_id": "shopify"}), default=str))
elif cmd == "counts":
    print("products", db.products.count_documents({}), "categories", db.categories.count_documents({}))
