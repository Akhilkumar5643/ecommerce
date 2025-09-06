import React, { useState, useEffect } from 'react';
import {
    ShoppingCart,
    User,
    Search,
    Heart,
    Star,
    Plus,
    Minus,
    Trash2,
    Eye,
    Edit,
    Package,
    Users,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    Filter,
    Grid,
    List,
    CreditCard,
    Truck,
    Shield,
    Home,
    Phone,
    Mail,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Loader
} from 'lucide-react';

const EcommercePlatform = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentPage, setCurrentPage] = useState('home');
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [checkoutData, setCheckoutData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        pincode: '',
        paymentMethod: 'cod'
    });

    // Authentication functions USD to INR conversion rate (approximate)
    const USD_TO_INR = 83.5;

    // Convert USD price to INR
    const convertToINR = (usdPrice) => {
        return Math.round(usdPrice * USD_TO_INR);
    };

    // Fetch products from FakeStore API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch products
                const productsResponse = await fetch('https://fakestoreapi.com/products');
                const productsData = await productsResponse.json();

                // Fetch categories
                const categoriesResponse = await fetch('https://fakestoreapi.com/products/categories');
                const categoriesData = await categoriesResponse.json();

                // Process products with Indian pricing
                const processedProducts = productsData.map(product => ({
                    ...product,
                    priceINR: convertToINR(product.price),
                    originalPriceINR: convertToINR(product.price * 1.2), // 20% higher original price
                    discount: 20,
                    inStock: Math.random() > 0.1, // 90% products in stock
                    reviews: Math.floor(Math.random() * 1000) + 100,
                    rating: {
                        rate: product.rating.rate,
                        count: product.rating.count
                    }
                }));

                setProducts(processedProducts);
                setCategories([{ id: 'all', name: 'All Products' }, ...categoriesData.map(cat => ({ id: cat, name: cat.charAt(0).toUpperCase() + cat.slice(1) }))]);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Authentication functions
    const login = (email, password, isAdmin = false) => {
        // Simple mock authentication
        const user = {
            id: 1,
            name: isAdmin ? 'Admin User' : 'John Doe',
            email: email,
            isAdmin: isAdmin
        };
        setCurrentUser(user);
        setCurrentPage(isAdmin ? 'admin-dashboard' : 'home');
    };

    const logout = () => {
        setCurrentUser(null);
        setCurrentPage('home');
        setCart([]);
        setWishlist([]);
    };

    // Cart functions
    const addToCart = (product, quantity = 1) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const updateCartQuantity = (productId, quantity) => {
        if (quantity === 0) {
            removeFromCart(productId);
            return;
        }
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    // Wishlist functions
    const toggleWishlist = (product) => {
        setWishlist(prevWishlist => {
            const exists = prevWishlist.find(item => item.id === product.id);
            if (exists) {
                return prevWishlist.filter(item => item.id !== product.id);
            }
            return [...prevWishlist, product];
        });
    };

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Calculate cart total
    const cartTotal = cart.reduce((total, item) => total + (item.priceINR * item.quantity), 0);

    // Header Component
    const Header = () => (
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <h1
                            className="text-2xl font-bold text-indigo-600 cursor-pointer"
                            onClick={() => setCurrentPage('home')}
                        >
                            ShopZone
                        </h1>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-lg mx-8">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center space-x-4">
                        {currentUser && !currentUser.isAdmin && (
                            <>
                                <button
                                    onClick={() => setCurrentPage('wishlist')}
                                    className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                                >
                                    <Heart className="h-6 w-6" />
                                    {wishlist.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {wishlist.length}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setCurrentPage('cart')}
                                    className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                                >
                                    <ShoppingCart className="h-6 w-6" />
                                    {cart.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {cart.length}
                                        </span>
                                    )}
                                </button>
                            </>
                        )}

                        {currentUser ? (
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-700">Hi, {currentUser.name.split(' ')[0]}</span>
                                <button
                                    onClick={() => setCurrentPage(currentUser.isAdmin ? 'admin-dashboard' : 'profile')}
                                    className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                                >
                                    <User className="h-6 w-6" />
                                </button>
                                <button
                                    onClick={logout}
                                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                                >
                                    <LogOut className="h-6 w-6" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setCurrentPage('login')}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );

    // Product Card Component
    const ProductCard = ({ product }) => (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="relative">
                <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        {product.discount}% OFF
                    </span>
                )}
                <button
                    onClick={() => toggleWishlist(product)}
                    className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${wishlist.find(item => item.id === product.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-600 hover:text-red-500'
                        }`}
                >
                    <Heart className="h-4 w-4" />
                </button>
            </div>

            <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.title}</h3>

                <div className="flex items-center mb-2">
                    <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{product.rating.rate}</span>
                    </div>
                    <span className="text-sm text-gray-500 ml-2">({product.rating.count} reviews)</span>
                </div>

                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">₹{product.priceINR.toLocaleString()}</span>
                        {product.discount > 0 && (
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPriceINR.toLocaleString()}</span>
                        )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${product.inStock
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                </div>

                <div className="flex space-x-2">
                    <button
                        onClick={() => setSelectedProduct(product)}
                        className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                        View Details
                    </button>
                    <button
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );

    // Product Modal Component
    const ProductModal = ({ product, onClose }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">{product.title}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-96 object-cover rounded-lg"
                            />
                        </div>

                        <div>
                            <div className="flex items-center mb-4">
                                <div className="flex items-center">
                                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                                    <span className="text-lg text-gray-700 ml-1">{product.rating.rate}</span>
                                </div>
                                <span className="text-gray-500 ml-2">({product.rating.count} reviews)</span>
                            </div>

                            <div className="flex items-center space-x-3 mb-4">
                                <span className="text-3xl font-bold text-gray-900">₹{product.priceINR.toLocaleString()}</span>
                                {product.discount > 0 && (
                                    <>
                                        <span className="text-xl text-gray-500 line-through">₹{product.originalPriceINR.toLocaleString()}</span>
                                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                                            {product.discount}% OFF
                                        </span>
                                    </>
                                )}
                            </div>

                            <p className="text-gray-600 mb-6">{product.description}</p>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Shield className="h-5 w-5 text-green-600" />
                                    <span className="text-sm text-gray-700">1 Year Warranty</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Truck className="h-5 w-5 text-blue-600" />
                                    <span className="text-sm text-gray-700">Free Delivery</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CreditCard className="h-5 w-5 text-purple-600" />
                                    <span className="text-sm text-gray-700">Secure Payment</span>
                                </div>
                            </div>

                            <div className="flex space-x-4 mt-6">
                                <button
                                    onClick={() => {
                                        addToCart(product);
                                        onClose();
                                    }}
                                    disabled={!product.inStock}
                                    className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                                >
                                    Add to Cart
                                </button>
                                <button
                                    onClick={() => toggleWishlist(product)}
                                    className={`p-3 rounded-lg border-2 transition-colors ${wishlist.find(item => item.id === product.id)
                                        ? 'border-red-500 bg-red-500 text-white'
                                        : 'border-gray-300 hover:border-red-500 hover:text-red-500'
                                        }`}
                                >
                                    <Heart className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Home Page Component
    const HomePage = () => (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Welcome to ShopZone
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 opacity-90">
                        Discover amazing products at unbeatable prices
                    </p>
                    <button
                        onClick={() => setCurrentPage('products')}
                        className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg"
                    >
                        Shop Now
                    </button>
                </div>
            </div>

            {/* Featured Categories */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.slice(1).map((category) => (
                        <div
                            key={category.id}
                            onClick={() => {
                                setSelectedCategory(category.id);
                                setCurrentPage('products');
                            }}
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-center"
                        >
                            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package className="h-8 w-8 text-indigo-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 capitalize">{category.name}</h3>
                        </div>
                    ))}
                </div>
            </div>

            {/* Featured Products */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
                {loading ? (
                    <div className="flex justify-center">
                        <Loader className="h-8 w-8 animate-spin text-indigo-600" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.slice(0, 8).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    // Products Page Component
    const ProductsPage = () => (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="flex flex-wrap items-center justify-between mb-8">
                    <div className="flex flex-wrap items-center space-x-4 mb-4 md:mb-0">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`}
                            >
                                <Grid className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`}
                            >
                                <List className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                    <div className="text-sm text-gray-600">
                        {filteredProducts.length} products found
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader className="h-8 w-8 animate-spin text-indigo-600" />
                    </div>
                ) : (
                    <div className={`grid gap-6 ${viewMode === 'grid'
                        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        : 'grid-cols-1'
                        }`}>
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                {filteredProducts.length === 0 && !loading && (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );

    // Cart Page Component
    const CartPage = () => (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                {cart.length === 0 ? (
                    <div className="text-center py-16">
                        <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
                        <button
                            onClick={() => setCurrentPage('products')}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex items-center py-4 border-b border-gray-200 last:border-b-0">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-1 ml-4">
                                            <h3 className="font-medium text-gray-900 line-clamp-2">{item.title}</h3>
                                            <p className="text-indigo-600 font-semibold">₹{item.priceINR.toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                                className="p-1 hover:bg-gray-100 rounded"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                                className="p-1 hover:bg-gray-100 rounded"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>₹{cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="border-t pt-2">
                                        <div className="flex justify-between font-semibold text-lg">
                                            <span>Total</span>
                                            <span>₹{cartTotal.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setCurrentPage('checkout')}
                                    className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // Checkout Page Component
    const CheckoutPage = () => {
        const handleCheckout = (e) => {
            e.preventDefault();
            // Simple checkout simulation
            alert('Order placed successfully! You will receive a confirmation email shortly.');
            setCart([]);
            setCurrentPage('home');
        };

        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Checkout Form */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
                            <form onSubmit={handleCheckout} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={checkoutData.name}
                                        onChange={(e) => setCheckoutData({ ...checkoutData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="PIN Code"
                                        value={checkoutData.pincode}
                                        onChange={(e) => setCheckoutData({ ...checkoutData, pincode: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                                    <div className="space-y-2">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="cod"
                                                checked={checkoutData.paymentMethod === 'cod'}
                                                onChange={(e) => setCheckoutData({ ...checkoutData, paymentMethod: e.target.value })}
                                                className="mr-3"
                                            />
                                            <span>Cash on Delivery</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="upi"
                                                checked={checkoutData.paymentMethod === 'upi'}
                                                onChange={(e) => setCheckoutData({ ...checkoutData, paymentMethod: e.target.value })}
                                                className="mr-3"
                                            />
                                            <span>UPI Payment</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="card"
                                                checked={checkoutData.paymentMethod === 'card'}
                                                onChange={(e) => setCheckoutData({ ...checkoutData, paymentMethod: e.target.value })}
                                                className="mr-3"
                                            />
                                            <span>Credit/Debit Card</span>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium mt-6"
                                >
                                    Place Order
                                </button>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-3">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                                            <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                                        </div>
                                        <span className="font-semibold">₹{(item.priceINR * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t pt-4 mt-4">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total</span>
                                    <span>₹{cartTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Wishlist Page Component
    const WishlistPage = () => (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

                {wishlist.length === 0 ? (
                    <div className="text-center py-16">
                        <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg mb-4">Your wishlist is empty</p>
                        <button
                            onClick={() => setCurrentPage('products')}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlist.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    // Login Page Component
    const LoginPage = () => {
        const [isRegister, setIsRegister] = useState(false);
        const [formData, setFormData] = useState({
            email: '',
            password: '',
            name: '',
            confirmPassword: ''
        });

        const handleSubmit = (e) => {
            e.preventDefault();
            if (isRegister) {
                if (formData.password !== formData.confirmPassword) {
                    alert('Passwords do not match');
                    return;
                }
                // Register logic
                login(formData.email, formData.password);
            } else {
                // Check for admin login
                const isAdmin = formData.email === 'admin@shopzone.com' && formData.password === 'admin123';
                login(formData.email, formData.password, isAdmin);
            }
        };

        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            {isRegister ? 'Create your account' : 'Sign in to your account'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <button
                                onClick={() => setIsRegister(!isRegister)}
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                {isRegister ? 'Sign in' : 'Sign up'}
                            </button>
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            {isRegister && (
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                            )}
                            <input
                                type="email"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                required
                            />
                            {isRegister && (
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                        >
                            {isRegister ? 'Sign up' : 'Sign in'}
                        </button>

                        {!isRegister && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>Demo Credentials:</strong><br />
                                    User: any email/password<br />
                                    Admin: admin@shopzone.com / admin123
                                </p>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        );
    };

    // Admin Dashboard Component
    const AdminDashboard = () => {
        const [activeTab, setActiveTab] = useState('overview');

        const AdminOverview = () => (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Products</p>
                            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                        </div>
                        <Package className="h-8 w-8 text-blue-600" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900">127</p>
                        </div>
                        <ShoppingCart className="h-8 w-8 text-green-600" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">1,234</p>
                        </div>
                        <Users className="h-8 w-8 text-purple-600" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">₹2,34,567</p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-yellow-600" />
                    </div>
                </div>
            </div>
        );

        const AdminProducts = () => (
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Products Management</h3>
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                            Add Product
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.slice(0, 10).map((product) => (
                                <tr key={product.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img className="h-10 w-10 rounded-lg object-cover" src={product.image} alt="" />
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 line-clamp-1">{product.title}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{product.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{product.priceINR.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button className="text-indigo-600 hover:text-indigo-900">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button className="text-green-600 hover:text-green-900">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button className="text-red-600 hover:text-red-900">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );

        const AdminOrders = () => (
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">Recent Orders</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {Array.from({ length: 10 }, (_, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{1000 + i}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Customer {i + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2024-01-{15 + i}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{(Math.random() * 10000 + 1000).toFixed(0)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${i % 3 === 0 ? 'bg-green-100 text-green-800' :
                                            i % 3 === 1 ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {i % 3 === 0 ? 'Delivered' : i % 3 === 1 ? 'Processing' : 'Shipped'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button className="text-indigo-600 hover:text-indigo-900">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button className="text-green-600 hover:text-green-900">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );

        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-600">Manage your e-commerce platform</p>
                    </div>

                    {/* Tabs */}
                    <div className="mb-8">
                        <nav className="flex space-x-8">
                            {[
                                { id: 'overview', name: 'Overview' },
                                { id: 'products', name: 'Products' },
                                { id: 'orders', name: 'Orders' },
                                { id: 'users', name: 'Users' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {tab.name}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'overview' && <AdminOverview />}
                    {activeTab === 'products' && <AdminProducts />}
                    {activeTab === 'orders' && <AdminOrders />}
                    {activeTab === 'users' && (
                        <div className="bg-white p-8 rounded-lg shadow-md text-center">
                            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Users Management</h3>
                            <p className="text-gray-600">User management functionality coming soon...</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Profile Page Component
    const ProfilePage = () => (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold mb-8">My Profile</h1>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Profile Sidebar */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User className="h-10 w-10 text-indigo-600" />
                                </div>
                                <h2 className="text-xl font-semibold">{currentUser?.name}</h2>
                                <p className="text-gray-600">{currentUser?.email}</p>
                            </div>

                            <nav className="space-y-2">
                                <button className="w-full text-left px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600">
                                    Account Details
                                </button>
                                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50">
                                    Order History
                                </button>
                                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50">
                                    Address Book
                                </button>
                                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50">
                                    Settings
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-6">Account Details</h3>

                            <form className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <input
                                            type="text"
                                            defaultValue="John"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            defaultValue="Doe"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        defaultValue={currentUser?.email}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        defaultValue="+91 9876543210"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <textarea
                                        defaultValue="123 Main Street, Hyderabad, Telangana, 500001"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        rows="3"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Footer Component
    const Footer = () => (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">ShopZone</h3>
                        <p className="text-gray-400 text-sm">
                            Your one-stop destination for quality products at amazing prices.
                            Shop with confidence and enjoy fast delivery across India.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><button onClick={() => setCurrentPage('home')} className="text-gray-400 hover:text-white">Home</button></li>
                            <li><button onClick={() => setCurrentPage('products')} className="text-gray-400 hover:text-white">Products</button></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Customer Service</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Returns</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Shipping Info</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Track Order</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Connect With Us</h4>
                        <div className="flex space-x-4 mb-4">
                            <a href="#" className="text-gray-400 hover:text-white">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                        <div className="text-sm text-gray-400">
                            <p className="flex items-center mb-1">
                                <Mail className="h-4 w-4 mr-2" />
                                support@shopzone.com
                            </p>
                            <p className="flex items-center">
                                <Phone className="h-4 w-4 mr-2" />
                                +91 1800-123-4567
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                    <p>&copy; 2024 ShopZone. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );

    // Main App Component
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Product Modal */}
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}

            {/* Main Content */}
            <main>
                {currentPage === 'home' && <HomePage />}
                {currentPage === 'products' && <ProductsPage />}
                {currentPage === 'cart' && currentUser && <CartPage />}
                {currentPage === 'checkout' && currentUser && <CheckoutPage />}
                {currentPage === 'wishlist' && currentUser && <WishlistPage />}
                {currentPage === 'login' && <LoginPage />}
                {currentPage === 'profile' && currentUser && !currentUser.isAdmin && <ProfilePage />}
                {currentPage === 'admin-dashboard' && currentUser && currentUser.isAdmin && <AdminDashboard />}
            </main>

            <Footer />
        </div>
    );
};

export default EcommercePlatform;  