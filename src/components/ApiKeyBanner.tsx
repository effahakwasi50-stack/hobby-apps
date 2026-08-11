import React from 'react';
import { Key, ExternalLink, ShieldAlert, X } from 'lucide-react';

interface Props {
  onDismiss?: () => void;
}

export const ApiKeyBanner: React.FC<Props> = ({ onDismiss }) => {
  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-b border-amber-500/20 px-4 py-3 text-amber-900 dark:text-amber-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 rounded-xl shrink-0">
            <Key className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <span className="font-semibold text-amber-900 dark:text-amber-100">
              Live Google Maps & Places API Key Optional Setup
            </span>
            <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
              Vacation Hub works out-of-the-box with rich interactive maps & curated places data. To enable live Google Places search:
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <a
            href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-100 text-xs font-medium rounded-lg transition"
          >
            Get API Key <ExternalLink className="w-3 h-3" />
          </a>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1 hover:bg-amber-500/20 rounded-lg transition text-amber-700 dark:text-amber-300"
              title="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
