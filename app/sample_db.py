import os
import sqlite3

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAMPLE_DB_PATH = os.path.join(BASE_DIR, "sample_business.db")

def init_sample_database():
    """Initializes a sample business SQLite DB for out-of-the-box demo testing."""
    conn = sqlite3.connect(SAMPLE_DB_PATH)
    cursor = conn.cursor()

    # Create tables
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS categories (
        category_id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_name TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS products (
        product_id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_name TEXT NOT NULL,
        category_id INTEGER,
        price REAL NOT NULL,
        stock_quantity INTEGER DEFAULT 0,
        FOREIGN KEY(category_id) REFERENCES categories(category_id)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS customers (
        customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        city TEXT NOT NULL,
        segment TEXT NOT NULL,
        created_at DATE DEFAULT CURRENT_DATE
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS orders (
        order_id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        product_id INTEGER,
        quantity INTEGER NOT NULL,
        total_amount REAL NOT NULL,
        status TEXT NOT NULL,
        order_date DATE NOT NULL,
        FOREIGN KEY(customer_id) REFERENCES customers(customer_id),
        FOREIGN KEY(product_id) REFERENCES products(product_id)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS monthly_revenue (
        revenue_id INTEGER PRIMARY KEY AUTOINCREMENT,
        year INTEGER NOT NULL,
        month TEXT NOT NULL,
        total_revenue REAL NOT NULL,
        profit_margin REAL NOT NULL
    );
    """)

    # Populate sample data if empty
    cursor.execute("SELECT COUNT(*) FROM categories")
    if cursor.fetchone()[0] == 0:
        cursor.executemany("INSERT INTO categories (category_name) VALUES (?)", [
            ("Elektronika",),
            ("Kiyim-kechak",),
            ("Kitoblar",),
            ("Uy-ro'zg'or",)
        ])

        cursor.executemany("INSERT INTO products (product_name, category_id, price, stock_quantity) VALUES (?, ?, ?, ?)", [
            ("MacBook Pro M3 16GB", 1, 1850.00, 15),
            ("iPhone 15 Pro Max 256GB", 1, 1300.00, 30),
            ("Samsung Ultra HD TV 55", 1, 750.00, 20),
            ("Erkaklar kostyum-shim", 2, 220.00, 50),
            ("Ayollar bahoriy ko'ylagi", 2, 85.00, 80),
            ("Python va AI qo'llanmasi", 3, 25.00, 120),
            ("SQL va Data Engineering", 3, 30.00, 95),
            ("Kofe mashinasi DeLonghi", 4, 380.00, 18)
        ])

        cursor.executemany("INSERT INTO customers (full_name, city, segment) VALUES (?, ?, ?)", [
            ("Alisher Navoiy LLC", "Toshkent", "Enterprise"),
            ("Javohir Karimov", "Samarqand", "Individual"),
            ("Zulxumor Saidova", "Farg'ona", "Individual"),
            ("TechSoft MCHJ", "Toshkent", "B2B"),
            ("Otabek Mahmudov", "Buxoro", "Individual"),
            ("EduVision Markazi", "Namangan", "B2B")
        ])

        cursor.executemany("INSERT INTO orders (customer_id, product_id, quantity, total_amount, status, order_date) VALUES (?, ?, ?, ?, ?, ?)", [
            (1, 1, 5, 9250.00, "Yetkazib berildi", "2026-01-15"),
            (1, 2, 10, 13000.00, "Yetkazib berildi", "2026-01-18"),
            (2, 6, 2, 50.00, "Yetkazib berildi", "2026-02-01"),
            (3, 5, 3, 255.00, "Yetkazib berildi", "2026-02-05"),
            (4, 3, 4, 3000.00, "Jarayonda", "2026-02-10"),
            (5, 7, 1, 30.00, "Yetkazib berildi", "2026-02-12"),
            (6, 8, 2, 760.00, "Bekor qilindi", "2026-02-14"),
            (2, 2, 1, 1300.00, "Yetkazib berildi", "2026-02-14")
        ])

        cursor.executemany("INSERT INTO monthly_revenue (year, month, total_revenue, profit_margin) VALUES (?, ?, ?, ?)", [
            (2025, "Yanvar", 45000.00, 24.5),
            (2025, "Fevral", 52000.00, 26.0),
            (2025, "Mart", 48000.00, 25.2),
            (2025, "Aprel", 61000.00, 28.1),
            (2026, "Yanvar", 68000.00, 29.4),
            (2026, "Fevral", 74000.00, 31.2)
        ])

    conn.commit()
    conn.close()
    return SAMPLE_DB_PATH

if __name__ == "__main__":
    init_sample_database()
