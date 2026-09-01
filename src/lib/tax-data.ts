
export type TaxData = {
  [country: string]: {
    rate: number; // Simplified flat tax rate in percent
    states?: string[];
  };
};

export const countryTaxData: TaxData = {
  "USA": {
    rate: 22,
    states: ['California', 'Texas', 'New York', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio'],
  },
  "Canada": {
    rate: 20.5,
    states: ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba', 'Saskatchewan'],
  },
  "India": {
    rate: 30,
    states: ['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu', 'Uttar Pradesh', 'Gujarat'],
  },
  "Pakistan": {
    rate: 15,
    states: ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan'],
  },
  "UK": {
    rate: 20,
    states: ['England', 'Scotland', 'Wales', 'Northern Ireland'],
  },
  "Germany": {
    rate: 42,
    states: ['Bavaria', 'Berlin', 'Hamburg', 'North Rhine-Westphalia', 'Baden-Württemberg'],
  },
  "Australia": {
    rate: 32.5,
    states: ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia'],
  },
  "Brazil": {
    rate: 27.5,
    states: ['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia'],
  },
  "Japan": {
    rate: 23,
    states: ['Tokyo', 'Kanagawa', 'Osaka', 'Aichi'],
  },
  "China": {
    rate: 25,
    states: ['Guangdong', 'Jiangsu', 'Shandong', 'Zhejiang'],
  },
  "South Africa": {
    rate: 30,
    states: ['Gauteng', 'KwaZulu-Natal', 'Western Cape', 'Eastern Cape'],
  }
};
