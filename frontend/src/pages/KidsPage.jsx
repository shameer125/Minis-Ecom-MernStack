import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProducts } from '../utils/api';
import ProductCard from '../components/ui/ProductCard';
import { PageLoader } from '../components/ui/Spinner';
import { FiArrowRight } from 'react-icons/fi';

const subcategories = [
  { label: 'Girls', slug: 'girls', img: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&auto=format&fit=crop', desc: 'Pretty & playful styles' },
  { label: 'Boys', slug: 'boys', img: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=400&auto=format&fit=crop', desc: 'Cool & comfortable fits' },
  { label: 'Dresses', slug: 'dresses', img: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&auto=format&fit=crop', desc: 'Adorable dresses' },
  { label: 'Tops', slug: 'tops', img: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&auto=format&fit=crop', desc: 'T-shirts & blouses' },
  { label: 'Bottoms', slug: 'bottoms', img: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400&auto=format&fit=crop', desc: 'Pants, shorts & skirts' },
  { label: 'Hoodies', slug: 'hoodies', img: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&auto=format&fit=crop', desc: 'Cozy hoodies & sweaters' },
];

export default function KidsPage() {
  const [searchParams] = useSearchParams();
  const sub = searchParams.get('subcategory');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = { category: 'kids', limit: 12, sort: 'newest' };
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
          src={activeSub?.img || 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1400&auto=format&fit=crop'}
          alt="Kids"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
          <p className="text-xs tracking-widest uppercase text-yellow-300 mb-2">Collection</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold">{activeSub?.label || 'Kids'}</h1>
          <p className="mt-2 text-gray-200 text-sm">{activeSub?.desc || 'Fun, colorful & comfortable styles'}</p>
        </div>
      </div>

      <div className="container-custom py-10">
        <div className="flex flex-wrap gap-2 mb-8">
          <Link to="/shop/kids"
            className={`px-4 py-2 text-sm font-medium border transition-colors ${!sub ? 'bg-dark text-white border-dark' : 'border-gray-300 hover:border-primary-500 hover:text-primary-600'}`}>
            All Kids
          </Link>
          {subcategories.map(s => (
            <Link key={s.slug} to={`/shop/kids?subcategory=${s.slug}`}
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
                <Link key={s.slug} to={`/shop/kids?subcategory=${s.slug}`} className="group text-center">
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
              {activeSub ? activeSub.label : 'All Kids'} <span className="text-gray-400 text-lg">({products.length})</span>
            </h2>
            <Link to="/shop/kids" className="text-sm text-primary-600 hover:underline flex items-center gap-1">View All <FiArrowRight size={14} /></Link>
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
            <Link to="/shop/kids" className="btn-outline inline-block">See All Kids' Products</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
