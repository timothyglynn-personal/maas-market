"use client";

import { useEffect, useState } from "react";

type ProductWithImages = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  status: string;
  product_images: { id: string; url: string; sort_order: number }[];
};

export default function AdminPage() {
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("draft");
  const [sellerId, setSellerId] = useState("");
  const [imageUrls, setImageUrls] = useState("");
  const [saving, setSaving] = useState(false);
  const [sellers, setSellers] = useState<{ stripe_account_id: string; name: string; email: string }[]>([]);

  async function loadProducts() {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
    fetch("/api/admin/sellers").then(r => r.json()).then(setSellers).catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const images = imageUrls
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description: description || null,
        price: Math.round(parseFloat(price) * 100),
        status,
        seller_id: sellerId || null,
        images,
      }),
    });

    if (res.ok) {
      setName("");
      setDescription("");
      setPrice("");
      setStatus("draft");
      setSellerId("");
      setImageUrls("");
      await loadProducts();
    }

    setSaving(false);
  }

  function startEdit(p: ProductWithImages) {
    setEditingId(p.id);
    setEditName(p.name);
    setEditDescription(p.description || "");
    setEditPrice((p.price / 100).toFixed(2));
    setEditStatus(p.status);
  }

  async function handleSaveEdit() {
    if (!editingId) return;
    setEditSaving(true);
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingId,
        name: editName,
        description: editDescription || null,
        price: Math.round(parseFloat(editPrice) * 100),
        status: editStatus,
      }),
    });
    setEditingId(null);
    setEditSaving(false);
    await loadProducts();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    await loadProducts();
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 p-8">
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-3xl font-bold mb-8"
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            color: "#c5a455",
          }}
        >
          MaaS Market Admin
        </h1>

        {/* Add product form */}
        <form
          onSubmit={handleSubmit}
          className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-10"
        >
          <h2 className="text-lg font-semibold mb-4">Add Product</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-neutral-400 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-sm focus:outline-none focus:border-[#c5a455]/50"
              />
            </div>
            <div>
              <label className="block text-sm text-neutral-400 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-sm focus:outline-none focus:border-[#c5a455]/50"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-neutral-400 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-sm focus:outline-none focus:border-[#c5a455]/50"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-neutral-400 mb-1">
              Image URLs (one per line)
            </label>
            <textarea
              value={imageUrls}
              onChange={(e) => setImageUrls(e.target.value)}
              rows={3}
              placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-sm focus:outline-none focus:border-[#c5a455]/50"
            />
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-sm focus:outline-none focus:border-[#c5a455]/50"
            >
              <option value="draft">Draft</option>
              <option value="active">Active (visible on store)</option>
              <option value="sold_out">Sold Out</option>
            </select>

            <select
              value={sellerId}
              onChange={(e) => setSellerId(e.target.value)}
              className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-sm focus:outline-none focus:border-[#c5a455]/50"
            >
              <option value="">No seller (platform)</option>
              {sellers.map((s) => (
                <option key={s.stripe_account_id} value={s.stripe_account_id}>
                  {s.name} ({s.email})
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded text-sm font-semibold disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #c5a455, #a68a3e)",
                color: "#1a1714",
              }}
            >
              {saving ? "Saving..." : "Add Product"}
            </button>
          </div>
        </form>

        {/* Product list */}
        <h2 className="text-lg font-semibold mb-4">
          Products ({products.length})
        </h2>

        {loading ? (
          <p className="text-neutral-500">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-neutral-500">
            No products yet. Add one above.
          </p>
        ) : (
          <div className="space-y-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-neutral-900 border border-neutral-800 rounded-lg p-4"
              >
                {editingId === p.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-sm focus:outline-none focus:border-[#c5a455]/50"
                        placeholder="Name"
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-sm focus:outline-none focus:border-[#c5a455]/50"
                        placeholder="Price ($)"
                      />
                    </div>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-sm focus:outline-none focus:border-[#c5a455]/50"
                      placeholder="Description"
                    />
                    <div className="flex gap-3">
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-sm focus:outline-none focus:border-[#c5a455]/50"
                      >
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="sold_out">Sold Out</option>
                      </select>
                      <button
                        onClick={handleSaveEdit}
                        disabled={editSaving}
                        className="px-4 py-2 rounded text-sm font-semibold disabled:opacity-50"
                        style={{ background: "linear-gradient(135deg, #c5a455, #a68a3e)", color: "#1a1714" }}
                      >
                        {editSaving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-sm text-neutral-400 hover:text-neutral-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      {p.product_images?.[0] && (
                        <img
                          src={p.product_images[0].url}
                          alt={p.name}
                          className="w-16 h-20 object-cover rounded"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold">{p.name}</h3>
                        <p className="text-sm text-neutral-400">
                          ${(p.price / 100).toFixed(2)} &middot;{" "}
                          <span
                            className={
                              p.status === "active"
                                ? "text-green-400"
                                : p.status === "draft"
                                ? "text-yellow-400"
                                : "text-red-400"
                            }
                          >
                            {p.status}
                          </span>
                        </p>
                        {p.description && (
                          <p className="text-xs text-neutral-500 mt-1">
                            {p.description}
                          </p>
                        )}
                        <p className="text-xs text-neutral-600 mt-1">
                          {p.product_images?.length || 0} image(s)
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => startEdit(p)}
                        className="text-sm text-[#c5a455] hover:text-[#d4b96a]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-sm text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
