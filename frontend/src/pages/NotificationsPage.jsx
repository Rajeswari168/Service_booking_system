import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/api';
import { Bell, Check, CheckCheck, Clock } from 'lucide-react';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getAll();
      setNotifications(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time updates regarding your service bookings</p>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900">No notifications</h3>
          <p className="text-sm text-gray-500 mt-1">You're all caught up!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-5 flex items-start justify-between gap-4 transition ${
                notif.isRead ? 'bg-white' : 'bg-blue-50/40'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div
                  className={`mt-0.5 p-2 rounded-full flex-shrink-0 ${
                    notif.isRead ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <p
                    className={`text-sm leading-relaxed ${
                      notif.isRead ? 'text-gray-700' : 'text-gray-900 font-medium'
                    }`}
                  >
                    {notif.message}
                  </p>
                  <span className="text-xs text-gray-400 mt-1.5 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {!notif.isRead && (
                <button
                  onClick={() => handleMarkAsRead(notif.id)}
                  className="px-2.5 py-1 text-xs font-semibold text-blue-600 bg-white hover:bg-blue-50 border border-blue-200 rounded-md transition flex-shrink-0 flex items-center space-x-1"
                >
                  <Check className="w-3 h-3" />
                  <span>Mark Read</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
