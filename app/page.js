'use client';

import React from 'react';
import {
  TrendingUp,
  Activity,
  Layers,
  BrainCircuit,
  AlertTriangle,
  Zap
} from 'lucide-react';
import Card from '../components/Card';
import ChartComponent from '../components/ChartComponent';
import { useCryptoData } from '../hooks/useCryptoData';

export default function App() {
  const { data, error, isValidating } = useCryptoData();

  const currentBTC = data?.btc?.[data.btc.length - 1];
  const prevBTC = data?.btc?.[data.btc.length - 2];
  const priceChange = currentBTC && prevBTC ? currentBTC.close - prevBTC.close : 0;
  const percentChange = currentBTC && prevBTC ? ((priceChange / prevBTC.close) * 100).toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">Crypto<span className="text-indigo-400">Pulse</span> AI</h1>
              <p className="text-[10px] text-slate-400 font-mono tracking-widest">REAL-TIME PREDICTION ENGINE</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full border border-slate-700">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isValidating ? 'bg-indigo-400' : 'bg-green-400'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isValidating ? 'bg-indigo-500' : 'bg-green-500'}`}></span>
              </span>
              <span className="text-xs font-mono text-slate-300">
                {isValidating ? 'SYNCING BINANCE...' : 'SYSTEM LIVE'}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-4 text-red-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div className="text-sm">
              <strong className="block mb-1">Data Fetch Error</strong>
              Binance API might be rate-limiting or blocking cross-origin requests.
              {error.message}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card
            title="Bitcoin Price"
            value={currentBTC ? `$${currentBTC.close.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '---'}
            subValue={currentBTC ? `${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)} (${percentChange}%)` : '---'}
            icon={TrendingUp}
            colorClass="text-orange-500"
          />
          <Card
            title="Market Volatility"
            value="High"
            subValue="Index: 82.4"
            icon={Activity}
            colorClass="text-purple-500"
          />
          <Card
            title="Correlation Factor"
            value="0.89"
            subValue="Strong ETH/SOL Link"
            icon={Layers}
            colorClass="text-blue-400"
          />
          <Card
            title="AI Confidence"
            value="Bullish"
            subValue="SMA Crossover Pending"
            icon={BrainCircuit}
            colorClass="text-emerald-400"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Live Market Analysis
            </h2>
          </div>

          <ChartComponent data={data} isLoading={!data && !error} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-400">
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
              <h3 className="text-slate-200 font-semibold mb-2">Technical Insight</h3>
              <p>
                The chart displays a real-time <span className="text-yellow-400 font-bold">20-period SMA</span> prediction overlay calculated client-side.
                Background areas represent ETH (Purple) and SOL (Green) price action scaled relative to their own axes, providing immediate visual context for market-wide movements.
              </p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
              <h3 className="text-slate-200 font-semibold mb-2">System Status</h3>
              <div className="flex justify-between border-b border-slate-800/50 pb-2 mb-2">
                <span>Data Source</span>
                <span className="text-slate-200">Binance Public API</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/50 pb-2 mb-2">
                <span>Update Frequency</span>
                <span className="text-slate-200">Every 3 Seconds (Polling)</span>
              </div>
              <div className="flex justify-between">
                <span>Render Engine</span>
                <span className="text-slate-200">Lightweight Charts (Canvas)</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}