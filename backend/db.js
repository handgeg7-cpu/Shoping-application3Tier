const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'shopdb'
});


async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      price NUMERIC(10, 2),
      image VARCHAR(255),
      description TEXT
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      items TEXT,
      total NUMERIC(10, 2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const { rows } = await pool.query('SELECT COUNT(*)::int AS cnt FROM products');
  if (rows[0].cnt === 0) {
    const items = [
      ['Classic T-Shirt', 19.99, '/images/tshirt.svg', 'Soft cotton tee crafted for everyday comfort.'],
      ['Performance Sneakers', 59.99, '/images/sneakers.svg', 'Lightweight trainers finished with a polished silhouette.'],
      ['Ceramic Mug', 9.5, '/images/mug.svg', 'A warm-toned mug made for slow mornings and long breaks.'],
      ['Everyday Backpack', 44.99, '/images/backpack.svg', 'A sleek carryall with refined pockets and a clean profile.']
    ];

    const placeholders = items.map((_, index) => `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`).join(', ');
    const values = items.flat();
    await pool.query(`INSERT INTO products (name, price, image, description) VALUES ${placeholders}`, values);
    console.log('Seeded products');
  }
}

initializeDatabase().catch((err) => {
  console.error('Database initialization failed:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  initializeDatabase
};
