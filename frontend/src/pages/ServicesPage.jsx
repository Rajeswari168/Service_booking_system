import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { serviceService, categoryService } from '../services/api';
import { Search, Filter, ArrowRight, Tag, CheckCircle } from 'lucide-react';

export const ServicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadServices();
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await serviceService.getAll(searchTerm, selectedCategory);
      setServices(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadServices();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-sm">
        <h1 className="text-3xl font-extrabold tracking-tight">Home Services on Demand</h1>
        <p className="mt-2 text-blue-100 max-w-2xl">
          Book trusted professionals for plumbing, electrical, and cooking services at upfront prices.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-xl">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search services (e.g. Tap Repair, Fan Installation)..."
              className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl text-sm transition shadow-sm"
          >
            Search
          </button>
        </form>
      </div>

      {/* Categories Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
            selectedCategory === ''
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id.toString())}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat.id.toString()
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Tag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900">No services found</h3>
          <p className="text-sm text-gray-500 mt-1">Try searching for something else or change filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                    {service.category?.name || 'General'}
                  </span>
                  <span className="text-lg font-bold text-gray-900">₹{service.price}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{service.description}</p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                <Link
                  to={`/services/${service.id}`}
                  className="text-xs font-medium text-gray-600 hover:text-blue-600 transition"
                >
                  View Details
                </Link>
                <Link
                  to={`/book?serviceId=${service.id}`}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition flex items-center space-x-1.5 shadow-sm"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
