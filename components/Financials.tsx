import React, { useState } from 'react';
import { StockData, TabType } from '../types';

interface FinancialsProps {
  data: StockData;
}

const Financials: React.FC<FinancialsProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.QUARTERS);

  const tabs = [
    { id: TabType.QUARTERS, label: 'Quarters' },
    { id: TabType.PROFIT_LOSS, label: 'Profit & Loss' },
    { id: TabType.BALANCE_SHEET, label: 'Balance Sheet' },
    { id: TabType.CASH_FLOW, label: 'Cash Flow' },
    { id: TabType.RATIOS, label: 'Ratios' },
  ];

  const renderQuarters = () => (
    <div className="overflow-x-auto scrollbar-hide">
      <table className="w-full text-sm text-right">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400 sticky left-0 bg-white dark:bg-darkcard">Period</th>
            {data.quarters.map((q, i) => (
              <th key={i} className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">{q.period}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          <tr>
            <td className="text-left py-2 px-4 font-medium text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-darkcard">Sales</td>
            {data.quarters.map((q, i) => <td key={i} className="py-2 px-4 dark:text-gray-300">{q.sales.toLocaleString()}</td>)}
          </tr>
          <tr>
            <td className="text-left py-2 px-4 font-medium text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-darkcard">Expenses</td>
            {data.quarters.map((q, i) => <td key={i} className="py-2 px-4 dark:text-gray-300">{q.expenses.toLocaleString()}</td>)}
          </tr>
          <tr className="bg-gray-50 dark:bg-slate-800/50 font-medium">
            <td className="text-left py-2 px-4 sticky left-0 bg-gray-50 dark:bg-slate-800">Operating Profit</td>
            {data.quarters.map((q, i) => <td key={i} className="py-2 px-4 text-slate-900 dark:text-white">{(q.sales - q.expenses).toLocaleString()}</td>)}
          </tr>
          <tr>
            <td className="text-left py-2 px-4 font-medium text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-darkcard">OPM %</td>
            {data.quarters.map((q, i) => <td key={i} className="py-2 px-4 dark:text-gray-300">{q.opm}%</td>)}
          </tr>
          <tr>
            <td className="text-left py-2 px-4 font-medium text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-darkcard">Other Income</td>
            {data.quarters.map((q, i) => <td key={i} className="py-2 px-4 dark:text-gray-300">{q.otherIncome.toLocaleString()}</td>)}
          </tr>
          <tr>
            <td className="text-left py-2 px-4 font-medium text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-darkcard">Interest</td>
            {data.quarters.map((q, i) => <td key={i} className="py-2 px-4 dark:text-gray-300">{q.interest.toLocaleString()}</td>)}
          </tr>
          <tr>
            <td className="text-left py-2 px-4 font-medium text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-darkcard">Depreciation</td>
            {data.quarters.map((q, i) => <td key={i} className="py-2 px-4 dark:text-gray-300">{q.depreciation.toLocaleString()}</td>)}
          </tr>
          <tr className="bg-gray-50 dark:bg-slate-800/50 font-medium">
             <td className="text-left py-2 px-4 sticky left-0 bg-gray-50 dark:bg-slate-800">Net Profit</td>
            {data.quarters.map((q, i) => <td key={i} className="py-2 px-4 text-slate-900 dark:text-white">{q.netProfit.toLocaleString()}</td>)}
          </tr>
           <tr>
            <td className="text-left py-2 px-4 font-medium text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-darkcard">EPS in Rs</td>
            {data.quarters.map((q, i) => <td key={i} className="py-2 px-4 dark:text-gray-300">{q.eps.toFixed(2)}</td>)}
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderBalanceSheet = () => (
     <div className="overflow-x-auto scrollbar-hide">
      <table className="w-full text-sm text-right">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400 sticky left-0 bg-white dark:bg-darkcard">Figures in Rs. Cr.</th>
            {data.balanceSheet.map((y, i) => (
              <th key={i} className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">{y.year}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
           <tr>
            <td className="text-left py-2 px-4 font-medium text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-darkcard">Share Capital</td>
            {data.balanceSheet.map((y, i) => <td key={i} className="py-2 px-4 dark:text-gray-300">{y.shareCapital.toLocaleString()}</td>)}
          </tr>
          <tr>
            <td className="text-left py-2 px-4 font-medium text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-darkcard">Reserves</td>
            {data.balanceSheet.map((y, i) => <td key={i} className="py-2 px-4 dark:text-gray-300">{y.reserves.toLocaleString()}</td>)}
          </tr>
          <tr>
            <td className="text-left py-2 px-4 font-medium text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-darkcard">Borrowings</td>
            {data.balanceSheet.map((y, i) => <td key={i} className="py-2 px-4 dark:text-gray-300">{y.borrowings.toLocaleString()}</td>)}
          </tr>
           <tr className="bg-gray-50 dark:bg-slate-800/50 font-bold">
            <td className="text-left py-2 px-4 sticky left-0 bg-gray-50 dark:bg-slate-800">Total Liabilities</td>
            {data.balanceSheet.map((y, i) => <td key={i} className="py-2 px-4 text-slate-900 dark:text-white">{y.totalLiabilities.toLocaleString()}</td>)}
          </tr>
          <tr>
            <td className="text-left py-2 px-4 font-medium text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-darkcard">Fixed Assets</td>
            {data.balanceSheet.map((y, i) => <td key={i} className="py-2 px-4 dark:text-gray-300">{y.fixedAssets.toLocaleString()}</td>)}
          </tr>
           <tr>
            <td className="text-left py-2 px-4 font-medium text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-darkcard">Investments</td>
            {data.balanceSheet.map((y, i) => <td key={i} className="py-2 px-4 dark:text-gray-300">{y.investments.toLocaleString()}</td>)}
          </tr>
           <tr className="bg-gray-50 dark:bg-slate-800/50 font-bold">
            <td className="text-left py-2 px-4 sticky left-0 bg-gray-50 dark:bg-slate-800">Total Assets</td>
            {data.balanceSheet.map((y, i) => <td key={i} className="py-2 px-4 text-slate-900 dark:text-white">{y.totalAssets.toLocaleString()}</td>)}
          </tr>
        </tbody>
      </table>
     </div>
  );

  return (
    <div className="bg-white dark:bg-darkcard rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-gray-100 dark:bg-slate-700 text-primary border-b-2 border-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[300px]">
        {activeTab === TabType.QUARTERS && renderQuarters()}
        {activeTab === TabType.BALANCE_SHEET && renderBalanceSheet()}
        {/* Placeholder for other tabs to save space in this demo */}
        {activeTab === TabType.PROFIT_LOSS && <div className="text-center py-10 text-gray-500">P&L Data Visualization would go here...</div>}
        {activeTab === TabType.CASH_FLOW && <div className="text-center py-10 text-gray-500">Cash Flow Data Visualization would go here...</div>}
        {activeTab === TabType.RATIOS && <div className="text-center py-10 text-gray-500">Ratios Analysis would go here...</div>}
      </div>
    </div>
  );
};

export default Financials;