// src/lib/api.js
export async function getStoreData() {
  const catalogUrl = import.meta.env.PUBLIC_CATALOG_URL;
  const gasUrl = import.meta.env.PUBLIC_GAS_URL;
  const urls = [catalogUrl, gasUrl].filter(Boolean);

  if (urls.length === 0) {
    throw new Error("PUBLIC_CATALOG_URL atau PUBLIC_GAS_URL belum di-set.");
  }

  let lastError;
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      const assetOrigin = new URL(url).origin;
      for (const product of data.produk || []) {
        product.foto = (product.foto || []).map((photo) => {
          try { return new URL(photo, assetOrigin).href; } catch { return photo; }
        });
      }
      return data;
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(`Gagal fetch katalog dari semua sumber: ${lastError?.message || "unknown error"}`);
}

export function groupVarianByProduk(varianList) {
  if (!Array.isArray(varianList)) return varianList || {};
  const grouped = {};
  for (const v of varianList) {
    if (!v.aktif) continue;
    if (!grouped[v.id_produk]) grouped[v.id_produk] = {};
    if (!grouped[v.id_produk][v.grup]) grouped[v.id_produk][v.grup] = [];
    grouped[v.id_produk][v.grup].push(v);
  }
  return grouped;
}

export function formatRupiah(angka) {
  return `Rp${Number(angka).toLocaleString("id-ID")}`;
}
