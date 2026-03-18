import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { getProducts } from "@/lib/products";
import { Product } from "@/lib/types";

function JsonLd({ products }: { products: Product[] }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Justin's Favorite Things",
    description:
      "Curated product recommendations from Justin — every item is personally purchased and loved.",
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.tagline,
        image: `https://justinsfavoritethings.com${product.image}`,
        url: product.affiliateUrl,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default function Home() {
  const products = getProducts();

  return (
    <>
      <JsonLd products={products} />
      <Header />
      <main>
        <ProductGrid products={products} />
      </main>
      <Footer />
    </>
  );
}
