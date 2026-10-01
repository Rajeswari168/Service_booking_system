import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { providerService, reviewService } from '../services/api';
import { ArrowLeft, Star, Briefcase, User, Calendar, CheckCircle } from 'lucide-react';

export const ProviderDetailPage = () => {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const p = await providerService.getById(id);
      setProvider(p);
      const r = await reviewService.getByProvider(id);
      setReviews(r);
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

  if (!provider) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Provider Not Found</h2>
        <Link to="/services" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
          Back to services
        </Link>
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
      : 'New';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/services" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Services
      </Link>

      {/* Provider Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-2xl">
              {provider.user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{provider.user?.name}</h1>
              <p className="text-sm text-gray-500 flex items-center mt-0.5">
                <Briefcase className="w-4 h-4 mr-1 text-gray-400" />
                {provider.experience} experience
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <div>
              <span className="text-lg font-bold text-amber-900">{averageRating}</span>
              <span className="text-xs text-amber-700 ml-1">({reviews.length} reviews)</span>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-100 pt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700 mb-2">About Provider</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{provider.bio}</p>
        </div>
      </div>

      {/* Services Offered */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Services Offered</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {provider.services?.map((svc) => (
            <div
              key={svc.id}
              className="p-4 border border-gray-200 rounded-xl flex items-center justify-between hover:bg-gray-50 transition"
            >
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">{svc.name}</h4>
                <span className="text-xs text-blue-600 font-bold">₹{svc.price}</span>
              </div>
              <Link
                to={`/book?serviceId=${svc.id}&providerId=${provider.id}`}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg"
              >
                Book
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews & Ratings */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Customer Reviews ({reviews.length})</h2>

        {reviews.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No reviews yet for this provider.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {reviews.map((rev) => (
              <div key={rev.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-semibold">
                      {rev.customer?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{rev.customer?.name}</span>
                  </div>
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 pl-8">{rev.comment}</p>
                <div className="text-[11px] text-gray-400 pl-8 mt-1">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
