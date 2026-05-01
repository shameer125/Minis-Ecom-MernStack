import { useState } from 'react';
import { sendContact } from '../utils/api';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendContact(form);
      toast.success('Message sent! We\'ll get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: FiMapPin, label: 'Address', value: '123 Fashion Street, Peshawar, KPK, Pakistan' },
    { icon: FiPhone, label: 'Phone', value: '+92 300 123 4567' },
    { icon: FiMail, label: 'Email', value: 'hello@minis.com' },
    { icon: FiClock, label: 'Hours', value: 'Mon–Sat: 9am – 6pm PKT' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="bg-gray-50 py-14 text-center">
        <p className="text-xs tracking-widest uppercase text-primary-600 mb-2">Get In Touch</p>
        <h1 className="font-display text-4xl md:text-5xl text-dark">Contact Us</h1>
        <p className="text-gray-500 mt-3 max-w-md mx-auto text-sm">
          Have a question or feedback? We'd love to hear from you. Our team is always ready to help.
        </p>
      </div>

      <div className="container-custom py-14">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="font-display text-2xl mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Jane Doe"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  placeholder="Order issue, product question..."
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  required
                  rows={6}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Tell us how we can help..."
                  className="input-field resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                <FiSend size={15} />
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="font-display text-2xl mb-6">Our Information</h2>
            <div className="space-y-5 mb-10">
              {contactInfo.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-50 flex items-center justify-center shrink-0">
                    <Icon className="text-primary-600" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">{label}</p>
                    <p className="text-sm text-dark mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ quick links */}
            <div className="bg-gray-50 p-6">
              <h3 className="font-semibold mb-4">Frequently Asked</h3>
              <div className="space-y-3 text-sm">
                {[
                  'How do I track my order?',
                  'What is your return policy?',
                  'Do you offer free shipping?',
                  'How can I change my order?',
                ].map(q => (
                  <div key={q} className="flex items-center gap-2 text-gray-600 hover:text-primary-600 cursor-pointer transition-colors">
                    <span className="text-primary-400">→</span> {q}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
