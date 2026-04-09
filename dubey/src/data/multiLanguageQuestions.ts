export interface Answer {
  questionId: number | string;
  stream: string;
  weight: number;
}

export interface MultiLanguageQuestion {
  id: number;
  category?: string;
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
  {
    id: 1,
    category: 'commerce',
    hinglish: 'Aapko numbers aur calculations se kya lagta hai?',
    english: 'How do you feel about numbers and calculations?',
    options: [
      { hinglish: 'Maza aata hai, bahut easy lagta hai', english: 'I enjoy them, they feel very easy', stream: 'commerce', weight: 3 },
      { hinglish: 'Theek thaak hai, manage kar leta hu', english: 'They are okay, I can manage', stream: 'neutral', weight: 1 },
      { hinglish: 'Boring lagta hai bilkul', english: 'They feel completely boring', stream: 'arts', weight: 2 },
      { hinglish: 'Sirf science ke liye useful hai', english: 'They are useful only for science', stream: 'science', weight: 2 }
    ]
  },
  {
    id: 2,
    category: 'commerce',
    hinglish: 'Aap apne pocket money ko kaise manage karte ho?',
    english: 'How do you manage your pocket money?',
    options: [
      { hinglish: 'Save karta hu aur track rakhta hu', english: 'I save it and keep track of it', stream: 'commerce', weight: 3 },
      { hinglish: 'Invest soch samajh ke karta hu', english: 'I invest it carefully', stream: 'commerce', weight: 3 },
      { hinglish: 'Jaisa aaya spend kar diya', english: 'I spend it as it comes', stream: 'arts', weight: 1 },
      { hinglish: 'Mujhe pocket money nahi milti', english: 'I do not get pocket money', stream: 'neutral', weight: 0 }
    ]
  },
  {
    id: 3,
    category: 'commerce',
    hinglish: 'Business news ya stock market ke baare mein padhna pasand hai?',
    english: 'Do you enjoy reading about business news or the stock market?',
    options: [
      { hinglish: 'Haan, interesting lagta hai', english: 'Yes, it feels interesting', stream: 'commerce', weight: 3 },
      { hinglish: 'Kabhi kabhi padh leta hu', english: 'I read about it sometimes', stream: 'commerce', weight: 2 },
      { hinglish: 'Bilkul nahi, bore hota hu', english: 'Not at all, it bores me', stream: 'arts', weight: 1 },
      { hinglish: 'Sirf tech news padhta hu', english: 'I only read tech news', stream: 'science', weight: 1 }
    ]
  },
  {
    id: 4,
    category: 'commerce',
    hinglish: 'Aapko shopping karte waqt kya zyada matter karta hai?',
    english: 'What matters most to you while shopping?',
    options: [
      { hinglish: 'Price compare karna aur best deal lena', english: 'Comparing prices and getting the best deal', stream: 'commerce', weight: 3 },
      { hinglish: 'Quality dekhni chahiye bas', english: 'Only quality should matter', stream: 'science', weight: 1 },
      { hinglish: 'Jo pasand aaya wohi lena', english: 'I buy whatever I like', stream: 'arts', weight: 2 },
      { hinglish: 'Brand name matter karta hai', english: 'Brand name matters', stream: 'commerce', weight: 2 }
    ]
  },
  {
    id: 5,
    category: 'commerce',
    hinglish: 'Agar aapke paas 10,000 rupee hote toh kya karte?',
    english: 'If you had 10,000 rupees, what would you do?',
    options: [
      { hinglish: 'Save karta ya invest karta', english: 'I would save or invest it', stream: 'commerce', weight: 3 },
      { hinglish: 'Kuch business start karne mein lagata', english: 'I would use it to start a small business', stream: 'commerce', weight: 3 },
      { hinglish: 'Apne liye kuch kharidta', english: 'I would buy something for myself', stream: 'arts', weight: 1 },
      { hinglish: 'Padhai ya courses mein spend karta', english: 'I would spend it on studies or courses', stream: 'science', weight: 2 }
    ]
  },
  {
    id: 6,
    category: 'commerce',
    hinglish: 'Bank account aur interest ke baare mein kitna jaante ho?',
    english: 'How much do you know about bank accounts and interest?',
    options: [
      { hinglish: 'Bahut kuch, mujhe achhe se samajh hai', english: 'A lot, I understand it well', stream: 'commerce', weight: 3 },
      { hinglish: 'Thoda bahut idea hai', english: 'I have some idea', stream: 'commerce', weight: 2 },
      { hinglish: 'Mujhe zyada nahi pata', english: 'I do not know much', stream: 'neutral', weight: 1 },
      { hinglish: 'Isse kya matlab padhai pe dhyao do', english: 'Why bother with it, just focus on studies', stream: 'arts', weight: 0 }
    ]
  },
  {
    id: 7,
    category: 'neutral',
    hinglish: 'Aapko kis type ki movies zyada pasand hai?',
    english: 'What type of movies do you like the most?',
    options: [
      { hinglish: 'Business tycoons ki stories', english: 'Stories of business tycoons', stream: 'commerce', weight: 3 },
      { hinglish: 'Science fiction aur tech wali', english: 'Science fiction and technology-based movies', stream: 'science', weight: 3 },
      { hinglish: 'Emotional aur romantic', english: 'Emotional and romantic movies', stream: 'arts', weight: 3 },
      { hinglish: 'Comedy aur entertainment', english: 'Comedy and entertainment', stream: 'arts', weight: 1 }
    ]
  },
  {
    id: 8,
    category: 'commerce',
    hinglish: 'Agar family business ho toh aap kya karoge?',
    english: 'If there were a family business, what would you do?',
    options: [
      { hinglish: 'Join karke grow karne ki koshish karunga', english: 'I would join it and try to grow it', stream: 'commerce', weight: 3 },
      { hinglish: 'Apna kuch alag karna pasand karunga', english: 'I would prefer to do something different on my own', stream: 'science', weight: 2 },
      { hinglish: 'Dekhenge jo man karega wohi karenge', english: 'I will see and do whatever feels right then', stream: 'arts', weight: 1 },
      { hinglish: 'Job hi better lagti hai', english: 'A regular job feels better', stream: 'neutral', weight: 1 }
    ]
  },
  {
    id: 9,
    category: 'science',
    hinglish: 'Maths ke kaunse topic mein aap strong ho?',
    english: 'Which topics in mathematics are you strong in?',
    options: [
      { hinglish: 'Profit-Loss, Percentage, Interest', english: 'Profit-Loss, Percentage, and Interest', stream: 'commerce', weight: 3 },
      { hinglish: 'Algebra aur Trigonometry', english: 'Algebra and Trigonometry', stream: 'science', weight: 3 },
      { hinglish: 'Geometry aur Mensuration', english: 'Geometry and Mensuration', stream: 'science', weight: 2 },
      { hinglish: 'Maths utna pasand nahi', english: 'I do not like mathematics that much', stream: 'arts', weight: 1 }
    ]
  },
  {
    id: 10,
    category: 'neutral',
    hinglish: 'Aapko kya lagta hai, success ka key kya hai?',
    english: 'What do you think is the key to success?',
    options: [
      { hinglish: 'Smart planning aur financial management', english: 'Smart planning and financial management', stream: 'commerce', weight: 3 },
      { hinglish: 'Hard work aur knowledge', english: 'Hard work and knowledge', stream: 'science', weight: 2 },
      { hinglish: 'Creativity aur passion', english: 'Creativity and passion', stream: 'arts', weight: 3 },
      { hinglish: 'Luck aur connections', english: 'Luck and connections', stream: 'neutral', weight: 1 }
    ]
  },
  {
    id: 11,
    category: 'commerce',
    hinglish: 'Online shopping apps mein aap kya notice karte ho?',
    english: 'What do you notice on online shopping apps?',
    options: [
      { hinglish: 'Discounts aur offers', english: 'Discounts and offers', stream: 'commerce', weight: 3 },
      { hinglish: 'Product reviews aur ratings', english: 'Product reviews and ratings', stream: 'science', weight: 2 },
      { hinglish: 'Design aur looks', english: 'Design and appearance', stream: 'arts', weight: 2 },
      { hinglish: 'Bas jo chahiye wohi dekhta hu', english: 'I only look for what I need', stream: 'neutral', weight: 1 }
    ]
  },
  {
    id: 12,
    category: 'commerce',
    hinglish: 'Agar aapka dost aapse paise udhar maange toh?',
    english: 'If your friend asks to borrow money from you, what would you do?',
    options: [
      { hinglish: 'Interest rate bataunga pehle', english: 'I would first mention an interest rate', stream: 'commerce', weight: 3 },
      { hinglish: 'Kitne time mein wapas karega puchhunga', english: 'I would ask when they will return it', stream: 'commerce', weight: 2 },
      { hinglish: 'Dosti mein no calculation', english: 'There should be no calculations in friendship', stream: 'arts', weight: 1 },
      { hinglish: 'Depends on kaunsa dost hai', english: 'It depends on which friend it is', stream: 'neutral', weight: 1 }
    ]
  },
  {
    id: 13,
    category: 'neutral',
    hinglish: 'Future mein aap kis type ki job prefer karoge?',
    english: 'What type of job would you prefer in the future?',
    options: [
      { hinglish: 'Banking, Finance, CA, MBA wali', english: 'Banking, Finance, CA, or MBA-related roles', stream: 'commerce', weight: 3 },
      { hinglish: 'Doctor, Engineer, Scientist', english: 'Doctor, Engineer, or Scientist', stream: 'science', weight: 3 },
      { hinglish: 'Artist, Writer, Designer, Media', english: 'Artist, Writer, Designer, or Media roles', stream: 'arts', weight: 3 },
      { hinglish: 'Abhi decide nahi kiya', english: 'I have not decided yet', stream: 'neutral', weight: 0 }
    ]
  },
  {
    id: 14,
    category: 'neutral',
    hinglish: 'Aapko kaunsa subject zyada interesting lagta hai?',
    english: 'Which subject feels the most interesting to you?',
    options: [
      { hinglish: 'Economics aur Business Studies', english: 'Economics and Business Studies', stream: 'commerce', weight: 3 },
      { hinglish: 'Physics, Chemistry, Biology', english: 'Physics, Chemistry, and Biology', stream: 'science', weight: 3 },
      { hinglish: 'History, Geography, Literature', english: 'History, Geography, and Literature', stream: 'arts', weight: 3 },
      { hinglish: 'Maths sabse best hai', english: 'Mathematics is the best', stream: 'science', weight: 2 }
    ]
  },
  {
    id: 15,
    category: 'commerce',
    hinglish: 'Agar aapko koi business idea aaye toh?',
    english: 'If you got a business idea, what would you do?',
    options: [
      { hinglish: 'Immediately research karunga aur plan banauga', english: 'I would immediately research it and make a plan', stream: 'commerce', weight: 3 },
      { hinglish: 'Parents aur teachers se advice lunga', english: 'I would ask my parents and teachers for advice', stream: 'neutral', weight: 2 },
      { hinglish: 'Doston ke saath discuss karunga', english: 'I would discuss it with friends', stream: 'arts', weight: 1 },
      { hinglish: 'Sochunga lekin shayad action na lu', english: 'I would think about it but maybe not take action', stream: 'neutral', weight: 1 }
    ]
  },
  {
    id: 16,
    category: 'science',
    hinglish: 'Aapko experiments karna pasand hai?',
    english: 'Do you like doing experiments?',
    options: [
      { hinglish: 'Haan, lab mein rehna pasand hai', english: 'Yes, I like being in the lab', stream: 'science', weight: 3 },
      { hinglish: 'Kabhi kabhi theek lagta hai', english: 'Sometimes it feels fine', stream: 'science', weight: 2 },
      { hinglish: 'Nahi, theory better lagti hai', english: 'No, theory feels better', stream: 'commerce', weight: 1 },
      { hinglish: 'Bilkul nahi, dangerous lagta hai', english: 'Not at all, it feels dangerous', stream: 'arts', weight: 1 }
    ]
  },
  {
    id: 17,
    category: 'science',
    hinglish: 'Technology aur gadgets ke baare mein kya feel karte ho?',
    english: 'How do you feel about technology and gadgets?',
    options: [
      { hinglish: 'Passion hai, hamesha update rehta hu', english: 'It is a passion, I always stay updated', stream: 'science', weight: 3 },
      { hinglish: 'Jitna zaroori hai utna jaanta hu', english: 'I know as much as needed', stream: 'neutral', weight: 1 },
      { hinglish: 'Jyada interest nahi hai', english: 'I am not very interested', stream: 'arts', weight: 1 },
      { hinglish: 'Bas phone use karta hu', english: 'I just use my phone', stream: 'neutral', weight: 0 }
    ]
  },
  {
    id: 18,
    category: 'science',
    hinglish: 'Space, planets, universe ke baare mein padhna pasand hai?',
    english: 'Do you like reading about space, planets, and the universe?',
    options: [
      { hinglish: 'Bahut interesting lagta hai', english: 'It feels very interesting', stream: 'science', weight: 3 },
      { hinglish: 'Kabhi kabhi videos dekhta hu', english: 'I watch videos about it sometimes', stream: 'science', weight: 2 },
      { hinglish: 'Utna interest nahi hai', english: 'I am not that interested', stream: 'commerce', weight: 1 },
      { hinglish: 'Bilkul boring hai', english: 'It is completely boring', stream: 'arts', weight: 0 }
    ]
  },
  {
    id: 19,
    category: 'neutral',
    hinglish: 'Problem solve karte waqt aapka approach kya hai?',
    english: 'What is your approach when solving a problem?',
    options: [
      { hinglish: 'Logical step-by-step solve karta hu', english: 'I solve it logically step by step', stream: 'science', weight: 3 },
      { hinglish: 'Practical solution sochta hu', english: 'I think of a practical solution', stream: 'commerce', weight: 2 },
      { hinglish: 'Creative approach try karta hu', english: 'I try a creative approach', stream: 'arts', weight: 2 },
      { hinglish: 'Kisi aur se help maang leta hu', english: 'I ask someone else for help', stream: 'neutral', weight: 1 }
    ]
  },
  {
    id: 20,
    category: 'science',
    hinglish: 'Aapko nature observe karna pasand hai?',
    english: 'Do you like observing nature?',
    options: [
      { hinglish: 'Haan, plants animals sab observe karta hu', english: 'Yes, I observe plants, animals, and everything', stream: 'science', weight: 3 },
      { hinglish: 'Thoda bahut theek hai', english: 'A little, it feels fine', stream: 'science', weight: 2 },
      { hinglish: 'City life better lagti hai', english: 'City life feels better', stream: 'commerce', weight: 1 },
      { hinglish: 'Nature se kya matlab', english: 'I do not really care about nature', stream: 'neutral', weight: 0 }
    ]
  },
  {
    id: 21,
    category: 'science',
    hinglish: 'Maths ke difficult problems solve karne mein maza aata hai?',
    english: 'Do you enjoy solving difficult mathematics problems?',
    options: [
      { hinglish: 'Haan, challenge pasand hai', english: 'Yes, I like the challenge', stream: 'science', weight: 3 },
      { hinglish: 'Theek thaak lagta hai', english: 'It feels okay', stream: 'science', weight: 2 },
      { hinglish: 'Bas pass hone ke liye karta hu', english: 'I only do it to pass', stream: 'commerce', weight: 1 },
      { hinglish: 'Maths se door rehna pasand hai', english: 'I prefer staying away from mathematics', stream: 'arts', weight: 1 }
    ]
  },
  {
    id: 22,
    category: 'science',
    hinglish: 'Agar koi machine kaam nahi kar rahi toh aap kya karoge?',
    english: 'If a machine is not working, what would you do?',
    options: [
      { hinglish: 'Khud try karunga theek karne ka', english: 'I would try fixing it myself', stream: 'science', weight: 3 },
      { hinglish: 'Manual padhunga pehle', english: 'I would read the manual first', stream: 'science', weight: 2 },
      { hinglish: 'Expert ko bulaunga', english: 'I would call an expert', stream: 'commerce', weight: 1 },
      { hinglish: 'Nayi kharid lunga', english: 'I would buy a new one', stream: 'arts', weight: 0 }
    ]
  },
  {
    id: 23,
    category: 'science',
    hinglish: 'Aapko research aur analysis karna pasand hai?',
    english: 'Do you like doing research and analysis?',
    options: [
      { hinglish: 'Haan, deep dive karna pasand hai', english: 'Yes, I like going deep into topics', stream: 'science', weight: 3 },
      { hinglish: 'Jitna zaroori hai utna karta hu', english: 'I do as much as necessary', stream: 'commerce', weight: 2 },
      { hinglish: 'Jaldi se kaam nikalna pasand hai', english: 'I like finishing things quickly', stream: 'arts', weight: 1 },
      { hinglish: 'Research boring lagti hai', english: 'Research feels boring', stream: 'neutral', weight: 0 }
    ]
  },
  {
    id: 24,
    category: 'science',
    hinglish: 'Future mein invention ya discovery karna chahoge?',
    english: 'Would you like to make an invention or discovery in the future?',
    options: [
      { hinglish: 'Haan, scientist banna hai', english: 'Yes, I want to become a scientist', stream: 'science', weight: 3 },
      { hinglish: 'Shayad kuch innovate karu', english: 'Maybe I will innovate something', stream: 'science', weight: 2 },
      { hinglish: 'Business mein innovation chahiye', english: 'Innovation is needed in business too', stream: 'commerce', weight: 2 },
      { hinglish: 'Itna bada socha nahi', english: 'I have not thought that big yet', stream: 'neutral', weight: 1 }
    ]
  },
  {
    id: 25,
    category: 'neutral',
    hinglish: 'Aapko data aur facts pe zyada believe hai ya feelings pe?',
    english: 'Do you believe more in data and facts or in feelings?',
    options: [
      { hinglish: 'Data aur facts sabse important', english: 'Data and facts are the most important', stream: 'science', weight: 3 },
      { hinglish: 'Dono ka apna importance hai', english: 'Both have their own importance', stream: 'commerce', weight: 2 },
      { hinglish: 'Feelings matter zyada', english: 'Feelings matter more', stream: 'arts', weight: 3 },
      { hinglish: 'Situation pe depend karta hai', english: 'It depends on the situation', stream: 'neutral', weight: 1 }
    ]
  },
  {
    id: 26,
    category: 'arts',
    hinglish: 'Aapko drawing, painting ya sketching pasand hai?',
    english: 'Do you like drawing, painting, or sketching?',
    options: [
      { hinglish: 'Haan, creative activities pasand hai', english: 'Yes, I like creative activities', stream: 'arts', weight: 3 },
      { hinglish: 'Kabhi kabhi try karta hu', english: 'I try it sometimes', stream: 'arts', weight: 2 },
      { hinglish: 'Utna achha nahi aata', english: 'I am not very good at it', stream: 'neutral', weight: 1 },
      { hinglish: 'Bilkul interest nahi hai', english: 'I have no interest in it at all', stream: 'science', weight: 0 }
    ]
  },
  {
    id: 27,
    category: 'arts',
    hinglish: 'Aapko writing ya storytelling pasand hai?',
    english: 'Do you like writing or storytelling?',
    options: [
      { hinglish: 'Haan, poems aur stories likhta hu', english: 'Yes, I write poems and stories', stream: 'arts', weight: 3 },
      { hinglish: 'Social media pe likh deta hu', english: 'I write on social media sometimes', stream: 'arts', weight: 2 },
      { hinglish: 'Bas school assignments ke liye', english: 'Only for school assignments', stream: 'neutral', weight: 1 },
      { hinglish: 'Writing boring lagti hai', english: 'Writing feels boring', stream: 'science', weight: 0 }
    ]
  },
  {
    id: 28,
    category: 'arts',
    hinglish: 'Music, dance ya acting mein interest hai?',
    english: 'Are you interested in music, dance, or acting?',
    options: [
      { hinglish: 'Haan, performing arts pasand hai', english: 'Yes, I like performing arts', stream: 'arts', weight: 3 },
      { hinglish: 'Hobby ke taur pe karta hu', english: 'I do it as a hobby', stream: 'arts', weight: 2 },
      { hinglish: 'Dekhna pasand hai par khud nahi', english: 'I like watching it, but not doing it myself', stream: 'neutral', weight: 1 },
      { hinglish: 'Isme career nahi dekhta', english: 'I do not see a career in it', stream: 'commerce', weight: 0 }
    ]
  },
  {
    id: 29,
    category: 'arts',
    hinglish: 'Aapko social causes aur helping others pasand hai?',
    english: 'Do you care about social causes and helping others?',
    options: [
      { hinglish: 'Haan, society ke liye kuch karna chahata hu', english: 'Yes, I want to do something for society', stream: 'arts', weight: 3 },
      { hinglish: 'Kabhi kabhi volunteer karta hu', english: 'I volunteer sometimes', stream: 'arts', weight: 2 },
      { hinglish: 'Apna kaam pehle important hai', english: 'My own work comes first', stream: 'commerce', weight: 1 },
      { hinglish: 'Mujhe fark nahi padta', english: 'It does not really matter to me', stream: 'neutral', weight: 0 }
    ]
  },
  {
    id: 30,
    category: 'arts',
    hinglish: 'Aapka imagination power kaisa hai?',
    english: 'How strong is your imagination?',
    options: [
      { hinglish: 'Bahut strong, hamesha new ideas aate hain', english: 'Very strong, I keep getting new ideas', stream: 'arts', weight: 3 },
      { hinglish: 'Theek thaak hai', english: 'It is decent', stream: 'arts', weight: 2 },
      { hinglish: 'Practical sochta hu zyada', english: 'I think more practically', stream: 'commerce', weight: 1 },
      { hinglish: 'Imagination se kya hota hai', english: 'What is the use of imagination anyway', stream: 'science', weight: 0 }
    ]
  },
  {
    id: 31,
    category: 'arts',
    hinglish: 'Aapko travel aur new cultures explore karna pasand hai?',
    english: 'Do you like travelling and exploring new cultures?',
    options: [
      { hinglish: 'Haan, bahut pasand hai', english: 'Yes, I love it', stream: 'arts', weight: 3 },
      { hinglish: 'Kabhi kabhi theek lagta hai', english: 'Sometimes it feels nice', stream: 'arts', weight: 2 },
      { hinglish: 'Ghar pe rehna better lagta hai', english: 'Staying at home feels better', stream: 'science', weight: 1 },
      { hinglish: 'Time waste lagta hai', english: 'It feels like a waste of time', stream: 'commerce', weight: 0 }
    ]
  },
  {
    id: 32,
    category: 'arts',
    hinglish: 'Aapko photography ya videography mein interest hai?',
    english: 'Are you interested in photography or videography?',
    options: [
      { hinglish: 'Haan, visual arts pasand hai', english: 'Yes, I like visual arts', stream: 'arts', weight: 3 },
      { hinglish: 'Phone se photos le leta hu', english: 'I take photos on my phone', stream: 'arts', weight: 2 },
      { hinglish: 'Bas memories ke liye', english: 'Only for memories', stream: 'neutral', weight: 1 },
      { hinglish: 'Isme kya rakha hai', english: 'I do not think there is much in it', stream: 'science', weight: 0 }
    ]
  },
  {
    id: 33,
    category: 'arts',
    hinglish: 'Aapko logon se baat karna aur socialize karna pasand hai?',
    english: 'Do you enjoy talking to people and socializing?',
    options: [
      { hinglish: 'Haan, extrovert hu main', english: 'Yes, I am an extrovert', stream: 'arts', weight: 3 },
      { hinglish: 'Known logon se theek lagta hai', english: 'I am comfortable with people I know', stream: 'neutral', weight: 1 },
      { hinglish: 'Thoda shy hu par manage kar leta hu', english: 'I am a little shy, but I manage', stream: 'commerce', weight: 2 },
      { hinglish: 'Akela rehna pasand hai', english: 'I prefer being alone', stream: 'science', weight: 1 }
    ]
  },
  {
    id: 34,
    category: 'arts',
    hinglish: 'Aapko fashion aur dressing sense pe dhyan dete ho?',
    english: 'Do you pay attention to fashion and dressing sense?',
    options: [
      { hinglish: 'Haan, style matter karta hai', english: 'Yes, style matters', stream: 'arts', weight: 3 },
      { hinglish: 'Theek thaak rehta hu', english: 'I keep it decent', stream: 'arts', weight: 2 },
      { hinglish: 'Comfort pehle hai', english: 'Comfort comes first', stream: 'science', weight: 1 },
      { hinglish: 'Ispe time waste nahi karta', english: 'I do not waste time on it', stream: 'commerce', weight: 0 }
    ]
  },
  {
    id: 35,
    category: 'arts',
    hinglish: 'Aapko history aur ancient civilizations padhna pasand hai?',
    english: 'Do you like reading about history and ancient civilizations?',
    options: [
      { hinglish: 'Haan, past se bahut kuch seekhne ko milta hai', english: 'Yes, there is a lot to learn from the past', stream: 'arts', weight: 3 },
      { hinglish: 'Kabhi kabhi interesting lagta hai', english: 'Sometimes it feels interesting', stream: 'arts', weight: 2 },
      { hinglish: 'Future pe focus karna chahiye', english: 'We should focus on the future', stream: 'science', weight: 1 },
      { hinglish: 'Boring lagta hai', english: 'It feels boring', stream: 'commerce', weight: 0 }
    ]
  },
  {
    id: 36,
    category: 'neutral',
    hinglish: 'Aapko team mein kaam karna pasand hai ya alone?',
    english: 'Do you prefer working in a team or alone?',
    options: [
      { hinglish: 'Team mein maza aata hai', english: 'I enjoy working in a team', stream: 'commerce', weight: 2 },
      { hinglish: 'Alone focus better rehta hai', english: 'I focus better alone', stream: 'science', weight: 2 },
      { hinglish: 'Dono situation mein adjust kar leta hu', english: 'I can adjust in both situations', stream: 'neutral', weight: 1 },
      { hinglish: 'Depends on kaunse log hain', english: 'It depends on the people involved', stream: 'arts', weight: 1 }
    ]
  },
  {
    id: 37,
    category: 'neutral',
    hinglish: 'Pressure situation mein aap kaise react karte ho?',
    english: 'How do you react in pressure situations?',
    options: [
      { hinglish: 'Calm rehke soch samajh ke kaam karta hu', english: 'I stay calm and act thoughtfully', stream: 'commerce', weight: 2 },
      { hinglish: 'Focus aur hard work se deal karta hu', english: 'I deal with it through focus and hard work', stream: 'science', weight: 2 },
      { hinglish: 'Creative solution nikalta hu', english: 'I come up with a creative solution', stream: 'arts', weight: 2 },
      { hinglish: 'Panic ho jaata hu', english: 'I panic', stream: 'neutral', weight: 0 }
    ]
  },
  {
    id: 38,
    category: 'neutral',
    hinglish: 'Aapka dream kya hai - Money, Fame, ya Satisfaction?',
    english: 'What is your dream: money, fame, or satisfaction?',
    options: [
      { hinglish: 'Money aur financial security', english: 'Money and financial security', stream: 'commerce', weight: 3 },
      { hinglish: 'Fame aur recognition', english: 'Fame and recognition', stream: 'arts', weight: 3 },
      { hinglish: 'Job satisfaction aur peace', english: 'Job satisfaction and peace', stream: 'science', weight: 2 },
      { hinglish: 'All of the above', english: 'All of the above', stream: 'neutral', weight: 1 }
    ]
  },
  {
    id: 39,
    category: 'neutral',
    hinglish: 'Aapko risk lena pasand hai ya safe rehna?',
    english: 'Do you like taking risks or staying safe?',
    options: [
      { hinglish: 'Calculated risk lena pasand hai', english: 'I like taking calculated risks', stream: 'commerce', weight: 3 },
      { hinglish: 'Safe aur planned approach', english: 'I prefer a safe and planned approach', stream: 'science', weight: 2 },
      { hinglish: 'Big risks big rewards', english: 'Big risks bring big rewards', stream: 'arts', weight: 2 },
      { hinglish: 'Risk bilkul nahi', english: 'I do not like risk at all', stream: 'neutral', weight: 0 }
    ]
  },
  {
    id: 40,
    category: 'neutral',
    hinglish: 'Aapko kaunsa game zyada pasand hai?',
    english: 'Which type of game do you like the most?',
    options: [
      { hinglish: 'Chess ya strategy games', english: 'Chess or strategy games', stream: 'commerce', weight: 3 },
      { hinglish: 'Puzzle ya brain games', english: 'Puzzle or brain games', stream: 'science', weight: 3 },
      { hinglish: 'Outdoor sports', english: 'Outdoor sports', stream: 'arts', weight: 1 },
      { hinglish: 'Video games', english: 'Video games', stream: 'neutral', weight: 1 }
    ]
  },
  {
    id: 41,
    category: 'neutral',
    hinglish: 'Aapko planning karna pasand hai ya spontaneous rehna?',
    english: 'Do you like planning or being spontaneous?',
    options: [
      { hinglish: 'Proper planning karta hu hamesha', english: 'I always do proper planning', stream: 'commerce', weight: 3 },
      { hinglish: 'Plan toh karta hu par flexible rehta hu', english: 'I plan, but I stay flexible', stream: 'science', weight: 2 },
      { hinglish: 'Go with the flow types', english: 'I go with the flow', stream: 'arts', weight: 2 },
      { hinglish: 'Depends on situation', english: 'It depends on the situation', stream: 'neutral', weight: 1 }
    ]
  },
  {
    id: 42,
    category: 'neutral',
    hinglish: 'Agar aapse galti ho jaaye toh kya karoge?',
    english: 'If you make a mistake, what would you do?',
    options: [
      { hinglish: 'Accept karunga aur learn karunga', english: 'I will accept it and learn from it', stream: 'commerce', weight: 2 },
      { hinglish: 'Analyze karunga kya galat hua', english: 'I will analyze what went wrong', stream: 'science', weight: 3 },
      { hinglish: 'Feel bad par move on kar jaunga', english: 'I will feel bad but move on', stream: 'arts', weight: 1 },
      { hinglish: 'Chupaa dunga shayad', english: 'I might hide it', stream: 'neutral', weight: 0 }
    ]
  },
  {
    id: 43,
    category: 'neutral',
    hinglish: 'Aapko leadership role pasand hai ya follower?',
    english: 'Do you like leadership roles or being a follower?',
    options: [
      { hinglish: 'Leader banna pasand hai', english: 'I like being a leader', stream: 'commerce', weight: 3 },
      { hinglish: 'Team member rehna comfortable hai', english: 'I am comfortable being a team member', stream: 'science', weight: 2 },
      { hinglish: 'Depends on kaunsa kaam hai', english: 'It depends on the kind of work', stream: 'neutral', weight: 1 },
      { hinglish: 'Independent kaam karna pasand hai', english: 'I like working independently', stream: 'arts', weight: 2 }
    ]
  },
  {
    id: 44,
    category: 'neutral',
    hinglish: 'Aapka time management kaisa hai?',
    english: 'How is your time management?',
    options: [
      { hinglish: 'Schedule follow karta hu strictly', english: 'I follow a schedule strictly', stream: 'commerce', weight: 3 },
      { hinglish: 'Priority wise manage karta hu', english: 'I manage it based on priorities', stream: 'science', weight: 2 },
      { hinglish: 'Jaisa mood ho waise kaam karta hu', english: 'I work according to my mood', stream: 'arts', weight: 1 },
      { hinglish: 'Time management struggle hai', english: 'Time management is a struggle for me', stream: 'neutral', weight: 0 }
    ]
  },
  {
    id: 45,
    category: 'neutral',
    hinglish: 'Finally, aapko apne future ko leke kya feel hota hai?',
    english: 'Finally, how do you feel about your future?',
    options: [
      { hinglish: 'Excited aur confident hu', english: 'I feel excited and confident', stream: 'commerce', weight: 2 },
      { hinglish: 'Thoda confused par hopeful hu', english: 'I am a little confused but hopeful', stream: 'neutral', weight: 1 },
      { hinglish: 'Anxious hu decision ko leke', english: 'I feel anxious about the decision', stream: 'arts', weight: 1 },
      { hinglish: 'Abhi clear nahi hai kuch', english: 'Nothing is clear yet', stream: 'neutral', weight: 0 }
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

export function getRecommendedStream(answers: Answer[], questionsPool?: any[]): {
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

  // Use provided questions pool or fallback to static array
  const questionsToSearch = questionsPool && questionsPool.length > 0 ? questionsPool : multiLanguageQuestions;

  for (const answer of answers) {
    const question = questionsToSearch.find((q) => String(q.id) === String(answer.questionId));
    if (question) {
      const option = question.options.find((opt: any) => opt.stream === answer.stream);
      if (option) {
        streamScores[option.stream] += option.weight;
      }
    }
  }

  // Neutral responses should push towards commerce
  streamScores.commerce += streamScores.neutral;

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
