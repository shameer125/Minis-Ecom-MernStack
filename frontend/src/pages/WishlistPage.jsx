import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiTrash2 } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) return (
    <div className="container-custom py-24 text-center animate-fade-in">
      <FiHeart size={64} className="mx-auto text-gray-200 mb-6" />
      <h2 className="font-display text-3xl mb-3">Your Wishlist is Empty</h2>
      <p className="text-gray-500 mb-8">Save items you love to come back to them later</p>
      <Link to="/shop" className="btn-primary">Browse Products</Link>
    </div>
  );

  return (
    <div className="container-custom py-10 animate-fade-in">
      <h1 className="font-display text-3xl md:text-4xl mb-8">
        My Wishlist <span className="text-gray-400 text-2xl">({wishlist.length})</span>
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {wishlist.map(product => {
          const discount = product.originalPrice
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

          return (
            <div key={product._id} className="group relative">
              {/* Image */}
              <Link to={`/product/${product.slug}`} className="block relative overflow-hidden bg-gray-50 aspect-[3/4]">
                <img
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {discount > 0 && (
                  <span className="absolute top-3 left-3 badge">-{discount}%</span>
                )}
              </Link>

              {/* Info */}
              <div className="pt-3">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{product.subcategory || product.category}</p>
                <Link to={`/product/${product.slug}`} className="text-sm font-medium text-dark hover:text-primary-600 transition-colors line-clamp-1 block">
                  {product.name}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-semibold text-dark">PKR {product.price.toLocaleString()}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-gray-400 line-through text-xs">PKR {product.originalPrice.toLocaleString()}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => addToCart(product, 1, product.sizes?.[0], product.colors?.[0])}
                    disabled={product.stock === 0}
                    className="flex-1 bg-dark text-white py-2 text-xs font-medium tracking-wider uppercase flex items-center justify-center gap-1 hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    <FiShoppingBag size={12} />
                    {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="w-9 h-9 flex items-center justify-center border border-gray-300 text-red-400 hover:bg-red-50 hover:border-red-300 transition-colors"
                    title="Remove from wishlist"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <Link to="/shop" className="btn-outline inline-block">Continue Shopping</Link>
      </div>
    </div>
  );
}
