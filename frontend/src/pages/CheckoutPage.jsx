import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../utils/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

// ✅ FIX: Move Field OUTSIDE component
const Field = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = true,
  ...rest
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="input-field"
      {...rest}
    />
  </div>
);

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: user?.name || "",
    address: user?.address?.street || "",
    city: user?.address?.city || "",
    postalCode: user?.address?.zip || "",
    country: "Pakistan",
    phone: user?.phone || "",
    paymentMethod: "Cash on Delivery",
    notes: "",
  });

  const shipping = cartTotal >= 5000 ? 0 : 299;
  const tax = Math.round(cartTotal * 0.05);
  const total = cartTotal + shipping + tax;

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return toast.error("Cart is empty");

    setLoading(true);

    try {
      const orderData = {
        orderItems: cartItems.map((i) => ({
          product: i._id,
          name: i.name,
          image: i.images?.[0],
          price: i.price,
          size: i.selectedSize,
          color: i.selectedColor,
          quantity: i.qty,
        })),
        shippingAddress: {
          fullName: form.fullName,
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
          phone: form.phone,
        },
        paymentMethod: form.paymentMethod,
        itemsPrice: cartTotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total,
        notes: form.notes,
      };

      const { data } = await createOrder(orderData);

      clearCart();
      toast.success("Order placed successfully! 🎉");
      navigate(`/orders/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-8 animate-fade-in">
      <h1 className="font-display text-3xl md:text-4xl mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* FORM */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping */}
            <div className="border border-gray-200 p-6">
              <h2 className="font-semibold text-lg mb-5">Shipping Address</h2>

              <div className="grid gap-4">
                <Field
                  label="Full Name"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                />
                <Field
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                />
                <Field
                  label="Street Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                  />
                  <Field
                    label="Postal Code"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                  />
                </div>

                <Field
                  label="Country"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Payment */}
            <div className="border border-gray-200 p-6">
              <h2 className="font-semibold text-lg mb-5">Payment Method</h2>

              <div className="space-y-3">
                {[
                  "Cash on Delivery",
                  "Bank Transfer",
                  "EasyPaisa",
                  "JazzCash",
                ].map((method) => (
                  <label
                    key={method}
                    className="flex items-center gap-3 cursor-pointer p-3 border hover:border-primary-300"
                    style={{
                      borderColor:
                        form.paymentMethod === method ? "#db2777" : undefined,
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={form.paymentMethod === method}
                      onChange={handleChange}
                      className="accent-primary-600"
                    />
                    <span className="text-sm font-medium">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="border border-gray-200 p-6">
              <h2 className="font-semibold text-lg mb-3">
                Order Notes (Optional)
              </h2>

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Special instructions or notes..."
                className="input-field resize-none"
              />
            </div>
          </div>

          {/* SUMMARY */}
          <div>
            <div className="bg-gray-50 p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-5">Your Order</h2>

              <div className="space-y-3 mb-5">
                {cartItems.map((item) => (
                  <div
                    key={`${item._id}-${item.selectedSize}`}
                    className="flex gap-3"
                  >
                    <img
                      src={item.images?.[0]}
                      alt={item.name}
                      className="w-12 h-14 object-cover bg-gray-200"
                    />

                    <div className="flex-1">
                      <p className="text-xs font-medium line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.selectedSize} · Qty {item.qty}
                      </p>
                    </div>

                    <span className="text-xs font-medium">
                      PKR {(item.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>PKR {cartTotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600" : ""}>
                    {shipping === 0 ? "FREE" : `PKR ${shipping}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>PKR {tax.toLocaleString()}</span>
                </div>

                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>PKR {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-dark w-full mt-5 disabled:opacity-50"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
