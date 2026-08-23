// src/lib/api.js
export async function getStoreData() {
  const catalogUrl = import.meta.env.PUBLIC_CATALOG_URL || import.meta.env.PUBLIC_GAS_URL;

  if (!catalogUrl) {
    throw new Error(
      "PUBLIC_CATALOG_URL atau PUBLIC_GAS_URL belum di-set di environment variable Cloudflare Pages."
    );
  }

  const res = await fetch(catalogUrl);
  if (!res.ok) {
    throw new Error(`Gagal fetch katalog: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
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
