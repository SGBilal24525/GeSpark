
export type ToolInput = {
    id: string;
    label: string;
    type: 'number' | 'number-unit' | 'radio' | 'select' | 'date' | 'group' | 'time' | 'select-dynamic' | 'textarea' | 'color';
    placeholder?: string;
    units?: string[];
    options?: string[];
    inputs?: ToolInput[]; // For grouped inputs
}

export type Tool = {
    slug: string;
    name: string;
    category: 'Calculators' | 'Converters';
    description: string;
    inputs: ToolInput[];
    formula?: {
        string: string;
        variables: { [key:string]: string };
    };
    blogSlug?: string;
}

export const tools: Tool[] = [
  // --- Calculators ---
  {
    slug: 'adsense-earning-calculator',
    name: 'AdSense Earning Calculator',
    category: 'Calculators',
    description: 'Estimate your AdSense income from page views, CTR, and CPC easily.',
    inputs: [
      { id: 'pageViews', label: 'Daily Page Views', type: 'number', placeholder: 'e.g., 10,000' },
      { id: 'ctr', label: 'Click-Through Rate (CTR %)', type: 'number', placeholder: 'e.g., 2.5' },
      { id: 'cpc', label: 'Cost Per Click (CPC in $)', type: 'number', placeholder: 'e.g., 0.15' },
      { id: 'adsPerPage', label: 'Ad Impressions per Page (Optional)', type: 'number', placeholder: 'e.g., 3' },
    ],
    formula: {
      string: "Earnings = (Page Views × CTR% × CPC) / 100",
      variables: {
        "Page Views": "The total number of times your pages with ads are viewed.",
        "CTR%": "Click-Through Rate: The percentage of page views that result in a click.",
        "CPC": "Cost Per Click: The amount you earn each time a user clicks an ad."
      }
    },
    blogSlug: 'how-adsense-calculator-works',
  },
  {
    slug: 'age-calculator',
    name: 'Age Calculator',
    category: 'Calculators',
    description: 'Calculate your exact age in years, months, days, hours, and seconds.',
    inputs: [
        { id: 'dob', label: 'Date of Birth', type: 'date' },
        { id: 'tob', label: 'Time of Birth (Optional)', type: 'time' },
    ],
    formula: {
        string: "Age = Current Date - Date of Birth",
        variables: {
            "Current Date": "The date and time right now.",
            "Date of Birth": "The date and time you were born."
        }
    },
    blogSlug: 'how-age-calculator-works',
  },
  {
    slug: 'bmi-calculator',
    name: 'BMI Calculator',
    category: 'Calculators',
    description: 'Calculate Body Mass Index using weight and height.',
    inputs: [
        { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
        { id: 'age', label: 'Age', type: 'number', placeholder: 'e.g., 25' },
        { id: 'height', label: 'Height', type: 'number-unit', units: ['cm', 'ft'] },
        { id: 'weight', label: 'Weight', type: 'number-unit', units: ['kg', 'lb'] },
    ],
    formula: {
        string: "BMI = weight (kg) / (height (m))²",
        variables: {
            "weight (kg)": "Your weight in kilograms.",
            "height (m)": "Your height in meters."
        }
    },
    blogSlug: 'what-is-bmi',
  },
  {
    slug: 'body-surface-area-calculator',
    name: 'Body Surface Area (BSA) Calculator',
    category: 'Calculators',
    description: 'Calculate the total surface area of a human body, used for medical dosage calculations.',
    inputs: [
      { id: 'height', label: 'Height', type: 'number-unit', units: ['cm', 'in', 'ft'] },
      { id: 'weight', label: 'Weight', type: 'number-unit', units: ['kg', 'lb'] },
      { id: 'formula', label: 'Formula', type: 'select', options: ['Mosteller', 'DuBois', 'Haycock'] },
    ],
    formula: {
        string: "BSA (m²) = √((Height(cm) × Weight(kg)) / 3600)",
        variables: {
            "Height(cm)": "Your height in centimeters.",
            "Weight(kg)": "Your weight in kilograms."
        }
    }
  },
  {
    slug: 'loan-calculator',
    name: 'Mortgage Calculator',
    category: 'Calculators',
    description: 'Estimate your monthly mortgage payments, total interest, and see a full amortization schedule.',
    inputs: [
        { id: 'loanAmount', label: 'Loan Amount', type: 'number', placeholder: 'e.g., 250000' },
        { id: 'interestRate', label: 'Annual Interest Rate (%)', type: 'number', placeholder: 'e.g., 4.5' },
        { id: 'tenure', label: 'Loan Term', type: 'number-unit', units: ['Years', 'Months'] },
    ],
    formula: {
        string: "M = P × [r(1+r)ⁿ] / [(1+r)ⁿ - 1]",
        variables: {
            "M": "Monthly Payment",
            "P": "Principal Loan Amount",
            "r": "Monthly Interest Rate",
            "n": "Total Number of Payments (Loan Term in Months)"
        }
    },
    blogSlug: 'how-loan-calculator-works'
  },
  {
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    category: 'Calculators',
    description: 'Quickly find percentages, increases, or decreases.',
    inputs: [
      { id: 'value1', label: 'Value 1', type: 'number', placeholder: 'e.g., 25' },
      { id: 'value2', label: 'Value 2', type: 'number', placeholder: 'e.g., 200' },
    ],
    formula: {
        string: "Percentage = (Part / Whole) * 100",
        variables: {
            "Part": "The value representing a portion of the whole.",
            "Whole": "The total or entire amount."
        }
    }
  },
  {
    slug: 'time-calculator',
    name: 'Time Calculator',
    category: 'Calculators',
    description: 'Add, subtract, or find the duration between two times.',
    inputs: [
        { id: 'time1_h', label: 'Hours', type: 'number', placeholder: 'HH' },
        { id: 'time1_m', label: 'Minutes', type: 'number', placeholder: 'MM' },
        { id: 'time1_s', label: 'Seconds', type: 'number', placeholder: 'SS' },
        { id: 'time2_h', label: 'Hours', type: 'number', placeholder: 'HH' },
        { id: 'time2_m', label: 'Minutes', type: 'number', placeholder: 'MM' },
        { id: 'time2_s', label: 'Seconds', type: 'number', placeholder: 'SS' },
    ],
    formula: {
        string: "Total Seconds = (H × 3600) + (M × 60) + S",
        variables: {
            "H": "Hours",
            "M": "Minutes",
            "S": "Seconds"
        }
    }
  },
  {
    slug: 'tip-calculator',
    name: 'Tip Calculator',
    category: 'Calculators',
    description: 'Calculate restaurant tips per person or total bill.',
    inputs: [
        { id: 'bill', label: 'Total Bill Amount', type: 'number', placeholder: 'e.g., 100' },
        { id: 'tip', label: 'Tip Percentage (%)', type: 'number', placeholder: 'e.g., 15' },
        { id: 'people', label: 'Number of People', type: 'number', placeholder: 'e.g., 4' },
    ],
    formula: {
        string: "Tip = Bill × (Tip % / 100)",
        variables: {
            "Bill": "The total cost of the service or meal.",
            "Tip %": "The percentage of the bill you want to give as a tip."
        }
    }
  },
  {
    slug: 'freelance-rate-calculator',
    name: 'Freelance Rate Calculator',
    category: 'Calculators',
    description: 'Determine your ideal hourly rate to meet income goals.',
    inputs: [
        { id: 'income', label: 'Desired Monthly Income', type: 'number', placeholder: 'e.g., 3000' },
        { id: 'hours', label: 'Weekly Hours', type: 'number', placeholder: 'e.g., 40' },
        { id: 'weeks', label: 'Working Weeks per Year', type: 'number', placeholder: 'e.g., 50' },
    ],
    formula: {
        string: "Hourly Rate = Monthly Income / (Weekly Billable Hours * 4.33)",
        variables: {
          "Monthly Income": "Your target income per month.",
          "Weekly Billable Hours": "Your productive, paid hours per week."
        }
    }
  },
  {
    slug: 'discount-calculator',
    name: 'Discount Calculator',
    category: 'Calculators',
    description: 'Find final price after discount or sale percentage.',
     inputs: [
        { id: 'price', label: 'Original Price', type: 'number', placeholder: 'e.g., 300' },
        { id: 'discount', label: 'Discount (%)', type: 'number', placeholder: 'e.g., 15' },
    ],
    formula: {
        string: "Final Price = Original Price - (Original Price × (Discount % / 100))",
        variables: {
            "Original Price": "The initial price of the item.",
            "Discount %": "The percentage off the original price."
        }
    }
  },
  {
    slug: 'calorie-calculator',
    name: 'Calorie Calculator',
    category: 'Calculators',
    description: 'Estimate daily calorie needs based on your activity level.',
    inputs: [
      { id: 'gender', label: 'Gender', type: 'radio', options: ['Male', 'Female'] },
      { id: 'age', label: 'Age (years)', type: 'number', placeholder: 'e.g., 25' },
      { id: 'height', label: 'Height', type: 'number-unit', units: ['cm', 'ft'], placeholder: 'e.g., 175' },
      { id: 'weight', label: 'Weight', type: 'number-unit', units: ['kg', 'lb'], placeholder: 'e.g., 70' },
      { id: 'activity', label: 'Activity Level', type: 'select', options: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Extra Active'] },
    ],
    formula: {
        string: "Maintenance Calories = BMR × Activity Factor",
        variables: {
            "BMR": "Basal Metabolic Rate - calories your body burns at rest.",
            "Activity Factor": "A multiplier based on how active you are."
        }
    }
  },
  {
    slug: 'salary-calculator',
    name: 'Salary Calculator',
    category: 'Calculators',
    description: 'Compute take-home pay after tax and deductions.',
    inputs: [
        { id: 'gross', label: 'Gross Annual Salary', type: 'number', placeholder: 'e.g., 60000' },
        { id: 'tax', label: 'Tax Rate (%)', type: 'number', placeholder: 'e.g., 15' },
        { id: 'deductions', label: 'Other Deductions (Annual)', type: 'number', placeholder: 'e.g., 1000' },
    ],
    formula: {
        string: "Net Salary = Gross Salary - Taxes - Deductions",
        variables: {
            "Gross Salary": "The total salary before any deductions.",
            "Taxes": "Amount paid to the government.",
            "Deductions": "Other cuts like pension or insurance."
        }
    }
  },
  {
    slug: 'saving-goal-calculator',
    name: 'Saving Goal Calculator',
    category: 'Calculators',
    description: 'Plan your savings, with interest/return options and timeline.',
    inputs: [
        { id: 'goal', label: 'Goal Amount', type: 'number', placeholder: 'e.g., 100000' },
        { id: 'timeframe', label: 'Months to Save', type: 'number', placeholder: 'e.g., 18' },
        { id: 'return', label: 'Expected Annual Return (%)', type: 'number', placeholder: 'e.g., 6' },
    ],
    formula: {
        string: "PMT = (G - S0*(1+r/n)^N) * (r/n) / (((1+r/n)^N)-1)",
        variables: {
            "PMT": "Required periodic contribution.",
            "G": "The future goal amount.",
            "S0": "Starting balance.",
            "r": "Annual interest rate.",
            "n": "Compounding periods per year.",
            "N": "Total number of contributions."
        }
    }
  },
  {
    slug: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    category: 'Calculators',
    description: "Calculate your investment's total return (ROI), profit, and growth percentage.",
    inputs: [
        { id: 'principal', label: 'Initial Investment ($)', type: 'number', placeholder: 'e.g., 10000' },
        { id: 'rate', label: 'Annual Interest Rate (%)', type: 'number', placeholder: 'e.g., 8' },
        { id: 'duration', label: 'Time Period (Years)', type: 'number', placeholder: 'e.g., 5' },
        { id: 'compounding', label: 'Compounding Frequency', type: 'select', options: ['Annually', 'Semi-Annually', 'Quarterly', 'Monthly', 'Weekly', 'Daily'] },
    ],
    formula: {
        string: "A = P(1 + r/n)^(nt)",
        variables: {
            "A": "The future value of the investment/loan, including interest.",
            "P": "The principal amount (the initial amount of money).",
            "r": "The annual interest rate (in decimal).",
            "n": "The number of times that interest is compounded per year.",
            "t": "The number of years the money is invested or borrowed for."
        }
    }
  },
  {
    slug: 'tax-calculator',
    name: 'Tax Calculator',
    category: 'Calculators',
    description: 'Enter income, deductions & region to get tax liability instantly.',
    inputs: [
        { id: 'income', label: 'Annual Income', type: 'number', placeholder: 'e.g., 80000' },
        { id: 'deductions', label: 'Deductions', type: 'number', placeholder: 'e.g., 5000' },
        { id: 'taxRate', label: 'Tax Rate (%)', type: 'number', placeholder: 'e.g. 20' },
    ],
    formula: {
        string: "Tax = (Taxable Income * Tax Rate) - Tax Credits",
        variables: {
            "Taxable Income": "Gross income minus deductions.",
            "Tax Rate": "The percentage rate applied to income.",
            "Tax Credits": "Reductions from the tax owed."
        }
    }
  },
  {
    slug: 'tax-saving-calculator',
    name: 'Tax Saving Calculator',
    category: 'Calculators',
    description: 'Estimate your potential tax savings based on income, investments, and deductions.',
    inputs: [
        { id: 'income', label: 'Annual Income', type: 'number', placeholder: 'e.g., 45000' },
        { id: 'deductions', label: 'Total Investments & Deductions', type: 'number', placeholder: 'e.g., 8000' },
        { id: 'taxRate', label: 'Tax Rate (%)', type: 'number', placeholder: 'e.g., 20' },
    ],
    formula: {
        string: "Tax Payable = (Total Income - Eligible Deductions) × Tax Rate",
        variables: {
            "Total Income": "Your gross annual income.",
            "Eligible Deductions": "Your total tax-deductible expenses and investments.",
            "Tax Rate": "The applicable tax percentage rate."
        }
    }
  },
  {
    slug: 'profit-margin-calculator',
    name: 'Profit Margin Calculator',
    category: 'Calculators',
    description: 'Calculate gross profit, margin, markup, and break-even price quickly.',
    inputs: [
        { id: 'cost', label: 'Cost Price', type: 'number', placeholder: 'e.g., 150' },
        { id: 'selling', label: 'Selling Price', type: 'number', placeholder: 'e.g., 200' },
    ],
    formula: {
        string: "Profit Margin (%) = ((Selling Price - Cost Price) / Selling Price) * 100",
        variables: {
            "Selling Price": "The price at which a product is sold.",
            "Cost Price": "The original cost of the product."
        }
    }
  },
  {
    slug: 'gpa-calculator',
    name: 'GPA Calculator',
    category: 'Calculators',
    description: 'Calculate Grade Point Average for students.',
    inputs: [
      { id: 'gpa-group', label: 'Courses', type: 'group', inputs: [
        { id: 'grade', label: 'Grade', type: 'select', options: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F'] },
        { id: 'credits', label: 'Credit Hours', type: 'number', placeholder: 'e.g., 3' },
      ]},
    ],
    formula: {
        string: "GPA = Σ(Grade Points × Credits) / Σ(Credits)",
        variables: {
            "Grade Points": "Numeric value for a letter grade (e.g., A=4.0).",
            "Credits": "The number of credit hours for a course."
        }
    }
  },
  {
    slug: 'water-intake-calculator',
    name: 'Water Intake Calculator',
    category: 'Calculators',
    description: 'Find daily water requirement based on body weight.',
    inputs: [
      { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: 'e.g., 70' },
      { id: 'activity', label: 'Activity Level', type: 'select', options: ['Low', 'Moderate', 'High'] },
    ],
    formula: {
        string: "Daily Intake ≈ Weight (kg) × 35 ml",
        variables: {
            "Weight (kg)": "Your body weight in kilograms.",
            "Activity Level": "Your daily physical activity level can increase this need."
        }
    }
  },
  {
    slug: 'electricity-bill-calculator',
    name: 'Electricity Bill Calculator',
    category: 'Calculators',
    description: 'Estimate your electricity bill based on units consumed and rate per unit.',
    inputs: [
      { id: 'units', label: 'Units Consumed (kWh)', type: 'number', placeholder: 'e.g., 350' },
      { id: 'rate', label: 'Rate per Unit ($/kWh)', type: 'number', placeholder: 'e.g., 0.15' },
      { id: 'fixedCharges', label: 'Fixed Charges ($)', type: 'number', placeholder: 'e.g., 10' },
      { id: 'tax', label: 'Tax or Surcharge (%)', type: 'number', placeholder: 'e.g., 5' },
    ],
    formula: {
        string: "Total Bill = (Units × Rate) + Fixed Charges + Tax",
        variables: {
            "Units": "Total electricity consumed in kilowatt-hours (kWh).",
            "Rate": "The cost for each unit of electricity.",
            "Fixed Charges": "A constant charge regardless of consumption.",
            "Tax": "Government taxes or surcharges on the bill."
        }
    }
  },
  // --- Converters ---
  {
    slug: 'ai-story-generator',
    name: 'AI Story Generator',
    category: 'Converters',
    description: 'Generate a short story from a simple prompt.',
    inputs: [
        { id: 'story-prompt', label: 'Story Prompt', type: 'textarea', placeholder: 'e.g., A lost astronaut on a colorful planet...' },
    ]
  },
  {
    slug: 'ai-hashtag-generator',
    name: 'AI Hashtag Generator',
    category: 'Converters',
    description: 'Generate relevant and trending hashtags for your social media posts using AI.',
    inputs: [
      { id: 'text-input', label: 'Post Content or Topic', type: 'textarea', placeholder: 'e.g., Just finished a great workout at the gym and feeling amazing!' },
    ]
  },
  {
    slug: 'date-format-converter',
    name: 'Date Format Converter',
    category: 'Converters',
    description: 'Convert dates between regional, technical, and ISO formats.',
    inputs: [
        { id: 'date', label: 'Date', type: 'date' },
        {
            id: 'outputFormat',
            label: 'Output Format',
            type: 'select',
            options: [
                'MM/dd/yyyy',
                'dd/MM/yyyy',
                'yyyy-MM-dd',
                'ISO 8601',
                'Unix Timestamp (seconds)',
                'RFC 2822',
                'SQL DateTime',
            ]
        }
    ]
  },
  {
    slug: 'emoji-converter',
    name: 'Emoji Converter',
    category: 'Converters',
    description: 'Convert emojis to text descriptions and text to relevant emojis with AI.',
    inputs: [
      { id: 'text-input', label: 'Text or Emoji Input', type: 'textarea', placeholder: 'e.g., I feel 🔥 or paste an emoji 😂' },
    ]
  },
  {
    slug: 'language-translator',
    name: 'Language Translator',
    category: 'Converters',
    description: 'Translate text between 100+ global languages with AI-powered contextual explanations.',
    inputs: [
      { 
        id: 'sourceLanguage', 
        label: 'From', 
        type: 'select', 
        options: [
            'Auto-detect', 'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch', 'Russian', 'Arabic', 'Hindi', 'Urdu', 'Chinese (Simplified)', 'Chinese (Traditional)', 'Japanese', 'Korean', 'Turkish', 'Persian (Farsi)', 'Indonesian', 'Thai', 'Vietnamese', 'Bengali', 'Greek', 'Hebrew', 'Swahili', 'Malay', 'Filipino', 'Polish', 'Romanian', 'Czech', 'Swedish', 'Finnish', 'Norwegian', 'Danish', 'Ukrainian', 'Hungarian', 'Slovak', 'Tamil', 'Telugu', 'Kannada', 'Gujarati', 'Marathi', 'Sinhala', 'Nepali', 'Lao', 'Khmer', 'Burmese', 'Somali', 'Zulu', 'Afrikaans'
        ]
      },
      { 
        id: 'targetLanguage', 
        label: 'To', 
        type: 'select', 
        options: [
            'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch', 'Russian', 'Arabic', 'Hindi', 'Urdu', 'Chinese (Simplified)', 'Chinese (Traditional)', 'Japanese', 'Korean', 'Turkish', 'Persian (Farsi)', 'Indonesian', 'Thai', 'Vietnamese', 'Bengali', 'Greek', 'Hebrew', 'Swahili', 'Malay', 'Filipino', 'Polish', 'Romanian', 'Czech', 'Swedish', 'Finnish', 'Norwegian', 'Danish', 'Ukrainian', 'Hungarian', 'Slovak', 'Tamil', 'Telugu', 'Kannada', 'Gujarati', 'Marathi', 'Sinhala', 'Nepali', 'Lao', 'Khmer', 'Burmese', 'Somali', 'Zulu', 'Afrikaans'
        ]
      },
      { id: 'sourceText', label: 'Source Text', type: 'textarea', placeholder: 'Enter text to translate...' },
    ]
  },
  {
    slug: 'color-converter',
    name: 'Color Converter',
    category: 'Converters',
    description: 'Convert colors between HEX, RGB, and HSL formats.',
    inputs: [
        { id: 'color', label: 'Color (HEX)', type: 'color', placeholder: '#1E90FF' },
    ]
  },
  {
    slug: 'currency-converter',
    name: 'Currency Converter',
    category: 'Converters',
    description: 'Convert currencies in real time with latest rates.',
    inputs: [
        { id: 'amount', label: 'Amount', type: 'number', placeholder: 'e.g., 100' },
        { id: 'from-unit', label: 'From', type: 'select', options: [
          'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BTN', 'BWP', 'BYN', 'BZD', 'CAD', 'CDF', 'CHF', 'CLP', 'CNY', 'COP', 'CRC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'FOK', 'GBP', 'GEL', 'GGP', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'IMP', 'INR', 'IQD', 'IRR', 'ISK', 'JEP', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KID', 'KMF', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRU', 'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLE', 'SLL', 'SOS', 'SRD', 'SSP', 'STN', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TVD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'UYU', 'UZS', 'VES', 'VND', 'VUV', 'WST', 'XAF', 'XCD', 'XDR', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMW', 'ZWL'
        ] },
        { id: 'to-unit', label: 'To', type: 'select', options: [
          'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BTN', 'BWP', 'BYN', 'BZD', 'CAD', 'CDF', 'CHF', 'CLP', 'CNY', 'COP', 'CRC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'FOK', 'GBP', 'GEL', 'GGP', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'IMP', 'INR', 'IQD', 'IRR', 'ISK', 'JEP', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KID', 'KMF', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRU', 'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLE', 'SLL', 'SOS', 'SRD', 'SSP', 'STN', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TVD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'UYU', 'UZS', 'VES', 'VND', 'VUV', 'WST', 'XAF', 'XCD', 'XDR', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMW', 'ZWL'
        ] },
    ],
    formula: {
        string: "Converted Amount = Amount × Exchange Rate",
        variables: {
            "Amount": "The value you want to convert.",
            "Exchange Rate": "The value of one currency in terms of another."
        }
    }
  },
  {
    slug: 'length-converter',
    name: 'Length Converter',
    category: 'Converters',
    description: 'Convert between mm, cm, m, km, inches, feet, and miles.',
    inputs: [
        { id: 'value', label: 'Value', type: 'number', placeholder: 'e.g., 10' },
        { id: 'from-unit', label: 'From', type: 'select', options: ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'] },
        { id: 'to-unit', label: 'To', type: 'select', options: ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'] },
    ]
  },
  {
    slug: 'weight-converter',
    name: 'Weight Converter',
    category: 'Converters',
    description: 'Convert between mg, g, kg, tons, pounds, and ounces.',
    inputs: [
        { id: 'value', label: 'Value', type: 'number', placeholder: 'e.g., 5' },
        { id: 'from-unit', label: 'From', type: 'select', options: ['mg', 'g', 'kg', 'ton', 'oz', 'lb', 'stone'] },
        { id: 'to-unit', label: 'To', type: 'select', options: ['mg', 'g', 'kg', 'ton', 'oz', 'lb', 'stone'] },
    ]
  },
  {
    slug: 'code-converter',
    name: 'Code Converter',
    category: 'Converters',
    description: 'Translate code from one programming language to another using AI.',
    inputs: [
      { 
        id: 'sourceLanguage', 
        label: 'Input Language', 
        type: 'select', 
        options: [
          'Bash', 'C#', 'C++', 'CSS', 'Dart', 'Dockerfile', 'Go', 'HTML', 'Java', 'JavaScript', 'JSON', 'Kotlin', 'Lua', 'MATLAB', 'Perl', 'PHP', 'PowerShell', 'Python', 'R', 'Ruby', 'Rust', 'SQL', 'Swift', 'TypeScript', 'XML', 'YAML'
        ]
      },
      { 
        id: 'targetLanguage', 
        label: 'Output Language', 
        type: 'select', 
        options: [
          'Bash', 'C#', 'C++', 'CSS', 'Dart', 'Dockerfile', 'Go', 'HTML', 'Java', 'JavaScript', 'JSON', 'Kotlin', 'Lua', 'MATLAB', 'Perl', 'PHP', 'PowerShell', 'Python', 'R', 'Ruby', 'Rust', 'SQL', 'Swift', 'TypeScript', 'XML', 'YAML'
        ]
      },
      { id: 'sourceCode', label: 'Source Code', type: 'textarea', placeholder: 'Enter your code here...' },
    ]
  },
  {
    slug: 'text-case-converter',
    name: 'Text Case Converter',
    category: 'Converters',
    description: 'Instantly convert text to UPPERCASE, lowercase, Title Case, and more.',
    inputs: [
      { id: 'text-input', label: 'Text Input', type: 'textarea', placeholder: 'Paste or type your text here...' },
    ]
  },
  {
    slug: 'grammar-checker',
    name: 'Grammar Checker',
    category: 'Converters',
    description: 'Fix grammar, punctuation, and spelling errors in your text with AI.',
    inputs: [
      { id: 'text-input', label: 'Text Input', type: 'textarea', placeholder: 'Paste or type your text here to check it...' },
    ]
  },
  {
    slug: 'data-converter',
    name: 'Data Converter',
    category: 'Converters',
    description: 'Convert between bits, bytes, KB, MB, GB, and TB.',
    inputs: [
      { id: 'value', label: 'Value', type: 'number', placeholder: 'e.g., 1024' },
      { id: 'from-unit', label: 'From', type: 'select', options: ['Bit', 'Byte', 'KB', 'MB', 'GB', 'TB', 'PB'] },
      { id: 'to-unit', label: 'To', type: 'select', options: ['Bit', 'Byte', 'KB', 'MB', 'GB', 'TB', 'PB'] },
    ]
  }
];
    

    





















