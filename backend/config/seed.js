const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const User = require('../models/User');

dotenv.config();

const products = [
  // ═══════════════════════════════
  // WOMEN — Dresses
  // ═══════════════════════════════
  {
    name: "Floral Wrap Dress",
    slug: "floral-wrap-dress",
    description: "A beautiful floral wrap dress perfect for any occasion. Made from lightweight, breathable fabric with a flattering silhouette.",
    price: 3499, originalPrice: 4800,
    category: "women", subcategory: "dresses",
    images: ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&auto=format&fit=crop","https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop"],
    sizes: ["XS","S","M","L","XL"], colors: ["Floral Blue","Floral Pink","Floral Yellow"],
    stock: 45, rating: 4.5, numReviews: 28, featured: true, tags: ["dress","floral","summer","women"]
  },
  {
    name: "Elegant Evening Gown",
    slug: "elegant-evening-gown",
    description: "Stunning floor-length evening gown with intricate embroidery. Perfect for formal events and galas.",
    price: 12999, originalPrice: 18000,
    category: "women", subcategory: "dresses",
    images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&auto=format&fit=crop","https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop"],
    sizes: ["XS","S","M","L"], colors: ["Black","Navy","Burgundy"],
    stock: 18, rating: 4.8, numReviews: 15, featured: true, tags: ["gown","evening","formal","women"]
  },
  {
    name: "Boho Maxi Dress",
    slug: "boho-maxi-dress",
    description: "Free-spirited boho maxi dress with tie-dye print. Perfect for beach days and summer festivals.",
    price: 2999, originalPrice: 4200,
    category: "women", subcategory: "dresses",
    images: ["https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop","https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop"],
    sizes: ["XS","S","M","L","XL"], colors: ["Turquoise","Coral","Purple"],
    stock: 35, rating: 4.3, numReviews: 22, featured: false, tags: ["maxi","boho","summer","women"]
  },
  {
    name: "Satin Slip Dress",
    slug: "satin-slip-dress",
    description: "Luxurious satin slip dress with a minimalist design. Effortlessly chic for evenings out.",
    price: 4999, originalPrice: 6500,
    category: "women", subcategory: "dresses",
    images: ["https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&auto=format&fit=crop"],
    sizes: ["XS","S","M","L"], colors: ["Champagne","Black","Blush"],
    stock: 25, rating: 4.6, numReviews: 19, featured: true, tags: ["satin","slip","evening","women"]
  },
  {
    name: "Casual Shirt Dress",
    slug: "casual-shirt-dress",
    description: "Relaxed shirt dress in premium cotton. Great for everyday wear — dress it up or down.",
    price: 2499, originalPrice: 3200,
    category: "women", subcategory: "dresses",
    images: ["https://images.unsplash.com/photo-1542295669297-4d352b042bca?w=600&auto=format&fit=crop"],
    sizes: ["XS","S","M","L","XL","XXL"], colors: ["White","Chambray","Olive"],
    stock: 60, rating: 4.2, numReviews: 31, featured: false, tags: ["casual","shirt dress","women"]
  },

  // ═══════════════════════════════
  // WOMEN — Tops
  // ═══════════════════════════════
  {
    name: "Classic White Blouse",
    slug: "classic-white-blouse",
    description: "Timeless white blouse with subtle texture. Versatile enough for office wear or a casual day out.",
    price: 1999, originalPrice: 2800,
    category: "women", subcategory: "tops",
    images: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop","https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&auto=format&fit=crop"],
    sizes: ["XS","S","M","L","XL","XXL"], colors: ["White","Cream","Light Pink"],
    stock: 80, rating: 4.3, numReviews: 45, featured: true, tags: ["blouse","tops","office","women"]
  },
  {
    name: "Ribbed Knit Crop Top",
    slug: "ribbed-knit-crop-top",
    description: "Trendy ribbed crop top in soft stretch knit. Pairs perfectly with high-waist bottoms.",
    price: 1499, originalPrice: 2000,
    category: "women", subcategory: "tops",
    images: ["https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop"],
    sizes: ["XS","S","M","L"], colors: ["Beige","Black","White","Sage"],
    stock: 70, rating: 4.4, numReviews: 38, featured: false, tags: ["crop top","knit","trendy","women"]
  },
  {
    name: "Linen Button-Up Shirt",
    slug: "linen-button-up-shirt",
    description: "Lightweight linen shirt with relaxed fit. Ideal for warm weather and casual Fridays.",
    price: 2299, originalPrice: 3000,
    category: "women", subcategory: "tops",
    images: ["https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&auto=format&fit=crop"],
    sizes: ["XS","S","M","L","XL"], colors: ["White","Dusty Rose","Sky Blue"],
    stock: 55, rating: 4.1, numReviews: 24, featured: false, tags: ["linen","shirt","casual","women"]
  },
  {
    name: "Off-Shoulder Ruffle Top",
    slug: "off-shoulder-ruffle-top",
    description: "Flirty off-shoulder top with delicate ruffle detailing. A summer wardrobe staple.",
    price: 1799, originalPrice: 2400,
    category: "women", subcategory: "tops",
    images: ["https://images.unsplash.com/photo-1562572159-4efc207f5aff?w=600&auto=format&fit=crop"],
    sizes: ["XS","S","M","L"], colors: ["White","Coral","Mint"],
    stock: 40, rating: 4.5, numReviews: 17, featured: false, tags: ["ruffle","off-shoulder","summer","women"]
  },

  // ═══════════════════════════════
  // WOMEN — Bottoms
  // ═══════════════════════════════
  {
    name: "High-Waist Skinny Jeans",
    slug: "high-waist-skinny-jeans",
    description: "Flattering high-waist skinny jeans with stretch for all-day comfort. Classic blue denim that never goes out of style.",
    price: 3999, originalPrice: 5500,
    category: "women", subcategory: "bottoms",
    images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop","https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&auto=format&fit=crop"],
    sizes: ["24","26","28","30","32"], colors: ["Blue","Black","White"],
    stock: 60, rating: 4.6, numReviews: 62, featured: false, tags: ["jeans","denim","bottoms","women"]
  },
  {
    name: "Flowy Pleated Midi Skirt",
    slug: "flowy-pleated-midi-skirt",
    description: "Elegant pleated midi skirt that moves beautifully. Versatile for both office and weekend wear.",
    price: 2799, originalPrice: 3800,
    category: "women", subcategory: "bottoms",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop"],
    sizes: ["XS","S","M","L","XL"], colors: ["Blush","Dusty Blue","Black"],
    stock: 42, rating: 4.4, numReviews: 29, featured: false, tags: ["skirt","midi","pleated","women"]
  },
  {
    name: "Wide-Leg Trousers",
    slug: "wide-leg-trousers",
    description: "Sophisticated wide-leg trousers in a relaxed cut. Effortlessly stylish for any setting.",
    price: 3299, originalPrice: 4500,
    category: "women", subcategory: "bottoms",
    images: ["https://images.unsplash.com/photo-1594938298603-c8148c4b4c7b?w=600&auto=format&fit=crop"],
    sizes: ["XS","S","M","L","XL"], colors: ["Camel","Black","Cream"],
    stock: 38, rating: 4.3, numReviews: 21, featured: false, tags: ["trousers","wide-leg","women"]
  },

  // ═══════════════════════════════
  // WOMEN — Outerwear
  // ═══════════════════════════════
  {
    name: "Camel Wool Coat",
    slug: "camel-wool-coat",
    description: "Classic camel coat in premium wool blend. A wardrobe investment that will last for years.",
    price: 14999, originalPrice: 20000,
    category: "women", subcategory: "outerwear",
    images: ["https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600&auto=format&fit=crop"],
    sizes: ["XS","S","M","L","XL"], colors: ["Camel","Black","Cream"],
    stock: 20, rating: 4.9, numReviews: 33, featured: true, tags: ["coat","wool","outerwear","women"]
  },
  {
    name: "Denim Jacket",
    slug: "womens-denim-jacket",
    description: "Classic denim jacket with a modern fit. Layer it over anything for an effortless look.",
    price: 4499, originalPrice: 6000,
    category: "women", subcategory: "outerwear",
    images: ["https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&auto=format&fit=crop"],
    sizes: ["XS","S","M","L","XL"], colors: ["Light Blue","Dark Blue","White"],
    stock: 50, rating: 4.5, numReviews: 41, featured: false, tags: ["denim","jacket","outerwear","women"]
  },

  // ═══════════════════════════════
  // MEN — Shirts
  // ═══════════════════════════════
  {
    name: "Slim Fit Oxford Shirt",
    slug: "slim-fit-oxford-shirt",
    description: "Premium Oxford cotton shirt with slim fit. Versatile for both casual and semi-formal occasions.",
    price: 2999, originalPrice: 4000,
    category: "men", subcategory: "shirts",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format&fit=crop","https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop"],
    sizes: ["S","M","L","XL","XXL"], colors: ["White","Light Blue","Navy","Pink"],
    stock: 70, rating: 4.4, numReviews: 38, featured: true, tags: ["shirt","oxford","men","formal"]
  },
  {
    name: "Linen Summer Shirt",
    slug: "linen-summer-shirt",
    description: "Breathable linen shirt perfect for hot days. Relaxed fit with roll-up sleeves.",
    price: 2499, originalPrice: 3500,
    category: "men", subcategory: "shirts",
    images: ["https://images.unsplash.com/photo-1516826957135-700dedea698c?w=600&auto=format&fit=crop"],
    sizes: ["S","M","L","XL","XXL"], colors: ["White","Beige","Sky Blue","Mint"],
    stock: 55, rating: 4.3, numReviews: 27, featured: false, tags: ["linen","shirt","summer","men"]
  },
  {
    name: "Formal Dress Shirt",
    slug: "formal-dress-shirt",
    description: "Crisp formal shirt with French cuffs. Ideal for office wear and formal occasions.",
    price: 3499, originalPrice: 4800,
    category: "men", subcategory: "shirts",
    images: ["https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop"],
    sizes: ["S","M","L","XL","XXL","3XL"], colors: ["White","Light Blue","Lavender"],
    stock: 45, rating: 4.5, numReviews: 32, featured: false, tags: ["formal","dress shirt","office","men"]
  },

  // ═══════════════════════════════
  // MEN — T-Shirts
  // ═══════════════════════════════
  {
    name: "Graphic Tee Collection",
    slug: "graphic-tee-collection",
    description: "Premium cotton graphic tee with unique artistic prints. Casual, comfortable and expressive.",
    price: 1499, originalPrice: 2200,
    category: "men", subcategory: "tshirts",
    images: ["https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&auto=format&fit=crop","https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop"],
    sizes: ["XS","S","M","L","XL","XXL"], colors: ["White","Black","Grey"],
    stock: 100, rating: 4.1, numReviews: 55, featured: false, tags: ["tshirt","graphic","men","casual"]
  },
  {
    name: "Essential V-Neck Tee",
    slug: "essential-vneck-tee",
    description: "Super-soft V-neck tee in premium Pima cotton. A must-have wardrobe basic in every color.",
    price: 999, originalPrice: 1500,
    category: "men", subcategory: "tshirts",
    images: ["https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop"],
    sizes: ["XS","S","M","L","XL","XXL"], colors: ["White","Black","Navy","Grey","Olive"],
    stock: 120, rating: 4.2, numReviews: 68, featured: false, tags: ["tshirt","vneck","basic","men"]
  },
  {
    name: "Polo Shirt Classic",
    slug: "polo-shirt-classic",
    description: "Timeless polo shirt in pique cotton. Smart casual style that works everywhere.",
    price: 2199, originalPrice: 3000,
    category: "men", subcategory: "tshirts",
    images: ["https://images.unsplash.com/photo-1625910513065-df7e56d02ee3?w=600&auto=format&fit=crop"],
    sizes: ["S","M","L","XL","XXL"], colors: ["Navy","White","Burgundy","Forest Green"],
    stock: 65, rating: 4.4, numReviews: 43, featured: false, tags: ["polo","tshirt","smart casual","men"]
  },

  // ═══════════════════════════════
  // MEN — Pants
  // ═══════════════════════════════
  {
    name: "Classic Chino Pants",
    slug: "classic-chino-pants",
    description: "Comfortable chino pants in a classic straight fit. Made from premium cotton twill fabric.",
    price: 3499, originalPrice: 4800,
    category: "men", subcategory: "pants",
    images: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop","https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop"],
    sizes: ["30x30","32x30","32x32","34x32","36x32"], colors: ["Khaki","Navy","Olive","Black"],
    stock: 55, rating: 4.2, numReviews: 29, featured: false, tags: ["pants","chino","men","casual"]
  },
  {
    name: "Slim Fit Dress Trousers",
    slug: "slim-fit-dress-trousers",
    description: "Sharp slim-fit trousers for a polished look. Perfect with a blazer or dress shirt.",
    price: 4299, originalPrice: 5800,
    category: "men", subcategory: "pants",
    images: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop"],
    sizes: ["30","32","34","36","38"], colors: ["Charcoal","Black","Navy"],
    stock: 40, rating: 4.5, numReviews: 22, featured: false, tags: ["trousers","formal","men"]
  },
  {
    name: "Jogger Pants",
    slug: "mens-jogger-pants",
    description: "Comfortable jogger pants with elastic waist and cuffs. Great for casual and active days.",
    price: 1999, originalPrice: 2800,
    category: "men", subcategory: "pants",
    images: ["https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&auto=format&fit=crop"],
    sizes: ["S","M","L","XL","XXL"], colors: ["Black","Grey","Navy"],
    stock: 75, rating: 4.1, numReviews: 36, featured: false, tags: ["jogger","pants","casual","men"]
  },

  // ═══════════════════════════════
  // MEN — Outerwear
  // ═══════════════════════════════
  {
    name: "Premium Wool Blazer",
    slug: "premium-wool-blazer",
    description: "Tailored wool blazer with modern cut. Elevate any outfit with this versatile piece.",
    price: 8999, originalPrice: 12000,
    category: "men", subcategory: "outerwear",
    images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop","https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&auto=format&fit=crop"],
    sizes: ["S","M","L","XL"], colors: ["Charcoal","Navy","Camel"],
    stock: 28, rating: 4.7, numReviews: 22, featured: true, tags: ["blazer","wool","men","formal"]
  },
  {
    name: "Winter Puffer Jacket",
    slug: "winter-puffer-jacket",
    description: "Warm and lightweight puffer jacket for cold days. Wind-resistant with a sleek profile.",
    price: 6999, originalPrice: 9500,
    category: "men", subcategory: "outerwear",
    images: ["https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600&auto=format&fit=crop"],
    sizes: ["S","M","L","XL","XXL"], colors: ["Black","Navy","Olive","Red"],
    stock: 35, rating: 4.6, numReviews: 28, featured: false, tags: ["jacket","puffer","winter","men"]
  },
  {
    name: "Bomber Jacket",
    slug: "mens-bomber-jacket",
    description: "Classic bomber jacket with ribbed collar and cuffs. Streetwear staple for every season.",
    price: 5499, originalPrice: 7500,
    category: "men", subcategory: "outerwear",
    images: ["https://images.unsplash.com/photo-1520975954732-35dd22299614?w=600&auto=format&fit=crop"],
    sizes: ["S","M","L","XL","XXL"], colors: ["Black","Olive","Navy"],
    stock: 42, rating: 4.4, numReviews: 35, featured: false, tags: ["bomber","jacket","streetwear","men"]
  },

  // ═══════════════════════════════
  // MEN — Suits
  // ═══════════════════════════════
  {
    name: "Two-Piece Business Suit",
    slug: "two-piece-business-suit",
    description: "Sharp two-piece suit in premium Italian wool blend. Tailored for a modern silhouette.",
    price: 24999, originalPrice: 35000,
    category: "men", subcategory: "suits",
    images: ["https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&auto=format&fit=crop"],
    sizes: ["38","40","42","44","46"], colors: ["Charcoal","Navy","Black"],
    stock: 15, rating: 4.8, numReviews: 12, featured: true, tags: ["suit","formal","business","men"]
  },

  // ═══════════════════════════════
  // KIDS
  // ═══════════════════════════════
  {
    name: "Kids Rainbow Hoodie",
    slug: "kids-rainbow-hoodie",
    description: "Soft and cozy hoodie with rainbow design for kids. Machine washable and durable.",
    price: 1799, originalPrice: 2500,
    category: "kids", subcategory: "hoodies",
    images: ["https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&auto=format&fit=crop"],
    sizes: ["2T","3T","4T","5T","6","7","8"], colors: ["Rainbow","Blue","Pink"],
    stock: 45, rating: 4.6, numReviews: 31, featured: false, tags: ["hoodie","kids","rainbow","casual"]
  },
  {
    name: "Girls Summer Dress Set",
    slug: "girls-summer-dress-set",
    description: "Adorable two-piece summer dress set for girls. Light, breathable and perfect for warm weather.",
    price: 1999, originalPrice: 2800,
    category: "kids", subcategory: "dresses",
    images: ["https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&auto=format&fit=crop"],
    sizes: ["2T","3T","4T","5T","6","7"], colors: ["Yellow","Pink","Blue"],
    stock: 40, rating: 4.5, numReviews: 19, featured: true, tags: ["dress","girls","summer","kids"]
  },
  {
    name: "Boys Cargo Shorts",
    slug: "boys-cargo-shorts",
    description: "Durable cargo shorts for active boys. Multiple pockets and reinforced seams.",
    price: 1299, originalPrice: 1800,
    category: "kids", subcategory: "boys",
    images: ["https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&auto=format&fit=crop"],
    sizes: ["4","5","6","7","8","9","10"], colors: ["Khaki","Navy","Olive","Black"],
    stock: 55, rating: 4.3, numReviews: 24, featured: false, tags: ["shorts","boys","cargo","kids"]
  },
  {
    name: "Girls Floral Tutu Skirt",
    slug: "girls-floral-tutu-skirt",
    description: "Adorable tutu skirt with floral embellishments. Perfect for special occasions and everyday fun.",
    price: 1499, originalPrice: 2200,
    category: "kids", subcategory: "girls",
    images: ["https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&auto=format&fit=crop"],
    sizes: ["2T","3T","4T","5T","6","7"], colors: ["Pink","White","Purple"],
    stock: 35, rating: 4.7, numReviews: 18, featured: false, tags: ["skirt","girls","tutu","kids"]
  },
  {
    name: "Kids Printed T-Shirt Pack",
    slug: "kids-printed-tshirt-pack",
    description: "Set of 3 fun printed t-shirts for kids. Soft cotton, vibrant prints, easy care.",
    price: 1999, originalPrice: 2800,
    category: "kids", subcategory: "tops",
    images: ["https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600&auto=format&fit=crop"],
    sizes: ["2T","3T","4T","5T","6","7","8"], colors: ["Multicolor"],
    stock: 65, rating: 4.4, numReviews: 42, featured: false, tags: ["tshirt","kids","printed","tops"]
  },
  {
    name: "Kids Denim Overalls",
    slug: "kids-denim-overalls",
    description: "Classic denim overalls for little ones. Easy snap buttons and adjustable straps.",
    price: 2299, originalPrice: 3200,
    category: "kids", subcategory: "bottoms",
    images: ["https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&auto=format&fit=crop"],
    sizes: ["12M","18M","2T","3T","4T","5T"], colors: ["Blue","Light Blue"],
    stock: 30, rating: 4.6, numReviews: 15, featured: false, tags: ["overalls","denim","kids","bottoms"]
  },
  {
    name: "Boys Hoodie Sweatshirt",
    slug: "boys-hoodie-sweatshirt",
    description: "Cozy fleece hoodie for boys with kangaroo pocket. Perfect for school and playtime.",
    price: 1599, originalPrice: 2200,
    category: "kids", subcategory: "hoodies",
    images: ["https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&auto=format&fit=crop"],
    sizes: ["4","5","6","7","8","9","10","12"], colors: ["Grey","Navy","Red","Black"],
    stock: 50, rating: 4.3, numReviews: 27, featured: false, tags: ["hoodie","boys","sweatshirt","kids"]
  },

  // ═══════════════════════════════
  // ACCESSORIES — Bags
  // ═══════════════════════════════
  {
    name: "Leather Tote Bag",
    slug: "leather-tote-bag",
    description: "Spacious genuine leather tote bag. Perfect for work, shopping or everyday use.",
    price: 6999, originalPrice: 9500,
    category: "accessories", subcategory: "bags",
    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop","https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop"],
    sizes: ["One Size"], colors: ["Tan","Black","Brown"],
    stock: 35, rating: 4.7, numReviews: 42, featured: true, tags: ["bag","leather","tote","accessories"]
  },
  {
    name: "Mini Crossbody Bag",
    slug: "mini-crossbody-bag",
    description: "Compact crossbody bag with adjustable strap. Fits your essentials perfectly.",
    price: 3499, originalPrice: 5000,
    category: "accessories", subcategory: "bags",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop"],
    sizes: ["One Size"], colors: ["Black","Nude","Red","Cobalt"],
    stock: 48, rating: 4.5, numReviews: 35, featured: false, tags: ["crossbody","bag","mini","accessories"]
  },
  {
    name: "Canvas Backpack",
    slug: "canvas-backpack",
    description: "Durable canvas backpack with laptop compartment. Practical and stylish for daily use.",
    price: 4499, originalPrice: 6000,
    category: "accessories", subcategory: "bags",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop"],
    sizes: ["One Size"], colors: ["Olive","Black","Navy","Tan"],
    stock: 40, rating: 4.4, numReviews: 28, featured: false, tags: ["backpack","canvas","bag","accessories"]
  },

  // ═══════════════════════════════
  // ACCESSORIES — Scarves
  // ═══════════════════════════════
  {
    name: "Silk Scarf",
    slug: "silk-scarf",
    description: "Luxurious silk scarf with intricate patterns. Can be worn multiple ways.",
    price: 2999, originalPrice: 4200,
    category: "accessories", subcategory: "scarves",
    images: ["https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&auto=format&fit=crop","https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop"],
    sizes: ["One Size"], colors: ["Multicolor","Blue","Pink","Red"],
    stock: 60, rating: 4.4, numReviews: 27, featured: false, tags: ["scarf","silk","accessories","women"]
  },
  {
    name: "Cashmere Wool Scarf",
    slug: "cashmere-wool-scarf",
    description: "Ultra-soft cashmere blend scarf for warmth and style. A winter essential.",
    price: 3999, originalPrice: 5500,
    category: "accessories", subcategory: "scarves",
    images: ["https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&auto=format&fit=crop"],
    sizes: ["One Size"], colors: ["Camel","Grey","Burgundy","Navy"],
    stock: 40, rating: 4.6, numReviews: 19, featured: false, tags: ["scarf","cashmere","winter","accessories"]
  },

  // ═══════════════════════════════
  // ACCESSORIES — Jewelry
  // ═══════════════════════════════
  {
    name: "Gold Layered Necklace Set",
    slug: "gold-layered-necklace-set",
    description: "Elegant set of 3 layered necklaces in 18k gold plating. Timeless and versatile.",
    price: 2499, originalPrice: 3500,
    category: "accessories", subcategory: "jewelry",
    images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&auto=format&fit=crop"],
    sizes: ["One Size"], colors: ["Gold","Silver"],
    stock: 55, rating: 4.6, numReviews: 38, featured: true, tags: ["necklace","gold","jewelry","accessories"]
  },
  {
    name: "Pearl Stud Earrings",
    slug: "pearl-stud-earrings",
    description: "Classic freshwater pearl stud earrings. Elegant and timeless for every occasion.",
    price: 1499, originalPrice: 2000,
    category: "accessories", subcategory: "jewelry",
    images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&auto=format&fit=crop"],
    sizes: ["One Size"], colors: ["White Pearl","Pink Pearl"],
    stock: 70, rating: 4.7, numReviews: 44, featured: false, tags: ["earrings","pearl","jewelry","accessories"]
  },

  // ═══════════════════════════════
  // ACCESSORIES — Belts & Sunglasses
  // ═══════════════════════════════
  {
    name: "Leather Belt Classic",
    slug: "leather-belt-classic",
    description: "Genuine leather belt with polished buckle. A wardrobe essential for men and women.",
    price: 1999, originalPrice: 2800,
    category: "accessories", subcategory: "belts",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop"],
    sizes: ["S","M","L","XL"], colors: ["Black","Brown","Tan"],
    stock: 65, rating: 4.3, numReviews: 31, featured: false, tags: ["belt","leather","accessories"]
  },
  {
    name: "Aviator Sunglasses",
    slug: "aviator-sunglasses",
    description: "Classic aviator sunglasses with UV400 protection. Timeless style for any face shape.",
    price: 2999, originalPrice: 4000,
    category: "accessories", subcategory: "sunglasses",
    images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop"],
    sizes: ["One Size"], colors: ["Gold/Brown","Silver/Grey","Black"],
    stock: 50, rating: 4.5, numReviews: 26, featured: false, tags: ["sunglasses","aviator","accessories"]
  },
  {
    name: "Cat-Eye Sunglasses",
    slug: "cat-eye-sunglasses",
    description: "Retro cat-eye frames with polarized lenses. Bold, chic and always on trend.",
    price: 2499, originalPrice: 3500,
    category: "accessories", subcategory: "sunglasses",
    images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop"],
    sizes: ["One Size"], colors: ["Tortoise","Black","Clear"],
    stock: 45, rating: 4.4, numReviews: 21, featured: false, tags: ["sunglasses","cat-eye","accessories","women"]
  },
  {
    name: "Wide Brim Sun Hat",
    slug: "wide-brim-sun-hat",
    description: "Stylish wide brim hat for sun protection. Perfect for beach days and summer outings.",
    price: 1799, originalPrice: 2500,
    category: "accessories", subcategory: "hats",
    images: ["https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=600&auto=format&fit=crop"],
    sizes: ["One Size"], colors: ["Natural","Black","White"],
    stock: 40, rating: 4.3, numReviews: 17, featured: false, tags: ["hat","sun hat","summer","accessories"]
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products across all categories`);

    // Log category breakdown
    const cats = {};
    products.forEach(p => {
      cats[p.category] = (cats[p.category] || 0) + 1;
    });
    console.log('📦 Category breakdown:', cats);

    // Create admin user
    await User.deleteMany({ email: 'admin@minis.com' });
    const admin = new User({
      name: 'Admin',
      email: 'admin@minis.com',
      password: 'admin123',
      isAdmin: true,
      isVerified: true,
    });
    await admin.save();
    console.log('✅ Admin user created → admin@minis.com / admin123');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seedDB();
