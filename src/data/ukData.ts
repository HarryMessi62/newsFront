// UK-specific data for localization
export const ukContactData = {
  company: {
    name: 'CryptoNews UK Ltd',
    registrationNumber: 'Company No. 12345678',
    address: {
      street: '25 Finsbury Circus',
      city: 'London',
      postcode: 'EC2M 7EA',
      country: 'United Kingdom'
    }
  },
  contact: {
    phone: '+44 20 7946 0958',
    email: 'info@cryptonews.uk',
    support: 'support@cryptonews.uk'
  },
  social: {
    twitter: '@CryptoNewsUK',
    linkedin: 'cryptonews-uk',
    telegram: '@CryptoNewsUK_Official'
  }
};

export const ukTeamMembers = [
  {
    name: 'James Thompson',
    role: 'Editor-in-Chief',
    email: 'james.thompson@cryptonews.uk',
    phone: '+44 20 7946 0959'
  },
  {
    name: 'Sarah Williams', 
    role: 'Lead Analyst',
    email: 'sarah.williams@cryptonews.uk',
    phone: '+44 20 7946 0960'
  },
  {
    name: 'Michael Davies',
    role: 'Technical Director', 
    email: 'michael.davies@cryptonews.uk',
    phone: '+44 20 7946 0961'
  },
  {
    name: 'Emma Johnson',
    role: 'Journalist',
    email: 'emma.johnson@cryptonews.uk',
    phone: '+44 20 7946 0962'
  }
];

// Random UK phone numbers for testing
export const generateUKPhone = () => {
  const areaCodes = ['020', '0121', '0161', '0113', '0117', '0131', '0141'];
  const areaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)];
  const number = Math.floor(Math.random() * 9000000) + 1000000;
  return `+44 ${areaCode.slice(1)} ${number.toString().slice(0, 4)} ${number.toString().slice(4)}`;
};

// UK addresses for testing
export const ukAddresses = [
  '10 Downing Street, London SW1A 2AA',
  '221B Baker Street, London NW1 6XE', 
  '1 Canary Wharf, London E14 5AB',
  '15 Bishopsgate, London EC2N 3AR',
  '30 St Mary Axe, London EC3A 8EP',
  '100 Liverpool Street, London EC2M 2RH'
]; 