"use client";
import { useEffect, useState } from "react";
import BindingTypesSection from "./BindingTypesSection";
import CoverExtras from "./CoverExtras";
import EnhancementsGrid from "./EnhancementsGrid";
import { ENDPOINTS } from "@/app/api/endpoints";
import Loading from "./loading";
export default function ServicesPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [enhancements, setEnhancements] = useState([]);
  const [coverExtras, setCoverExtras] = useState([]);
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, enhancementsRes, coverExtrasRes] =
          await Promise.all([
            fetch(ENDPOINTS.PRODUCTS),
            fetch(ENDPOINTS.ENHANCEMENTS),
            fetch(ENDPOINTS.COVER_EXTRAS),
          ]);

        const [productsData, enhancementsData, coverExtrasData] =
          await Promise.all([
            productsRes.json(),
            enhancementsRes.json(),
            coverExtrasRes.json(),
          ]);

        setProducts(productsData);
        setEnhancements(enhancementsData);
        setCoverExtras(coverExtrasData);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <BindingTypesSection products={products} />
      <EnhancementsGrid enhancements={enhancements} />
      <CoverExtras coverExtras={coverExtras} />
    </>
  );
}
