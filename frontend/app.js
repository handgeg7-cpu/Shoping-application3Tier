async function fetchProducts() {
  const res = await fetch('/api/products');
  return res.json();
}

const productsEl = document.getElementById('products');
const cartItemsEl = document.getElementById('cart-items');
const cartCountEl = document.getElementById('cart-count');
const cartBadgeEl = document.getElementById('cart-badge');
const cartTotalEl = document.getElementById('cart-total');
const cartTotalFinalEl = document.getElementById('cart-total-final');
const placeOrderBtn = document.getElementById('place-order');

let cart = [];
let productsCatalog = [];

function getProductMeta(product) {
  const name = (product.name || '').toLowerCase();
  if (name.includes('shirt')) return { badge: 'Best seller', category: 'Apparel' };
  if (name.includes('sneaker')) return { badge: 'New arrival', category: 'Footwear' };
  if (name.includes('mug')) return { badge: 'Desk favorite', category: 'Home' };
  if (name.includes('backpack')) return { badge: 'Travel ready', category: 'Accessories' };
  return { badge: 'Featured', category: 'Essentials' };
}

function renderProducts(products) {
  productsEl.innerHTML = '';
  if (!products.length) {
    productsEl.innerHTML = '<p>Products are temporarily unavailable.</p>';
    return;
  }

  products.forEach((p) => {
    const meta = getProductMeta(p);
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <img class="product-image" src="${p.image || '/images/hero.svg'}" alt="${p.name}" />
      <div class="product-meta">
        <span class="product-badge">${meta.badge}</span>
        <span class="product-category">${meta.category}</span>
      </div>
      <h4>${p.name}</h4>
      <p>${p.description || 'A carefully chosen staple for modern routines.'}</p>
      <div class="product-footer">
        <span class="price">$${Number(p.price).toFixed(2)}</span>
        <button data-id="${p.id}">Add to cart</button>
      </div>
    `;
    productsEl.appendChild(card);
  });
}

function updateCartUI() {
  const count = cart.length;
  cartCountEl.textContent = `Cart (${count})`;
  cartBadgeEl.textContent = `${count} item${count === 1 ? '' : 's'}`;
  cartItemsEl.innerHTML = '';

  let total = 0;
  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<li class="cart-empty">Your basket is waiting for its first favorite.</li>';
  } else {
    cart.forEach((it) => {
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = `<span>${it.name}</span><strong>$${Number(it.price).toFixed(2)}</strong>`;
      cartItemsEl.appendChild(li);
      total += Number(it.price);
    });
  }

  cartTotalEl.textContent = total.toFixed(2);
  cartTotalFinalEl.textContent = total.toFixed(2);
}

document.addEventListener('click', (e) => {
  const button = e.target.closest('.product-card button');
  if (button) {
    const id = Number(button.getAttribute('data-id'));
    addToCart(id);
  }
});

async function addToCart(id) {
  const product = productsCatalog.find((x) => x.id === id);
  if (product) {
    cart.push(product);
    updateCartUI();
  }
}

placeOrderBtn.addEventListener('click', async () => {
  if (cart.length === 0) return;
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: cart, total: cart.reduce((s, i) => s + Number(i.price), 0) })
  });
  const data = await res.json();
  if (data && data.success) {
    alert('Order placed: ' + data.orderId);
    cart = [];
    updateCartUI();
  } else {
    alert('Order failed');
  }
});

fetchProducts()
  .then((products) => {
    productsCatalog = products;
    renderProducts(products);
    updateCartUI();
  })
  .catch((err) => {
    productsEl.innerHTML = '<p>Failed to load products.</p>';
    console.error(err);
  });
