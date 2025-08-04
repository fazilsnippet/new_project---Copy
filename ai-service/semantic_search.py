# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from pymongo import MongoClient
# from sentence_transformers import SentenceTransformer
# import numpy as np

# # Load the semantic model
# model = SentenceTransformer("all-MiniLM-L6-v2")

# # Flask app setup
# app = Flask(__name__)
# CORS(app)

# # MongoDB connection
# MONGO_URI = "mongodb+srv://fazil:fazil123@fazak.5hyej.mongodb.net/?retryWrites=true&w=majority&appName=fazak"
# client = MongoClient(MONGO_URI)
# print("Databases:", client.list_database_names())

# db = client["test"]
# products_collection = db["products"]

# # Semantic Search Endpoint
# @app.post("/semantic-search")
# def semantic_search():
#     text = request.form.get("text")
#     if not text:
#         return jsonify({"error": "Text input is required"}), 400

#     # Vectorize the search query
#     query_embedding = model.encode(text)

#     # Fetch all products with name & description
#     products = list(products_collection.find({}, {"_id": 1, "name": 1, "description": 1}))
#     if not products:
#         return jsonify({"error": "No products found"}), 404

#     product_embeddings = []
#     product_ids = []

#     for product in products:
#         combined_text = f"{product.get('name', '')} {product.get('description', '')}"
#         embedding = model.encode(combined_text)
#         product_embeddings.append(embedding)
#         product_ids.append(str(product["_id"]))

#     # Compute cosine similarity
#     scores = np.dot(product_embeddings, query_embedding) / (
#         np.linalg.norm(product_embeddings, axis=1) * np.linalg.norm(query_embedding)
#     )

#     # Sort by similarity
#     top_indices = np.argsort(scores)[::-1][:10]
#     similar_ids = [product_ids[i] for i in top_indices]

#     return jsonify({"similar_product_ids": similar_ids})

# if __name__ == "__main__":
#     app.run(port=8000, debug=True)


# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from pymongo import MongoClient
# from bson import ObjectId
# from sentence_transformers import SentenceTransformer
# import numpy as np

# # --- Flask App Setup ---
# app = Flask(__name__)
# CORS(app)

# # --- Load SentenceTransformer Model ---
# model = SentenceTransformer("all-MiniLM-L6-v2")

# # --- MongoDB Setup ---
# MONGO_URI = "mongodb+srv://fazil:fazil123@fazak.5hyej.mongodb.net/?retryWrites=true&w=majority&appName=fazak"
# client = MongoClient(MONGO_URI)
# db = client["test"]
# products_collection = db["products"]

# # --- Helper Function to Serialize BSON (Handles ObjectId Recursively) ---
# def serialize_bson(obj):
#     if isinstance(obj, list):
#         return [serialize_bson(item) for item in obj]
#     elif isinstance(obj, dict):
#         return {key: serialize_bson(value) for key, value in obj.items()}
#     elif isinstance(obj, ObjectId):
#         return str(obj)
#     else:
#         return obj

# # --- Semantic Search Endpoint ---
# @app.route("/semantic-search", methods=["POST"])
# def semantic_search():
#     text = request.form.get("text")
#     if not text:
#         return jsonify({"error": "Text input is required"}), 400

#     # Vectorize query
#     query_embedding = model.encode(text)
#     print("Query embedding:", query_embedding)

#     # Fetch all products
#     products = list(products_collection.find({}, {"_id": 1, "name": 1, "description": 1}))
#     print("Fetched products:", len(products))
#     if not products:
#         return jsonify({"error": "No products found"}), 404

#     product_embeddings = []
#     product_ids = []

#     for product in products:
#         combined_text = f"{product.get('name', '')} {product.get('description', '')}"
#         embedding = model.encode(combined_text)
#         product_embeddings.append(embedding)
#         product_ids.append(product["_id"])  # Keep as ObjectId

#     product_embeddings = np.array(product_embeddings)
#     query_embedding = np.array(query_embedding)

#     # Cosine similarity
#     scores = np.dot(product_embeddings, query_embedding) / (
#         np.linalg.norm(product_embeddings, axis=1) * np.linalg.norm(query_embedding)
#     )

#     print("Cosine scores:", scores)

#     # Top 10
#     top_indices = np.argsort(scores)[::-1][:10]
#     top_ids = [product_ids[i] for i in top_indices if scores[i] > 0.3]  # threshold to ignore weak matches
#     print("Top product IDs:", top_ids)

#     if not top_ids:
#         return jsonify([]), 200

#     top_products = list(products_collection.find({"_id": {"$in": top_ids}}))
#     return jsonify(serialize_bson(top_products)), 200

# # --- Default Route ---
# @app.route("/", methods=["GET"])
# def home():
#     return jsonify({"message": "Semantic search service running"}), 200

# # --- Run App ---
# if __name__ == "__main__":
#     app.run(port=8000, debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
import numpy as np

# Load the semantic model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Flask app setup
app = Flask(__name__)
CORS(app)

# MongoDB connection
MONGO_URI = "mongodb+srv://fazil:fazil123@fazak.5hyej.mongodb.net/?retryWrites=true&w=majority&appName=fazak"
client = MongoClient(MONGO_URI)
print("Databases:", client.list_database_names())

db = client["test"]
products_collection = db["products"]

# Semantic Search Endpoint
@app.post("/semantic-search")
def semantic_search():
    text = request.form.get("text")
    if not text:
        return jsonify({"error": "Text input is required"}), 400

    # Vectorize the search query
    query_embedding = model.encode(text)

    # Fetch all products with name & description
    products = list(products_collection.find({}, {"_id": 1, "name": 1, "description": 1}))
    if not products:
        return jsonify({"error": "No products found"}), 404

    product_embeddings = []
    product_ids = []

    for product in products:
        combined_text = f"{product.get('name', '')} {product.get('description', '')}"
        embedding = model.encode(combined_text)
        product_embeddings.append(embedding)
        product_ids.append(str(product["_id"]))

    # Convert to NumPy arrays
    product_embeddings = np.array(product_embeddings)
    query_embedding = np.array(query_embedding)

    # Compute cosine similarity
    similarities = np.dot(product_embeddings, query_embedding) / (
        np.linalg.norm(product_embeddings, axis=1) * np.linalg.norm(query_embedding)
    )

    # Apply similarity threshold
    threshold = 0.5
    top_indices = np.where(similarities >= threshold)[0]
    
    # Sort those by similarity
    sorted_indices = top_indices[np.argsort(similarities[top_indices])[::-1]]
    similar_ids = [product_ids[i] for i in sorted_indices[:10]]  # return top 10 only

    return jsonify({
        "similar_product_ids": similar_ids,
        "similarity_scores": [float(similarities[i]) for i in sorted_indices[:10]]
    })


if __name__ == "__main__":
    app.run(port=8000, debug=True)
