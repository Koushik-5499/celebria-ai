import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
        <Sparkles className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 font-serif">404 - Page Not Found</h1>
      <p className="text-sm text-slate-500 max-w-md mx-auto">
        The celebration page or link you followed could not be found. Let&apos;s return you to your event dashboard.
      </p>
      <div className="pt-2">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/20"
        >
          <Home className="w-4 h-4" />
          <span>Return to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
