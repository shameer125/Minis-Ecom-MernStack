import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProducts } from '../utils/api';
import ProductCard from '../components/ui/ProductCard';
import { PageLoader } from '../components/ui/Spinner';
import { FiArrowRight } from 'react-icons/fi';

const subcategories = [
  { label: 'Dresses', slug: 'dresses', img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&auto=format&fit=crop', desc: 'From casual to formal' },
  { label: 'Tops & Blouses', slug: 'tops', img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&auto=format&fit=crop', desc: 'Effortless everyday tops' },
  { label: 'Bottoms', slug: 'bottoms', img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&auto=format&fit=crop', desc: 'Jeans, skirts & more' },
  { label: 'Outerwear', slug: 'outerwear', img: 'https://images.unsplash.com/photo-1548624313-0396a7657e52?w=400&auto=format&fit=crop', desc: 'Coats, jackets & blazers' },
  { label: 'Activewear', slug: 'activewear', img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop', desc: 'Move in style' },
  { label: 'Swimwear', slug: 'swimwear', img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&auto=format&fit=crop', desc: 'Beach & poolside looks' },
];

export default function WomenPage() {
  const [searchParams] = useSearchParams();
  const sub = searchParams.get('subcategory');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = { category: 'women', limit: 12, sort: 'newest' };
    if (sub) params.subcategory = sub;
    getProducts(params)
      .then(({ data }) => setProducts(data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [sub]);

  const activeSub = subcategories.find(s => s.slug === sub);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={activeSub?.img || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&auto=format&fit=crop'}
          alt="Women"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
          <p className="text-xs tracking-widest uppercase text-pink-300 mb-2">Collection</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold">{activeSub?.label || "Women's"}</h1>
          <p className="mt-2 text-gray-200 text-sm">{activeSub?.desc || 'Curated styles for every occasion'}</p>
        </div>
      </div>

      <div className="container-custom py-10">
        {/* Subcategory Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link to="/shop/women"
            className={`px-4 py-2 text-sm font-medium border transition-colors ${!sub ? 'bg-dark text-white border-dark' : 'border-gray-300 hover:border-primary-500 hover:text-primary-600'}`}>
            All Women
          </Link>
          {subcategories.map(s => (
            <Link key={s.slug} to={`/shop/women?subcategory=${s.slug}`}
              className={`px-4 py-2 text-sm font-medium border transition-colors ${sub === s.slug ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 hover:border-primary-500 hover:text-primary-600'}`}>
              {s.label}
            </Link>
          ))}
        </div>

        {/* Subcategory Grid — only show when no filter active */}
        {!sub && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-2xl text-dark">Shop by Category</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {subcategories.map(s => (
                <Link key={s.slug} to={`/shop/women?subcategory=${s.slug}`}
                  className="group text-center">
                  <div className="aspect-square overflow-hidden mb-2">
                    <img src={s.img} alt={s.label}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <p className="text-sm font-medium text-dark group-hover:text-primary-600 transition-colors">{s.label}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl text-dark">
              {activeSub ? activeSub.label : "All Women's"} <span className="text-gray-400 text-lg">({products.length})</span>
            </h2>
            <Link to="/shop/women" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
              View All <FiArrowRight size={14} />
            </Link>
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
            <Link to="/shop/women" className="btn-outline inline-block">See All Women's Products</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
