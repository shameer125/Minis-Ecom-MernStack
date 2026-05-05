import { useEffect, useState } from 'react';
import { getProducts } from '../utils/api';
import ProductCard from '../components/ui/ProductCard';
import { PageLoader } from '../components/ui/Spinner';

export default function SalePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all products — sale items have originalPrice > price
    getProducts({ limit: 24, sort: 'price-asc' })
      .then(({ data }) => {
        const onSale = data.products.filter(p => p.originalPrice && p.originalPrice > p.price);
        setProducts(onSale);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-dark py-20 text-center">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #db2777 0, #db2777 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px'
        }} />
        <div className="relative">
          <p className="text-primary-300 text-xs tracking-widest uppercase mb-3">
          Limited Time</p>
          <h1 className="font-display text-6xl md:text-8xl font-bold text-white">
          SALE</h1>
          <p className="text-gray-300 mt-3 text-lg">Up to 50% off on selected styles</p>
          <div className="flex justify-center gap-6 mt-6">
            {['Free Shipping', 'Easy Returns', 'Authentic Products'].map(t => (
              <span key={t} className="text-xs text-primary-300 tracking-wider">✦ {t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="container-custom py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl text-dark">Sale Items</h2>
            <p className="text-sm text-gray-500">{products.length} items on sale</p>
          </div>
        </div>

        {loading ? (
          <PageLoader />
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-2xl text-gray-400 mb-2">No sale items right now</p>
            <p className="text-gray-400 text-sm">Check back soon for great deals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
