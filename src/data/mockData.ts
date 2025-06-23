export interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  category: string;
  imageUrl: string;
  likes: number;
  comments: number;
  views: number;
  tags: string[];
  featured?: boolean;
}

export interface Podcast {
  id: number;
  title: string;
  guest: string;
  description: string;
  duration: string;
  publishedAt: string;
  imageUrl: string;
  episode: number;
}

export interface Report {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  publishedAt: string;
}

export const cryptoData: CryptoData[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 105318.41,
    change: 1456.23,
    changePercent: 1.4
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 2504.52,
    change: -45.67,
    changePercent: -1.8
  },
  {
    symbol: 'XRP',
    name: 'Ripple',
    price: 2.21,
    change: 0.12,
    changePercent: 5.7
  },
  {
    symbol: 'DOGE',
    name: 'Dogecoin',
    price: 0.18,
    change: -0.005,
    changePercent: -2.7
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.89,
    change: 0.03,
    changePercent: 3.5
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    price: 148.56,
    change: -8.23,
    changePercent: -5.2
  },
  {
    symbol: 'MATIC',
    name: 'Polygon',
    price: 0.87,
    change: 0.02,
    changePercent: 2.4
  },
  {
    symbol: 'AVAX',
    name: 'Avalanche',
    price: 34.67,
    change: 1.23,
    changePercent: 3.7
  }
];

export const articles: Article[] = [
  {
    id: 1,
    title: 'Bitcoin Price Prediction: Golden Cross Pattern Targets $150,000 Rally',
    excerpt: 'Technical analysis suggests Bitcoin could see massive gains as golden cross pattern emerges on weekly charts.',
    content: 'Bitcoin has been showing strong technical signals with the formation of a golden cross pattern on the weekly timeframe. This bullish indicator, combined with increasing institutional adoption, suggests potential for significant price appreciation in the coming months.',
    author: 'Arslan Butt',
    publishedAt: '2025-06-08T10:30:00Z',
    category: 'Price Analysis',
    imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=400&fit=crop',
    likes: 1247,
    comments: 89,
    views: 15420,
    tags: ['Bitcoin', 'Technical Analysis', 'Price Prediction'],
    featured: true
  },
  {
    id: 2,
    title: 'Ethereum 2.0 Staking Rewards Hit All-Time High as Network Upgrades Continue',
    excerpt: 'Ethereum staking yields reach new peaks following successful network optimizations and increased validator participation.',
    content: 'The Ethereum network continues to evolve with recent upgrades leading to improved staking rewards for validators. The increased participation rate and network efficiency improvements have created attractive yields for long-term holders.',
    author: 'Sarah Chen',
    publishedAt: '2025-06-08T08:15:00Z',
    category: 'Ethereum News',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop',
    likes: 892,
    comments: 67,
    views: 12350,
    tags: ['Ethereum', 'Staking', 'DeFi']
  },
  {
    id: 3,
    title: 'Major Banks Announce Bitcoin Treasury Holdings Following MicroStrategy Model',
    excerpt: 'Several Fortune 500 companies reveal plans to add Bitcoin to their balance sheets as corporate adoption accelerates.',
    content: 'Following MicroStrategy\'s successful Bitcoin treasury strategy, major corporations are announcing their own Bitcoin acquisition plans. This trend represents a significant shift in corporate treasury management and institutional crypto adoption.',
    author: 'Michael Rodriguez',
    publishedAt: '2025-06-08T06:45:00Z',
    category: 'Bitcoin News',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=400&fit=crop',
    likes: 2156,
    comments: 134,
    views: 28750,
    tags: ['Bitcoin', 'Institutional', 'Corporate Adoption']
  },
  {
    id: 4,
    title: 'DeFi Protocol Launches Revolutionary Cross-Chain Bridge Technology',
    excerpt: 'New interoperability solution promises to solve blockchain fragmentation with seamless asset transfers.',
    content: 'A groundbreaking DeFi protocol has unveiled advanced cross-chain bridge technology that enables seamless asset transfers between major blockchains. This innovation addresses one of the biggest challenges in the current DeFi ecosystem.',
    author: 'Alex Thompson',
    publishedAt: '2025-06-07T14:20:00Z',
    category: 'DeFi News',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    likes: 743,
    comments: 52,
    views: 9840,
    tags: ['DeFi', 'Cross-Chain', 'Innovation']
  },
  {
    id: 5,
    title: 'Regulatory Clarity Emerges as SEC Provides New Crypto Guidelines',
    excerpt: 'Securities and Exchange Commission releases comprehensive framework for cryptocurrency regulation.',
    content: 'The SEC has published new guidelines that provide much-needed clarity for cryptocurrency projects and exchanges. These regulations are expected to foster innovation while protecting investors in the rapidly evolving crypto space.',
    author: 'Jennifer Walsh',
    publishedAt: '2025-06-07T11:30:00Z',
    category: 'Regulation',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=400&fit=crop',
    likes: 1534,
    comments: 98,
    views: 19200,
    tags: ['Regulation', 'SEC', 'Compliance']
  },
  {
    id: 6,
    title: 'NFT Market Shows Signs of Recovery with New Gaming Integrations',
    excerpt: 'Gaming industry adoption drives renewed interest in NFT technology and digital collectibles.',
    content: 'The NFT market is experiencing a resurgence as major gaming companies integrate non-fungible tokens into their platforms. This utility-driven approach is creating sustainable demand for digital assets.',
    author: 'David Kim',
    publishedAt: '2025-06-07T09:15:00Z',
    category: 'NFT News',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    likes: 687,
    comments: 43,
    views: 8760,
    tags: ['NFT', 'Gaming', 'Digital Assets']
  },
  {
    id: 7,
    title: 'Coinbase Announces Support for 12 New Altcoins in Major Expansion',
    excerpt: 'Leading cryptocurrency exchange adds dozen new digital assets to trading platform.',
    content: 'Coinbase has announced the addition of 12 new altcoins to its platform, significantly expanding its cryptocurrency offerings. This move comes as institutional demand for diverse digital assets continues to grow.',
    author: 'Emily Watson',
    publishedAt: '2025-06-07T07:30:00Z',
    category: 'Altcoin News',
    imageUrl: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=400&fit=crop',
    likes: 921,
    comments: 76,
    views: 11850,
    tags: ['Coinbase', 'Altcoins', 'Exchange']
  },
  {
    id: 8,
    title: 'Layer 2 Solutions Drive Ethereum Gas Fees to Yearly Lows',
    excerpt: 'Optimistic rollups and zk-rollups significantly reduce transaction costs on Ethereum network.',
    content: 'Ethereum transaction fees have dropped to their lowest levels this year as Layer 2 scaling solutions gain widespread adoption. The success of these technologies points to a more scalable future for Ethereum.',
    author: 'Mark Thompson',
    publishedAt: '2025-06-06T16:45:00Z',
    category: 'Ethereum News',
    imageUrl: 'https://images.unsplash.com/photo-1640826558928-5918330a6fdc?w=800&h=400&fit=crop',
    likes: 1156,
    comments: 92,
    views: 13200,
    tags: ['Ethereum', 'Layer 2', 'Gas Fees']
  },
  {
    id: 9,
    title: 'Dogecoin Price Analysis: DOGE Shows Bullish Momentum After Celebrity Endorsements',
    excerpt: 'Social media buzz and celebrity support drive renewed interest in meme cryptocurrency.',
    content: 'Dogecoin has experienced significant price movement following a series of high-profile endorsements. Technical indicators suggest potential for continued upward momentum in the near term.',
    author: 'Lisa Park',
    publishedAt: '2025-06-06T14:20:00Z',
    category: 'Price Analysis',
    imageUrl: 'https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=800&h=400&fit=crop',
    likes: 743,
    comments: 121,
    views: 9600,
    tags: ['Dogecoin', 'Price Analysis', 'Meme Coins']
  },
  {
    id: 10,
    title: 'Solana DEX Trading Volume Surpasses Ethereum for First Time',
    excerpt: 'Fast transaction speeds and low fees drive record trading activity on Solana-based exchanges.',
    content: 'Decentralized exchanges built on Solana have achieved a historic milestone by processing more trading volume than Ethereum-based DEXs. This achievement highlights the growing adoption of alternative blockchain platforms.',
    author: 'Ryan Mitchell',
    publishedAt: '2025-06-06T12:10:00Z',
    category: 'Altcoin News',
    imageUrl: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&h=400&fit=crop',
    likes: 892,
    comments: 67,
    views: 10800,
    tags: ['Solana', 'DEX', 'Trading Volume']
  },
  {
    id: 11,
    title: 'Federal Reserve Hints at CBDC Development in Latest Policy Statement',
    excerpt: 'Central bank digital currency research accelerates as Fed explores digital dollar options.',
    content: 'The Federal Reserve has published new research indicating serious consideration of a central bank digital currency. This development could significantly impact the cryptocurrency landscape.',
    author: 'Robert Chen',
    publishedAt: '2025-06-06T10:00:00Z',
    category: 'Regulation',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
    likes: 1823,
    comments: 156,
    views: 21500,
    tags: ['CBDC', 'Federal Reserve', 'Regulation']
  },
  {
    id: 12,
    title: 'Cardano Smart Contracts Reach New Milestone with 1000+ dApps',
    excerpt: 'Ecosystem growth accelerates as developers embrace Cardano\'s unique blockchain architecture.',
    content: 'The Cardano ecosystem has reached a significant milestone with over 1000 decentralized applications now deployed on the network. This growth demonstrates the platform\'s maturing development environment.',
    author: 'Amanda Foster',
    publishedAt: '2025-06-05T18:30:00Z',
    category: 'Altcoin News',
    imageUrl: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=800&h=400&fit=crop',
    likes: 654,
    comments: 83,
    views: 7900,
    tags: ['Cardano', 'Smart Contracts', 'dApps']
  }
];

export const podcasts: Podcast[] = [
  {
    id: 1,
    title: 'The Future of Bitcoin DeFi',
    guest: 'Matt Mudano, CEO of Arch',
    description: 'Discussion on Bitcoin Momentum, Programmability on Bitcoin, and the Future of Bitcoin DeFi',
    duration: '45 min',
    publishedAt: '2025-06-08T10:44:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop',
    episode: 443
  },
  {
    id: 2,
    title: 'Blockchain Oracles and Tokenizing Private Credit',
    guest: 'Marcin Kazmierczak, Co-Founder of RedStone',
    description: 'Deep dive into blockchain oracles and the tokenization of private credit markets',
    duration: '52 min',
    publishedAt: '2025-06-06T04:01:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop',
    episode: 442
  },
  {
    id: 3,
    title: 'AI Agents and The Future of Creator Economy',
    guest: 'Harrison Hines, CEO of Fleek',
    description: 'Exploring AI Agents, The Agent Layer, and The Future of the Creator Economy',
    duration: '38 min',
    publishedAt: '2025-05-21T03:52:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=400&h=400&fit=crop',
    episode: 440
  },
  {
    id: 4,
    title: 'The Next Internet and Validators on Solana',
    guest: 'Austin Federa, Co-Founder of DoubleZero',
    description: 'Discussion on The Next Internet, The Future of Solana, and Validators',
    duration: '41 min',
    publishedAt: '2025-05-17T03:40:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop',
    episode: 438
  }
];

export const reports: Report[] = [
  {
    id: 1,
    title: 'Bitcoin, Ethereum, and Solana: Q1 Results and Q2 Market Outlook',
    description: 'Comprehensive analysis of major cryptocurrency performance and market predictions',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
    category: 'Market Analysis',
    publishedAt: '2025-06-08T00:00:00Z'
  },
  {
    id: 2,
    title: 'May 2025 Altcoin Outlook: SUI, Meme Coins, and AI Tokens Expert Predictions',
    description: 'Expert analysis on emerging altcoin trends and investment opportunities',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop',
    category: 'Altcoin Analysis',
    publishedAt: '2025-06-07T00:00:00Z'
  },
  {
    id: 3,
    title: 'June 2025 Altcoin Outlook: Altseason Could Start by July, Experts Say',
    description: 'Seasonal analysis and predictions for the upcoming altcoin market cycle',
    imageUrl: 'https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=800&h=400&fit=crop',
    category: 'Market Trends',
    publishedAt: '2025-06-06T00:00:00Z'
  },
  {
    id: 4,
    title: 'Cats vs Dogs Meme Coins: Do Cats Take Over? | Research Report',
    description: 'Detailed research on meme coin trends and community dynamics',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=400&fit=crop',
    category: 'Meme Coins',
    publishedAt: '2025-06-05T00:00:00Z'
  }
]; 