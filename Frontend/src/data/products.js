const products = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 99.99,
    description: "Experience premium sound quality with these wireless Bluetooth headphones. Featuring noise cancellation and up to 20 hours of battery life.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Electronics",
    rating: 4.5,
    inStock: true,
    features: [
      "Active Noise Cancellation",
      "20-hour Battery Life",
      "Bluetooth 5.0",
      "Built-in Microphone",
      "Touch Controls"
    ]
  },
  {
    id: 2,
    name: "Smartphone X Pro",
    price: 899.99,
    description: "The latest smartphone with a stunning display, powerful camera system, and all-day battery life. Stay connected with the fastest 5G network.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Electronics",
    rating: 4.8,
    inStock: true,
    features: [
      "6.7-inch Super AMOLED Display",
      "Triple Camera System",
      "5G Connectivity",
      "128GB Storage",
      "All-day Battery Life"
    ]
  },
  {
    id: 3,
    name: "Premium Leather Backpack",
    price: 129.99,
    description: "A stylish and durable leather backpack perfect for daily use or travel. Features multiple compartments and laptop sleeve.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Fashion",
    rating: 4.3,
    inStock: true,
    features: [
      "Genuine Leather",
      "Laptop Compartment (fits up to 15 inches)",
      "Water-resistant",
      "Multiple Pockets",
      "Adjustable Straps"
    ]
  },
  {
    id: 4,
    name: "Smart Fitness Watch",
    price: 149.99,
    description: "Track your fitness goals with this advanced smartwatch. Monitor heart rate, sleep, and activity with a sleek, waterproof design.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Electronics",
    rating: 4.6,
    inStock: true,
    features: [
      "Heart Rate Monitoring",
      "Sleep Tracking",
      "GPS",
      "7-day Battery Life",
      "Waterproof (50m)"
    ]
  },
  {
    id: 5,
    name: "Luxury Scented Candle",
    price: 35.99,
    description: "Create a relaxing atmosphere with this luxury scented candle. Made with natural soy wax and essential oils for a clean, long-lasting burn.",
    image: "https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Home",
    rating: 4.2,
    inStock: true,
    features: [
      "Natural Soy Wax",
      "50-hour Burn Time",
      "Premium Essential Oils",
      "Handcrafted",
      "Reusable Container"
    ]
  },
  {
    id: 6,
    name: "Designer Sunglasses",
    price: 159.99,
    description: "Protect your eyes in style with these designer sunglasses. UV protection and durable frames make them perfect for everyday wear.",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Fashion",
    rating: 4.4,
    inStock: false,
    features: [
      "100% UV Protection",
      "Polarized Lenses",
      "Lightweight Frame",
      "Scratch-resistant",
      "Includes Case & Cleaning Cloth"
    ]
  },
  {
    id: 7,
    name: "Portable Bluetooth Speaker",
    price: 79.99,
    description: "Take your music anywhere with this portable Bluetooth speaker. Waterproof design and powerful sound in a compact package.",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Electronics",
    rating: 4.1,
    inStock: true,
    features: [
      "Waterproof (IPX7)",
      "10-hour Battery Life",
      "Bluetooth 5.0",
      "Built-in Microphone",
      "Compact & Portable"
    ]
  },
  {
    id: 8,
    name: "Organic Cotton T-shirt",
    price: 29.99,
    description: "A comfortable and sustainable t-shirt made from 100% organic cotton. Soft, breathable, and perfect for everyday wear.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Fashion",
    rating: 4.0,
    inStock: true,
    features: [
      "100% Organic Cotton",
      "Sustainably Produced",
      "Pre-shrunk",
      "Relaxed Fit",
      "Available in Multiple Colors"
    ]
  }
];

export default products; 