import React, { useState } from 'react';
import { runPrestigePathFinder } from '../services/realityApi';
import { GitMerge, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

const SmartAdvisor = () => {
  const [shipName, setShipName] = useState('');
  const [targetCrew, setTargetCrew] = useState('Eva');
  const [unownedExclude, setUnownedExclude] = useState('');
  const [unownedExtra, setUnownedExtra] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetCrew.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const data = await runPrestigePathFinder(shipName, targetCrew, unownedExclude, unownedExtra);
      setResult(data);
    } catch (err) {
      console.error("Prestige calculation error:", err);
      setResult({
        status: 'error',
        message: 'Failed to run Prestige Path Finder.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-container">
      <div className="card">
        <div className="card-body">
          <div className="flex items-center space-x-2 mb-2">
            <GitMerge className="w-6 h-6 text-indigo-400" />
            <h2 className="card-title">Smart Prestige Advisor</h2>
          </div>
          <p className="card-subtitle">
            Combines <strong>Blackhand's Prestige Path Finder</strong> (hosted via <code>pss.reality.net</code>) with <strong>Pixel-Prestige</strong> role metrics. Enter your ship name and target crew to calculate optimal 2-crew fusion paths.
          </p>

          <form onSubmit={handleSubmit} className="advisor-form-grid">
            <div className="form-group">
              <label>Ship Name (Optional)</label>
              <input
                type="text"
                placeholder="Enter ship name to inspect owned crew..."
                value={shipName}
                onChange={(e) => setShipName(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Target Crew Name <span className="text-rose-400">*</span></label>
              <input
                type="text"
                placeholder="e.g. Eva, Admiral Snek, Spike Spiegel"
                value={targetCrew}
                onChange={(e) => setTargetCrew(e.target.value)}
                required
                className="form-control"
              />
            </div>

            <div className="form-group col-span-2">
              <label>Exclude Crew Copies (Optional)</label>
              <textarea
                placeholder="Enter comma-separated crew to exclude i.e. Elf, Noah..."
                value={unownedExclude}
                onChange={(e) => setUnownedExclude(e.target.value)}
                rows="2"
                className="form-control"
              />
            </div>

            <div className="form-group col-span-2">
              <label>Unowned Extra Crew (Optional)</label>
              <textarea
                placeholder="Enter comma-separated unowned crew names..."
                value={unownedExtra}
                onChange={(e) => setUnownedExtra(e.target.value)}
                rows="2"
                className="form-control"
              />
            </div>

            <div className="col-span-2">
              <button type="submit" className="btn btn-primary w-full py-3" disabled={loading}>
                {loading ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    <span>Running Prestige Path Finder on pss.reality.net...</span>
                  </>
                ) : (
                  <>
                    <GitMerge className="w-5 h-5 mr-2" />
                    <span>Calculate Optimal Prestige Fusion Paths</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Output Result Card */}
      {result && (
        <div className="card">
          <div className="card-header flex-between">
            <h3 className="card-title flex items-center">
              {result.status === 'success' ? (
                <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2 text-rose-400" />
              )}
              Prestige Path Finder Results
            </h3>
            <span className="text-xs text-muted">Powered by pss.reality.net (/run-script)</span>
          </div>
          <div className="card-body">
            {result.status === 'success' ? (
              <div>
                <div className="text-sm text-emerald-400 mb-4">{result.message}</div>
                <div
                  className="code-output-block"
                  dangerouslySetInnerHTML={{ __html: result.output || 'Prestige tree calculated successfully.' }}
                />
              </div>
            ) : (
              <div className="text-rose-400 font-medium">
                {result.message || 'An error occurred while calculating fusion paths.'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartAdvisor;
