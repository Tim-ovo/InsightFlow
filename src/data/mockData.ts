export interface OverviewData {
  date: string;
  uv: number;
  click: number;
  order: number;
  pay: number;
  gmv: number;
  cost: number;
  refund: number;
  profit: number;
}

export interface ChannelData extends OverviewData {
  channel: string;
}

export interface UserData extends OverviewData {
  user_type: string;
}

export interface ProductData extends OverviewData {
  category: string;
}

export const overviewData: OverviewData[] = [
  { date: '2023-10-01', uv: 10000, click: 5000, order: 1000, pay: 800, gmv: 80000, cost: 20000, refund: 5000, profit: 55000 },
  { date: '2023-10-02', uv: 11000, click: 5500, order: 1100, pay: 850, gmv: 85000, cost: 22000, refund: 6000, profit: 57000 },
  { date: '2023-10-03', uv: 10500, click: 5200, order: 1050, pay: 820, gmv: 82000, cost: 21000, refund: 5500, profit: 55500 },
  { date: '2023-10-04', uv: 12000, click: 6000, order: 1200, pay: 900, gmv: 90000, cost: 24000, refund: 6500, profit: 59500 },
  { date: '2023-10-05', uv: 15000, click: 7000, order: 1300, pay: 950, gmv: 110000, cost: 40000, refund: 15000, profit: 55000 }, // GMV up, Profit down (Promo day)
  { date: '2023-10-06', uv: 18000, click: 8000, order: 1400, pay: 1000, gmv: 120000, cost: 45000, refund: 20000, profit: 55000 }, // Conversion rate drop significantly
  { date: '2023-10-07', uv: 20000, click: 9000, order: 1500, pay: 1050, gmv: 130000, cost: 50000, refund: 25000, profit: 55000 }
];

export const channelData: ChannelData[] = [
  // Search
  { date: '2023-10-06', channel: 'search', uv: 5000, click: 3000, order: 800, pay: 700, gmv: 70000, cost: 10000, refund: 5000, profit: 55000 },
  { date: '2023-10-07', channel: 'search', uv: 5500, click: 3200, order: 850, pay: 750, gmv: 75000, cost: 11000, refund: 5500, profit: 58500 },
  // Short Video
  { date: '2023-10-06', channel: 'short_video', uv: 10000, click: 4000, order: 400, pay: 200, gmv: 20000, cost: 30000, refund: 10000, profit: -20000 }, // Low conversion, high cost
  { date: '2023-10-07', channel: 'short_video', uv: 12000, click: 4500, order: 450, pay: 220, gmv: 25000, cost: 32000, refund: 12000, profit: -19000 },
  // Ads
  { date: '2023-10-06', channel: 'ads', uv: 3000, click: 1000, order: 200, pay: 100, gmv: 30000, cost: 5000, refund: 5000, profit: 20000 },
  { date: '2023-10-07', channel: 'ads', uv: 2500, click: 1300, order: 200, pay: 80, gmv: 30000, cost: 7000, refund: 7500, profit: 15500 },
];

export const userData: UserData[] = [
  // New
  { date: '2023-10-06', user_type: 'new', uv: 13000, click: 6000, order: 600, pay: 300, gmv: 30000, cost: 35000, refund: 10000, profit: -15000 },
  { date: '2023-10-07', user_type: 'new', uv: 15000, click: 7000, order: 700, pay: 350, gmv: 35000, cost: 40000, refund: 12000, profit: -17000 },
  // Old
  { date: '2023-10-06', user_type: 'old', uv: 5000, click: 2000, order: 800, pay: 700, gmv: 90000, cost: 10000, refund: 10000, profit: 70000 },
  { date: '2023-10-07', user_type: 'old', uv: 5000, click: 2000, order: 800, pay: 700, gmv: 95000, cost: 10000, refund: 13000, profit: 72000 },
];

export const productData: ProductData[] = [
  { date: '2023-10-06', category: 'high_margin_apparel', uv: 8000, click: 4000, order: 600, pay: 500, gmv: 50000, cost: 10000, refund: 5000, profit: 35000 },
  { date: '2023-10-06', category: 'low_margin_electronics', uv: 10000, click: 4000, order: 800, pay: 500, gmv: 70000, cost: 35000, refund: 15000, profit: 20000 },
  { date: '2023-10-07', category: 'high_margin_apparel', uv: 8000, click: 4000, order: 600, pay: 500, gmv: 50000, cost: 10000, refund: 5000, profit: 35000 },
  { date: '2023-10-07', category: 'low_margin_electronics', uv: 12000, click: 5000, order: 900, pay: 550, gmv: 80000, cost: 40000, refund: 20000, profit: 20000 },
];
