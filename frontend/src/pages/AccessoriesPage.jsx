import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProducts } from '../utils/api';
import ProductCard from '../components/ui/ProductCard';
import { PageLoader } from '../components/ui/Spinner';
import { FiArrowRight } from 'react-icons/fi';

const subcategories = [
  { label: 'Bags', slug: 'bags', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&auto=format&fit=crop', desc: 'Totes, clutches & more' },
  { label: 'Scarves', slug: 'scarves', img: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&auto=format&fit=crop', desc: 'Silk, wool & printed' },
  { label: 'Belts', slug: 'belts', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop', desc: 'Leather & woven styles' },
  { label: 'Jewelry', slug: 'jewelry', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&auto=format&fit=crop', desc: 'Necklaces, rings & more' },
  { label: 'Sunglasses', slug: 'sunglasses', img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&auto=format&fit=crop', desc: 'UV protection & style' },
  { label: 'Hats', slug: 'hats', img: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=400&auto=format&fit=crop', desc: 'Caps, beanies & fedoras' },
];

export default function AccessoriesPage() {
  const [searchParams] = useSearchParams();
  const sub = searchParams.get('subcategory');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = { category: 'accessories', limit: 12, sort: 'newest' };
    if (sub) params.subcategory = sub;
    getProducts(params)
      .then(({ data }) => setProducts(data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [sub]);

  const activeSub = subcategories.find(s => s.slug === sub);

  return (
    <div className="animate-fade-in">
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={activeSub?.img || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1400&auto=format&fit=crop'}
          alt="Accessories"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center
        text-white text-center">
          <p className="text-xs tracking-widest uppercase text-amber-300 mb-2">Collection</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold">{activeSub?.label || 'Accessories'}</h1>
          <p className="mt-2 text-gray-200 text-sm">{activeSub?.desc || 'The finishing touch to every outfit'}</p>
        </div>
      </div>

      <div className="container-custom py-10">
        <div className="flex flex-wrap gap-2 mb-8">
          <Link to="/shop/accessories"
            className={`px-4 py-2 text-sm font-medium border transition-colors ${!sub ? 'bg-dark text-white border-dark' : 'border-gray-300 hover:border-primary-500 hover:text-primary-600'}`}>
            All Accessories
          </Link>
          {subcategories.map(s => (
            <Link key={s.slug} to={`/shop/accessories?subcategory=${s.slug}`}
              className={`px-4 py-2 text-sm font-medium border transition-colors ${sub === s.slug ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 hover:border-primary-500 hover:text-primary-600'}`}>
              {s.label}
            </Link>
          ))}
        </div>

        {!sub && (
          <div className="mb-12">
            <h2 className="font-display text-2xl text-dark mb-5">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {subcategories.map(s => (
                <Link key={s.slug} to={`/shop/accessories?subcategory=${s.slug}`} className="group text-center">
                  <div className="aspect-square overflow-hidden mb-2">
                    <img src={s.img} alt={s.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <p className="text-sm font-medium text-dark group-hover:text-primary-600 transition-colors">{s.label}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl text-dark">
              {activeSub ? activeSub.label : 'All Accessories'} <span className="text-gray-400 text-lg">({products.length})</span>
            </h2>
            <Link to="/shop/accessories" className="text-sm text-primary-600 hover:underline flex items-center gap-1">View All <FiArrowRight size={14} /></Link>
          </div>
          {loading ? <PageLoader /> : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.length === 0
                ? <p className="col-span-4 text-center py-16 text-gray-400">No products found in this category yet.</p>
                : products.map(p => <ProductCard key={p._id} product={p} />)
              }
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/shop/accessories" className="btn-outline inline-block">See All Accessories</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
