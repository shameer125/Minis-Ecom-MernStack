import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProducts } from '../utils/api';
import ProductCard from '../components/ui/ProductCard';
import { PageLoader } from '../components/ui/Spinner';
import { FiArrowRight } from 'react-icons/fi';

const subcategories = [
  { label: 'Shirts', slug: 'shirts', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&auto=format&fit=crop', desc: 'Oxford, casual & formal' },
  { label: 'T-Shirts', slug: 'tshirts', img: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&auto=format&fit=crop', desc: 'Graphic & plain tees' },
  { label: 'Pants', slug: 'pants', img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&auto=format&fit=crop', desc: 'Chinos, trousers & denim' },
  { label: 'Outerwear', slug: 'outerwear', img: 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=400&auto=format&fit=crop', desc: 'Blazers, coats & jackets' },
  { label: 'Suits', slug: 'suits', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop', desc: 'Sharp & tailored looks' },
  { label: 'Activewear', slug: 'activewear', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop', desc: 'Gym & sport essentials' },
];

export default function MenPage() {
  const [searchParams] = useSearchParams();
  const sub = searchParams.get('subcategory');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = { category: 'men', limit: 12, sort: 'newest' };
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
          src={activeSub?.img || 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=1400&auto=format&fit=crop'}
          alt="Men"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
          <p className="text-xs tracking-widest uppercase text-blue-300 mb-2">Collection</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold">{activeSub?.label || "Men's"}</h1>
          <p className="mt-2 text-gray-200 text-sm">{activeSub?.desc || 'Timeless pieces for the modern man'}</p>
        </div>
      </div>

      <div className="container-custom py-10">
        <div className="flex flex-wrap gap-2 mb-8">
          <Link to="/shop/men"
            className={`px-4 py-2 text-sm font-medium border transition-colors ${!sub ? 'bg-dark text-white border-dark' : 'border-gray-300 hover:border-primary-500 hover:text-primary-600'}`}>
            All Men
          </Link>
          {subcategories.map(s => (
            <Link key={s.slug} to={`/shop/men?subcategory=${s.slug}`}
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
                <Link key={s.slug} to={`/shop/men?subcategory=${s.slug}`} className="group text-center">
                  <div className="aspect-square overflow-hidden mb-2">
                    <img src={s.img} alt={s.label} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110" />
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
              {activeSub ? activeSub.label : "All Men's"} <span className="text-gray-400 text-lg">({products.length})</span>
            </h2>
            <Link to="/shop/men" className="text-sm text-primary-600 hover:underline flex items-center gap-1">View All <FiArrowRight size={14} /></Link>
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
            <Link to="/shop/men" className="btn-outline inline-block">See All Men's Products</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
