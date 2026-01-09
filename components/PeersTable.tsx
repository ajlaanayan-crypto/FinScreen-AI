import React from 'react';
import { PeerData } from '../types';

interface PeersTableProps {
  peers: PeerData[];
}

const PeersTable: React.FC<PeersTableProps> = ({ peers }) => {
  return (
    <div className="bg-white dark:bg-darkcard rounded-lg shadow-sm p-6 mb-6">
       <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Peer Comparison</h2>
       <div className="overflow-x-auto">
         <table className="w-full text-sm">
           <thead>
             <tr className="border-b border-gray-200 dark:border-gray-700 text-left">
               <th className="py-3 px-2 font-semibold text-gray-600 dark:text-gray-400">Name</th>
               <th className="py-3 px-2 font-semibold text-gray-600 dark:text-gray-400 text-right">CMP Rs.</th>
               <th className="py-3 px-2 font-semibold text-gray-600 dark:text-gray-400 text-right">P/E</th>
               <th className="py-3 px-2 font-semibold text-gray-600 dark:text-gray-400 text-right">Mar Cap Rs.Cr.</th>
               <th className="py-3 px-2 font-semibold text-gray-600 dark:text-gray-400 text-right">Div Yld %</th>
               <th className="py-3 px-2 font-semibold text-gray-600 dark:text-gray-400 text-right">ROCE %</th>
               <th className="py-3 px-2 font-semibold text-gray-600 dark:text-gray-400 text-right">ROE %</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
             {peers.map((peer, i) => (
               <tr key={i} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                 <td className="py-2.5 px-2 font-medium text-primary hover:underline cursor-pointer">{peer.name}</td>
                 <td className="py-2.5 px-2 text-right dark:text-gray-300">{peer.cmp.toLocaleString()}</td>
                 <td className="py-2.5 px-2 text-right dark:text-gray-300">{peer.pe}</td>
                 <td className="py-2.5 px-2 text-right dark:text-gray-300">{peer.marketCap.toLocaleString()}</td>
                 <td className="py-2.5 px-2 text-right dark:text-gray-300">{peer.dividendYield}%</td>
                 <td className="py-2.5 px-2 text-right dark:text-gray-300">{peer.roce}%</td>
                 <td className="py-2.5 px-2 text-right dark:text-gray-300">{peer.roe}%</td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
    </div>
  );
};

export default PeersTable;