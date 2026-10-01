import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { serviceService, providerService } from '../services/api';
import { ArrowLeft, User, Calendar, Star, CheckCircle, ArrowRight } from 'lucide-react';

export const ServiceDetailPage = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const serviceData = await serviceService.getById(id);
      setService(serviceData);
      const providersData = await providerService.getByService(id);
      setProviders(providersData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Service Not Found</h2>
        <Link to="/services" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
          Back to all services
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/services" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Services
      </Link>

      {/* Service Header Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-md">
              {service.category?.name}
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">{service.name}</h1>
            <p className="text-gray-600 mt-2 max-w-xl">{service.description}</p>
          </div>
          <div className="text-left md:text-right flex-shrink-0">
            <span className="text-xs text-gray-500 block">Price</span>
            <span className="text-3xl font-extrabold text-gray-900">₹{service.price}</span>
            <div className="mt-3">
              <Link
                to={`/book?serviceId=${service.id}`}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition shadow-sm inline-flex items-center space-x-1.5"
              >
                <span>Book This Service</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Available Providers Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Available Service Providers ({providers.length})
        </h2>

        {providers.length === 0 ? (
          <div className="p-6 bg-white rounded-xl border border-gray-200 text-center text-gray-500 text-sm">
            No specific providers assigned yet. You can still select this service on the booking page.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-base">
                      {provider.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{provider.user?.name}</h3>
                      <p className="text-xs text-blue-600 font-medium">{provider.experience} experience</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-3 mb-4">{provider.bio}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    to={`/providers/${provider.id}`}
                    className="text-xs text-gray-600 hover:text-blue-600 font-medium"
                  >
                    View Profile & Reviews
                  </Link>
                  <Link
                    to={`/book?serviceId=${service.id}&providerId=${provider.id}`}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition"
                  >
                    Select Provider
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
