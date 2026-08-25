import json
import mysql.connector
from backend.core.config import DB_CONFIG
from backend.core.logger import logger

def get_db_cursor():
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()
    return conn, cursor

def get_chat_history(session_id: str, limit: int = 6) -> str:
    logger.info("get_chat_history : session_id: %s", session_id)
    try:
        connection, cursor = get_db_cursor()
        cursor.execute(
            """
            SELECT role, message
            FROM chat_messages
            WHERE session_id=%s
            ORDER BY message_id DESC
            LIMIT %s OFFSET 1
            """,
            (session_id, limit)
        )
        rows = cursor.fetchall()
        cursor.close()
        connection.close()
        rows.reverse()
        history = []
        
        for role, message in rows:
            label = "User" if role == "user" else "Assistant"
            history.append(f"{label}: {message}")

        logger.info("History: %s", json.dumps(history))
        return "\n".join(history)
    except Exception as e:
        logger.exception(f"Failed to fetch chat history from DB: {e}")
        return ""

def save_chat_session(session_id: str, user_id: int):
    """
    Save a newly created chat session into MySQL.
    """
    try:
        connection, cursor = get_db_cursor()
        query = """
            INSERT INTO chat_sessions (
                session_id,
                user_id
            )
            VALUES (%s, %s)
        """
        cursor.execute(query, (session_id, user_id))
        connection.commit()
        cursor.close()
        connection.close()
    except Exception as e:
        logger.exception(f"Failed to save chat session: {e}")

def save_chat_message(session_id: str, role: str, message: str):
    """
    Save a chat message into chat_messages table.
    """
    try:
        connection, cursor = get_db_cursor()
        query = """
            INSERT INTO chat_messages (
                session_id,
                role,
                message
            )
            VALUES (%s, %s, %s)
        """
        cursor.execute(
            query,
            (
                session_id,
                role,
                message
            )
        )
        connection.commit()
        cursor.close()
        connection.close()
    except Exception as e:
        logger.exception(f"Failed to save chat message: {e}")
