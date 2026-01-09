import { GoogleGenAI, Type, Schema } from "@google/genai";
import { StockData } from "../types";
import { MOCK_STOCK_DATA } from "../constants";

// Initialize Gemini
const apiKey = process.env.API_KEY || ''; // Ensure this is handled safely
const ai = new GoogleGenAI({ apiKey });

export interface AnalysisResult {
  summary: string;
  fairValue: {
    dcf: number;
    pe: number;
    verdict: string;
  };
  risks: string[];
  strengths: string[];
}

export const fetchRealtimeStockData = async (query: string): Promise<StockData> => {
  if (!apiKey) {
    console.warn("No API Key provided, returning mock data.");
    return MOCK_STOCK_DATA;
  }

  try {
    const prompt = `
      Find the latest real-time financial data for the stock/company: "${query}".

      Search Strategy:
      1. First, identify if this is an Indian stock (NSE/BSE). If the user types a name like "Zomato", look for "ZOMATO NSE" or "ZOMATO BSE" data.
      2. If it is a global company (e.g., Apple, Tesla), look for US listing data.
      3. If the query is a code (e.g., "500123"), treat it as a BSE code.
      
      Required Data Points (Latest Available):
      1. Overview: Current Price (Live/Close), Market Cap, PE Ratio, Book Value, Dividend Yield, ROCE, ROE, 52W High/Low.
      2. About: Brief description.
      3. Quarterly Results: Recent 4 quarters. (Sales, Expenses, Net Profit, EPS, etc.). Estimate if exact table not found, but keep Price/MarketCap accurate.
      4. Balance Sheet: Recent yearly data. (Share Capital, Borrowings, Assets).
      5. Peers: 3-5 competitors in the same market.

      Return ONLY JSON matching the schema.
    `;

    const stockSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        symbol: { type: Type.STRING, description: "Stock Symbol (e.g., RELIANCE)" },
        name: { type: Type.STRING, description: "Full Company Name" },
        sector: { type: Type.STRING },
        currentPrice: { type: Type.NUMBER },
        marketCap: { type: Type.NUMBER, description: "Market Cap in Crores" },
        highLow: { type: Type.STRING, description: "Format: High / Low" },
        stockPE: { type: Type.NUMBER },
        bookValue: { type: Type.NUMBER },
        dividendYield: { type: Type.NUMBER },
        roce: { type: Type.NUMBER },
        roe: { type: Type.NUMBER },
        faceValue: { type: Type.NUMBER },
        about: { type: Type.STRING },
        quarters: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              period: { type: Type.STRING },
              sales: { type: Type.NUMBER },
              expenses: { type: Type.NUMBER },
              opm: { type: Type.NUMBER },
              otherIncome: { type: Type.NUMBER },
              interest: { type: Type.NUMBER },
              depreciation: { type: Type.NUMBER },
              pbt: { type: Type.NUMBER },
              tax: { type: Type.NUMBER },
              netProfit: { type: Type.NUMBER },
              eps: { type: Type.NUMBER },
            }
          }
        },
        balanceSheet: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              year: { type: Type.STRING },
              shareCapital: { type: Type.NUMBER },
              reserves: { type: Type.NUMBER },
              borrowings: { type: Type.NUMBER },
              otherLiabilities: { type: Type.NUMBER },
              totalLiabilities: { type: Type.NUMBER },
              fixedAssets: { type: Type.NUMBER },
              cwip: { type: Type.NUMBER },
              investments: { type: Type.NUMBER },
              otherAssets: { type: Type.NUMBER },
              totalAssets: { type: Type.NUMBER },
            }
          }
        },
        peers: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              cmp: { type: Type.NUMBER },
              pe: { type: Type.NUMBER },
              marketCap: { type: Type.NUMBER },
              dividendYield: { type: Type.NUMBER },
              roce: { type: Type.NUMBER },
              roe: { type: Type.NUMBER },
            }
          }
        }
      },
      required: ["symbol", "name", "currentPrice", "marketCap", "stockPE", "quarters", "balanceSheet", "peers"]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: stockSchema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    // Parse JSON
    const data = JSON.parse(text) as StockData;
    return data;

  } catch (error) {
    console.error("Error fetching realtime stock data:", error);
    // Return mock data as fallback if search/parsing fails
    return { ...MOCK_STOCK_DATA, name: `(Offline) ${MOCK_STOCK_DATA.name}` };
  }
}

export const generateStockAnalysis = async (stock: StockData): Promise<AnalysisResult> => {
  if (!apiKey) return getMockAnalysis(stock);

  try {
    const prompt = `
      Analyze the following stock data for ${stock.name} (${stock.symbol}).
      
      Financial Highlights:
      Current Price: ${stock.currentPrice}
      Market Cap: ${stock.marketCap} Cr
      PE: ${stock.stockPE}
      ROCE: ${stock.roce}%
      ROE: ${stock.roe}%
      Book Value: ${stock.bookValue}

      Recent Quarterly Performance (Last 4 quarters net profit):
      ${stock.quarters.map(q => `${q.period}: ${q.netProfit}`).join(', ')}

      About: ${stock.about}

      Provide a JSON response with the following structure:
      1. A concise fundamental summary.
      2. A fair value estimation based on PE and a rough DCF mental model.
      3. Key lists of risks and strengths.
    `;

    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING },
        fairValue: {
          type: Type.OBJECT,
          properties: {
            dcf: { type: Type.NUMBER },
            pe: { type: Type.NUMBER },
            verdict: { type: Type.STRING }
          }
        },
        risks: { type: Type.ARRAY, items: { type: Type.STRING } },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return getMockAnalysis(stock);
  }
};

export const streamChatResponse = async function* (message: string, history: {role: string, parts: {text: string}[]}[]): AsyncGenerator<string> {
   if (!apiKey) {
    yield "API Key missing. Please configure your environment to use the Chat feature properly.";
    return;
   }

   try {
     const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        history: history,
        config: {
          systemInstruction: "You are a helpful financial analyst assistant on the FinScreen app. You help users analyze stocks, explain financial terms, and interpret data. Keep answers concise and professional.",
          tools: [{ googleSearch: {} }] // Enable Google Search for market updates
        }
     });

     const result = await chat.sendMessageStream({ message });
     
     for await (const chunk of result) {
        if (chunk.text) {
          yield chunk.text;
        }
     }
   } catch (error) {
     console.error("Chat Error:", error);
     yield "Sorry, I encountered an error connecting to the AI service.";
   }
}

// Fallback if API key is not present during demo
const getMockAnalysis = (stock: StockData): AnalysisResult => ({
  summary: `${stock.name} is a market leader in its sector. The company has shown consistent performance with a ROCE of ${stock.roce}%. Current valuations suggest it is trading at a premium compared to historical averages.`,
  fairValue: {
    dcf: stock.currentPrice * 0.9,
    pe: stock.currentPrice * 0.85,
    verdict: "Slightly Overvalued"
  },
  risks: ["High competition in new verticals", "Global economic slowdown affecting exports"],
  strengths: ["Strong balance sheet", "Market leadership", "Consistent cash flow generation"]
});

export const interpretScreenQuery = async (query: string): Promise<string> => {
    if (!apiKey) return "API Key required for AI Screen Builder.";

    const prompt = `
      Convert this natural language stock query into a SQL-like condition string for a screener database.
      Query: "${query}"
      Example Input: "Debt free companies with high growth"
      Example Output: "Debt_to_Equity < 0.1 AND Sales_Growth_3Y > 15 AND Profit_Growth_3Y > 15"
      
      Only return the condition string.
    `;
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      return response.text || "Could not interpret query.";
    } catch (e) {
      return "Error processing query.";
    }
};