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
MONGO_URI = "mongodb+srv://fazil:fazil123@fazak.5hyej.mongodb.net/test?retryWrites=true&w=majority&appName=fazak"
client = MongoClient(MONGO_URI)
print("Databases:", client.list_database_names())

db = client["test"]
products_collection = db["products"]
@app.post("/semantic-search")                                   # register this function as a POST route at /semantic-search
def semantic_search():                                          # define the Flask view function
    data = request.get_json() or request.form                   # try to parse JSON body; if none, fall back to form data
    text = data.get("text")                                     # extract the "text" field from the parsed input
    if not text:                                                # if text is missing or empty
        return jsonify({"error": "Text input is required"}), 400# return a 400 Bad Request with an explanatory JSON message

    # Normalize query embedding
    query_embedding = model.encode(text, convert_to_numpy=True) # encode the input text into a numeric embedding (NumPy array)
    query_embedding = query_embedding / np.linalg.norm(query_embedding)  # scale the query vector to unit length (L2-normalize)

    # Fetch all products (include fields you want in response)
    products = list(products_collection.find({}, {               # query MongoDB for all products, projecting only selected fields
        "_id": 1,
        "name": 1,
        "description": 1,
        "price": 1,
        "images": 1
    }))
    if not products:                                             # if no products were found in the DB
        return jsonify({"error": "No products found"}), 404      # return 404 Not Found with a message

    product_embeddings, product_docs = [], []                     # prepare lists to hold embeddings and lightweight product docs
    for product in products:                                      # iterate over every fetched product document
        combined_text = f"{product.get('name', '')} {product.get('description', '')}"  # combine name + description for a single text input
        embedding = model.encode(combined_text, convert_to_numpy=True)  # encode the combined text into an embedding (NumPy array)
        embedding = embedding / np.linalg.norm(embedding)         # normalize the product embedding to unit length
        product_embeddings.append(embedding)                      # append the normalized embedding to our list

        # Store full product doc for later
        product_docs.append({                                     # create a small dict with fields the API will return to the client
            "id": str(product["_id"]),                            # convert MongoDB ObjectId to string for JSON
            "name": product.get("name", ""),                      # product name (or empty string if missing)
            "description": product.get("description", ""),        # product description (or empty string if missing)
            "price": product.get("price", 0),                     # product price (or 0 if missing)
            "images": product.get("images", [])                   # product images array (or empty list if missing)
        })

    product_embeddings = np.array(product_embeddings)             # convert list of embeddings into a NumPy array shape (N, D)

    # Cosine similarity (dot product since normalized)
    similarities = np.dot(product_embeddings, query_embedding)    # compute similarity scores: dot product with the normalized query

    # Threshold + top results
    threshold = 0.5                                              # similarity threshold — only keep items with score >= this
    top_indices = np.where(similarities >= threshold)[0]         # indices of products meeting the threshold
    sorted_indices = top_indices[np.argsort(similarities[top_indices])[::-1]]  # sort those indices by descending similarity

    # Return top 10 with details + score
    similar_products = []                                        # prepare final results list
    for i in sorted_indices[:10]:                                # limit to top 10 matches (or fewer if less pass the threshold)
        product = product_docs[i]                                # retrieve the corresponding stored product dict
        product["similarity"] = float(similarities[i])           # add the similarity score (as a plain float for JSON)
        similar_products.append(product)                         # add product dict to the results list

    return jsonify({"results": similar_products})                # return a JSON response with the matching products and scores

# --- Default Route ---
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Semantic search service running"}), 200

# --- Run App ---
if __name__ == "__main__":
    app.run(port=8000, debug=True)