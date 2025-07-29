### Vfriends Full Python App (Terminal MVP for VS Code)

# STEP 1: db.py — Database and Backend Logic

import sqlite3
from datetime import datetime

conn = sqlite3.connect('vfriends.db')
cursor = conn.cursor()

def setup_db():
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            role TEXT,
            points INTEGER DEFAULT 0,
            streak INTEGER DEFAULT 0,
            last_active TEXT
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS doubts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT,
            asker_id INTEGER,
            solver_id INTEGER,
            is_solved INTEGER DEFAULT 0
        )
    ''')
    conn.commit()

def add_user(name, role):
    now = datetime.now().strftime("%Y-%m-%d")
    cursor.execute('INSERT INTO users (name, role, last_active) VALUES (?, ?, ?)', (name, role, now))
    conn.commit()
    return cursor.lastrowid

def get_users_by_role(role):
    cursor.execute('SELECT * FROM users WHERE role = ?', (role,))
    return cursor.fetchall()

def add_doubt(question, asker_id):
    cursor.execute('INSERT INTO doubts (question, asker_id) VALUES (?, ?)', (question, asker_id))
    conn.commit()

def get_unsolved_doubts():
    cursor.execute('SELECT * FROM doubts WHERE is_solved = 0')
    return cursor.fetchall()

def solve_doubt(doubt_id, solver_id):
    cursor.execute('UPDATE doubts SET is_solved = 1, solver_id = ? WHERE id = ?', (solver_id, doubt_id))
    cursor.execute('UPDATE users SET points = points + 10 WHERE id = ?', (solver_id,))
    update_streak(solver_id)
    conn.commit()

def update_streak(user_id):
    now = datetime.now().strftime("%Y-%m-%d")
    cursor.execute('SELECT last_active, streak FROM users WHERE id = ?', (user_id,))
    result = cursor.fetchone()
    if not result:
        return
    last_active, streak = result
    
    if last_active == now:
        return  # Already active today
    elif (datetime.now() - datetime.strptime(last_active, "%Y-%m-%d")).days == 1:
        streak += 1
    else:
        streak = 1
    
    cursor.execute('UPDATE users SET streak = ?, last_active = ? WHERE id = ?', (streak, now, user_id))
    conn.commit()

def get_leaderboard():
    cursor.execute('SELECT name, points, streak FROM users ORDER BY points DESC LIMIT 5')
    return cursor.fetchall()