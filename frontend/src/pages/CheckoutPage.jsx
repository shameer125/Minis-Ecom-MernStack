import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../utils/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const NAME_RE = /^[A-Za-z\s]+$/;
/** Match backend shipping checks */
const STREET_RE = /^[a-zA-Z0-9\s,.'#\-\/()]+$/;
const CITY_RE = /^[a-zA-Z\s\-'.]+$/;
const COUNTRY_RE = /^[a-zA-Z\s,\.-]+$/;

const Field = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = true,
  error,
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
    {error ? (
      <p className="text-red-600 text-xs mt-1">{error}</p>
    ) : null}
  </div>
);

const emptyErrors = () => ({
  fullName: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
});

function validateCheckoutForm(form) {
  const errors = emptyErrors();

  const name = form.fullName.trim();
  if (!name) errors.fullName = "Full name is required";
  else if (!NAME_RE.test(name))
    errors.fullName = "Name may only contain letters and spaces";

  const phone = form.phone.trim();
  if (!phone) errors.phone = "Phone number is required";
  else if (!/^[0-9]+$/.test(phone))
    errors.phone = "Phone must contain only numbers";

  const street = form.address.trim();
  if (!street) errors.address = "Street address is required";
  else if (/[\r\n]/.test(street)) errors.address = "Street address must be a single line";
  else if (street.length < 5) errors.address = "Street address is too short (at least 5 characters)";
  else if (street.length > 180) errors.address = "Street address is too long";
  else if (!STREET_RE.test(street))
    errors.address = "Use letters, numbers, spaces, or , . ' # - / ( ) only";

  const city = form.city.trim();
  if (!city) errors.city = "City is required";
  else if (/[\r\n]/.test(city)) errors.city = "City must be a single line";
  else if (city.length < 2 || city.length > 80) errors.city = "City must be 2–80 characters";
  else if (!CITY_RE.test(city))
    errors.city = "City may only contain letters, spaces, hyphens or apostrophes";

  const postalNorm = form.postalCode.trim().toUpperCase().replace(/\s+/g, " ");
  if (!postalNorm) errors.postalCode = "Postal code is required";
  else if (/[\r\n]/.test(postalNorm)) errors.postalCode = "Postal code must be a single line";
  else if (/[^A-Z0-9\s\-]/.test(postalNorm))
    errors.postalCode =
      "Postal code may only contain letters, numbers, spaces or hyphens";
  else if (postalNorm.length > 15) errors.postalCode = "Postal code is too long";
  else if (postalNorm.replace(/[\s-]/g, "").length < 3)
    errors.postalCode = "Postal code must have at least 3 letters or digits";

  const country = form.country.trim();
  if (!country) errors.country = "Country is required";
  else if (/[\r\n]/.test(country)) errors.country = "Country must be a single line";
  else if (country.length < 2 || country.length > 80)
    errors.country = "Country must be 2–80 characters";
  else if (!COUNTRY_RE.test(country))
    errors.country =
      "Country may only contain letters, spaces, commas, hyphens or periods";

  return errors;
}

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(emptyErrors);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "fullName") {
      setForm((f) => ({ ...f, [name]: value.replace(/[^A-Za-z\s]/g, "") }));
    } else if (name === "phone") {
      setForm((f) => ({ ...f, [name]: value.replace(/\D/g, "") }));
    } else if (name === "address") {
      setForm((f) => ({
        ...f,
        address: value.replace(/[^a-zA-Z0-9\s,.'#\-\/()]/g, "").slice(0, 180),
      }));
    } else if (name === "city") {
      setForm((f) => ({
        ...f,
        city: value.replace(/[^a-zA-Z\s\-'.]/g, "").slice(0, 80),
      }));
    } else if (name === "postalCode") {
      setForm((f) => ({
        ...f,
        postalCode: value.replace(/[^a-zA-Z0-9\s\-]/g, "").toUpperCase().slice(0, 15),
      }));
    } else if (name === "country") {
      setForm((f) => ({
        ...f,
        country: value.replace(/[^a-zA-Z\s,\.-]/g, "").slice(0, 80),
      }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
    if (errors[name]) setErrors((er) => ({ ...er, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return toast.error("Cart is empty");

    const validation = validateCheckoutForm(form);
    setErrors(validation);
    if (Object.values(validation).some(Boolean)) {
      toast.error("Please fix the errors in shipping details.");
      return;
    }

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
          fullName: form.fullName.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          postalCode: form.postalCode.trim().toUpperCase().replace(/\s+/g, " "),
          country: form.country.trim(),
          phone: form.phone.trim(),
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
      const serverErrors = err.response?.data?.errors;
      if (serverErrors && typeof serverErrors === "object") {
        setErrors((prev) => ({
          ...prev,
          ...Object.fromEntries(
            Object.entries(serverErrors).map(([k, v]) => [k, String(v)]),
          ),
        }));
      }
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
                  autoComplete="name"
                  error={errors.fullName}
                />
                <Field
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="digits only"
                  value={form.phone}
                  onChange={handleChange}
                  error={errors.phone}
                />
                <Field
                  label="Street Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  error={errors.address}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    error={errors.city}
                  />
                  <Field
                    label="Postal Code"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    error={errors.postalCode}
                  />
                </div>

                <Field
                  label="Country"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  error={errors.country}
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
                    className="flex items-center gap-3 cursor-pointer p-3 border
                     hover:border-primary-300"
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
