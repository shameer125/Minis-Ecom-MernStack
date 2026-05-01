import { useState } from "react";
import {
  FiSave,
  FiMail,
  FiTruck,
  FiShield,
  FiBell,
  FiGlobe,
} from "react-icons/fi";
import { FaStore } from "react-icons/fa";
import toast from "react-hot-toast";

const tabs = [
  { id: "store", label: "Store Info", icon: FaStore },
  { id: "shipping", label: "Shipping", icon: FiTruck },
  { id: "notifications", label: "Notifications", icon: FiBell },
  { id: "security", label: "Security", icon: FiShield },
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("store");
  const [saving, setSaving] = useState(false);

  const [storeSettings, setStoreSettings] = useState({
    storeName: "MINIS Fashion",
    storeEmail: "hello@minis.com",
    storePhone: "+92 300 123 4567",
    storeAddress: "123 Fashion Street, Peshawar",
    currency: "PKR",
    taxRate: "5",
    aboutText: "Your ultimate fashion destination in Pakistan.",
    freeShippingThreshold: "5000",
    shippingFee: "299",
    expressShippingFee: "599",
    metaTitle: "MINIS Fashion Store",
    metaDescription: "Shop the latest fashion trends at MINIS.",
  });

  const [notifSettings, setNotifSettings] = useState({
    orderPlaced: true,
    orderShipped: true,
    orderDelivered: true,
    lowStock: true,
    newCustomer: false,
    dailyReport: false,
    weeklyReport: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactor: false,
    loginAlerts: true,
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Settings saved successfully!");
    setSaving(false);
  };

  const setStore = (k, v) => setStoreSettings((s) => ({ ...s, [k]: v }));
  const setNotif = (k, v) => setNotifSettings((s) => ({ ...s, [k]: v }));
  const setSec = (k, v) => setSecuritySettings((s) => ({ ...s, [k]: v }));

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400 bg-gray-50 text-gray-700";
  const labelClass = "block text-sm font-semibold text-gray-600 mb-1.5";

  const Toggle = ({ checked, onChange, label, desc }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      <div
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${checked ? "bg-amber-400" : "bg-gray-200"}`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`}
        />
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          <p className="text-sm text-gray-400">
            Manage your store configuration
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-60"
        >
          <FiSave size={15} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <div className="w-48 shrink-0 space-y-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === id ? "bg-amber-400 text-white shadow-sm" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"}`}
            >
              <Icon size={16} className="shrink-0" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* Store Info */}
          {activeTab === "store" && (
            <div className="space-y-5">
              <div>
                <h2 className="font-bold text-lg text-gray-800 mb-1">
                  Store Information
                </h2>
                <p className="text-sm text-gray-400 mb-5">
                  Basic details about your store
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Store Name</label>
                    <input
                      value={storeSettings.storeName}
                      onChange={(e) => setStore("storeName", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Store Email</label>
                    <input
                      type="email"
                      value={storeSettings.storeEmail}
                      onChange={(e) => setStore("storeEmail", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input
                      value={storeSettings.storePhone}
                      onChange={(e) => setStore("storePhone", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Currency</label>
                    <select
                      value={storeSettings.currency}
                      onChange={(e) => setStore("currency", e.target.value)}
                      className={inputClass}
                    >
                      <option value="PKR">PKR — Pakistani Rupee</option>
                      <option value="USD">USD — US Dollar</option>
                      <option value="GBP">GBP — British Pound</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Store Address</label>
                    <input
                      value={storeSettings.storeAddress}
                      onChange={(e) => setStore("storeAddress", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Tax Rate (%)</label>
                    <input
                      type="number"
                      value={storeSettings.taxRate}
                      onChange={(e) => setStore("taxRate", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Free Shipping Threshold (PKR)
                    </label>
                    <input
                      type="number"
                      value={storeSettings.freeShippingThreshold}
                      onChange={(e) =>
                        setStore("freeShippingThreshold", e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>About Store</label>
                    <textarea
                      rows={3}
                      value={storeSettings.aboutText}
                      onChange={(e) => setStore("aboutText", e.target.value)}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <h3 className="font-bold text-gray-700 mb-1 flex items-center gap-2">
                  <FiGlobe size={16} /> SEO Settings
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  Improve your store's search visibility
                </p>
                <div className="space-y-3">
                  <div>
                    <label className={labelClass}>Meta Title</label>
                    <input
                      value={storeSettings.metaTitle}
                      onChange={(e) => setStore("metaTitle", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Meta Description</label>
                    <textarea
                      rows={2}
                      value={storeSettings.metaDescription}
                      onChange={(e) =>
                        setStore("metaDescription", e.target.value)
                      }
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shipping */}
          {activeTab === "shipping" && (
            <div>
              <h2 className="font-bold text-lg text-gray-800 mb-1">
                Shipping Settings
              </h2>
              <p className="text-sm text-gray-400 mb-6">
                Configure delivery rates and policies
              </p>
              <div className="space-y-6">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <h3 className="font-semibold text-amber-800 mb-1 text-sm">
                    Free Shipping
                  </h3>
                  <p className="text-xs text-amber-600 mb-3">
                    Orders above this amount qualify for free shipping
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-amber-700">
                      PKR
                    </span>
                    <input
                      type="number"
                      value={storeSettings.freeShippingThreshold}
                      onChange={(e) =>
                        setStore("freeShippingThreshold", e.target.value)
                      }
                      className="border border-amber-300 rounded-xl px-4 py-2 text-sm outline-none focus:border-amber-500 bg-white w-40"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="border border-gray-100 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-700 mb-1 text-sm">
                      Standard Shipping
                    </h3>
                    <p className="text-xs text-gray-400 mb-3">
                      3–5 business days
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-medium">
                        PKR
                      </span>
                      <input
                        type="number"
                        value={storeSettings.shippingFee}
                        onChange={(e) =>
                          setStore("shippingFee", e.target.value)
                        }
                        className={inputClass + " w-28"}
                      />
                    </div>
                  </div>
                  <div className="border border-gray-100 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-700 mb-1 text-sm">
                      Express Shipping
                    </h3>
                    <p className="text-xs text-gray-400 mb-3">
                      1–2 business days
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-medium">
                        PKR
                      </span>
                      <input
                        type="number"
                        value={storeSettings.expressShippingFee}
                        onChange={(e) =>
                          setStore("expressShippingFee", e.target.value)
                        }
                        className={inputClass + " w-28"}
                      />
                    </div>
                  </div>
                </div>

                <div className="border border-gray-100 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-700 mb-3 text-sm">
                    Delivery Cities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Karachi",
                      "Lahore",
                      "Islamabad",
                      "Peshawar",
                      "Quetta",
                      "Faisalabad",
                      "Multan",
                      "Rawalpindi",
                    ].map((city) => (
                      <span
                        key={city}
                        className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-medium"
                      >
                        {city}
                      </span>
                    ))}
                    <button className="text-xs bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors">
                      + Add City
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div>
              <h2 className="font-bold text-lg text-gray-800 mb-1">
                Notification Preferences
              </h2>
              <p className="text-sm text-gray-400 mb-6">
                Choose what alerts you receive
              </p>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Order Alerts
                </p>
                <Toggle
                  checked={notifSettings.orderPlaced}
                  onChange={(v) => setNotif("orderPlaced", v)}
                  label="New Order Placed"
                  desc="Get notified when a customer places an order"
                />
                <Toggle
                  checked={notifSettings.orderShipped}
                  onChange={(v) => setNotif("orderShipped", v)}
                  label="Order Shipped"
                  desc="Confirmation when order is dispatched"
                />
                <Toggle
                  checked={notifSettings.orderDelivered}
                  onChange={(v) => setNotif("orderDelivered", v)}
                  label="Order Delivered"
                  desc="Alert when order is marked delivered"
                />
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-5 mb-2">
                  Store Alerts
                </p>
                <Toggle
                  checked={notifSettings.lowStock}
                  onChange={(v) => setNotif("lowStock", v)}
                  label="Low Stock Warning"
                  desc="Alert when product stock falls below 10"
                />
                <Toggle
                  checked={notifSettings.newCustomer}
                  onChange={(v) => setNotif("newCustomer", v)}
                  label="New Customer Registration"
                  desc="Notify when a new user signs up"
                />
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-5 mb-2">
                  Reports
                </p>
                <Toggle
                  checked={notifSettings.dailyReport}
                  onChange={(v) => setNotif("dailyReport", v)}
                  label="Daily Sales Report"
                  desc="Receive daily summary via email"
                />
                <Toggle
                  checked={notifSettings.weeklyReport}
                  onChange={(v) => setNotif("weeklyReport", v)}
                  label="Weekly Analytics Report"
                  desc="Receive weekly performance summary"
                />
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div>
              <h2 className="font-bold text-lg text-gray-800 mb-1">
                Security Settings
              </h2>
              <p className="text-sm text-gray-400 mb-6">
                Manage your account security
              </p>
              <div className="space-y-5">
                <div className="border border-gray-100 rounded-xl p-5">
                  <h3 className="font-bold text-gray-700 mb-4 text-sm">
                    Change Password
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className={labelClass}>Current Password</label>
                      <input
                        type="password"
                        value={securitySettings.currentPassword}
                        onChange={(e) =>
                          setSec("currentPassword", e.target.value)
                        }
                        className={inputClass}
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>New Password</label>
                      <input
                        type="password"
                        value={securitySettings.newPassword}
                        onChange={(e) => setSec("newPassword", e.target.value)}
                        className={inputClass}
                        placeholder="Min 8 characters"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Confirm New Password</label>
                      <input
                        type="password"
                        value={securitySettings.confirmPassword}
                        onChange={(e) =>
                          setSec("confirmPassword", e.target.value)
                        }
                        className={inputClass}
                        placeholder="Repeat new password"
                      />
                    </div>
                    <button
                      onClick={() => toast.success("Password updated!")}
                      className="bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
                <div className="border border-gray-100 rounded-xl p-5">
                  <h3 className="font-bold text-gray-700 mb-1 text-sm">
                    Security Options
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">
                    Additional account protection
                  </p>
                  <Toggle
                    checked={securitySettings.twoFactor}
                    onChange={(v) => setSec("twoFactor", v)}
                    label="Two-Factor Authentication"
                    desc="Add an extra layer of security to your account"
                  />
                  <Toggle
                    checked={securitySettings.loginAlerts}
                    onChange={(v) => setSec("loginAlerts", v)}
                    label="Login Alerts"
                    desc="Get notified of new logins to your admin account"
                  />
                </div>
                <div className="border border-red-100 bg-red-50 rounded-xl p-5">
                  <h3 className="font-bold text-red-700 mb-1 text-sm">
                    Danger Zone
                  </h3>
                  <p className="text-xs text-red-500 mb-3">
                    Irreversible actions — proceed with caution
                  </p>
                  <button
                    onClick={() =>
                      toast.error("This action is disabled in demo mode")
                    }
                    className="border border-red-400 text-red-600 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    Clear All Session Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
