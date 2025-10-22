

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
# MONGO_URI = "mongodb+srv://fazil:fazil123@fazak.5hyej.mongodb.net/test?retryWrites=true&w=majority&appName=fazak"
# client = MongoClient(MONGO_URI)
# print("Databases:", client.list_database_names())

# db = client["test"]
# products_collection = db["products"]
# # @app.post("/semantic-search")                                   # register this function as a POST route at /semantic-search
# # def semantic_search():                                          # define the Flask view function
# #     data = request.get_json() or request.form                   # try to parse JSON body; if none, fall back to form data
# #     text = data.get("text")                                     # extract the "text" field from the parsed input
# #     if not text:                                                # if text is missing or empty
# #         return jsonify({"error": "Text input is required"}), 400# return a 400 Bad Request with an explanatory JSON message

# #     # Normalize query embedding
# #     query_embedding = model.encode(text, convert_to_numpy=True) # encode the input text into a numeric embedding (NumPy array)
# #     query_embedding = query_embedding / np.linalg.norm(query_embedding)  # scale the query vector to unit length (L2-normalize)

# #     # Fetch all products (include fields you want in response)
# #     products = list(products_collection.find({}, {               # query MongoDB for all products, projecting only selected fields
# #         "_id": 1,
# #         "name": 1,
# #         "description": 1,
# #         "price": 1,
# #         "images": 1
# #     }))
# #     if not products:                                             # if no products were found in the DB
# #         return jsonify({"error": "No products found"}), 404      # return 404 Not Found with a message

# #     product_embeddings, product_docs = [], []                     # prepare lists to hold embeddings and lightweight product docs
# #     for product in products:                                      # iterate over every fetched product document
# #         combined_text = f"{product.get('name', '')} {product.get('description', '')}"  # combine name + description for a single text input
# #         embedding = model.encode(combined_text, convert_to_numpy=True)  # encode the combined text into an embedding (NumPy array)
# #         embedding = embedding / np.linalg.norm(embedding)         # normalize the product embedding to unit length
# #         product_embeddings.append(embedding)                      # append the normalized embedding to our list

# #         # Store full product doc for later
# #         product_docs.append({                                     # create a small dict with fields the API will return to the client
# #             "id": str(product["_id"]),                            # convert MongoDB ObjectId to string for JSON
# #             "name": product.get("name", ""),                      # product name (or empty string if missing)
# #             "description": product.get("description", ""),        # product description (or empty string if missing)
# #             "price": product.get("price", 0),                     # product price (or 0 if missing)
# #             "images": product.get("images", [])                   # product images array (or empty list if missing)
# #         })

# #     product_embeddings = np.array(product_embeddings)             # convert list of embeddings into a NumPy array shape (N, D)

# #     # Cosine similarity (dot product since normalized)
# #     similarities = np.dot(product_embeddings, query_embedding)    # compute similarity scores: dot product with the normalized query

# #     # Threshold + top results
# #     threshold = 0.4                                              # similarity threshold — only keep items with score >= this
# #     top_indices = np.where(similarities >= threshold)[0]         # indices of products meeting the threshold
# #     sorted_indices = top_indices[np.argsort(similarities[top_indices])[::-1]]  # sort those indices by descending similarity

# #     # Return top 10 with details + score
# #     similar_products = []                                        # prepare final results list
# #     for i in sorted_indices[:10]:                                # limit to top 10 matches (or fewer if less pass the threshold)
# #         product = product_docs[i]                                # retrieve the corresponding stored product dict
# #         product["similarity"] = float(similarities[i])           # add the similarity score (as a plain float for JSON)
# #         similar_products.append(product)                         # add product dict to the results list

# #     return jsonify({"results": similar_products})                # return a JSON response with the matching products and scores


# # returns best 5 matching proudcts
# @app.post("/semantic-search")
# def semantic_search():
#     data = request.get_json() or request.form
#     text = data.get("text")
#     if not text:
#         return jsonify({"error": "Text input is required"}), 400

#     query_embedding = model.encode(text, convert_to_numpy=True)
#     query_embedding = query_embedding / np.linalg.norm(query_embedding)

#     products = list(products_collection.find({}, {
#         "_id": 1,
#         "name": 1,
#         "description": 1,
#         "price": 1,
#         "images": 1
#     }))
#     if not products:
#         return jsonify({"error": "No products found"}), 404

#     product_embeddings, product_docs = [], []
#     for product in products:
#         combined_text = f"{product.get('name', '')} {product.get('description', '')}"
#         embedding = model.encode(combined_text, convert_to_numpy=True)
#         embedding = embedding / np.linalg.norm(embedding)
#         product_embeddings.append(embedding)
#         product_docs.append({
#             "id": str(product["_id"]),
#             "name": product.get("name", ""),
#             "description": product.get("description", ""),
#             "price": product.get("price", 0),
#             "images": product.get("images", [])
#         })

#     product_embeddings = np.array(product_embeddings)
#     similarities = np.dot(product_embeddings, query_embedding)

#     # Sort all products by similarity (descending)
#     sorted_indices = np.argsort(similarities)[::-1]

#     # Always return at least 5 (or fewer if not enough products in DB)
#     num_results = min(5, len(sorted_indices))
#     similar_products = []
#     for i in sorted_indices[:num_results]:
#         product = product_docs[i]
#         product["similarity"] = float(similarities[i])
#         similar_products.append(product)

#     return jsonify({"results": similar_products})


# # --- Default Route ---
# @app.route("/", methods=["GET"])
# def home():
#     return jsonify({"message": "Semantic search service running"}), 200

# # --- Run App ---
# if __name__ == "__main__":
#     app.run(port=8000, debug=True)





#2nd test

import os
import math
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from elasticsearch import Elasticsearch, helpers
from sentence_transformers import SentenceTransformer

# ---------------------------
ES_HOST = "https://localhost:9200"
ES_USER = "elastic"
ES_PASS = "elastic"  # same one shown when you first installed Elasticsearch
ES_CA_CERT = "C:\elasticsearch-9.1.5\config\certs/http_ca.crt"
ES_INDEX = "products"   # 👈 this was missing

# Correct connection for SSL-enabled Elasticsearch
es = Elasticsearch(
    ES_HOST,
    basic_auth=(ES_USER, ES_PASS),
    ca_certs=ES_CA_CERT,
)

# Quick test
try:
    print("Connected:", es.info())
except Exception as e:
    print("Connection failed:", e)


MONGO_URI = os.getenv("MONGO_URI",
                      "mongodb+srv://fazil:fazil123@fazak.5hyej.mongodb.net/test?retryWrites=true&w=majority&appName=fazak")
MONGO_DB = os.getenv("MONGO_DB", "test")
MONGO_COLLECTION = os.getenv("MONGO_COLLECTION", "products")

EMBED_MODEL_NAME = os.getenv("EMBED_MODEL", "all-MiniLM-L6-v2")  # 384 dims
EMBED_DIMS = 384  # must match model

# Hybrid weights
W_SEMANTIC = float(os.getenv("W_SEMANTIC", 0.6))
W_LEXICAL = float(os.getenv("W_LEXICAL", 0.4))

# Search defaults
LEXICAL_TOP_K = int(os.getenv("LEXICAL_TOP_K", 200))   # candidates from lexical search
RETURN_K = int(os.getenv("RETURN_K", 10))             # final returned results
RERANK_TOP_K = int(os.getenv("RERANK_TOP_K", 10))     # top-k that will be reranked by cross-encoder

# Optional reranker: set env RERANKER_MODEL to cross-encoder model name to enable
RERANKER_MODEL = os.getenv("RERANKER_MODEL", None)  # e.g., "cross-encoder/ms-marco-MiniLM-L-6-v2"

# ---------------------------
# INIT
# ---------------------------
app = Flask(__name__)
CORS(app)

# # ES client
# es_kwargs = {"hosts": [ES_HOST]}
# if ES_AUTH:
#     es_kwargs["http_auth"] = ES_AUTH
# if ES_CA_CERTS:
#     es_kwargs["ca_certs"] = ES_CA_CERTS
# es = Elasticsearch(**es_kwargs)

# Mongo client
mongo_client = MongoClient(MONGO_URI)
db = mongo_client[MONGO_DB]
products_collection = db[MONGO_COLLECTION]

print("Products count:", db["products"].count_documents({}))

# embedding model (SentenceTransformer)
embed_model = SentenceTransformer(EMBED_MODEL_NAME)

# optional reranker
cross_encoder = None
if RERANKER_MODEL:
    try:
        from sentence_transformers import CrossEncoder
        cross_encoder = CrossEncoder(RERANKER_MODEL)
        app.logger.info(f"Loaded reranker: {RERANKER_MODEL}")
    except Exception as e:
        app.logger.warning(f"Unable to load reranker {RERANKER_MODEL}: {e}")
        cross_encoder = None

# ---------------------------
# Helper: create index & mapping
# ---------------------------
def create_index_if_not_exists():
    if es.indices.exists(index=ES_INDEX):
        app.logger.info(f"Index '{ES_INDEX}' already exists.")
        return

    mapping = {
        "mappings": {
            "properties": {
                "name": {
                    "type": "text",
                    "analyzer": "standard",
                    "fields": {"keyword": {"type": "keyword"}}
                },
                "description": {"type": "text", "analyzer": "standard"},
                "brand": {"type": "keyword"},
                "price": {"type": "double"},
                "images": {"type": "keyword"},
                "embedding": {
                    "type": "dense_vector",
                    "dims": EMBED_DIMS,
                    "index": True,
                    "similarity": "cosine"
                }
            }
        }
    }

    es.indices.create(index=ES_INDEX, body=mapping)
    app.logger.info(f"✅ Created index '{ES_INDEX}' with mapping.")

# ---------------------------
# Helper: sync embeddings from MongoDB -> Elasticsearch
# - If a product has no embedding in MongoDB, compute and save it to MongoDB first.
# - Then index (upsert) document into ES with embedding and text fields.
# ---------------------------
from bson import ObjectId

def sync_all_embeddings(batch_size=500):
    create_index_if_not_exists()
    cursor = products_collection.find({})
    actions = []
    count = 0

    for product in cursor:
        pid = str(product.get("_id"))
        name = product.get("name", "") or ""
        description = product.get("description", "") or ""
        images = product.get("images", [])
        price = product.get("price", 0)
        
        # Convert brand safely
        brand_val = product.get("brand", "")
        if isinstance(brand_val, dict) and "$oid" in brand_val:
            brand = str(brand_val["$oid"])
        elif isinstance(brand_val, ObjectId):
            brand = str(brand_val)
        else:
            brand = str(brand_val)

        # Ensure embedding
        embedding = product.get("embedding")
        if not embedding:
            combined = f"{name} {description}"
            vec = embed_model.encode(combined, normalize_embeddings=True).astype(float).tolist()
            products_collection.update_one({"_id": ObjectId(pid)}, {"$set": {"embedding": vec}})
            embedding = vec

        doc = {
            "name": name,
            "description": description,
            "brand": brand,
            "price": price,
            "images": images,
            "embedding": embedding
        }

        actions.append({
            "_op_type": "index",
            "_index": ES_INDEX,
            "_id": pid,
            "_source": doc
        })

        count += 1
        if len(actions) >= batch_size:
            helpers.bulk(es, actions)
            actions = []
            app.logger.info(f"Indexed {count} so far...")

    if actions:
        helpers.bulk(es, actions)
    cursor.close()
    app.logger.info(f"✅ Sync complete. Total indexed: {count}")
    return {"indexed": count}


# ---------------------------
# Helper: cosine similarity (numpy)
# ---------------------------
def cosine_similarity(a: np.ndarray, b: np.ndarray):
    # expects 1-D arrays
    if a.ndim != 1 or b.ndim != 1:
        a = a.reshape(-1)
        b = b.reshape(-1)
    denom = (np.linalg.norm(a) * np.linalg.norm(b))
    if denom == 0:
        return 0.0
    return float(np.dot(a, b) / denom)

# ---------------------------
# Search endpoint: hybrid workflow
# 1) compute query embedding
# 2) lexical search in ES to get top N candidates + their _score
# 3) fetch candidate embeddings (from ES _source or MongoDB)
# 4) compute semantic similarity in Python
# 5) normalize lexical and semantic scores, combine using weights
# 6) optional cross-encoder rerank on top M
# ---------------------------
@app.route("/search", methods=["POST"])
def search():
    body = request.get_json() or request.form
    query_text = body.get("text") or body.get("query")
    if not query_text:
        return jsonify({"error": "Missing 'text' in request body"}), 400

    # 1) query embedding
    qv = embed_model.encode(query_text)
    qv = qv / np.linalg.norm(qv)

    # 2) lexical search in ES
    es_query = {
        "size": LEXICAL_TOP_K,
        "query": {
            "multi_match": {
                "query": query_text,
                "fields": ["name^3", "description"]
            }
        }
    }
    es_res = es.search(index=ES_INDEX, body=es_query)
    hits = es_res.get("hits", {}).get("hits", [])
    if not hits:
        return jsonify({"results": []}), 200

    # prepare candidate list
    candidate_ids = []
    candidate_lex_scores = {}
    candidate_embeddings = {}

    for h in hits:
        doc_id = h["_id"]
        candidate_ids.append(doc_id)
        candidate_lex_scores[doc_id] = h["_score"]
        # prefer embedding from ES _source if present
        src = h.get("_source", {})
        emb = src.get("embedding")
        if emb is not None:
            candidate_embeddings[doc_id] = np.array(emb, dtype=float)
        else:
            # fallback - fetch from MongoDB
            try:
                prod = products_collection.find_one({"_id": ObjectId(doc_id)})
                if prod and prod.get("embedding") is not None:
                    candidate_embeddings[doc_id] = np.array(prod["embedding"], dtype=float)
            except Exception:
                # doc_id might be stringified ObjectId; try string id
                prod = products_collection.find_one({"_id": doc_id})
                if prod and prod.get("embedding") is not None:
                    candidate_embeddings[doc_id] = np.array(prod["embedding"], dtype=float)

    # 3) semantic similarities
    semantic_scores = {}
    for cid in candidate_ids:
        emb = candidate_embeddings.get(cid)
        if emb is None:
            # as last resort, compute embedding from the product text (expensive)
            prod = products_collection.find_one({"_id": cid})
            if prod:
                combined = f"{prod.get('name','')} {prod.get('description','')}"
                emb = embed_model.encode(combined).astype(float)
                # do not persist here
            else:
                emb = np.zeros(EMBED_DIMS, dtype=float)
        # normalize embeddings before cosine
        if np.linalg.norm(emb) != 0:
            emb_norm = emb / np.linalg.norm(emb)
        else:
            emb_norm = emb
        sim = cosine_similarity(emb_norm, qv)
        semantic_scores[cid] = sim

    # 4) normalize lexical scores to [0,1] using max observed score
    max_lex = max(candidate_lex_scores.values()) if candidate_lex_scores else 1.0
    normalized_lex = {cid: (candidate_lex_scores[cid] / max_lex) for cid in candidate_ids}

    # 5) normalize semantic (-1..1) -> (0..1)
    normalized_sem = {cid: (semantic_scores[cid] + 1.0) / 2.0 for cid in candidate_ids}

    # 6) fused final score
    fused_scores = {}
    for cid in candidate_ids:
        fused = W_SEMANTIC * normalized_sem.get(cid, 0.0) + W_LEXICAL * normalized_lex.get(cid, 0.0)
        fused_scores[cid] = fused

    # 7) build candidate list sorted by fused score (desc)
    sorted_cands = sorted(candidate_ids, key=lambda x: fused_scores.get(x, 0.0), reverse=True)

    # 8) optional cross-encoder rerank on top RERANK_TOP_K
    final_order = sorted_cands
    if cross_encoder:
        rerank_slice = sorted_cands[:RERANK_TOP_K]
        # prepare pairs (query, text)
        pairs = []
        id_to_text = {}
        for cid in rerank_slice:
            # fetch text for reranker
            src = es.get(index=ES_INDEX, id=cid, ignore=[404]).get("_source", {})
            text_for = src.get("name", "") + " " + src.get("description", "")
            id_to_text[cid] = text_for
            pairs.append((query_text, text_for))
        try:
            scores = cross_encoder.predict(pairs)
            cid_scores = dict(zip(rerank_slice, scores.tolist()))
            # replace top part of final_order with reranked ordering
            reranked = sorted(rerank_slice, key=lambda x: cid_scores.get(x, 0.0), reverse=True)
            final_order = reranked + [c for c in sorted_cands if c not in rerank_slice]
        except Exception as e:
            app.logger.warning(f"Reranker failed: {e}")
            final_order = sorted_cands

    # 9) trim to RETURN_K and fetch full product docs from MongoDB in order
    final_ids = final_order[:RETURN_K]
    # fetch preserving order
    results = []
    for fid in final_ids:
        prod = None
        # try id as string first (we stored ES id as str(_id))
        prod = products_collection.find_one({"_id": fid})
        if not prod:
            # try ObjectId conversion
            try:
                prod = products_collection.find_one({"_id": ObjectId(fid)})
            except Exception:
                prod = None
        if prod is None:
            # try ES source fallback
            esdoc = es.get(index=ES_INDEX, id=fid, ignore=[404]).get("_source", {})
            prod = {
                "name": esdoc.get("name"),
                "description": esdoc.get("description"),
                "price": esdoc.get("price"),
                "images": esdoc.get("images", []),
                "_id": fid
            }
        # attach scores
        prod_result = {
            "id": str(fid),
            "name": prod.get("name"),
            "description": prod.get("description"),
            "price": prod.get("price"),
            "images": prod.get("images", []),
            "semantic_score": float(semantic_scores.get(fid, 0.0)),
            "lexical_score": float(candidate_lex_scores.get(fid, 0.0)),
            "fused_score": float(fused_scores.get(fid, 0.0))
        }
        results.append(prod_result)

    return jsonify({"query": query_text, "results": results}), 200

# ---------------------------
# Utility endpoints
# ---------------------------
@app.route("/create_index", methods=["POST"])
def create_index_endpoint():
    create_index_if_not_exists()
    return jsonify({"status": "index_created_or_exists"}), 200

@app.route("/sync_embeddings", methods=["POST"])
def sync_embeddings_endpoint():
    res = sync_all_embeddings()
    return jsonify(res), 200



@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Hybrid search service (MongoDB primary, ES secondary) running."}), 200

# ---------------------------
# Run
# ---------------------------
if __name__ == "__main__":
    # Quick connectivity checks
    try:
        app.logger.info("Checking Elasticsearch connectivity...")
        if not es.ping():
            app.logger.error("Cannot connect to Elasticsearch. Check ES_HOST and credentials.")
        else:
            app.logger.info("Connected to Elasticsearch.")
    except Exception as e:
        app.logger.error(f"Elasticsearch ping failed: {e}")

    try:
        app.logger.info("MongoDB databases: %s", mongo_client.list_database_names())
    except Exception:
        app.logger.warning("Could not list MongoDB DBs at startup.")

    app.run(host="0.0.0.0", port=8000, debug=True)
