export interface Answer {
  questionId: number;
  stream: string;
  weight: number;
}

export interface MultiLanguageQuestion {
  id: number;
  hinglish: string;
  english: string;
  options: {
    hinglish: string;
    english: string;
    stream: 'science' | 'commerce' | 'arts' | 'neutral';
    weight: number;
  }[];
}

export const multiLanguageQuestions: MultiLanguageQuestion[] = [
  // Finance & Commerce Focused Questions (1-15)
  {
    id: 1,
    hinglish: "Aapko numbers aur calculations se kya lagta hai?",
    english: "How do you feel about numbers and calculations?",
    options: [
      { hinglish: "Maza aata hai, bahut easy lagta hai", english: "I enjoy it, it feels easy", stream: "commerce", weight: 3 },
      { hinglish: "Theek thaak hai, manage kar leta hu", english: "It's okay, I can manage", stream: "neutral", weight: 1 },
      { hinglish: "Boring lagta hai bilkul", english: "It feels completely boring", stream: "arts", weight: 2 },
      { hinglish: "Sirf science ke liye useful hai", english: "Only useful for science", stream: "science", weight: 2 }
    ]
  },
  {
    id: 2,
    hinglish: "Aap apne pocket money ko kaise manage karte ho?",
    english: "How do you manage your pocket money?",
    options: [
      { hinglish: "Save karta hu aur track rakhta hu", english: "I save and track it", stream: "commerce", weight: 3 },
      { hinglish: "Invest soch samajh ke karta hu", english: "I carefully invest it", stream: "commerce", weight: 3 },
      { hinglish: "Jaisa aaya spend kar diya", english: "I spend it as soon as I get it", stream: "arts", weight: 1 },
      { hinglish: "Mujhe pocket money nahi milti", english: "I don't get pocket money", stream: "neutral", weight: 0 }
    ]
  },
  {
    id: 3,
    hinglish: "Business news ya stock market ke baare mein padhna pasand hai?",
    english: "Do you enjoy reading about business news or stock market?",
    options: [
      { hinglish: "Haan, interesting lagta hai", english: "Yes, it's interesting", stream: "commerce", weight: 3 },
      { hinglish: "Kabhi kabhi padh leta hu", english: "Sometimes I read about it", stream: "commerce", weight: 2 },
      { hinglish: "Bilkul nahi, bore hota hu", english: "Not at all, it bores me", stream: "arts", weight: 1 },
      { hinglish: "Sirf tech news padhta hu", english: "I only read tech news", stream: "science", weight: 1 }
    ]
  },
  {
    id: 4,
    hinglish: "Aapko shopping karte waqt kya zyada matter karta hai?",
    english: "What matters most to you while shopping?",
    options: [
      { hinglish: "Price compare karna aur best deal lena", english: "Comparing prices and getting the best deal", stream: "commerce", weight: 3 },
      { hinglish: "Quality dekhni chahiye bas", english: "Quality is all that matters", stream: "science", weight: 1 },
      { hinglish: "Jo pasand aaya wohi lena", english: "I buy what I like", stream: "arts", weight: 2 },
      { hinglish: "Brand name matter karta hai", english: "Brand name matters", stream: "commerce", weight: 2 }
    ]
  },
  {
    id: 5,
    hinglish: "Agar aapke paas 10,000 rupee hote toh kya karte?",
    english: "If you had 10,000 rupees, what would you do?",
    options: [
      { hinglish: "Save karta ya invest karta", english: "I would save or invest it", stream: "commerce", weight: 3 },
      { hinglish: "Kuch business start karne mein lagata", english: "I would start a small business", stream: "commerce", weight: 3 },
      { hinglish: "Apne liye kuch kharidta", english: "I would buy something for myself", stream: "arts", weight: 1 },
      { hinglish: "Padhai ya courses mein spend karta", english: "I would spend it on studies or courses", stream: "science", weight: 2 }
    ]
  },
  {
    id: 6,
    hinglish: "Bank account aur interest ke baare mein kitna jaante ho?",
    english: "How much do you know about bank accounts and interest?",
    options: [
      { hinglish: "Bahut kuch, mujhe achhe se samajh hai", english: "A lot, I understand it well", stream: "commerce", weight: 3 },
      { hinglish: "Thoda bahut idea hai", english: "I have some idea", stream: "commerce", weight: 2 },
      { hinglish: "Mujhe zyada nahi pata", english: "I don't know much", stream: "neutral", weight: 1 },
      { hinglish: "Isse kya matlab padhai pe dhyao do", english: "Why bother, focus on studies", stream: "arts", weight: 0 }
    ]
  },
  {
    id: 7,
    hinglish: "Aapko kis type ki movies zyada pasand hai?",
    english: "What type of movies do you prefer?",
    options: [
      { hinglish: "Business tycoons ki stories", english: "Business tycoon stories", stream: "commerce", weight: 3 },
      { hinglish: "Science fiction aur tech wali", english: "Science fiction and tech", stream: "science", weight: 3 },
      { hinglish: "Emotional aur romantic", english: "Emotional and romantic", stream: "arts", weight: 3 },
      { hinglish: "Comedy aur entertainment", english: "Comedy and entertainment", stream: "arts", weight: 1 }
    ]
  },
  {
    id: 8,
    hinglish: "Agar family business ho toh aap kya karoge?",
    english: "If there was a family business, what would you do?",
    options: [
      { hinglish: "Join karke grow karne ki koshish karunga", english: "I would join and try to grow it", stream: "commerce", weight: 3 },
      { hinglish: "Apna kuch alag karna pasand karunga", english: "I would prefer to do something different", stream: "science", weight: 2 },
      { hinglish: "Dekhenge jo man karega wohi karenge", english: "I'll see what feels right", stream: "arts", weight: 1 },
      { hinglish: "Job hi better lagti hai", english: "A regular job seems better", stream: "neutral", weight: 1 }
    ]
  },
  {
    id: 9,
    hinglish: "Maths ke kaunse topic mein aap strong ho?",
    english: "Which math topics are you strong in?",
    options: [
      { hinglish: "Profit-Loss, Percentage, Interest", english: "Profit-Loss, Percentage, Interest", stream: "commerce", weight: 3 },
      { hinglish: "Algebra aur Trigonometry", english: "Algebra and Trigonometry", stream: "science", weight: 3 },
      { hinglish: "Geometry aur Mensuration", english: "Geometry and Mensuration", stream: "science", weight: 2 },
      { hinglish: "Maths utna pasand nahi", english: "I don't like math much", stream: "arts", weight: 1 }
    ]
  },
  {
    id: 10,
    hinglish: "Aapko kya lagta hai, success ka key kya hai?",
    english: "What do you think is the key to success?",
    options: [
      { hinglish: "Smart planning aur financial management", english: "Smart planning and financial management", stream: "commerce", weight: 3 },
      { hinglish: "Hard work aur knowledge", english: "Hard work and knowledge", stream: "science", weight: 2 },
      { hinglish: "Creativity aur passion", english: "Creativity and passion", stream: "arts", weight: 3 },
      { hinglish: "Luck aur connections", english: "Luck and connections", stream: "neutral", weight: 1 }
    ]
  },
  {
    id: 11,
    hinglish: "Online shopping apps mein aap kya notice karte ho?",
    english: "What do you notice in online shopping apps?",
    options: [
      { hinglish: "Discounts aur offers", english: "Discounts and offers", stream: "commerce", weight: 3 },
      { hinglish: "Product reviews aur ratings", english: "Product reviews and ratings", stream: "science", weight: 2 },
      { hinglish: "Design aur looks", english: "Design and appearance", stream: "arts", weight: 2 },
      { hinglish: "Bas jo chahiye wohi dekhta hu", english: "I just look for what I need", stream: "neutral", weight: 1 }
    ]
  },
  {
    id: 12,
    hinglish: "Agar aapka dost aapse paise udhar maange toh?",
    english: "If your friend asks to borrow money from you?",
    options: [
      { hinglish: "Interest rate bataunga pehle", english: "I would mention the interest rate first", stream: "commerce", weight: 3 },
      { hinglish: "Kitne time mein wapas karega puchhunga", english: "I would ask when they'll return it", stream: "commerce", weight: 2 },
      { hinglish: "Dosti mein no calculation", english: "No calculations in friendship", stream: "arts", weight: 1 },
      { hinglish: "Depends on kaunsa dost hai", english: "Depends on which friend", stream: "neutral", weight: 1 }
    ]
  },
  {
    id: 13,
    hinglish: "Future mein aap kis type ki job prefer karoge?",
    english: "What type of job do you prefer in the future?",
    options: [
      { hinglish: "Banking, Finance, CA, MBA wali", english: "Banking, Finance, CA, or MBA", stream: "commerce", weight: 3 },
      { hinglish: "Doctor, Engineer, Scientist", english: "Doctor, Engineer, or Scientist", stream: "science", weight: 3 },
      { hinglish: "Artist, Writer, Designer, Media", english: "Artist, Writer, Designer, or Media", stream: "arts", weight: 3 },
      { hinglish: "Abhi decide nahi kiya", english: "Haven't decided yet", stream: "neutral", weight: 0 }
    ]
  },
  {
    id: 14,
    hinglish: "Aapko kaunsa subject zyada interesting lagta hai?",
    english: "Which subject interests you the most?",
    options: [
      { hinglish: "Economics aur Business Studies", english: "Economics and Business Studies", stream: "commerce", weight: 3 },
      { hinglish: "Physics, Chemistry, Biology", english: "Physics, Chemistry, Biology", stream: "science", weight: 3 },
      { hinglish: "History, Geography, Literature", english: "History, Geography, Literature", stream: "arts", weight: 3 },
      { hinglish: "Maths sabse best hai", english: "Math is the best", stream: "science", weight: 2 }
    ]
  },
  {
    id: 15,
    hinglish: "Agar aapko koi business idea aaye toh?",
    english: "If you get a business idea?",
    options: [
      { hinglish: "Immediately research karunga aur plan banauga", english: "I would immediately research and plan", stream: "commerce", weight: 3 },
      { hinglish: "Parents aur teachers se advice lunga", english: "I would ask parents and teachers", stream: "neutral", weight: 2 },
      { hinglish: "Doston ke saath discuss karunga", english: "I would discuss with friends", stream: "arts", weight: 1 },
      { hinglish: "Sochunga lekin shayad action na lu", english: "I would think but maybe not act", stream: "neutral", weight: 1 }
    ]
  },
  // Science Focused Questions (16-25)
  {
    id: 16,
    hinglish: "Aapko experiments karna pasand hai?",
    english: "Do you enjoy doing experiments?",
    options: [
      { hinglish: "Haan, lab mein rehna pasand hai", english: "Yes, I enjoy being in the lab", stream: "science", weight: 3 },
      { hinglish: "Kabhi kabhi theek lagta hai", english: "Sometimes it's okay", stream: "science", weight: 2 },
      { hinglish: "Nahi, theory better lagti hai", english: "No, theory is better", stream: "commerce", weight: 1 },
      { hinglish: "Bilkul nahi, dangerous lagta hai", english: "Not at all, it seems dangerous", stream: "arts", weight: 1 }
    ]
  },
  {
    id: 17,
    hinglish: "Technology aur gadgets ke baare mein kya feel karte ho?",
    english: "What's your feeling about technology and gadgets?",
    options: [
      { hinglish: "Passion hai, hamesha update rehta hu", english: "I'm passionate and always updated", stream: "science", weight: 3 },
      { hinglish: "Jitna zaroori hai utna jaanta hu", english: "I know what's necessary", stream: "neutral", weight: 1 },
      { hinglish: "Jyada interest nahi hai", english: "Not much interest", stream: "arts", weight: 1 },
      { hinglish: "Bas phone use karta hu", english: "I just use my phone", stream: "neutral", weight: 0 }
    ]
  },
  {
    id: 18,
    hinglish: "Space, planets, universe ke baare mein padhna pasand hai?",
    english: "Do you enjoy reading about space, planets, and the universe?",
    options: [
      { hinglish: "Bahut interesting lagta hai", english: "Very interesting", stream: "science", weight: 3 },
      { hinglish: "Kabhi kabhi videos dekhta hu", english: "I sometimes watch videos", stream: "science", weight: 2 },
      { hinglish: "Utna interest nahi hai", english: "Not much interest", stream: "commerce", weight: 1 },
      { hinglish: "Bilkul boring hai", english: "Completely boring", stream: "arts", weight: 0 }
    ]
  },
  {
    id: 19,
    hinglish: "Aapko coding ya programming mein interest hai?",
    english: "Are you interested in coding or programming?",
    options: [
      { hinglish: "Haan, career banana chahta hu", english: "Yes, I want to make it a career", stream: "science", weight: 3 },
      { hinglish: "Learning phase mein hu", english: "I'm in the learning phase", stream: "science", weight: 2 },
      { hinglish: "Thoda try kiya but difficult laga", english: "I tried but found it difficult", stream: "neutral", weight: 1 },
      { hinglish: "Bilkul nahi, too complicated", english: "Not at all, too complicated", stream: "arts", weight: 0 }
    ]
  },
  {
    id: 20,
    hinglish: "Chemical reactions aur elements ke baare mein samajhna pasand hai?",
    english: "Do you enjoy understanding chemical reactions and elements?",
    options: [
      { hinglish: "Bahut, fascinated hu", english: "Very much, I'm fascinated", stream: "science", weight: 3 },
      { hinglish: "Theek hai, samajh aata hai", english: "It's okay, I understand", stream: "science", weight: 2 },
      { hinglish: "Utna pasand nahi", english: "Not really", stream: "commerce", weight: 1 },
      { hinglish: "Bilkul confusing hai", english: "It's confusing", stream: "arts", weight: 0 }
    ]
  },
  // Arts/Humanities Focused (21-30)
  {
    id: 21,
    hinglish: "Aapko creative work karna pasand hai?",
    english: "Do you enjoy doing creative work?",
    options: [
      { hinglish: "Haan, music, art, writing sab", english: "Yes, music, art, writing everything", stream: "arts", weight: 3 },
      { hinglish: "Kabhi kabhi kuch likhta/banata hu", english: "Sometimes I write or create", stream: "arts", weight: 2 },
      { hinglish: "Utna pasand nahi", english: "Not much", stream: "science", weight: 1 },
      { hinglish: "Nahi, bohot time waste lagta hai", english: "No, seems like time waste", stream: "commerce", weight: 0 }
    ]
  },
  {
    id: 22,
    hinglish: "History aur social topics padhne mein kya lagta hai?",
    english: "What do you think about reading history and social topics?",
    options: [
      { hinglish: "Bahut interesting, seekhna pasand hai", english: "Very interesting, I enjoy learning", stream: "arts", weight: 3 },
      { hinglish: "Theek hai pareeksha ke liye zaroori", english: "It's okay, needed for exams", stream: "arts", weight: 2 },
      { hinglish: "Utna pasand nahi", english: "Not much interest", stream: "science", weight: 1 },
      { hinglish: "Bilkul nahi, boring", english: "Not at all, boring", stream: "commerce", weight: 0 }
    ]
  },
  {
    id: 23,
    hinglish: "Movies, books, ya stories ke baare mein discuss karna pasand hai?",
    english: "Do you enjoy discussing movies, books, or stories?",
    options: [
      { hinglish: "Haan, sab ko sunna pasand hai", english: "Yes, I love listening to everyone", stream: "arts", weight: 3 },
      { hinglish: "Kabhi kabhi karte hain", english: "Sometimes I do", stream: "arts", weight: 2 },
      { hinglish: "Time waste lagta hai", english: "Seems like time waste", stream: "science", weight: 1 },
      { hinglish: "Bilkul nahi", english: "Not at all", stream: "commerce", weight: 0 }
    ]
  },
  {
    id: 24,
    hinglish: "Aapko kis subject se sabhi topics interesting lagte hain?",
    english: "Which subject makes all topics interesting to you?",
    options: [
      { hinglish: "Literature ya Languages", english: "Literature or Languages", stream: "arts", weight: 3 },
      { hinglish: "Science ke sare topics", english: "All science topics", stream: "science", weight: 3 },
      { hinglish: "Business aur Economics", english: "Business and Economics", stream: "commerce", weight: 3 },
      { hinglish: "Kuch bhi zyada nahi", english: "Nothing particularly", stream: "neutral", weight: 1 }
    ]
  },
  {
    id: 25,
    hinglish: "Future mein aap kaunsi stream lena pasand karoge?",
    english: "Which stream would you prefer in the future?",
    options: [
      { hinglish: "Commerce - modern career options", english: "Commerce - modern career options", stream: "commerce", weight: 3 },
      { hinglish: "Science - technical path", english: "Science - technical path", stream: "science", weight: 3 },
      { hinglish: "Arts - creative freedom", english: "Arts - creative freedom", stream: "arts", weight: 3 },
      { hinglish: "Information nahi - baad mein sochenge", english: "Unsure - will think later", stream: "neutral", weight: 0 }
    ]
  }
];

export function getQuestionByLanguage(language: 'hinglish' | 'english'): any[] {
  return multiLanguageQuestions.map((q) => ({
    id: q.id,
    question: language === 'hinglish' ? q.hinglish : q.english,
    options: q.options.map((opt) => ({
      text: language === 'hinglish' ? opt.hinglish : opt.english,
      stream: opt.stream,
      weight: opt.weight
    }))
  }));
}

export function getRecommendedStream(answers: Answer[]): {
  stream: 'science' | 'commerce' | 'arts';
  scores: { science: number; commerce: number; arts: number; neutral: number };
  percentage: number;
} {
  const streamScores: Record<string, number> = {
    commerce: 0,
    science: 0,
    arts: 0,
    neutral: 0
  };

  for (const answer of answers) {
    const question = multiLanguageQuestions.find((q) => q.id === answer.questionId);
    if (question) {
      const option = question.options.find((opt) => opt.stream === answer.stream);
      if (option) {
        streamScores[option.stream] += option.weight;
      }
    }
  }

  const rankedStreams: Array<'science' | 'commerce' | 'arts'> = ['science', 'commerce', 'arts'];
  rankedStreams.sort((a, b) => streamScores[b] - streamScores[a]);
  const recommendedStream = rankedStreams[0] ?? 'commerce';
  const maxScore = Math.max(streamScores.commerce, streamScores.science, streamScores.arts);

  return {
    stream: recommendedStream,
    scores: streamScores as { science: number; commerce: number; arts: number; neutral: number },
    percentage: Math.round((maxScore / (answers.length * 3)) * 100)
  };
}
