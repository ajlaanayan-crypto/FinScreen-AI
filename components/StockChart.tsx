import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CrosshairMode, IChartApi, ISeriesApi, AreaSeries } from 'lightweight-charts';
import { EXAMPLE_CHART_DATA } from '../constants';
import { Activity } from 'lucide-react';

interface StockChartProps {
  darkMode?: boolean;
}

const StockChart: React.FC<StockChartProps> = ({ darkMode = false }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<IChartApi | null>(null);
  const areaSeriesRef = useRef<ISeriesApi<AreaSeries> | null>(null);

  const [range, setRange] = useState('1Y');

  // Tooltip State
  const [tooltipData, setTooltipData] = useState<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: darkMode ? '#1e293b' : '#ffffff' },
        textColor: darkMode ? '#94a3b8' : '#333',
      },
      grid: {
        vertLines: { color: darkMode ? '#334155' : '#e2e8f0' },
        horzLines: { color: darkMode ? '#334155' : '#e2e8f0' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: darkMode ? '#334155' : '#cbd5e1',
      },
      timeScale: {
        borderColor: darkMode ? '#334155' : '#cbd5e1',
        timeVisible: true,
      },
    });

    chartInstance.current = chart;

    // --- Area Series (v5 Syntax) ---
    // Using addSeries with AreaSeries class
    const areaSeries = chart.addSeries(AreaSeries, {
      topColor: 'rgba(59, 130, 246, 0.4)',
      bottomColor: 'rgba(59, 130, 246, 0.0)',
      lineColor: '#3b82f6',
      lineWidth: 2,
    });
    areaSeriesRef.current = areaSeries;

    // Initialize with data
    const sortedData = [...EXAMPLE_CHART_DATA].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
    
    // Set Area Data
    areaSeries.setData(sortedData.map(d => ({ time: d.time, value: d.close })));

    // Subscribe to crosshair move for Tooltip
    chart.subscribeCrosshairMove(param => {
      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > chartContainerRef.current!.clientWidth ||
        param.point.y < 0 ||
        param.point.y > 400
      ) {
        setTooltipData(null);
      } else {
        // Find data point
        const dataPoint = sortedData.find(d => d.time === param.time);
        if (dataPoint) {
            setTooltipData(dataPoint);
        }
      }
    });

    // Resize Handler
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
  }, [darkMode]);

  // Update Data when range changes
  useEffect(() => {
    if (!chartInstance.current || !areaSeriesRef.current) return;
    
    let filteredData = [...EXAMPLE_CHART_DATA];
    const totalDays = filteredData.length;
    if (range === '1M') filteredData = filteredData.slice(totalDays - 30);
    else if (range === '6M') filteredData = filteredData.slice(totalDays - 180);
    else if (range === '1Y') filteredData = filteredData.slice(totalDays - 365);
    else if (range === '3Y') filteredData = filteredData.slice(totalDays - 1095);
    else if (range === '5Y') filteredData = filteredData.slice(totalDays - 1825);
    
    areaSeriesRef.current.setData(filteredData.map(d => ({ time: d.time, value: d.close })));
    
    chartInstance.current.timeScale().fitContent();

  }, [range]);

  const ranges = ['1M', '6M', '1Y', '3Y', '5Y', 'Max'];

  return (
    <div className="bg-white dark:bg-darkcard rounded-lg shadow-sm p-4 mb-6 relative group">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        
        {/* Left: Toggles */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
           <div className="p-1.5 rounded-md bg-white dark:bg-slate-600 shadow-sm text-primary cursor-default" title="Price Chart">
             <Activity size={18} />
           </div>
        </div>

        {/* Right: Ranges */}
        <div className="flex gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-md overflow-x-auto">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs font-medium rounded-sm transition-all whitespace-nowrap ${
                range === r 
                  ? 'bg-white dark:bg-slate-600 text-primary shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      
      {/* Chart Container */}
      <div className="relative h-[400px] w-full border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden">
        <div ref={chartContainerRef} className="w-full h-full" />
        
        {/* Floating Tooltip / Legend */}
        <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-2 rounded border border-gray-200 dark:border-gray-700 shadow-sm pointer-events-none z-10 text-xs sm:text-sm">
            <div className="flex gap-3">
                <span className={`font-bold ${!tooltipData || tooltipData.close >= tooltipData.open ? 'text-green-600' : 'text-red-600'}`}>
                    Reliance Ind.
                </span>
                {tooltipData ? (
                    <>
                        <span className="dark:text-gray-300">Price: <span className="font-mono">{tooltipData.close}</span></span>
                    </>
                ) : (
                    <span className="text-gray-400 italic">Hover for details</span>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default StockChart;