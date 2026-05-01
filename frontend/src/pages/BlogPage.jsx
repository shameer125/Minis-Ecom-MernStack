import { Link } from 'react-router-dom';

const posts = [
  {
    id: 1,
    title: '10 Must-Have Pieces for Your Summer Wardrobe',
    excerpt: 'As the temperature rises, it\'s time to refresh your wardrobe with these essential summer pieces that are both stylish and comfortable.',
    category: 'Style Guide',
    date: 'April 20, 2025',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop',
    author: 'Aisha Khan',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'How to Style a Wrap Dress for Any Occasion',
    excerpt: 'The wrap dress is one of the most versatile pieces in a woman\'s wardrobe. Here\'s how to style it from brunch to boardroom.',
    category: 'How To',
    date: 'April 15, 2025',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&auto=format&fit=crop',
    author: 'Sara Ali',
    readTime: '4 min read',
  },
  {
    id: 3,
    title: 'Men\'s Fashion Trends to Watch in 2025',
    excerpt: 'From relaxed tailoring to bold prints, here are the key menswear trends you need to know about this season.',
    category: 'Trends',
    date: 'April 10, 2025',
    image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600&auto=format&fit=crop',
    author: 'Bilal Ahmed',
    readTime: '6 min read',
  },
  {
    id: 4,
    title: 'Dressing Your Kids for Back to School',
    excerpt: 'Get your little ones ready for the new school year with these practical yet stylish outfit ideas for every age group.',
    category: 'Kids',
    date: 'April 5, 2025',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&auto=format&fit=crop',
    author: 'Fatima Malik',
    readTime: '3 min read',
  },
  {
    id: 5,
    title: 'The Complete Guide to Sustainable Fashion',
    excerpt: 'Making eco-conscious choices doesn\'t mean sacrificing style. Discover how to build a sustainable wardrobe you\'ll love.',
    category: 'Lifestyle',
    date: 'March 28, 2025',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop',
    author: 'Zara Hassan',
    readTime: '7 min read',
  },
  {
    id: 6,
    title: 'Accessorizing 101: Less is More',
    excerpt: 'Master the art of accessorizing with these simple rules that will elevate any outfit without going overboard.',
    category: 'Accessories',
    date: 'March 20, 2025',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop',
    author: 'Aisha Khan',
    readTime: '4 min read',
  },
];

const categories = ['All', 'Style Guide', 'Trends', 'How To', 'Kids', 'Lifestyle', 'Accessories'];

export default function BlogPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="bg-gray-50 py-14 text-center border-b">
        <p className="text-xs tracking-widest uppercase text-primary-600 mb-2">Our Journal</p>
        <h1 className="font-display text-4xl md:text-5xl text-dark">Style Blog</h1>
        <p className="text-gray-500 mt-3 max-w-md mx-auto text-sm">
          Fashion tips, style guides, and trend reports from the MINIS team
        </p>
      </div>

      <div className="container-custom py-12">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              className={`px-4 py-2 text-xs font-medium tracking-wider uppercase transition-colors border ${
                cat === 'All'
                  ? 'bg-dark text-white border-dark'
                  : 'border-gray-300 text-gray-600 hover:border-primary-500 hover:text-primary-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="overflow-hidden group">
            <img
              src={posts[0].image}
              alt={posts[0].title}
              className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="badge mb-3 w-fit">{posts[0].category}</span>
            <h2 className="font-display text-3xl text-dark mb-3 leading-snug">{posts[0].title}</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">{posts[0].excerpt}</p>
            <div className="flex items-center gap-3 text-xs text-gray-400 mb-5">
              <span>{posts[0].author}</span>
              <span>·</span>
              <span>{posts[0].date}</span>
              <span>·</span>
              <span>{posts[0].readTime}</span>
            </div>
            <button className="btn-primary w-fit">Read Article</button>
          </div>
        </div>

        {/* Post Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(1).map(post => (
            <article key={post.id} className="group cursor-pointer">
              <div className="overflow-hidden mb-4 aspect-[4/3]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <span className="text-xs text-primary-600 font-medium tracking-wider uppercase">{post.category}</span>
              <h3 className="font-display text-xl text-dark mt-1 mb-2 group-hover:text-primary-600 transition-colors leading-snug">
                {post.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3">{post.excerpt}</p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{post.author}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
