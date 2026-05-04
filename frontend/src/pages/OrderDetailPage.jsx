import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../utils/api';
import { PageLoader } from '../components/ui/Spinner';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getOrder(id)
      .then(({ data }) => setOrder(data))
      .catch(() => setError('Order not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader />;
  if (error) return (
    <div className="container-custom py-20 text-center">
      <h2 className="font-display text-2xl mb-4">{error}</h2>
      <Link to="/orders" className="btn-primary">
      Back to Orders</Link>
    </div>
  );

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="container-custom py-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <Link to="/orders" className="text-sm text-gray-400
          hover:text-primary-600 transition-colors mb-2 block">← Back to Orders</Link>
          <h1 className="font-display text-3xl">Order Details</h1>
          <p className="text-sm text-gray-500 mt-1">
            #{order._id.slice(-8).toUpperCase()} · Placed on {new Date(order.createdAt).toLocaleDateString('en-PK', { dateStyle: 'long' })}
          </p>
        </div>
        <span className={`text-sm px-4 py-2 font-medium capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
          {order.status}
        </span>
      </div>

      {/* Order Progress */}
      {order.status !== 'cancelled' && (
        <div className="mb-8 border border-gray-100 p-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-200 z-0" />
            <div
              className="absolute left-0 top-4 h-0.5 bg-primary-500 z-0 transition-all duration-500"
              style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
            />
            {STATUS_STEPS.map((step, i) => (
              <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i <= currentStep ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                  {i < currentStep ? '✓' : i + 1}
                </div>
                <span className={`text-xs capitalize font-medium ${i <= currentStep ? 'text-primary-600' : 'text-gray-400'}`}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-semibold text-lg">Items Ordered</h2>
          {order.orderItems.map((item, i) => (
            <div key={i} className="flex gap-4 border border-gray-100 p-4">
              <img
                src={item.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200'}
                alt={item.name}
                className="w-20 h-24 object-cover bg-gray-50 shrink-0"
              />
              <div className="flex-1">
                <p className="font-medium text-dark">{item.name}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {item.size && <span>Size: {item.size}</span>}
                  {item.size && item.color && ' · '}
                  {item.color && <span>Color: {item.color}</span>}
                </p>
                <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">PKR {(item.price * item.quantity).toLocaleString()}</p>
                <p className="text-xs text-gray-400">PKR {item.price.toLocaleString()} each</p>
              </div>
            </div>
          ))}

          {/* Shipping Address */}
          <div className="border border-gray-100 p-5 mt-4">
            <h3 className="font-semibold mb-3">Shipping Address</h3>
            <p className="text-sm text-gray-600">{order.shippingAddress.fullName}</p>
            <p className="text-sm text-gray-600">{order.shippingAddress.address}</p>
            <p className="text-sm text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
            <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
            {order.shippingAddress.phone && <p className="text-sm text-gray-600 mt-1">📞 {order.shippingAddress.phone}</p>}
          </div>

          {/* Payment Method */}
          <div className="border border-gray-100 p-5">
            <h3 className="font-semibold mb-2">Payment Method</h3>
            <p className="text-sm text-gray-600">{order.paymentMethod}</p>
            <p className={`text-xs mt-1 font-medium ${order.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
              {order.isPaid ? `✓ Paid on ${new Date(order.paidAt).toLocaleDateString()}` : '⏳ Payment Pending'}
            </p>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="border border-gray-100 p-5">
              <h3 className="font-semibold mb-2">Order Notes</h3>
              <p className="text-sm text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-gray-50 p-6 sticky top-24">
            <h2 className="font-semibold text-lg mb-5">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal ({order.orderItems.reduce((a, i) => a + i.quantity, 0)} items)</span>
                <span>PKR {order.itemsPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className={order.shippingPrice === 0 ? 'text-green-600 font-medium' : ''}>
                  {order.shippingPrice === 0 ? 'FREE' : `PKR ${order.shippingPrice}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tax</span>
                <span>PKR {order.taxPrice.toLocaleString()}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-base">
                <span>Total</span>
                <span>PKR {order.totalPrice.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <Link to="/shop" className="btn-primary w-full text-center block">Continue Shopping</Link>
              <Link to="/orders" className="btn-outline w-full text-center block">All Orders</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
