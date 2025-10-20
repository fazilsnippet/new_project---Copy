from pymongo import MongoClient
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")
client = MongoClient("mongodb+srv://fazil:fazil123@fazak.5hyej.mongodb.net/?retryWrites=true&w=majority&appName=fazak")
products_collection = client["test"]["products"]

for product in products_collection.find():
    combined_text = f"{product.get('name', '')} {product.get('description', '')}"
    embedding = model.encode(combined_text).tolist()
    products_collection.update_one({"_id": product["_id"]}, {"$set": {"embedding": embedding}})