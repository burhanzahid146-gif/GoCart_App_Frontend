import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; 
import { useNavigate } from 'react-router-dom'; 


const dummyProducts = [
  {
    id: 9901,
    title: "Classic Black Leather Jacket",
    price: 120.00,
    description: "Premium quality leather jacket for men with a stylish modern fit.",
    category: "men's clothing",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9902,
    title: "Minimalist Casual White Sneakers",
    price: 75.50,
    description: "Comfortable everyday sneakers crafted with breathable canvas material.",
    category: "footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9903,
    title: "Modern Wireless Over-Ear Headphones",
    price: 199.99,
    description: "High-resolution audio with active noise cancellation and long battery life.",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9904,
    title: "Smart Fitness Tracking Watch",
    price: 149.00,
    description: "Monitor your health, heart rate, workouts, and notifications on the go.",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9905,
    title: "Elegant Silver Wristwatch",
    price: 89.99,
    description: "Classic design with a stainless steel strap suitable for any formal occasion.",
    category: "accessories",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9906,
    title: "Designer Polarized Sunglasses",
    price: 45.00,
    description: "Protect your eyes with UV400 lenses and a lightweight trendy frame.",
    category: "accessories",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9907,
    title: "Waterproof Urban Travel Backpack",
    price: 65.00,
    description: "Durable backpack with a dedicated laptop compartment and USB charging port.",
    category: "bags",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9908,
    title: "Casual Cotton Crewneck T-Shirt",
    price: 25.00,
    description: "Ultra-soft 100% organic cotton t-shirt designed for all-day comfort.",
    category: "men's clothing",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9909,
    title: "Professional DSLR Camera",
    price: 850.00,
    description: "Capture stunning high-definition photos and 4K videos with interchangeable lenses.",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9910,
    title: "Compact Portable Bluetooth Speaker",
    price: 55.00,
    description: "Rich stereo sound with deep bass and waterproof body for outdoor parties.",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9911,
    title: "Stunning Diamond Gold Ring",
    price: 450.00,
    description: "Exquisite 18k yellow gold ring featuring a brilliant cut centerpiece diamond.",
    category: "jewelery",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9912,
    title: "Delicate Pearl Pendant Necklace",
    price: 120.00,
    description: "Lustrous freshwater cultured pearl hanging on a fine sterling silver chain.",
    category: "jewelery",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9913,
    title: "Bohemian Chic Summer Dress",
    price: 60.00,
    description: "Lightweight floral print maxi dress perfect for sunny beach days.",
    category: "women's clothing",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9914,
    title: "Cozy Knit Oversized Sweater",
    price: 70.00,
    description: "Warm and stylish woolen sweater to keep you cozy during winter chill.",
    category: "women's clothing",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9915,
    title: "Athletic Running Sports Shoes",
    price: 90.00,
    description: "Engineered mesh upper with responsive cushioning for professional runners.",
    category: "footwear",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9916,
    title: "Stainless Steel Insulated Water Bottle",
    price: 28.00,
    description: "Keeps your drinks ice-cold for 24 hours or piping hot for 12 hours.",
    category: "accessories",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9917,
    title: "Ergonomic Mechanical Gaming Keyboard",
    price: 110.00,
    description: "RGB backlit mechanical keyboard with tactile switches for high-speed typing.",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9918,
    title: "High-Precision Wireless Gaming Mouse",
    price: 65.00,
    description: "Ultra-fast response time, adjustable DPI, and ergonomic grip design.",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9919,
    title: "Luxury Leather Office Briefcase",
    price: 180.00,
    description: "Sophisticated genuine leather briefcase with multiple storage compartments.",
    category: "bags",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9920,
    title: "Modern Ceramic Coffee Mug",
    price: 18.00,
    description: "Handcrafted matte-finish ceramic mug for your morning brews.",
    category: "home & kitchen",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60"
  }
];

function Productlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); 
  const searchQuery = useSelector((state) => state.authentication?.searchQuery || '');

  useEffect(() => {
    let isMounted = true;

    async function getProducts() {
      try {
        const res = await fetch('https://fakestoreapi.com/products');
        if (!res.ok) throw new Error('Server down');
        const data = await res.json();
        
        if (isMounted) {
          setProducts(data); 
          setLoading(false);
        }
      } catch (error) {
        console.log("Server down, loading dummy products...", error);
        if (isMounted) {
          setProducts(dummyProducts); 
          setLoading(false);          
        }
      }
    }

    getProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = products.filter((item) => {
    const query = searchQuery ? searchQuery.trim().toLowerCase() : '';
    if (!query) return true;
    return (
      item.title?.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query)
    );
  });

  const handleAddToCart = (item) => {
    navigate('/payment', { 
      state: { 
        items: [
          {
            title: item.title,
            price: item.price,
            quantity: 1,
            image: item.image 
          }
        ],
        totalAmount: item.price 
      } 
    });
  };

 
  if (loading) {
    return (
      <div style={{ backgroundColor: '#111111', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#ff6f00', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
        <div className="spinner"></div>
        <h3 style={{ marginTop: '20px', color: '#ffffff', fontWeight: '600' }}>Loading products...</h3>
        <style>{`
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 111, 0, 0.2);
            border-top: 4px solid #ff6f00;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#111111', minHeight: '100vh', color: '#ffffff', padding: '40px 20px', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      
      <style>
        {`
          .product-card {
            transition: all 0.3s ease-in-out;
          }
          .product-card:hover {
            border-color: #ff6f00 !important;
            transform: translateY(-8px); 
            box-shadow: 0 12px 30px rgba(255, 111, 0, 0.25) !important;
          }
        `}
      </style>

    
      <div style={{ 
        padding: '30px', 
        marginBottom: '40px', 
        borderRadius: '20px', 
        background: 'linear-gradient(135deg, rgba(255, 111, 0, 0.12) 0%, rgba(26, 26, 26, 0.8) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 10px 0' }}>
          {searchQuery ? `Search Results for "${searchQuery}"` : <>Explore <span style={{ color: '#ec5e16' }}>Go Cart</span></>}
        </h2>
        <p style={{ color: '#aaaaaa', margin: 0, fontSize: '0.95rem' }}>
          {searchQuery ? `` : `Discover our latest collection`}
        </p>
      </div>

      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", 
        gap: "24px", 
        maxWidth: "1400px", 
        margin: "0 auto" 
      }}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <div 
              key={item.id} 
              className="product-card" 
              style={{ 
                backgroundColor: '#1a1a1a',
                border: "1px solid rgba(255, 255, 255, 0.08)", 
                padding: "20px", 
                borderRadius: "16px",
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '15px', display: 'flex', justifyContent: 'center', height: '180px', marginBottom: '15px' }}>
                <img 
                  src={item.image} 
                  alt={item.title} 
                  style={{ width: "100%", height: "100%", objectFit: "contain" }} 
                />
              </div>

              <div>
                <span style={{ color: '#ff6f00', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
                  {item.category}
                </span>
                <h4 style={{ 
                  fontSize: '0.95rem', 
                  fontWeight: '700', 
                  color: '#ffffff', 
                  margin: '0 0 15px 0',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {item.title}
                </h4>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                <p style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                  ${item.price}
                </p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(item); 
                  }}
                  style={{
                    backgroundColor: '#ff6f00',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  Buy Now
                </button>
              </div>

            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#aaaaaa' }}>
            <h3>No products found matching "{searchQuery}"</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Productlist;