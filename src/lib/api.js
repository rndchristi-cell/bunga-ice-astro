// src/lib/api.js
export async function getStoreData() {
  const GAS_URL = import.meta.env.PUBLIC_GAS_URL;

  if (!GAS_URL) {
    throw new Error(
      "PUBLIC_GAS_URL belum di-set. Tambahin di .env atau environment variable Cloudflare Pages."
    );
  }

  const res = await fetch(GAS_URL);
  if (!res.ok) {
    throw new Error(`Gagal fetch data dari GAS: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

export function groupVarianByProduk(varianList) {
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
