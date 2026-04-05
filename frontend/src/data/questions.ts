export interface Answer {
  questionId: number;
  stream: string;
  weight: number;
}

export interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    stream: 'science' | 'commerce' | 'arts' | 'neutral';
    weight: number;
  }[];
}

export const questions: Question[] = [
  // Finance & Commerce Focused Questions (1-15)
  {
    id: 1,
    question: "Aapko numbers aur calculations se kya lagta hai?",
    options: [
      { text: "Maza aata hai, bahut easy lagta hai", stream: "commerce", weight: 3 },
      { text: "Theek thaak hai, manage kar leta hu", stream: "neutral", weight: 1 },
      { text: "Boring lagta hai bilkul", stream: "arts", weight: 2 },
      { text: "Sirf science ke liye useful hai", stream: "science", weight: 2 }
    ]
  },
  {
    id: 2,
    question: "Aap apne pocket money ko kaise manage karte ho?",
    options: [
      { text: "Save karta hu aur track rakhta hu", stream: "commerce", weight: 3 },
      { text: "Invest soch samajh ke karta hu", stream: "commerce", weight: 3 },
      { text: "Jaisa aaya spend kar diya", stream: "arts", weight: 1 },
      { text: "Mujhe pocket money nahi milti", stream: "neutral", weight: 0 }
    ]
  },
  {
    id: 3,
    question: "Business news ya stock market ke baare mein padhna pasand hai?",
    options: [
      { text: "Haan, interesting lagta hai", stream: "commerce", weight: 3 },
      { text: "Kabhi kabhi padh leta hu", stream: "commerce", weight: 2 },
      { text: "Bilkul nahi, bore hota hu", stream: "arts", weight: 1 },
      { text: "Sirf tech news padhta hu", stream: "science", weight: 1 }
    ]
  },
  {
    id: 4,
    question: "Aapko shopping karte waqt kya zyada matter karta hai?",
    options: [
      { text: "Price compare karna aur best deal lena", stream: "commerce", weight: 3 },
      { text: "Quality dekhni chahiye bas", stream: "science", weight: 1 },
      { text: "Jo pasand aaya wohi lena", stream: "arts", weight: 2 },
      { text: "Brand name matter karta hai", stream: "commerce", weight: 2 }
    ]
  },
  {
    id: 5,
    question: "Agar aapke paas 10,000 rupee hote toh kya karte?",
    options: [
      { text: "Save karta ya invest karta", stream: "commerce", weight: 3 },
      { text: "Kuch business start karne mein lagata", stream: "commerce", weight: 3 },
      { text: "Apne liye kuch kharidta", stream: "arts", weight: 1 },
      { text: "Padhai ya courses mein spend karta", stream: "science", weight: 2 }
    ]
  },
  {
    id: 6,
    question: "Bank account aur interest ke baare mein kitna jaante ho?",
    options: [
      { text: "Bahut kuch, mujhe achhe se samajh hai", stream: "commerce", weight: 3 },
      { text: "Thoda bahut idea hai", stream: "commerce", weight: 2 },
      { text: "Mujhe zyada nahi pata", stream: "neutral", weight: 1 },
      { text: "Isse kya matlab padhai pe dhyao do", stream: "arts", weight: 0 }
    ]
  },
  {
    id: 7,
    question: "Aapko kis type ki movies zyada pasand hai?",
    options: [
      { text: "Business tycoons ki stories", stream: "commerce", weight: 3 },
      { text: "Science fiction aur tech wali", stream: "science", weight: 3 },
      { text: "Emotional aur romantic", stream: "arts", weight: 3 },
      { text: "Comedy aur entertainment", stream: "arts", weight: 1 }
    ]
  },
  {
    id: 8,
    question: "Agar family business ho toh aap kya karoge?",
    options: [
      { text: "Join karke grow karne ki koshish karunga", stream: "commerce", weight: 3 },
      { text: "Apna kuch alag karna pasand karunga", stream: "science", weight: 2 },
      { text: "Dekhenge jo man karega wohi karenge", stream: "arts", weight: 1 },
      { text: "Job hi better lagti hai", stream: "neutral", weight: 1 }
    ]
  },
  {
    id: 9,
    question: "Maths ke kaunse topic mein aap strong ho?",
    options: [
      { text: "Profit-Loss, Percentage, Interest", stream: "commerce", weight: 3 },
      { text: "Algebra aur Trigonometry", stream: "science", weight: 3 },
      { text: "Geometry aur Mensuration", stream: "science", weight: 2 },
      { text: "Maths utna pasand nahi", stream: "arts", weight: 1 }
    ]
  },
  {
    id: 10,
    question: "Aapko kya lagta hai, success ka key kya hai?",
    options: [
      { text: "Smart planning aur financial management", stream: "commerce", weight: 3 },
      { text: "Hard work aur knowledge", stream: "science", weight: 2 },
      { text: "Creativity aur passion", stream: "arts", weight: 3 },
      { text: "Luck aur connections", stream: "neutral", weight: 1 }
    ]
  },
  {
    id: 11,
    question: "Online shopping apps mein aap kya notice karte ho?",
    options: [
      { text: "Discounts aur offers", stream: "commerce", weight: 3 },
      { text: "Product reviews aur ratings", stream: "science", weight: 2 },
      { text: "Design aur looks", stream: "arts", weight: 2 },
      { text: "Bas jo chahiye wohi dekhta hu", stream: "neutral", weight: 1 }
    ]
  },
  {
    id: 12,
    question: "Agar aapka dost aapse paise udhar maange toh?",
    options: [
      { text: "Interest rate bataunga pehle", stream: "commerce", weight: 3 },
      { text: "Kitne time mein wapas karega puchhunga", stream: "commerce", weight: 2 },
      { text: "Dosti mein no calculation", stream: "arts", weight: 1 },
      { text: "Depends on kaunsa dost hai", stream: "neutral", weight: 1 }
    ]
  },
  {
    id: 13,
    question: "Future mein aap kis type ki job prefer karoge?",
    options: [
      { text: "Banking, Finance, CA, MBA wali", stream: "commerce", weight: 3 },
      { text: "Doctor, Engineer, Scientist", stream: "science", weight: 3 },
      { text: "Artist, Writer, Designer, Media", stream: "arts", weight: 3 },
      { text: "Abhi decide nahi kiya", stream: "neutral", weight: 0 }
    ]
  },
  {
    id: 14,
    question: "Aapko kaunsa subject zyada interesting lagta hai?",
    options: [
      { text: "Economics aur Business Studies", stream: "commerce", weight: 3 },
      { text: "Physics, Chemistry, Biology", stream: "science", weight: 3 },
      { text: "History, Geography, Literature", stream: "arts", weight: 3 },
      { text: "Maths sabse best hai", stream: "science", weight: 2 }
    ]
  },
  {
    id: 15,
    question: "Agar aapko koi business idea aaye toh?",
    options: [
      { text: "Immediately research karunga aur plan banauga", stream: "commerce", weight: 3 },
      { text: "Parents aur teachers se advice lunga", stream: "neutral", weight: 2 },
      { text: "Doston ke saath discuss karunga", stream: "arts", weight: 1 },
      { text: "Sochunga lekin shayad action na lu", stream: "neutral", weight: 1 }
    ]
  },
  // Science Focused Questions (16-25)
  {
    id: 16,
    question: "Aapko experiments karna pasand hai?",
    options: [
      { text: "Haan, lab mein rehna pasand hai", stream: "science", weight: 3 },
      { text: "Kabhi kabhi theek lagta hai", stream: "science", weight: 2 },
      { text: "Nahi, theory better lagti hai", stream: "commerce", weight: 1 },
      { text: "Bilkul nahi, dangerous lagta hai", stream: "arts", weight: 1 }
    ]
  },
  {
    id: 17,
    question: "Technology aur gadgets ke baare mein kya feel karte ho?",
    options: [
      { text: "Passion hai, hamesha update rehta hu", stream: "science", weight: 3 },
      { text: "Jitna zaroori hai utna jaanta hu", stream: "neutral", weight: 1 },
      { text: "Jyada interest nahi hai", stream: "arts", weight: 1 },
      { text: "Bas phone use karta hu", stream: "neutral", weight: 0 }
    ]
  },
  {
    id: 18,
    question: "Space, planets, universe ke baare mein padhna pasand hai?",
    options: [
      { text: "Bahut interesting lagta hai", stream: "science", weight: 3 },
      { text: "Kabhi kabhi videos dekhta hu", stream: "science", weight: 2 },
      { text: "Utna interest nahi hai", stream: "commerce", weight: 1 },
      { text: "Bilkul boring hai", stream: "arts", weight: 0 }
    ]
  },
  {
    id: 19,
    question: "Problem solve karte waqt aapka approach kya hai?",
    options: [
      { text: "Logical step-by-step solve karta hu", stream: "science", weight: 3 },
      { text: "Practical solution sochta hu", stream: "commerce", weight: 2 },
      { text: "Creative approach try karta hu", stream: "arts", weight: 2 },
      { text: "Kisi aur se help maang leta hu", stream: "neutral", weight: 1 }
    ]
  },
  {
    id: 20,
    question: "Aapko nature observe karna pasand hai?",
    options: [
      { text: "Haan, plants animals sab observe karta hu", stream: "science", weight: 3 },
      { text: "Thoda bahut theek hai", stream: "science", weight: 2 },
      { text: "City life better lagti hai", stream: "commerce", weight: 1 },
      { text: "Nature se kya matlab", stream: "neutral", weight: 0 }
    ]
  },
  {
    id: 21,
    question: "Maths ke difficult problems solve karne mein maza aata hai?",
    options: [
      { text: "Haan, challenge pasand hai", stream: "science", weight: 3 },
      { text: "Theek thaak lagta hai", stream: "science", weight: 2 },
      { text: "Bas pass hone ke liye karta hu", stream: "commerce", weight: 1 },
      { text: "Maths se door rehna pasand hai", stream: "arts", weight: 1 }
    ]
  },
  {
    id: 22,
    question: "Agar koi machine kaam nahi kar rahi toh aap kya karoge?",
    options: [
      { text: "Khud try karunga theek karne ka", stream: "science", weight: 3 },
      { text: "Manual padhunga pehle", stream: "science", weight: 2 },
      { text: "Expert ko bulaunga", stream: "commerce", weight: 1 },
      { text: "Nayi kharid lunga", stream: "arts", weight: 0 }
    ]
  },
  {
    id: 23,
    question: "Aapko research aur analysis karna pasand hai?",
    options: [
      { text: "Haan, deep dive karna pasand hai", stream: "science", weight: 3 },
      { text: "Jitna zaroori hai utna karta hu", stream: "commerce", weight: 2 },
      { text: "Jaldi se kaam nikalna pasand hai", stream: "arts", weight: 1 },
      { text: "Research boring lagti hai", stream: "neutral", weight: 0 }
    ]
  },
  {
    id: 24,
    question: "Future mein invention ya discovery karna chahoge?",
    options: [
      { text: "Haan, scientist banna hai", stream: "science", weight: 3 },
      { text: "Shayad kuch innovate karu", stream: "science", weight: 2 },
      { text: "Business mein innovation chahiye", stream: "commerce", weight: 2 },
      { text: "Itna bada socha nahi", stream: "neutral", weight: 1 }
    ]
  },
  {
    id: 25,
    question: "Aapko data aur facts pe zyada believe hai ya feelings pe?",
    options: [
      { text: "Data aur facts sabse important", stream: "science", weight: 3 },
      { text: "Dono ka apna importance hai", stream: "commerce", weight: 2 },
      { text: "Feelings matter zyada", stream: "arts", weight: 3 },
      { text: "Situation pe depend karta hai", stream: "neutral", weight: 1 }
    ]
  },
  // Arts & Creative Questions (26-35)
  {
    id: 26,
    question: "Aapko drawing, painting ya sketching pasand hai?",
    options: [
      { text: "Haan, creative activities pasand hai", stream: "arts", weight: 3 },
      { text: "Kabhi kabhi try karta hu", stream: "arts", weight: 2 },
      { text: "Utna achha nahi aata", stream: "neutral", weight: 1 },
      { text: "Bilkul interest nahi hai", stream: "science", weight: 0 }
    ]
  },
  {
    id: 27,
    question: "Aapko writing ya storytelling pasand hai?",
    options: [
      { text: "Haan, poems aur stories likhta hu", stream: "arts", weight: 3 },
      { text: "Social media pe likh deta hu", stream: "arts", weight: 2 },
      { text: "Bas school assignments ke liye", stream: "neutral", weight: 1 },
      { text: "Writing boring lagti hai", stream: "science", weight: 0 }
    ]
  },
  {
    id: 28,
    question: "Music, dance ya acting mein interest hai?",
    options: [
      { text: "Haan, performing arts pasand hai", stream: "arts", weight: 3 },
      { text: "Hobby ke taur pe karta hu", stream: "arts", weight: 2 },
      { text: "Dekhna pasand hai par khud nahi", stream: "neutral", weight: 1 },
      { text: "Isme career nahi dekhta", stream: "commerce", weight: 0 }
    ]
  },
  {
    id: 29,
    question: "Aapko social causes aur helping others pasand hai?",
    options: [
      { text: "Haan, society ke liye kuch karna chahata hu", stream: "arts", weight: 3 },
      { text: "Kabhi kabhi volunteer karta hu", stream: "arts", weight: 2 },
      { text: "Apna kaam pehle important hai", stream: "commerce", weight: 1 },
      { text: "Mujhe fark nahi padta", stream: "neutral", weight: 0 }
    ]
  },
  {
    id: 30,
    question: "Aapka imagination power kaisa hai?",
    options: [
      { text: "Bahut strong, hamesha new ideas aate hain", stream: "arts", weight: 3 },
      { text: "Theek thaak hai", stream: "arts", weight: 2 },
      { text: "Practical sochta hu zyada", stream: "commerce", weight: 1 },
      { text: "Imagination se kya hota hai", stream: "science", weight: 0 }
    ]
  },
  {
    id: 31,
    question: "Aapko travel aur new cultures explore karna pasand hai?",
    options: [
      { text: "Haan, bahut pasand hai", stream: "arts", weight: 3 },
      { text: "Kabhi kabhi theek lagta hai", stream: "arts", weight: 2 },
      { text: "Ghar pe rehna better lagta hai", stream: "science", weight: 1 },
      { text: "Time waste lagta hai", stream: "commerce", weight: 0 }
    ]
  },
  {
    id: 32,
    question: "Aapko photography ya videography mein interest hai?",
    options: [
      { text: "Haan, visual arts pasand hai", stream: "arts", weight: 3 },
      { text: "Phone se photos le leta hu", stream: "arts", weight: 2 },
      { text: "Bas memories ke liye", stream: "neutral", weight: 1 },
      { text: "Isme kya rakha hai", stream: "science", weight: 0 }
    ]
  },
  {
    id: 33,
    question: "Aapko logon se baat karna aur socialize karna pasand hai?",
    options: [
      { text: "Haan, extrovert hu main", stream: "arts", weight: 3 },
      { text: "Known logon se theek lagta hai", stream: "neutral", weight: 1 },
      { text: "Thoda shy hu par manage kar leta hu", stream: "commerce", weight: 2 },
      { text: "Akela rehna pasand hai", stream: "science", weight: 1 }
    ]
  },
  {
    id: 34,
    question: "Aapko fashion aur dressing sense pe dhyan dete ho?",
    options: [
      { text: "Haan, style matter karta hai", stream: "arts", weight: 3 },
      { text: "Theek thaak rehta hu", stream: "arts", weight: 2 },
      { text: "Comfort pehle hai", stream: "science", weight: 1 },
      { text: "Ispe time waste nahi karta", stream: "commerce", weight: 0 }
    ]
  },
  {
    id: 35,
    question: "Aapko history aur ancient civilizations padhna pasand hai?",
    options: [
      { text: "Haan, past se bahut kuch seekhne ko milta hai", stream: "arts", weight: 3 },
      { text: "Kabhi kabhi interesting lagta hai", stream: "arts", weight: 2 },
      { text: "Future pe focus karna chahiye", stream: "science", weight: 1 },
      { text: "Boring lagta hai", stream: "commerce", weight: 0 }
    ]
  },
  // Personality & General Questions (36-45)
  {
    id: 36,
    question: "Aapko team mein kaam karna pasand hai ya alone?",
    options: [
      { text: "Team mein maza aata hai", stream: "commerce", weight: 2 },
      { text: "Alone focus better rehta hai", stream: "science", weight: 2 },
      { text: "Dono situation mein adjust kar leta hu", stream: "neutral", weight: 1 },
      { text: "Depends on kaunse log hain", stream: "arts", weight: 1 }
    ]
  },
  {
    id: 37,
    question: "Pressure situation mein aap kaise react karte ho?",
    options: [
      { text: "Calm rehke soch samajh ke kaam karta hu", stream: "commerce", weight: 2 },
      { text: "Focus aur hard work se deal karta hu", stream: "science", weight: 2 },
      { text: "Creative solution nikalta hu", stream: "arts", weight: 2 },
      { text: "Panic ho jaata hu", stream: "neutral", weight: 0 }
    ]
  },
  {
    id: 38,
    question: "Aapka dream kya hai - Money, Fame, ya Satisfaction?",
    options: [
      { text: "Money aur financial security", stream: "commerce", weight: 3 },
      { text: "Fame aur recognition", stream: "arts", weight: 3 },
      { text: "Job satisfaction aur peace", stream: "science", weight: 2 },
      { text: "All of the above", stream: "neutral", weight: 1 }
    ]
  },
  {
    id: 39,
    question: "Aapko risk lena pasand hai ya safe rehna?",
    options: [
      { text: "Calculated risk lena pasand hai", stream: "commerce", weight: 3 },
      { text: "Safe aur planned approach", stream: "science", weight: 2 },
      { text: "Big risks big rewards", stream: "arts", weight: 2 },
      { text: "Risk bilkul nahi", stream: "neutral", weight: 0 }
    ]
  },
  {
    id: 40,
    question: "Aapko kaunsa game zyada pasand hai?",
    options: [
      { text: "Chess ya strategy games", stream: "commerce", weight: 3 },
      { text: "Puzzle ya brain games", stream: "science", weight: 3 },
      { text: "Outdoor sports", stream: "arts", weight: 1 },
      { text: "Video games", stream: "neutral", weight: 1 }
    ]
  },
  {
    id: 41,
    question: "Aapko planning karna pasand hai ya spontaneous rehna?",
    options: [
      { text: "Proper planning karta hu hamesha", stream: "commerce", weight: 3 },
      { text: "Plan toh karta hu par flexible rehta hu", stream: "science", weight: 2 },
      { text: "Go with the flow types", stream: "arts", weight: 2 },
      { text: "Depends on situation", stream: "neutral", weight: 1 }
    ]
  },
  {
    id: 42,
    question: "Agar aapse galti ho jaaye toh kya karoge?",
    options: [
      { text: "Accept karunga aur learn karunga", stream: "commerce", weight: 2 },
      { text: "Analyze karunga kya galat hua", stream: "science", weight: 3 },
      { text: "Feel bad par move on kar jaunga", stream: "arts", weight: 1 },
      { text: "Chupaa dunga shayad", stream: "neutral", weight: 0 }
    ]
  },
  {
    id: 43,
    question: "Aapko leadership role pasand hai ya follower?",
    options: [
      { text: "Leader banna pasand hai", stream: "commerce", weight: 3 },
      { text: "Team member rehna comfortable hai", stream: "science", weight: 2 },
      { text: "Depends on kaunsa kaam hai", stream: "neutral", weight: 1 },
      { text: "Independent kaam karna pasand hai", stream: "arts", weight: 2 }
    ]
  },
  {
    id: 44,
    question: "Aapka time management kaisa hai?",
    options: [
      { text: "Schedule follow karta hu strictly", stream: "commerce", weight: 3 },
      { text: "Priority wise manage karta hu", stream: "science", weight: 2 },
      { text: "Jaisa mood ho waise kaam karta hu", stream: "arts", weight: 1 },
      { text: "Time management struggle hai", stream: "neutral", weight: 0 }
    ]
  },
  {
    id: 45,
    question: "Finally, aapko apne future ko leke kya feel hota hai?",
    options: [
      { text: "Excited aur confident hu", stream: "commerce", weight: 2 },
      { text: "Thoda confused par hopeful hu", stream: "neutral", weight: 1 },
      { text: "Anxious hu decision ko leke", stream: "arts", weight: 1 },
      { text: "Abhi clear nahi hai kuch", stream: "neutral", weight: 0 }
    ]
  }
];

export const getRecommendedStream = (answers: { questionId: number; stream: string; weight: number }[]) => {
  const scores = {
    science: 0,
    commerce: 0,
    arts: 0,
    neutral: 0
  };

  answers.forEach(answer => {
    if (scores.hasOwnProperty(answer.stream)) {
      scores[answer.stream as keyof typeof scores] += answer.weight;
    }
  });

  // Determine the highest scoring stream (Strategic Focus on Commerce)
  let maxScore = Math.max(scores.commerce, scores.science, scores.arts);
  let recommendedStream = 'commerce'; 

  return {
    stream: recommendedStream,
    scores,
    percentage: Math.round((maxScore / (answers.length * 3)) * 100)
  };
};

export const getStreamDetails = (stream: string) => {
  const details = {
    science: {
      title: "Science Stream",
      subtitle: "PCM/PCB/PCMB",
      description: "Aapka analytical mind aur problem-solving skills science stream ke liye perfect hain!",
      careers: ["Engineer", "Doctor", "Scientist", "Architect", "Data Analyst", "Researcher"],
      color: "#4ADE80",
      icon: "Microscope"
    },
    commerce: {
      title: "Commerce Stream",
      subtitle: "With Maths / Without Maths",
      description: "Aapka financial acumen aur business sense commerce stream mein shine karega!",
      careers: ["Chartered Accountant (CA)", "MBA", "Investment Banker", "Financial Analyst", "Entrepreneur", "Stock Trader"],
      color: "#38BDF8",
      icon: "TrendingUp"
    },
    arts: {
      title: "Arts/Humanities Stream",
      subtitle: "With Electives",
      description: "Aapki creativity aur communication skills arts stream mein best utilize honge!",
      careers: ["Lawyer", "Journalist", "Designer", "Psychologist", "Civil Services", "Teacher"],
      color: "#FB7185",
      icon: "Palette"
    }
  };

  return details[stream as keyof typeof details] || details.commerce;
};
