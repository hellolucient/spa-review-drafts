'use client';

import { useState } from 'react';

interface ReviewDraft {
  review: string;
  draft: string;
}

const SAMPLE_REVIEWS = `Absolutely terrible experience. Waited 40 minutes past my appointment time. The massage room was cold and the therapist kept checking her phone. Never coming back.

---

Good massage overall. Therapist was skilled. Only complaint is the locker room could be cleaner. Would probably return.

---

Amazing experience from start to finish! The staff was welcoming, facility spotless, and my massage was exactly what I needed. Already booked my next appointment!`;

export default function Home() {
  const [spaName, setSpaName] = useState('');
  const [voiceNotes, setVoiceNotes] = useState('');
  const [reviewsText, setReviewsText] = useState('');
  const [drafts, setDrafts] = useState<ReviewDraft[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadSample = () => {
    setSpaName('Serenity Spa');
    setVoiceNotes('warm, short, no corporate');
    setReviewsText(SAMPLE_REVIEWS);
    setDrafts([]);
    setError('');
  };

  const handleDraftReplies = async () => {
    if (!reviewsText.trim()) {
      setError('Please paste at least one review');
      return;
    }

    setLoading(true);
    setError('');
    setDrafts([]);

    try {
      const response = await fetch('/api/draft-replies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spaName: spaName.trim() || undefined,
          voiceNotes: voiceNotes.trim() || undefined,
          reviews: reviewsText.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate drafts');
      }

      const data = await response.json();
      setDrafts(data.drafts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Spa Review Reply Drafts
          </h1>
          <p className="text-gray-600">
            Paste your Google reviews and get professional reply drafts instantly
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="spaName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Spa Name <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                id="spaName"
                value={spaName}
                onChange={(e) => setSpaName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Serenity Spa"
              />
            </div>

            <div>
              <label
                htmlFor="voiceNotes"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Voice Notes <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                id="voiceNotes"
                value={voiceNotes}
                onChange={(e) => setVoiceNotes(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., warm, short, no corporate"
              />
            </div>

            <div>
              <label
                htmlFor="reviews"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Reviews{' '}
                <span className="text-gray-500 text-xs">
                  (paste one or multiple reviews, separated by --- or blank lines)
                </span>
              </label>
              <textarea
                id="reviews"
                value={reviewsText}
                onChange={(e) => setReviewsText(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-48"
                placeholder="Paste reviews here..."
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleDraftReplies}
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Generating...' : 'Draft Replies'}
              </button>
              <button
                onClick={loadSample}
                disabled={loading}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-300 disabled:opacity-50 transition-colors"
              >
                Try a Sample
              </button>
            </div>
          </div>
        </div>

        {drafts.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Reply Drafts ({drafts.length})
            </h2>
            {drafts.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 grid md:grid-cols-2 gap-6"
              >
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase">
                    Original Review
                  </h3>
                  <div className="bg-gray-50 rounded p-4 text-gray-700 whitespace-pre-wrap">
                    {item.review}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase">
                      Draft Reply
                    </h3>
                    <button
                      onClick={() => copyToClipboard(item.draft)}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="bg-indigo-50 rounded p-4 text-gray-700 whitespace-pre-wrap">
                    {item.draft}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
