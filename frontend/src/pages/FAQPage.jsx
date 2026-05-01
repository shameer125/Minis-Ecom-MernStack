import { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const faqs = [
  {
    category: 'Orders & Shipping',
    items: [
      { q: 'How long does delivery take?', a: 'Standard delivery within Pakistan takes 3–5 business days. Express delivery (1–2 days) is available in major cities including Karachi, Lahore, Islamabad, and Peshawar.' },
      { q: 'Is there free shipping?', a: 'Yes! All orders over PKR 5,000 qualify for free standard shipping. Orders below this threshold have a flat shipping fee of PKR 299.' },
      { q: 'Can I track my order?', a: 'Absolutely. Once your order is shipped, you will receive an SMS and email with a tracking link. You can also track your order in the "My Orders" section of your account.' },
      { q: 'Do you ship internationally?', a: 'Currently we ship within Pakistan only. We are working on expanding to international shipping — sign up for our newsletter to be notified when this launches.' },
    ]
  },
  {
    category: 'Returns & Exchanges',
    items: [
      { q: 'What is your return policy?', a: 'We offer a 30-day return policy on all items. Products must be in their original, unworn condition with tags attached. Sale items are final sale and not eligible for returns.' },
      { q: 'How do I start a return?', a: 'Go to "My Orders" in your account, select the order, and click "Request Return". Our team will review your request within 24 hours and arrange a pickup.' },
      { q: 'When will I receive my refund?', a: 'Refunds are processed within 5–7 business days after we receive and inspect the returned item. The amount will be credited back to your original payment method.' },
      { q: 'Can I exchange an item for a different size?', a: 'Yes! Exchanges for different sizes are free of charge, subject to availability. Simply request a return and select "Exchange" as the reason.' },
    ]
  },
  {
    category: 'Products & Sizing',
    items: [
      { q: 'How do I find my correct size?', a: 'Each product page has a detailed size guide with measurements. We recommend measuring yourself and comparing to our size chart before ordering.' },
      { q: 'Are the product colors accurate?', a: 'We do our best to show accurate colors, but slight variations can occur due to different screen settings. If you\'re unsure, our customer service team can help.' },
      { q: 'How do I care for my MINIS clothing?', a: 'Care instructions are printed on the label of each garment. Most items can be machine washed on a gentle cycle in cold water. Dry cleaning is recommended for premium pieces.' },
    ]
  },
  {
    category: 'Account & Payment',
    items: [
      { q: 'What payment methods do you accept?', a: 'We accept Cash on Delivery (COD), Bank Transfer, EasyPaisa, and JazzCash. More payment options are coming soon.' },
      { q: 'Is my payment information secure?', a: 'Yes. All transactions are encrypted and secure. We do not store your payment details on our servers.' },
      { q: 'Do I need an account to shop?', a: 'You can browse as a guest, but creating an account lets you track orders, save your wishlist, and enjoy a faster checkout experience.' },
    ]
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100">
      <button
        className="w-full flex items-center justify-between py-4 text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className={`text-sm font-medium transition-colors ${open ? 'text-primary-600' : 'text-dark'}`}>{q}</span>
        <span className={`shrink-0 w-6 h-6 flex items-center justify-center rounded-full transition-colors ${open ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
          {open ? <FiMinus size={13} /> : <FiPlus size={13} />}
        </span>
      </button>
      {open && (
        <p className="text-sm text-gray-500 leading-relaxed pb-4 pr-10 animate-fade-in">{a}</p>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="bg-gray-50 py-14 text-center border-b">
        <p className="text-xs tracking-widest uppercase text-primary-600 mb-2">Help Center</p>
        <h1 className="font-display text-4xl md:text-5xl text-dark">Frequently Asked Questions</h1>
        <p className="text-gray-500 mt-3 max-w-md mx-auto text-sm">
          Find answers to common questions about orders, shipping, returns, and more.
        </p>
      </div>

      <div className="container-custom py-14">
        <div className="max-w-3xl mx-auto">
          {faqs.map(({ category, items }) => (
            <div key={category} className="mb-10">
              <h2 className="font-display text-2xl text-dark mb-4 pb-2 border-b-2 border-primary-200">{category}</h2>
              <div>
                {items.map(item => <FAQItem key={item.q} {...item} />)}
              </div>
            </div>
          ))}

          {/* Still need help */}
          <div className="bg-primary-50 border border-primary-100 p-8 text-center mt-12">
            <h3 className="font-display text-2xl text-dark mb-2">Still Have Questions?</h3>
            <p className="text-gray-500 text-sm mb-6">Our team is happy to help. Reach out and we'll get back to you within 24 hours.</p>
            <Link to="/contact" className="btn-primary inline-block">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
