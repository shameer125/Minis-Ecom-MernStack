import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-dark text-gray-300">
      {/* Newsletter */}
      <div className="bg-primary-600 py-10">
        <div className="container-custom text-center">
          <h3 className="font-display text-2xl text-white mb-2">Join the MINIS Community</h3>
          <p className="text-pink-100 text-sm mb-6">Subscribe for exclusive offers, new arrivals and style inspiration</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 text-sm text-gray-800 outline-none" />
            <button type="submit" className="bg-dark text-white px-6 py-3 text-sm font-medium tracking-wider uppercase hover:bg-gray-800 transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h2 className="font-display text-3xl text-white mb-4">MINIS</h2>
            <p className="text-sm leading-relaxed text-gray-400 mb-6">
              Your ultimate fashion destination. Curating styles for every occasion, every season, every you.
            </p>
            <div className="flex gap-4">
              {[FiInstagram, FiFacebook, FiTwitter, FiYoutube].map((Icon, i) => (
                <a key={i} href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-medium tracking-wider uppercase text-sm mb-5">Shop</h4>
            <ul className="space-y-3 text-sm">
              {[['Women', '/shop/women'], ["Men", '/shop/men'], ["Kids", '/shop/kids'], ['Accessories', '/shop/accessories'], ['Sale', '/shop?sale=true']].map(([label, path]) => (
                <li key={label}>
                  <Link to={path} className="text-gray-400 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-white font-medium tracking-wider uppercase text-sm mb-5">Help</h4>
            <ul className="space-y-3 text-sm">
              {[['My Account', '/profile'], ['My Orders', '/orders'], ['Contact Us', '/contact'], ['FAQs', '/contact'], ['Size Guide', '/shop']].map(([label, path]) => (
                <li key={label}>
                  <Link to={path} className="text-gray-400 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-medium tracking-wider uppercase text-sm mb-5">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <FiMapPin className="mt-0.5 shrink-0 text-primary-400" size={15} />
                <span>123 Fashion Street, Peshawar, Pakistan</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-primary-400" size={15} />
                <a href="tel:+923001234567" className="hover:text-white transition-colors">+92 300 123 4567</a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-primary-400" size={15} />
                <a href="mailto:hello@minis.com" className="hover:text-white transition-colors">hello@minis.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-5">
        <div className="container-custom flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} MINIS Fashion. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Returns</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
