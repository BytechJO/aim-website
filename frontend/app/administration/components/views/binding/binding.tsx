"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "@/app/api/endpoints";
import AdminTable, { AdminColumn } from "../../AdminTable";
import ProductForm from "./bindingForm";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/app/shared/ToastProvider";

type Product = {
  id: number;
  title_en: string;
  title_ar: string;
  slug: string;
  image_url: string;
  description_en?: string;
  sort_order: number;
  is_active: boolean;
  subtitle_en: string;
};

export default function Binding() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  const handleDelete = async () => {
    if (!deleteProduct) return;

    try {
      setDeleting(true);

      const token = localStorage.getItem("admin_token");

      const response = await fetch(
        `${ENDPOINTS.PRODUCTS}/${deleteProduct.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Delete failed");
      }

      showToast("Product deleted successfully", "ok");

      // eslint-disable-next-line react-hooks/immutability
      await loadProducts();
      setDeleteProduct(null);

      setDeleteProduct(null);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Delete failed",
        "err",
      );
    } finally {
      setDeleting(false);
    }
  };
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const token = localStorage.getItem("admin_token");

      const response = await fetch(ENDPOINTS.PRODUCTS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleReorder = async (newProducts: Product[]) => {
    const previousProducts = [...products];

    const normalizedProducts = newProducts.map((item, index) => ({
      ...item,
      sort_order: index + 1,
    }));

    try {
      setProducts(normalizedProducts);
      setSavingOrder(true);

      const token = localStorage.getItem("admin_token");

      const response = await fetch(`${ENDPOINTS.PRODUCTS}/reorder`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ids: normalizedProducts.map((item) => item.id),
        }),
      });

      if (!response.ok) {
        let message = "Reorder failed";

        try {
          const data = await response.json();
          message = data.error || message;
        } catch {}

        throw new Error(message);
      }

      showToast("Order updated successfully", "ok");

      await loadProducts();
    } catch (error) {
      setProducts(previousProducts);

      showToast(
        error instanceof Error ? error.message : "Reorder failed",
        "err",
      );
    } finally {
      setSavingOrder(false);
    }
  };
  const columns: AdminColumn<Product>[] = [
    {
      key: "product",
      label: "Product",
      width: "15%",
      render: (product) => (
        <div className="flex items-center gap-3">
          <Image
            src={product.image_url}
            alt={product.title_en}
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 rounded-lg object-cover"
          />

          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold text-[#1A1A1A]">
              {product.title_en}
            </div>
            <div className="truncate text-[12px] text-[#9A9A9A]">
              {product.title_ar}
            </div>{" "}
            <div className="truncate text-[12px] text-[#9A9A9A]">
              {product.subtitle_en}
            </div>
          </div>
        </div>
      ),
    },

    {
      key: "slug",
      label: "Slug",
      width: "15%",
      render: (product) => (
        <div className="truncate font-mono text-[13px] text-[#4B4B4B]">
          {product.slug}
        </div>
      ),
    },

    {
      key: "description",
      label: "Description",
      width: "20%",
      render: (product) => (
        <div className="truncate text-[13px] text-[#7A7A7A]">
          {product.description_en || "—"}
        </div>
      ),
    },
    {
      key: "order",
      label: "Order",
      width: "6%",
      render: (product) => (
        <span className="text-[14px] text-[#4B4B4B]">{product.sort_order}</span>
      ),
    },

    {
      key: "status",
      label: "Status",
      width: "8%",
      render: (product) => (
        <span
          className={`rounded-full px-3 py-1 text-[11px] font-bold ${
            product.is_active
              ? "bg-[#EAF7EF] text-[#169C52]"
              : "bg-[#FFF0F0] text-[#D64545]"
          }`}
        >
          {product.is_active ? "ACTIVE" : "INACTIVE"}
        </span>
      ),
    },

    {
      key: "actions",
      label: "Actions",
      width: "14%",
      render: (product) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingProduct(product);
              setShowForm(true);
            }}
            className="rounded-full border border-[#D7D9DF] px-4 py-1.5 text-[12px] font-medium transition hover:bg-[#F6F6F6] cursor-pointer"
          >
            Edit
          </button>

          <button
            onClick={() => setDeleteProduct(product)}
            className="rounded-full border border-[#F1C5C5] px-4 py-1.5 text-[12px] font-medium text-[#D64545] transition hover:bg-[#FFF5F5] cursor-pointer"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#D7D9DF] border-t-black" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div
        className="
    sticky
    top-0
    z-30
    mb-4
    border
    border-[#D7D9DF]
    bg-white
  "
      >
        <div className="flex items-center justify-between px-8 py-5">
          <h1 className="font-adamina text-[24px] text-[#111]">Binding</h1>

          <button
            onClick={() => setShowForm(true)}
            className="
    group
    rounded-full
    bg-[#0F0F0F]
    px-5
    py-2
    text-[13px]
    font-semibold
    text-white
    transition-all
    duration-300
    hover:-translate-y-0.5
    hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)]
    active:translate-y-0
    active:scale-[0.98]
    cursor-pointer
  "
          >
            <span className="inline-flex items-center gap-2">
              <span className="transition-transform duration-300 group-hover:rotate-90">
                +
              </span>
              Add Binding
            </span>
          </button>
        </div>
      </div>
      <div className="p-6">
        {/* Table */}
        <AdminTable
          data={products}
          columns={columns}
          draggable
          savingOrder={savingOrder}
          onReorder={handleReorder}
        />
      </div>

      <AnimatePresence>
        {showForm && (
          <ProductForm
            product={editingProduct || undefined}
            onClose={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
            onSaved={() => {
              loadProducts();
              setShowForm(false);
              setEditingProduct(null);
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deleteProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            >
              <h3 className="mb-2 text-xl font-semibold">Delete Product</h3>

              <p className="text-sm text-[#707070]">
                Are you sure you want to delete{" "}
                <strong>{deleteProduct.title_en}</strong>?
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteProduct(null)}
                  className="rounded-full border border-[#D7D9DF] px-4 py-2 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded-full bg-[#D64545] px-4 py-2 text-white disabled:opacity-50 cursor-pointer"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
