import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Sparkles, 
  Upload, 
  X, 
  Search, 
  ShoppingBag, 
  Zap, 
  Camera, 
  TrendingUp, 
  Heart,
  Filter,
  SlidersHorizontal,
  Clock,
  Check,
  AlertCircle 
} from 'lucide-react';
import { products } from '../data/products';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'mens' | 'womens' | 'caps' | 'bags' | 'shoes' | 'unisex';
  images: string[];
  sizes: string[];
  colors: string[];
  quantity: number;
  status: 'available' | 'low-stock' | 'sold-out';
}

const AIItemFinder = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [similarityScore, setSimilarityScore] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'visual' | 'trending'>('visual');
  const [cameraMode, setCameraMode] = useState(false);
  const [similarityThreshold, setSimilarityThreshold] = useState(70);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 5242880, // 5MB
    onDrop: files => {
      if (files.length > 0) {
        const file = files[0];
        setSelectedImage(URL.createObjectURL(file));
        setIsSearching(true);
        
        // Simulate image processing and AI search
        setTimeout(() => {
          performAISearch(file);
        }, 1800);
      }
    }
  });

  const performAISearch = (file) => {
    // Simulate AI processing
    const randomScore = Math.floor(Math.random() * 30) + 70; // Random score between 70-99
    setSimilarityScore(randomScore);
    
    // Filter products based on similarity threshold
    const filteredProducts = products.filter(product => 
      product.status !== 'sold-out' && 
      Math.random() * 100 > (100 - similarityThreshold)
    );
    
    // Sort by relevance (random in this case)
    const sortedResults = [...filteredProducts].sort(() => 0.5 - Math.random()).slice(0, 8);
    
    setSearchResults(sortedResults);
    setIsSearching(false);
  };

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'available':
        return <span className="flex items-center text-green-600 text-xs"><Check className="w-3 h-3 mr-1" /> In Stock</span>;
      case 'low-stock':
        return <span className="flex items-center text-amber-600 text-xs"><Clock className="w-3 h-3 mr-1" /> Low Stock</span>;
      case 'sold-out':
        return <span className="flex items-center text-red-600 text-xs"><AlertCircle className="w-3 h-3 mr-1" /> Sold Out</span>;
      default:
        return null;
    }
  };

  const resetSearch = (e) => {
    e.stopPropagation();
    setSelectedImage(null);
    setSearchResults([]);
    setActiveFilters([]);
    setSimilarityScore(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative">
      {/* Subtle pattern overlay */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none z-0"></div>
      
      {/* Minimal animated accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-96 h-96 bg-black/5 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-black/5 rounded-full blur-3xl bottom-0 right-0 animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-16 relative z-10">
       

       

        {/* Tab Navigation */}
        <div className="flex mb-8 border-b border-gray-200">
          <button 
            className={`py-3 px-5 font-medium flex items-center ${activeTab === 'visual' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
            onClick={() => setActiveTab('visual')}
          >
            <Camera className="w-4 h-4 mr-2" />
            Visual Search
          </button>
          <button 
            className={`py-3 px-5 font-medium flex items-center ${activeTab === 'trending' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
            onClick={() => setActiveTab('trending')}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Trending Styles
          </button>
        </div>

        {activeTab === 'visual' && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-8">
              {!cameraMode ? (
                <div 
                  {...getRootProps()}
                  className={`relative border-2 border-dashed rounded-2xl transition-all overflow-hidden
                    ${isDragActive ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-400'}`}
                >
                  <input {...getInputProps()} />
                  
                  {selectedImage ? (
                    <div className="relative">
                      <img 
                        src={selectedImage} 
                        alt="Uploaded" 
                        className="w-full object-contain rounded-xl"
                        style={{ maxHeight: '400px' }} // Reduced image size
                      />
                      <button
                        onClick={resetSearch}
                        className="absolute top-4 right-4 p-2 bg-black/70 hover:bg-black rounded-full text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      
                      {/* Similarity score */}
                      {similarityScore > 0 && (
                        <div className="absolute top-4 left-4 bg-black/70 rounded-full px-3 py-1.5 text-white font-medium text-sm">
                          {similarityScore}% Match
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-12 md:py-16 space-y-5 text-center">
                      <div className="relative mx-auto w-16 h-16 bg-black rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-white" />
                        <div className="absolute inset-0 bg-black rounded-full animate-ping opacity-20"></div>
                      </div>
                      <div>
                        <p className="text-xl font-medium text-gray-900">
                          {isDragActive ? 'Drop to discover similar styles' : 'Upload a fashion image'}
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                          Drag and drop or click to select an image (max 5MB)
                        </p>
                      </div>
                      <div className="pt-4 flex justify-center gap-4">
                        <button className="px-6 py-3 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-all">
                          Select Image
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setCameraMode(true);
                          }}
                          className="px-6 py-3 bg-white border border-gray-300 text-gray-800 font-medium rounded-full hover:bg-gray-50 transition-all flex items-center"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Use Camera
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative border-2 border-dashed rounded-2xl transition-all overflow-hidden">
                  <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-10 h-10 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-500">Camera preview would appear here</p>
                      <button 
                        onClick={() => setCameraMode(false)}
                        className="mt-4 px-4 py-2 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-all"
                      >
                        Back to Upload
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Similarity threshold slider */}
              {selectedImage && (
                <div className="mt-6 px-1">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">Similarity Threshold: {similarityThreshold}%</label>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={similarityThreshold}
                    onChange={(e) => setSimilarityThreshold(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>More Options</span>
                    <span>Exact Matches</span>
                  </div>
                </div>
              )}

              {isSearching && (
                <div className="mt-10 text-center">
                  <div className="inline-flex items-center justify-center gap-3 py-3 px-6 bg-gray-50 rounded-full">
                    <div className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full"></div>
                    <span className="text-gray-800 font-medium">Analyzing style details...</span>
                  </div>
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="mt-12">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
                        <Search className="w-5 h-5 text-gray-800" />
                        <span>Style Matches</span>
                      </h2>
                      <p className="text-gray-500 text-sm">Found {searchResults.length} products matching your style</p>
                    </div>
                    
                    <button 
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium"
                    >
                      <Filter className="w-4 h-4" />
                      Filters
                    </button>
                  </div>
                  
                  {/* Filters */}
                  {showFilters && (
                    <div className="mb-8 p-4 bg-gray-50 rounded-xl">
                      <div className="mb-4">
                        <h3 className="text-sm font-medium mb-2">Categories</h3>
                        <div className="flex flex-wrap gap-2">
                          {['mens', 'womens', 'caps', 'bags', 'shoes', 'unisex'].map((category) => (
                            <button
                              key={category}
                              onClick={() => toggleFilter(category)}
                              className={`px-3 py-1 text-xs font-medium rounded-full ${
                                activeFilters.includes(category)
                                  ? 'bg-black text-white'
                                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Status</h3>
                        <div className="flex flex-wrap gap-2">
                          {['available', 'low-stock'].map((status) => (
                            <button
                              key={status}
                              onClick={() => toggleFilter(status)}
                              className={`px-3 py-1 text-xs font-medium rounded-full ${
                                activeFilters.includes(status)
                                  ? 'bg-black text-white'
                                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {status === 'available' ? 'In Stock' : 'Low Stock'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Search results */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {searchResults.map((product) => (
                      <div key={product.id} className="group">
                        <div className="relative overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
                          <div className="aspect-[3/4] overflow-hidden">
                            <img 
                              src={product.images[0] || '/api/placeholder/400/500'} 
                              alt={product.name} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-6 group-hover:translate-y-0 transition-transform">
                              <button className="w-full bg-white text-black font-medium py-2 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2 text-sm">
                                <ShoppingBag className="w-4 h-4" />
                                View Product
                              </button>
                            </div>
                          </div>
                          
                          <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-gray-100">
                            <Heart className="w-4 h-4 text-gray-800" />
                          </button>
                        </div>
                        
                        <div className="mt-3 px-1">
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                              {product.category}
                            </p>
                            {getStatusBadge(product.status)}
                          </div>
                          <h3 className="font-medium text-gray-900 mt-1 truncate">{product.name}</h3>
                          <div className="flex justify-between items-center mt-1">
                            <p className="font-semibold">${product.price.toFixed(2)}</p>
                            <div className="flex gap-1">
                              {product.colors.slice(0, 3).map((color, index) => (
                                <div 
                                  key={index} 
                                  className="w-3 h-3 rounded-full border border-gray-300" 
                                  style={{ backgroundColor: color }}
                                ></div>
                              ))}
                              {product.colors.length > 3 && (
                                <div className="text-xs text-gray-500">+{product.colors.length - 3}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'trending' && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden p-6 md:p-8">
            <div className="text-center mb-10">
              <TrendingUp className="w-8 h-8 text-gray-800 mx-auto mb-3" />
              <h2 className="text-xl font-semibold">Trending Styles</h2>
              <p className="text-gray-500 mt-1">Discover the most popular fashion items this week</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.filter(p => p.status === 'available').slice(0, 8).map((product) => (
                <div key={product.id} className="group">
                  <div className="relative overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
                    <div className="aspect-[3/4] overflow-hidden">
                      <img 
                        src={product.images[0] || '/api/placeholder/400/500'} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-6 group-hover:translate-y-0 transition-transform">
                        <button className="w-full bg-white text-black font-medium py-2 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2 text-sm">
                          <ShoppingBag className="w-4 h-4" />
                          View Product
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 px-1">
                    <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                    <p className="font-semibold mt-1">${product.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}



         {/* Feature Explanation */}
         <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-gray-800" />
              New Feature: Advanced Style Matching
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <div className="h-14 w-14 bg-gray-900 rounded-full flex items-center justify-center mb-3">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-1">Visual Search</h3>
                <p className="text-sm text-gray-600">Upload any fashion image to find visually similar products across our entire catalog.</p>
              </div>
              <div className="flex flex-col">
                <div className="h-14 w-14 bg-gray-800 rounded-full flex items-center justify-center mb-3">
                  <SlidersHorizontal className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-1">Similarity Controls</h3>
                <p className="text-sm text-gray-600">Adjust the similarity threshold to find products that match your specific style preferences.</p>
              </div>
              <div className="flex flex-col">
                <div className="h-14 w-14 bg-gray-700 rounded-full flex items-center justify-center mb-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-1">Trending Suggestions</h3>
                <p className="text-sm text-gray-600">Explore trending styles and personal recommendations based on your search history.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default AIItemFinder;