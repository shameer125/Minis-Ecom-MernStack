import { Link } from 'react-router-dom';
import { FiHeart, FiAward, FiUsers, FiGlobe } from 'react-icons/fi';

const stats = [
  { label: 'Happy Customers', value: '50,000+', icon: FiUsers },
  { label: 'Products', value: '1,200+', icon: FiHeart },
  { label: 'Cities Served', value: '50+', icon: FiGlobe },
  { label: 'Years of Excellence', value: '8+', icon: FiAward },
];

const team = [
  { name: 'Aisha Khan', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop' },
  { name: 'Bilal Ahmed', role: 'Head of Design', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop' },
  { name: 'Sara Malik', role: 'Creative Director', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&auto=format&fit=crop' },
  { name: 'Omar Farooq', role: 'Head of Operations', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop' },
];

const values = [
  { title: 'Quality First', desc: 'Every piece is crafted with care, using premium materials that stand the test of time.', icon: '✦' },
  { title: 'Inclusive Fashion', desc: 'Fashion is for everyone. We celebrate diversity and offer styles for all body types.', icon: '♥' },
  { title: 'Sustainability', desc: 'We are committed to responsible fashion — reducing waste and ethical sourcing.', icon: '◈' },
  { title: 'Community', desc: 'MINIS is more than a brand — it\'s a community of people who love great style.', icon: '❋' },
];

export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative h-[50vh] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&auto=format&fit=crop" alt="About" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex items-center justify-center text-center text-white px-4">
          <div>
            <p className="text-xs tracking-widest uppercase text-primary-300 mb-3">Our Story</p>
            <h1 className="font-display text-5xl md:text-6xl font-bold">About MINIS</h1>
            <p className="mt-4 text-gray-200 max-w-lg mx-auto">Where fashion meets passion, and every customer is family.</p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="container-custom py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs tracking-widest uppercase text-primary-600 mb-3">Who We Are</p>
            <h2 className="font-display text-4xl text-dark mb-5">Born from a Passion for Fashion</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              MINIS was founded in 2017 with a simple mission: to make beautiful, high-quality fashion accessible to everyone in Pakistan and beyond. What started as a small boutique in Peshawar has grown into one of the region's most loved online fashion destinations.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              We believe that getting dressed should be a joyful experience — not a stressful one. That's why we curate collections that are stylish, versatile, and affordable, so you can always look and feel your best.
            </p>
            <Link to="/shop" className="btn-primary inline-block">Shop the Collection</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop" alt="" className="w-full h-56 object-cover" />
            <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&auto=format&fit=crop" alt="" className="w-full h-56 object-cover mt-8" />
          </div>
        </div>

      </section>

      {/* Stats */}
      <section className="bg-dark py-14">
        <div className="container-custom grid grid-cols-2 md:grid-cols-4
        gap-8 text-center">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label}>
              <Icon className="mx-auto text-primary-400 mb-3" size={28} />
              <p className="font-display text-4xl text-white font-bold">{value}</p>
              <p className="text-gray-400 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="container-custom py-16">
        <div className="text-center mb-12">
          <p className="text-xs tracking-widest uppercase text-primary-600 mb-2">What Drives Us</p>
          <h2 className="section-title">Our Values</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map(({ title, desc, icon }) => (
            <div key={title} className="border border-gray-100 p-6 hover:border-primary-300 hover:shadow-md transition-all duration-300">
              <span className="text-2xl text-primary-500 mb-4 block">{icon}</span>
              <h3 className="font-semibold text-dark mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-xs tracking-widest uppercase text-primary-600 mb-2">The People Behind MINIS</p>
            <h2 className="section-title">Meet Our Team</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map(({ name, role, img }) => (
              <div key={name} className="text-center group">
                <div className="overflow-hidden mb-4 aspect-square">
                  <img src={img} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <h3 className="font-semibold text-dark">{name}</h3>
                <p className="text-sm text-gray-500">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="container-custom max-w-xl">
          <h2 className="font-display text-4xl text-dark mb-4">Ready to Find Your Style?</h2>
          <p className="text-gray-500 mb-8">Explore our latest collections and discover fashion that speaks to you.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/shop" className="btn-primary">Shop Now</Link>
            <Link to="/contact" className="btn-outline">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
