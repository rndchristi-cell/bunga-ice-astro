const CART_KEY = "bungaice_cart";

export function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent("cart-updated"));
}

export function addToCart(item) {
  const cart = getCart();
  const idx = cart.findIndex(
    (c) =>
      c.produkId === item.produkId &&
      JSON.stringify(c.varianTerpilih) === JSON.stringify(item.varianTerpilih)
  );
  if (idx > -1) {
    cart[idx].qty += item.qty;
  } else {
    cart.push({ ...item, cartId: crypto.randomUUID() });
  }
  saveCart(cart);
}

export function updateQty(cartId, qty) {
  const cart = getCart();
  const idx = cart.findIndex((c) => c.cartId === cartId);
  if (idx > -1) {
    if (qty <= 0) cart.splice(idx, 1);
    else cart[idx].qty = qty;
  }
  saveCart(cart);
}

export function removeFromCart(cartId) {
  saveCart(getCart().filter((c) => c.cartId !== cartId));
}

export function clearCart() {
  saveCart([]);
}

export function getCartTotal(cart) {
  return cart.reduce((sum, item) => sum + item.hargaSatuan * item.qty, 0);
}

export function getCartCount(cart) {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}
