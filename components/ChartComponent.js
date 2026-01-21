'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { createChart, ColorType, CrosshairMode, LineStyle } from 'lightweight-charts';
import { RefreshCw } from 'lucide-react';
import { calculateSMA } from '../utils/analytics';

const ChartComponent = ({ data, isLoading }) => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const seriesRef = useRef({ btc: null, eth: null, sol: null, prediction: null });

    const predictionData = useMemo(() => {
        if (!data?.btc) return [];
        return calculateSMA(data.btc, 20);
    }, [data?.btc]);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: '#0f172a' },
                textColor: '#94a3b8',
            },
            grid: {
                vertLines: { color: '#1e293b' },
                horzLines: { color: '#1e293b' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 500,
            crosshair: { mode: CrosshairMode.Normal },
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
                borderColor: '#334155',
            },
            rightPriceScale: {
                borderColor: '#334155',
                visible: true,
                scaleMargins: { top: 0.1, bottom: 0.2 },
            },

            leftPriceScale: {
                visible: false,
                borderColor: '#334155',
                scaleMargins: { top: 0.3, bottom: 0.1 },
            },
        });

        const ethSeries = chart.addAreaSeries({
            priceScaleId: 'left',
            lineColor: 'rgba(98, 126, 234, 0.5)',
            topColor: 'rgba(98, 126, 234, 0.2)',
            bottomColor: 'rgba(98, 126, 234, 0.0)',
            lineWidth: 1,
        });

        const solSeries = chart.addAreaSeries({
            priceScaleId: 'left',
            lineColor: 'rgba(20, 241, 149, 0.5)',
            topColor: 'rgba(20, 241, 149, 0.2)',
            bottomColor: 'rgba(20, 241, 149, 0.0)',
            lineWidth: 1,
        });

        const btcSeries = chart.addCandlestickSeries({
            priceScaleId: 'right',
            upColor: '#22c55e',
            downColor: '#ef4444',
            borderVisible: false,
            wickUpColor: '#22c55e',
            wickDownColor: '#ef4444',
        });

        const predictionSeries = chart.addLineSeries({
            priceScaleId: 'right',
            color: '#fbbf24',
            lineWidth: 2,
            lineStyle: LineStyle.Solid,
            title: 'SMA (20) Prediction',
        });

        chartRef.current = chart;
        seriesRef.current = { btc: btcSeries, eth: ethSeries, sol: solSeries, prediction: predictionSeries };

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    useEffect(() => {
        if (data && seriesRef.current.btc) {
            seriesRef.current.btc.setData(data.btc);

            const ethLineData = data.eth.map(d => ({ time: d.time, value: d.close }));
            const solLineData = data.sol.map(d => ({ time: d.time, value: d.close }));

            seriesRef.current.eth.setData(ethLineData);
            seriesRef.current.sol.setData(solLineData);

            seriesRef.current.prediction.setData(predictionData);
        }
    }, [data, predictionData]);

    return (
        <div className="relative w-full h-[500px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
            <div ref={chartContainerRef} className="w-full h-full" />

            {isLoading && !data && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10 backdrop-blur-sm">
                    <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                    <span className="ml-3 text-indigo-300 font-mono">
                        Connecting to Binance Stream...
                    </span>
                </div>
            )}

            <div className="absolute top-4 left-4 flex flex-col gap-2 bg-slate-900/90 p-3 rounded-lg border border-slate-700/50 backdrop-blur-md z-20 shadow-lg">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span className="text-xs text-slate-200 font-bold">BTC/USDT (Live)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-amber-400"></span>
                    <span className="text-xs text-slate-400">SMA Prediction</span>
                </div>
                <div className="h-px bg-slate-700 my-1"></div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Correlations</div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#627EEA] opacity-50"></span>
                    <span className="text-xs text-slate-400">ETH Trend</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#14F195] opacity-50"></span>
                    <span className="text-xs text-slate-400">SOL Trend</span>
                </div>
            </div>
        </div>
    );
};

export default ChartComponent;
