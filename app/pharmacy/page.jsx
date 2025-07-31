
"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Heart, 
  ShoppingCart, 
  Star, 
  MapPin, 
  Truck, 
  Clock, 
  Shield, 
  Pill, 
  Brain,
  Leaf,
  Zap,
  CheckCircle,
  Plus,
  Minus,
  X,
  Camera,
  Upload,
  Phone,
  ChevronDown,
  Calendar,
  Bell
} from "lucide-react";

export default function WellnessPharmacy() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");
  const [showPrescriptionUpload, setShowPrescriptionUpload] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);

  // Sample products with mental wellness focus
  const products = [
    {
      id: 1,
      name: "Magnesium Glycinate",
      category: "supplements",
      price: 24.99,
      originalPrice: 29.99,
      rating: 4.8,
      reviews: 1247,
      image: "🧠",
      description: "Premium magnesium for stress relief and better sleep",
      benefits: ["Reduces anxiety", "Improves sleep quality", "Muscle relaxation"],
      inStock: true,
      isPrescription: false,
      brand: "MindWell",
      dosage: "400mg",
      quantity: 90,
      discount: 17,
      fastDelivery: true,
      subscriptionAvailable: true
    },
    {
      id: 2,
      name: "Ashwagandha Complex",
      category: "supplements",
      price: 32.99,
      rating: 4.7,
      reviews: 892,
      image: "🌿",
      description: "Adaptogenic herb for stress management and mood support",
      benefits: ["Reduces cortisol", "Improves mood", "Enhances focus"],
      inStock: true,
      isPrescription: false,
      brand: "NatureCalm",
      dosage: "600mg",
      quantity: 60,
      fastDelivery: true,
      subscriptionAvailable: true
    },
    {
      id: 3,
      name: "Sertraline (Generic Zoloft)",
      category: "prescription",
      price: 15.99,
      rating: 4.5,
      reviews: 324,
      image: "💊",
      description: "SSRI antidepressant for depression and anxiety",
      benefits: ["Treats depression", "Reduces anxiety", "Improves mood"],
      inStock: true,
      isPrescription: true,
      brand: "Generic",
      dosage: "50mg",
      quantity: 30,
      requiresPrescription: true
    },
    {
      id: 4,
      name: "L-Theanine + GABA",
      category: "supplements",
      price: 19.99,
      rating: 4.9,
      reviews: 567,
      image: "🧘",
      description: "Natural calm and focus enhancement supplement",
      benefits: ["Promotes relaxation", "Enhances focus", "No drowsiness"],
      inStock: true,
      isPrescription: false,
      brand: "ZenMind",
      dosage: "200mg",
      quantity: 120,
      fastDelivery: true,
      subscriptionAvailable: true
    },
    {
      id: 5,
      name: "Omega-3 DHA/EPA",
      category: "supplements",
      price: 28.99,
      rating: 4.6,
      reviews: 1089,
      image: "🐟",
      description: "High-potency fish oil for brain health and mood",
      benefits: ["Supports brain function", "Mood stabilization", "Heart health"],
      inStock: true,
      isPrescription: false,
      brand: "OceanPure",
      dosage: "1000mg",
      quantity: 90,
      fastDelivery: true,
      subscriptionAvailable: true
    },
    {
      id: 6,
      name: "Melatonin Extended Release",
      category: "sleep",
      price: 12.99,
      rating: 4.4,
      reviews: 743,
      image: "🌙",
      description: "Natural sleep aid with gradual release formula",
      benefits: ["Improves sleep onset", "Maintains sleep", "Non-habit forming"],
      inStock: true,
      isPrescription: false,
      brand: "SleepWell",
      dosage: "3mg",
      quantity: 60,
      fastDelivery: true,
      subscriptionAvailable: true
    }
  ];

  const categories = [
    { id: "all", name: "All Products", icon: "🏪" },
    { id: "prescription", name: "Prescription", icon: "💊" },
    { id: "supplements", name: "Supplements", icon: "🌿" },
    { id: "sleep", name: "Sleep Support", icon: "🌙" },
    { id: "anxiety", name: "Anxiety Relief", icon: "🧘" },
    { id: "mood", name: "Mood Support", icon: "😊" },
    { id: "focus", name: "Focus & Clarity", icon: "🎯" }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const toggleWishlist = (product) => {
    const exists = wishlist.find(item => item.id === product.id);
    if (exists) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏥 <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Wellness Pharmacy</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your trusted source for mental wellness supplements, prescriptions, and natural remedies
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-green-700 text-sm font-medium">FDA Approved</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full">
              <Truck className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 text-sm font-medium">Free 2-Day Shipping</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full">
              <Phone className="w-4 h-4 text-purple-600" />
              <span className="text-purple-700 text-sm font-medium">24/7 Pharmacist Support</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <button 
              onClick={() => setShowPrescriptionUpload(true)}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <Upload className="w-5 h-5" />
              <span className="font-medium">Upload Prescription</span>
            </button>
            <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all">
              <Bell className="w-5 h-5" />
              <span className="font-medium">Refill Reminders</span>
            </button>
            <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Schedule Delivery</span>
            </button>
            <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all">
              <Phone className="w-5 h-5" />
              <span className="font-medium">Consult Pharmacist</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search medicines, supplements, or health products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
              </select>
              
              {/* Cart */}
              <button
                onClick={() => setShowCart(true)}
                className="relative flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <ShoppingCart className="w-4 h-4" />
                Cart
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <span>{category.icon}</span>
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden">
              {/* Product Image & Badge */}
              <div className="relative p-6 text-center bg-gradient-to-br from-blue-50 to-green-50">
                <div className="text-6xl mb-2">{product.image}</div>
                {product.discount && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    -{product.discount}%
                  </span>
                )}
                {product.fastDelivery && (
                  <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    <Truck className="w-3 h-3 inline mr-1" />
                    Fast
                  </span>
                )}
                
                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute bottom-2 right-2 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all"
                >
                  <Heart 
                    className={`w-4 h-4 ${
                      wishlist.find(item => item.id === product.id)
                        ? "text-red-500 fill-current"
                        : "text-gray-400"
                    }`}
                  />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg text-gray-900 leading-tight">{product.name}</h3>
                  {product.isPrescription && (
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">
                      Rx
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                
                {/* Benefits */}
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {product.benefits.slice(0, 2).map((benefit, idx) => (
                      <span key={idx} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium ml-1">{product.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                </div>

                {/* Brand & Dosage */}
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <span>Brand: {product.brand}</span>
                  <span>{product.dosage} • {product.quantity} count</span>
                </div>

                {/* Price & Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-green-600">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {product.subscriptionAvailable && (
                      <button className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition">
                        Subscribe
                      </button>
                    )}
                    <button
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                    >
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Modal */}
        {showCart && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold">Shopping Cart ({getTotalItems()} items)</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 max-h-96 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="text-3xl">{item.image}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.brand} • {item.dosage}</p>
                          <p className="text-green-600 font-bold">${item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {cart.length > 0 && (
                <div className="border-t p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold">Total: ${getTotalPrice()}</span>
                    <div className="flex gap-2">
                      <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                        Save for Later
                      </button>
                      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Checkout
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    Free shipping on orders over $50 • Same-day delivery available
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Prescription Upload Modal */}
        {showPrescriptionUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold">Upload Prescription</h2>
                <button
                  onClick={() => setShowPrescriptionUpload(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Take a photo or upload prescription</p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Choose File
                  </button>
                </div>
                
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Secure & HIPAA compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Verified by licensed pharmacists</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Fast processing in 1-2 hours</span>
                  </div>
                </div>
                
                <button className="w-full mt-6 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Upload Prescription
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Licensed Pharmacists</h3>
            <p className="text-gray-600">Get expert advice from our certified pharmacy team 24/7</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Same-day delivery available in most areas, free shipping over $50</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Reminders</h3>
            <p className="text-gray-600">Never miss a dose with our intelligent medication reminder system</p>
          </div>
        </div>

      </div>
    </main>
  );
}
