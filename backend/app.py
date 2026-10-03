import os

import psycopg2
from flask import Flask, jsonify
from flask_cors import CORS


app = Flask(__name__)

CORS(app, origins=[
    "http://localhost:5173",
    "https://web.noelav.space",
    "http://web.noelav.space",
])


def get_db_connection():
    return psycopg2.connect(
        host=os.environ["DB_HOST"],
        port=os.environ.get("DB_PORT", "5432"),
        dbname=os.environ["DB_NAME"],
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
    )


@app.get("/health")
def health():
    return jsonify({
        "status": "healthy"
    })


@app.get("/api/message")
def message():
    try:
        conn = get_db_connection()

        with conn.cursor() as cursor:
            cursor.execute("SELECT NOW();")
            db_time = cursor.fetchone()[0]

        conn.close()

        return jsonify({
            "message": "Hello from the ECS backend!",
            "database": "connected",
            "database_time": str(db_time)
        })

    except Exception as exc:
        app.logger.exception("Database connection failed")

        return jsonify({
            "message": "Backend is running, but database connection failed",
            "error": str(exc)
        }), 500


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", "8080"))
    )