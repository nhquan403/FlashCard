import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { bulkCreateWords } from '../../db/queries';
import { parseWordImport } from '../../lib/parse-word-import';
import ResponsiveSheet from '../ui/responsive-sheet';

interface WordImportModalProps {
  folderId: number;
  onClose: () => void;
}

type Step = 'input' | 'preview';

export default function WordImportModal({ folderId, onClose }: WordImportModalProps) {
  const [step, setStep] = useState<Step>('input');
  const [text, setText] = useState('');
  const [delimiterHint, setDelimiterHint] = useState('');
  const [parsed, setParsed] = useState<{ pairs: Array<{ word: string; description: string; pronunciation?: string }>; skipped: number }>({ pairs: [], skipped: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTextChange = (value: string) => {
    setText(value);
    if (value.trim()) {
      const { detectedDelimiter, pairs } = parseWordImport(value);
      const label = detectedDelimiter === '\t' ? 'tab' : `"${detectedDelimiter}"`;
      setDelimiterHint(`Detected: ${label} · ${pairs.length} word${pairs.length !== 1 ? 's' : ''}`);
    } else {
      setDelimiterHint('');
    }
  };

  const handleParse = () => {
    const result = parseWordImport(text);
    if (result.pairs.length === 0) {
      setError('No valid pairs found. Each line should be: word - description');
      return;
    }
    setError('');
    setParsed({ pairs: result.pairs, skipped: result.skipped });
    setStep('preview');
  };

  const handleImport = async () => {
    setLoading(true);
    try {
      await bulkCreateWords(folderId, parsed.pairs);
      onClose();
    } catch {
      setError('Import failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <ResponsiveSheet onClose={onClose} ariaLabel="import words">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-4 pb-1 mb-4">
          <h2 className="text-gray-100 text-lg font-semibold">
            {step === 'input' ? 'Import Words' : 'Preview Import'}
          </h2>
          <button onClick={onClose} className="relative p-2 -m-1 text-gray-400 hover:text-gray-200 rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-colors touch-manipulation">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pb-6">
          {step === 'input' ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-300 text-sm font-medium">Paste words</label>
                <textarea
                  value={text}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder={"Paste words here, one per line\nexample: apple - a common fruit\nhello - a greeting"}
                  rows={6}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500 w-full placeholder-gray-500 resize-none font-mono text-sm min-h-[140px] sm:min-h-[240px]"
                  autoFocus
                />
                {delimiterHint && (
                  <p className="text-blue-400 text-xs">{delimiterHint}</p>
                )}
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-700 hover:bg-gray-600 text-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleParse}
                  disabled={!text.trim()}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Parse
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-gray-300 text-sm">
                <span className="text-green-400 font-semibold">{parsed.pairs.length} words</span> parsed
                {parsed.skipped > 0 && (
                  <span className="text-yellow-400">, {parsed.skipped} skipped</span>
                )}
              </p>

              {/* Preview table */}
              <div className="overflow-y-auto max-h-[clamp(160px,40vh,300px)] rounded-lg border border-gray-700">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-gray-800">
                    <tr>
                      <th className="text-left px-3 py-2 text-gray-400 font-medium w-1/4">Word</th>
                      <th className="text-left px-3 py-2 text-gray-400 font-medium">Description</th>
                      <th className="text-left px-3 py-2 text-gray-400 font-medium w-1/4">Pronunciation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.pairs.map((pair, i) => (
                      <tr key={i} className="border-t border-gray-800">
                        <td className="px-3 py-2 text-gray-100 font-medium">{pair.word}</td>
                        <td className="px-3 py-2 text-gray-400 truncate max-w-[160px]" title={pair.description}>
                          {pair.description}
                        </td>
                        <td className="px-3 py-2 text-gray-500 font-mono text-xs truncate" title={pair.pronunciation}>
                          {pair.pronunciation ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setStep('input'); setError(''); }}
                  className="bg-gray-700 hover:bg-gray-600 text-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleImport}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Importing…' : `Import ${parsed.pairs.length} words`}
                </button>
              </div>
            </div>
          )}
        </div>
      </ResponsiveSheet>
    </AnimatePresence>
  );
}
