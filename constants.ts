import { StockData, FinancialQuarter, BalanceSheetYear, PeerData } from './types';

// Mock Data for Reliance Industries (Fallback)
export const MOCK_QUARTERS: FinancialQuarter[] = [
  { period: 'Sep 2023', sales: 231886, expenses: 198254, opm: 14.5, otherIncome: 3822, interest: 5741, depreciation: 12588, pbt: 19125, tax: 4983, netProfit: 14142, eps: 20.9 },
  { period: 'Dec 2023', sales: 225086, expenses: 191632, opm: 14.9, otherIncome: 3965, interest: 5892, depreciation: 12879, pbt: 18648, tax: 4782, netProfit: 13866, eps: 20.5 },
  { period: 'Mar 2024', sales: 240715, expenses: 204561, opm: 15.0, otherIncome: 4122, interest: 5911, depreciation: 13105, pbt: 21260, tax: 5430, netProfit: 15830, eps: 23.4 },
  { period: 'Jun 2024', sales: 235123, expenses: 201234, opm: 14.4, otherIncome: 3755, interest: 6102, depreciation: 13455, pbt: 18087, tax: 4612, netProfit: 13475, eps: 19.9 },
];

export const MOCK_BALANCE_SHEET: BalanceSheetYear[] = [
  { year: 'Mar 2020', shareCapital: 6339, reserves: 446992, borrowings: 336294, otherLiabilities: 234123, totalLiabilities: 1023748, fixedAssets: 532124, cwip: 109234, investments: 275891, otherAssets: 106500, totalAssets: 1023748 },
  { year: 'Mar 2021', shareCapital: 6445, reserves: 693723, borrowings: 291234, otherLiabilities: 245123, totalLiabilities: 1236525, fixedAssets: 632124, cwip: 99234, investments: 365891, otherAssets: 139276, totalAssets: 1236525 },
  { year: 'Mar 2022', shareCapital: 6765, reserves: 772720, borrowings: 266305, otherLiabilities: 280453, totalLiabilities: 1326243, fixedAssets: 701234, cwip: 125345, investments: 389123, otherAssets: 110541, totalAssets: 1326243 },
  { year: 'Mar 2023', shareCapital: 6766, reserves: 814053, borrowings: 314052, otherLiabilities: 295673, totalLiabilities: 1430544, fixedAssets: 812345, cwip: 165789, investments: 320123, otherAssets: 132287, totalAssets: 1430544 },
  { year: 'Mar 2024', shareCapital: 6766, reserves: 852123, borrowings: 325123, otherLiabilities: 305123, totalLiabilities: 1489135, fixedAssets: 912345, cwip: 145123, investments: 300123, otherAssets: 131544, totalAssets: 1489135 },
];

export const MOCK_PEERS: PeerData[] = [
  { name: 'Reliance Inds.', cmp: 2985, pe: 28.5, marketCap: 2020345, dividendYield: 0.3, roce: 11.2, roe: 10.5 },
  { name: 'TCS', cmp: 4120, pe: 30.2, marketCap: 1512345, dividendYield: 1.2, roce: 48.5, roe: 39.2 },
  { name: 'HDFC Bank', cmp: 1650, pe: 18.5, marketCap: 1254123, dividendYield: 0.9, roce: 6.5, roe: 14.5 },
  { name: 'ICICI Bank', cmp: 1120, pe: 17.1, marketCap: 785123, dividendYield: 0.8, roce: 6.8, roe: 15.2 },
  { name: 'Infosys', cmp: 1620, pe: 24.5, marketCap: 675123, dividendYield: 2.1, roce: 42.1, roe: 32.5 },
];

export const MOCK_STOCK_DATA: StockData = {
  symbol: 'RELIANCE',
  name: 'Reliance Industries Ltd.',
  sector: 'Refineries',
  currentPrice: 2985.45,
  marketCap: 2020345,
  highLow: '3029 / 2220',
  stockPE: 28.5,
  bookValue: 1285,
  dividendYield: 0.34,
  roce: 11.2,
  roe: 10.5,
  faceValue: 10,
  about: "Reliance Industries Limited is a Fortune 500 company and the largest private sector corporation in India. It has evolved from being a textiles and polyester company to an integrated player across energy, materials, retail, entertainment and digital services.",
  quarters: MOCK_QUARTERS,
  balanceSheet: MOCK_BALANCE_SHEET,
  peers: MOCK_PEERS
};

// Generate realistic OHLCV Data
export const generateOHLCData = (count = 1000) => {
  const data = [];
  let date = new Date();
  date.setFullYear(date.getFullYear() - 2); // Start 2 years ago
  
  let price = 2400;
  
  for (let i = 0; i < count; i++) {
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) {
      date.setDate(date.getDate() + 1);
      continue;
    }

    const volatility = 25;
    const change = (Math.random() - 0.5) * volatility;
    
    // Create random candle
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * (volatility / 2);
    const low = Math.min(open, close) - Math.random() * (volatility / 2);
    const volume = Math.floor(Math.random() * 5000000) + 1000000;
    
    // Format YYYY-MM-DD
    const time = date.toISOString().split('T')[0];
    
    data.push({
      time,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: volume,
      value: Number(close.toFixed(2)) // for Line chart
    });
    
    price = close;
    date.setDate(date.getDate() + 1);
  }
  return data;
};

export const EXAMPLE_CHART_DATA = generateOHLCData(800);

// Comprehensive list of NSE/BSE stocks
export const SEARCH_SUGGESTIONS = [
  // NIFTY 50 & Major Large Caps
  { symbol: "RELIANCE", name: "Reliance Industries Ltd" },
  { symbol: "TCS", name: "Tata Consultancy Services Ltd" },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd" },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd" },
  { symbol: "INFY", name: "Infosys Ltd" },
  { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd" },
  { symbol: "ITC", name: "ITC Ltd" },
  { symbol: "SBIN", name: "State Bank of India" },
  { symbol: "LICI", name: "Life Insurance Corporation of India" },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever Ltd" },
  { symbol: "LT", name: "Larsen & Toubro Ltd" },
  { symbol: "BAJFINANCE", name: "Bajaj Finance Ltd" },
  { symbol: "HCLTECH", name: "HCL Technologies Ltd" },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank Ltd" },
  { symbol: "AXISBANK", name: "Axis Bank Ltd" },
  { symbol: "ADANIENT", name: "Adani Enterprises Ltd" },
  { symbol: "SUNPHARMA", name: "Sun Pharmaceutical Industries Ltd" },
  { symbol: "TITAN", name: "Titan Company Ltd" },
  { symbol: "ULTRACEMCO", name: "UltraTech Cement Ltd" },
  { symbol: "ASIANPAINT", name: "Asian Paints Ltd" },
  { symbol: "MARUTI", name: "Maruti Suzuki India Ltd" },
  { symbol: "BAJFINSV", name: "Bajaj Finserv Ltd" },
  { symbol: "ADANIPORTS", name: "Adani Ports and SEZ Ltd" },
  { symbol: "TATASTEEL", name: "Tata Steel Ltd" },
  { symbol: "NTPC", name: "NTPC Ltd" },
  { symbol: "TATAMOTORS", name: "Tata Motors Ltd" },
  { symbol: "M&M", name: "Mahindra & Mahindra Ltd" },
  { symbol: "POWERGRID", name: "Power Grid Corporation of India Ltd" },
  { symbol: "ONGC", name: "Oil & Natural Gas Corporation Ltd" },
  { symbol: "WIPRO", name: "Wipro Ltd" },
  { symbol: "COALINDIA", name: "Coal India Ltd" },
  { symbol: "IOC", name: "Indian Oil Corporation Ltd" },
  { symbol: "BAJAJ-AUTO", name: "Bajaj Auto Ltd" },
  { symbol: "DLF", name: "DLF Ltd" },
  { symbol: "VBL", name: "Varun Beverages Ltd" },
  { symbol: "SIEMENS", name: "Siemens Ltd" },
  { symbol: "HAL", name: "Hindustan Aeronautics Ltd" },
  { symbol: "ZOMATO", name: "Zomato Ltd" },
  { symbol: "JIOFIN", name: "Jio Financial Services Ltd" },
  { symbol: "TRENT", name: "Trent Ltd" },
  { symbol: "GRASIM", name: "Grasim Industries Ltd" },
  { symbol: "JSWSTEEL", name: "JSW Steel Ltd" },
  { symbol: "TECHM", name: "Tech Mahindra Ltd" },
  { symbol: "INDUSINDBK", name: "IndusInd Bank Ltd" },
  { symbol: "HINDALCO", name: "Hindalco Industries Ltd" },
  { symbol: "NESTLEIND", name: "Nestle India Ltd" },
  { symbol: "BRITANNIA", name: "Britannia Industries Ltd" },
  { symbol: "ADANIPOWER", name: "Adani Power Ltd" },
  { symbol: "BEL", name: "Bharat Electronics Ltd" },
  { symbol: "LTIM", name: "LTIMindtree Ltd" },
  { symbol: "DIVISLAB", name: "Divi's Laboratories Ltd" },
  { symbol: "EICHERMOT", name: "Eicher Motors Ltd" },
  { symbol: "CIPLA", name: "Cipla Ltd" },
  { symbol: "GAIL", name: "GAIL (India) Ltd" },
  { symbol: "BPCL", name: "Bharat Petroleum Corporation Ltd" },
  { symbol: "TATACONSUM", name: "Tata Consumer Products Ltd" },
  { symbol: "DRREDDY", name: "Dr. Reddy's Laboratories Ltd" },
  { symbol: "HEROMOTOCO", name: "Hero MotoCorp Ltd" },
  { symbol: "APOLLOHOSP", name: "Apollo Hospitals Enterprise Ltd" },
  { symbol: "SHRIRAMFIN", name: "Shriram Finance Ltd" },
  
  // Midcaps & Notable Stocks
  { symbol: "IRFC", name: "Indian Railway Finance Corp" },
  { symbol: "RVNL", name: "Rail Vikas Nigam Ltd" },
  { symbol: "MAZDOC", name: "Mazagon Dock Shipbuilders" },
  { symbol: "COCHINSHIP", name: "Cochin Shipyard" },
  { symbol: "RECLTD", name: "REC Ltd" },
  { symbol: "PFC", name: "Power Finance Corporation" },
  { symbol: "NHPC", name: "NHPC Ltd" },
  { symbol: "SJVN", name: "SJVN Ltd" },
  { symbol: "IREDA", name: "IREDA" },
  { symbol: "BHEL", name: "Bharat Heavy Electricals Ltd" },
  { symbol: "SUZLON", name: "Suzlon Energy" },
  { symbol: "IDEA", name: "Vodafone Idea" },
  { symbol: "YESBANK", name: "Yes Bank" },
  { symbol: "IDFCFIRSTB", name: "IDFC First Bank" },
  { symbol: "FEDERALBNK", name: "Federal Bank" },
  { symbol: "AUBANK", name: "AU Small Finance Bank" },
  { symbol: "BANDHANBNK", name: "Bandhan Bank" },
  { symbol: "PNB", name: "Punjab National Bank" },
  { symbol: "BANKBARODA", name: "Bank of Baroda" },
  { symbol: "CANBK", name: "Canara Bank" },
  { symbol: "UNIONBANK", name: "Union Bank of India" },
  { symbol: "IOB", name: "Indian Overseas Bank" },
  { symbol: "UCOBANK", name: "UCO Bank" },
  { symbol: "CENTRALBK", name: "Central Bank of India" },
  { symbol: "MAHABANK", name: "Bank of Maharashtra" },
  { symbol: "PAYTM", name: "One97 Communications (Paytm)" },
  { symbol: "NYKAA", name: "FSN E-Commerce (Nykaa)" },
  { symbol: "POLICYBZR", name: "PB Fintech (PolicyBazaar)" },
  { symbol: "DELHIVERY", name: "Delhivery Ltd" },
  { symbol: "MAMAEARTH", name: "Honasa Consumer (Mamaearth)" },
  { symbol: "OLA", name: "Ola Electric" },
  { symbol: "PREMIERENE", name: "Premier Energies" },
  { symbol: "IXIGO", name: "Le Travenues (Ixigo)" },
  { symbol: "AWFIS", name: "Awfis Space Solutions" },
  { symbol: "GOMT", name: "Go Digit General Insurance" },
  { symbol: "BHARATRH", name: "Bharat Road Network" },
  { symbol: "IRCTC", name: "IRCTC" },
  { symbol: "JUBLFOOD", name: "Jubilant FoodWorks" },
  { symbol: "DEVYANI", name: "Devyani International" },
  { symbol: "SAPPHIRE", name: "Sapphire Foods" },
  { symbol: "WESTLIFE", name: "Westlife Foodworld" },
  { symbol: "RELAXO", name: "Relaxo Footwears" },
  { symbol: "BATAINDIA", name: "Bata India" },
  { symbol: "CAMPUS", name: "Campus Activewear" },
  { symbol: "METROBRAND", name: "Metro Brands" },
  { symbol: "VEDL", name: "Vedanta Ltd" },
  { symbol: "HINDZINC", name: "Hindustan Zinc" },
  { symbol: "NMDC", name: "NMDC Ltd" },
  { symbol: "SAIL", name: "Steel Authority of India" },
  { symbol: "NATIONALUM", name: "National Aluminium Co" },
  { symbol: "HAVELLS", name: "Havells India" },
  { symbol: "POLYCAB", name: "Polycab India" },
  { symbol: "KEI", name: "KEI Industries" },
  { symbol: "DIXON", name: "Dixon Technologies" },
  { symbol: "AMBER", name: "Amber Enterprises" },
  { symbol: "PIDILITIND", name: "Pidilite Industries" },
  { symbol: "BERGEPAINT", name: "Berger Paints" },
  { symbol: "KANSAINER", name: "Kansai Nerolac" },
  { symbol: "ASTRAL", name: "Astral Ltd" },
  { symbol: "SUPREMEIND", name: "Supreme Industries" },
  { symbol: "PIIND", name: "PI Industries" },
  { symbol: "UPL", name: "UPL Ltd" },
  { symbol: "SRF", name: "SRF Ltd" },
  { symbol: "NAVINFLUOR", name: "Navin Fluorine" },
  { symbol: "DEEPAKNTR", name: "Deepak Nitrite" },
  { symbol: "TATACHEM", name: "Tata Chemicals" },
  { symbol: "AARTIIND", name: "Aarti Industries" },
  { symbol: "ATUL", name: "Atul Ltd" },
  { symbol: "VINATIORGA", name: "Vinati Organics" },
  { symbol: "FINEORG", name: "Fine Organic Industries" },
  { symbol: "BOSCHLTD", name: "Bosch Ltd" },
  { symbol: "MRF", name: "MRF Ltd" },
  { symbol: "BALKRISIND", name: "Balkrishna Industries" },
  { symbol: "APOLLOTYRE", name: "Apollo Tyres" },
  { symbol: "CEATLTD", name: "CEAT Ltd" },
  { symbol: "MOTHERSON", name: "Samvardhana Motherson" },
  { symbol: "SONACOMS", name: "Sona BLW Precision" },
  { symbol: "UNO_MINDA", name: "Uno Minda" },
  { symbol: "ENDURANCE", name: "Endurance Technologies" },
  { symbol: "TVSMOTOR", name: "TVS Motor Company" },
  { symbol: "ASHOKLEY", name: "Ashok Leyland" },
  { symbol: "ESCORTS", name: "Escorts Kubota" },
  { symbol: "CUMMINSIND", name: "Cummins India" },
  { symbol: "ABB", name: "ABB India" },
  { symbol: "THERMAX", name: "Thermax Ltd" },
  { symbol: "TRIVENI", name: "Triveni Turbine" },
  { symbol: "KPITTECH", name: "KPIT Technologies" },
  { symbol: "PERSISTENT", name: "Persistent Systems" },
  { symbol: "COFORGE", name: "Coforge Ltd" },
  { symbol: "MPHASIS", name: "Mphasis Ltd" },
  { symbol: "LTTS", name: "L&T Technology Services" },
  { symbol: "TATAELXSI", name: "Tata Elxsi" },
  { symbol: "HAPPSTMNDS", name: "Happiest Minds" },
  { symbol: "TANLA", name: "Tanla Platforms" },
  { symbol: "ROUTE", name: "Route Mobile" },
  { symbol: "AFFLE", name: "Affle India" },
  { symbol: "DATAPATTNS", name: "Data Patterns" },
  { symbol: "MTARTECH", name: "MTAR Technologies" },
  { symbol: "PARAS", name: "Paras Defence" },
  { symbol: "ZENGEN", name: "Zen Technologies" }
];