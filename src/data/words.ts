import { WordItem, StageInfo } from '../types';

export const VOCABULARY_WORDS: WordItem[] = [
  {
    id: 'princess',
    english: 'Princess',
    hebrew: 'נסיכה',
    phonetic: 'פְּרִינְסֶס',
    emoji: '👸',
    exampleSentence: 'The princess lives in a beautiful castle.',
    sentenceHebrew: 'הנסיכה גרה בטירה יפהפייה.',
  },
  {
    id: 'cow',
    english: 'Cow',
    hebrew: 'פרה',
    phonetic: 'קָאוּ',
    emoji: '🐄',
    exampleSentence: 'The friendly cow gives fresh milk.',
    sentenceHebrew: 'הפרה הידידותית נותנת חלב טרי.',
  },
  {
    id: 'man',
    english: 'Man',
    hebrew: 'איש / גבר',
    phonetic: 'מֶאן',
    emoji: '👨',
    exampleSentence: 'The tall man is very nice and helpful.',
    sentenceHebrew: 'האיש הגבוה נחמד ועוזר מאוד.',
  },
  {
    id: 'think',
    english: 'Think',
    hebrew: 'לחשוב',
    phonetic: "תִ'ינְק",
    emoji: '🧠',
    exampleSentence: 'I think English is fun and easy to learn.',
    sentenceHebrew: 'אני חושב/ת שאנגלית זה כיף וקל ללמידה.',
  },
  {
    id: 'teacher',
    english: 'Teacher',
    hebrew: 'מורה',
    phonetic: "טִיצ'ֶר",
    emoji: '👩‍🏫',
    exampleSentence: 'Our teacher teaches us the new words.',
    sentenceHebrew: 'המורה שלנו מלמדת אותנו את המילים החדשות.',
  },
  {
    id: 'say',
    english: 'Say',
    hebrew: 'לומר',
    phonetic: 'סֵיי',
    emoji: '🗣️',
    exampleSentence: 'Please say the word clearly out loud.',
    sentenceHebrew: 'אנא אמרו את המילה ברור ובקול רם.',
  },
  {
    id: 'dog',
    english: 'Dog',
    hebrew: 'כלב',
    phonetic: 'דּוֹג',
    emoji: '🐶',
    exampleSentence: 'The playful dog runs in the green park.',
    sentenceHebrew: 'הכלב השובב רץ בפארק הירוק.',
  },
  {
    id: 'clean',
    english: 'Clean',
    hebrew: 'לנקות / נקי',
    phonetic: 'קְלִין',
    emoji: '🧼',
    exampleSentence: 'We clean the big table before dinner.',
    sentenceHebrew: 'אנחנו מנקים את השולחן הגדול לפני ארוחת הערב.',
  },
  {
    id: 'fly',
    english: 'Fly',
    hebrew: 'לעוף / זבוב',
    phonetic: 'פְלָאי',
    emoji: '🦅',
    exampleSentence: 'Birds fly high in the blue sky.',
    sentenceHebrew: 'ציפורים עפות גבוה בשמיים הכחולים.',
  },
  {
    id: 'eat',
    english: 'Eat',
    hebrew: 'לאכול',
    phonetic: 'אִיט',
    emoji: '🍎',
    exampleSentence: 'The children eat fresh fruit every day.',
    sentenceHebrew: 'הילדים אוכלים פירות טריים בכל יום.',
  },
  {
    id: 'flamingo',
    english: 'Flamingo',
    hebrew: 'פלמינגו',
    phonetic: 'פְלָמִינְגּוֹ',
    emoji: '🦩',
    exampleSentence: 'The pink flamingo stands near the lake.',
    sentenceHebrew: 'הפלמינגו הוורוד עומד ליד האגם.',
  },
  {
    id: 'baby',
    english: 'Baby',
    hebrew: 'תינוק',
    phonetic: 'בֵּייבִּי',
    emoji: '👶',
    exampleSentence: 'The cute baby smiles on the soft chair.',
    sentenceHebrew: 'התינוק החמוד מחייך על הכיסא הרך.',
  },
  {
    id: 'house',
    english: 'House',
    hebrew: 'בית',
    phonetic: 'הָאוּס',
    emoji: '🏠',
    exampleSentence: 'We live in a cozy house near the school.',
    sentenceHebrew: 'אנחנו גרים בבית נעים ליד בית הספר.',
  },
  {
    id: 'dish',
    english: 'Dish',
    hebrew: 'צלחת / כלי',
    phonetic: 'דִּישׁ',
    emoji: '🍽️',
    exampleSentence: 'Put the warm food on the clean dish.',
    sentenceHebrew: 'שימו את האוכל החם על הצלחת הנקייה.',
  },
  {
    id: 'catch',
    english: 'Catch',
    hebrew: 'לתפוס',
    phonetic: 'קֶאטְשׁ',
    emoji: '🤾',
    exampleSentence: 'Can you catch the ball with your hands?',
    sentenceHebrew: 'האם אתם יכולים לתפוס את הכדור בידיים?',
  },
  {
    id: 'fall',
    english: 'Fall',
    hebrew: 'ליפול / סתיו',
    phonetic: 'פוֹל',
    emoji: '🍂',
    exampleSentence: 'Colorful leaves fall from the trees in autumn.',
    sentenceHebrew: 'עלים צבעוניים נופלים מהעצים בסתיו.',
  },
  {
    id: 'tall',
    english: 'Tall',
    hebrew: 'גבוה',
    phonetic: 'טוֹל',
    emoji: '🦒',
    exampleSentence: 'The tall giraffe reaches the green tree.',
    sentenceHebrew: 'הג\'ירפה הגבוהה מגיעה אל העץ הירוק.',
  },
  {
    id: 'chair',
    english: 'Chair',
    hebrew: 'כיסא',
    phonetic: "צֵ'ר",
    emoji: '🪑',
    exampleSentence: 'Please sit down on the wooden chair.',
    sentenceHebrew: 'אנא שבו על כיסא העץ.',
  },
  {
    id: 'table',
    english: 'Table',
    hebrew: 'שולחן',
    phonetic: 'טֵייבֶּל',
    emoji: '🪵',
    exampleSentence: 'The books and notebooks are on the table.',
    sentenceHebrew: 'הספרים והמחברות מונחים על השולחן.',
  },
  {
    id: 'clock',
    english: 'Clock',
    hebrew: 'שעון',
    phonetic: 'קְלוֹק',
    emoji: '⏰',
    exampleSentence: 'The round clock shows eight in the morning.',
    sentenceHebrew: 'השעון העגול מראה שמונה בבוקר.',
  },
  {
    id: 'woman',
    english: 'Woman',
    hebrew: 'אישה',
    phonetic: 'ווּמֶן',
    emoji: '👩',
    exampleSentence: 'The kind woman helps the baby walk.',
    sentenceHebrew: 'האישה הטובה עוזרת לתינוק ללכת.',
  },
  {
    id: 'near',
    english: 'Near',
    hebrew: 'קרוב / ליד',
    phonetic: 'נִיר',
    emoji: '📍',
    exampleSentence: 'The playground is near our quiet house.',
    sentenceHebrew: 'מגרש המשחקים נמצא קרוב לבית השקט שלנו.',
  },
  {
    id: 'clown',
    english: 'Clown',
    hebrew: 'ליצן',
    phonetic: 'קְלָאוּן',
    emoji: '🤡',
    exampleSentence: 'The funny clown tells cheerful jokes.',
    sentenceHebrew: 'הליצן המצחיק מספר בדיחות משמחות.',
  },
  {
    id: 'nice',
    english: 'Nice',
    hebrew: 'נחמד / נעים',
    phonetic: 'נַאיְס',
    emoji: '😊',
    exampleSentence: 'It is very nice to learn with good friends.',
    sentenceHebrew: 'זה מאוד נחמד ללמוד עם חברים טובים.',
  },
  {
    id: 'favorite',
    english: 'Favorite',
    hebrew: 'מועדף / אהוב',
    phonetic: 'פֵייבוֹרִיט',
    emoji: '⭐',
    exampleSentence: 'English is my favorite subject in school.',
    sentenceHebrew: 'אנגלית היא המקצוע האהוב עליי בבית הספר.',
  },
  {
    id: 'meat',
    english: 'Meat',
    hebrew: 'בשר',
    phonetic: 'מִיט',
    emoji: '🥩',
    exampleSentence: 'The hungry dog likes to eat cooked meat.',
    sentenceHebrew: 'הכלב הרעב אוהב לאכול בשר מבושל.',
  },
  {
    id: 'sky',
    english: 'Sky',
    hebrew: 'שמיים',
    phonetic: 'סְקַאי',
    emoji: '☁️',
    exampleSentence: 'White clouds float softly in the blue sky.',
    sentenceHebrew: 'עננים לבנים צפים ברוך בשמיים הכחולים.',
  },
  {
    id: 'castle',
    english: 'Castle',
    hebrew: 'טירה / ארמון',
    phonetic: 'קָאסֶל',
    emoji: '🏰',
    exampleSentence: 'The ancient castle has tall gray stone walls.',
    sentenceHebrew: 'לטירה העתיקה יש חומות אבן אפורות וגבוהות.',
  },
  {
    id: 'burn',
    english: 'Burn',
    hebrew: 'לבעור / לשרוף',
    phonetic: 'בֶּרְן',
    emoji: '🔥',
    exampleSentence: 'Do not touch the bright fire, it can burn.',
    sentenceHebrew: 'אל תיגעו באש הבוהקת, היא עלולה לשרוף.',
  },
];

export const STAGES_CONFIG: StageInfo[] = [
  {
    id: 1,
    name: 'תחנה 1: אותיות גדולות וקטנות',
    subtitle: 'כתיבה וזיהוי Capital & Lowercase',
    description: 'מתרגלים כתיבה וזיהוי של אותיות גדולות וקטנות באנגלית (A-a, B-b, C-c...), התאמת זוגות ושמיעת צליל האות!',
    icon: '🔤',
    minPoints: 0,
    tileTarget: 1,
  },
  {
    id: 2,
    name: 'תחנה 2: אוצר מילים ואות פותחת',
    subtitle: '29 המילים החדשות וכתיבת אות פותחת לתמונה',
    description: 'היכרות מקיפה עם כל 29 המילים למבחן, תרגול כתיבת האות הפותחת לתמונה (כמו F לפלמינגו ו-C לטירה)!',
    icon: '🖼️',
    minPoints: 150,
    tileTarget: 2,
  },
  {
    id: 3,
    name: 'תחנה 3: קריאת משפט והתאמה לתמונה',
    subtitle: 'קריאת משפטים באנגלית והבנת הקשר',
    description: 'קוראים משפטים שלמים באנגלית הבנויים מאוצר המילים של המבחן, ומתאימים לתמונה הנכונה!',
    icon: '🧩',
    minPoints: 300,
    tileTarget: 3,
  },
  {
    id: 4,
    name: 'תחנה 4: קריאת טקסט ושאלות הבנה',
    subtitle: 'הבנת הנקרא: קטעי קריאה ושאלות',
    description: 'קוראים ומקשיבים לקטעי קריאה קצרים ומהנים באנגלית ועונים על שאלות הבנת הנקרא לקראת המבחן!',
    icon: '📖',
    minPoints: 450,
    tileTarget: 4,
  },
  {
    id: 5,
    name: 'תחנה 5: מבחן האלופים המסכם',
    subtitle: 'סימולציית המבחן החדש ותעודת הצטיינות',
    description: 'מבחן מסכם של כל חלקי המבחן: אותיות, אות פותחת, השלמת משפטים בהאזנה, התאמת משפטים והבנת הנקרא!',
    icon: '🏆',
    minPoints: 600,
    tileTarget: 5,
  },
];

// Alphabet letters data for Station 1
export interface AlphabetItem {
  upper: string;
  lower: string;
  name: string;
  sampleWord: string;
  sampleHebrew: string;
}

export const ALPHABET_DATA: AlphabetItem[] = [
  { upper: 'A', lower: 'a', name: 'אֵיי', sampleWord: 'Apple', sampleHebrew: 'תפוח' },
  { upper: 'B', lower: 'b', name: 'בִּי', sampleWord: 'Baby', sampleHebrew: 'תינוק' },
  { upper: 'C', lower: 'c', name: 'סִי', sampleWord: 'Castle', sampleHebrew: 'טירה' },
  { upper: 'D', lower: 'd', name: 'דִּי', sampleWord: 'Dog', sampleHebrew: 'כלב' },
  { upper: 'E', lower: 'e', name: 'אִי', sampleWord: 'Eat', sampleHebrew: 'לאכול' },
  { upper: 'F', lower: 'f', name: 'אֶף', sampleWord: 'Flamingo', sampleHebrew: 'פלמינגו' },
  { upper: 'G', lower: 'g', name: 'גִּי', sampleWord: 'Green', sampleHebrew: 'ירוק' },
  { upper: 'H', lower: 'h', name: 'אֵייץ׳', sampleWord: 'House', sampleHebrew: 'בית' },
  { upper: 'I', lower: 'i', name: 'אַאי', sampleWord: 'Ice', sampleHebrew: 'קרח' },
  { upper: 'J', lower: 'j', name: 'גֵ׳יי', sampleWord: 'Jump', sampleHebrew: 'לקפוץ' },
  { upper: 'K', lower: 'k', name: 'קֵיי', sampleWord: 'King', sampleHebrew: 'מלך' },
  { upper: 'L', lower: 'l', name: 'אֶל', sampleWord: 'Lion', sampleHebrew: 'אריה' },
  { upper: 'M', lower: 'm', name: 'אֶם', sampleWord: 'Meat', sampleHebrew: 'בשר' },
  { upper: 'N', lower: 'n', name: 'אֶן', sampleWord: 'Near', sampleHebrew: 'קרוב' },
  { upper: 'O', lower: 'o', name: 'אוֹ', sampleWord: 'Orange', sampleHebrew: 'תפוז' },
  { upper: 'P', lower: 'p', name: 'פִּי', sampleWord: 'Princess', sampleHebrew: 'נסיכה' },
  { upper: 'Q', lower: 'q', name: 'קְיוּ', sampleWord: 'Queen', sampleHebrew: 'מלכה' },
  { upper: 'R', lower: 'r', name: 'אָר', sampleWord: 'Red', sampleHebrew: 'אדום' },
  { upper: 'S', lower: 's', name: 'אֶס', sampleWord: 'Sky', sampleHebrew: 'שמיים' },
  { upper: 'T', lower: 't', name: 'טִי', sampleWord: 'Teacher', sampleHebrew: 'מורה' },
  { upper: 'U', lower: 'u', name: 'יוּ', sampleWord: 'Umbrella', sampleHebrew: 'מטריה' },
  { upper: 'V', lower: 'v', name: 'וִי', sampleWord: 'Van', sampleHebrew: 'מסחרית' },
  { upper: 'W', lower: 'w', name: 'דַּבֶּלְיוּ', sampleWord: 'Woman', sampleHebrew: 'אישה' },
  { upper: 'X', lower: 'x', name: 'אֶקְס', sampleWord: 'Box', sampleHebrew: 'קופסה' },
  { upper: 'Y', lower: 'y', name: 'וַואי', sampleWord: 'Yellow', sampleHebrew: 'צהוב' },
  { upper: 'Z', lower: 'z', name: 'זֶד', sampleWord: 'Zoo', sampleHebrew: 'גן חיות' },
];

// First letter to picture practice data
export interface FirstLetterItem {
  id: string;
  word: string;
  firstLetter: string;
  hebrew: string;
  emoji: string;
  hint: string;
}

export const FIRST_LETTER_ITEMS: FirstLetterItem[] = [
  { id: 'fl1', word: 'Flamingo', firstLetter: 'F', hebrew: 'פלמינגו', emoji: '🦩', hint: 'עוף ורוד גבוה' },
  { id: 'fl2', word: 'Dog', firstLetter: 'D', hebrew: 'כלב', emoji: '🐶', hint: 'חיית מחמד אהובה' },
  { id: 'fl3', word: 'Princess', firstLetter: 'P', hebrew: 'נסיכה', emoji: '👸', hint: 'בת מלך בארמון' },
  { id: 'fl4', word: 'Castle', firstLetter: 'C', hebrew: 'טירה', emoji: '🏰', hint: 'מבנה אבן עתיק' },
  { id: 'fl5', word: 'Clown', firstLetter: 'C', hebrew: 'ליצן', emoji: '🤡', hint: 'מצחיק בקרקס' },
  { id: 'fl6', word: 'Cow', firstLetter: 'C', hebrew: 'פרה', emoji: '🐄', hint: 'חיה בחווה' },
  { id: 'fl7', word: 'Clock', firstLetter: 'C', hebrew: 'שעון', emoji: '⏰', hint: 'מראה את השעה' },
  { id: 'fl8', word: 'Baby', firstLetter: 'B', hebrew: 'תינוק', emoji: '👶', hint: 'ילד קטן מאוד' },
  { id: 'fl9', word: 'House', firstLetter: 'H', hebrew: 'בית', emoji: '🏠', hint: 'מקום שבו גרים' },
  { id: 'fl10', word: 'Teacher', firstLetter: 'T', hebrew: 'מורה', emoji: '👩‍🏫', hint: 'מלמדת בכיתה' },
  { id: 'fl11', word: 'Chair', firstLetter: 'C', hebrew: 'כיסא', emoji: '🪑', hint: 'רהיט לישיבה' },
  { id: 'fl12', word: 'Table', firstLetter: 'T', hebrew: 'שולחן', emoji: '🪵', hint: 'רהיט שעליו עובדים ואוכלים' },
  { id: 'fl13', word: 'Meat', firstLetter: 'M', hebrew: 'בשר', emoji: '🥩', hint: 'אוכל מזין' },
  { id: 'fl14', word: 'Sky', firstLetter: 'S', hebrew: 'שמיים', emoji: '☁️', hint: 'למעלה עם העננים והשמש' },
  { id: 'fl15', word: 'Woman', firstLetter: 'W', hebrew: 'אישה', emoji: '👩', hint: 'אדם מבוגר ממין נקבה' },
  { id: 'fl16', word: 'Man', firstLetter: 'M', hebrew: 'איש / גבר', emoji: '👨', hint: 'אדם מבוגר ממין זכר' },
];

// Sentence to picture matching items
export interface SentenceMatchItem {
  id: string;
  sentence: string;
  hebrewTranslation: string;
  correctEmoji: string;
  correctLabel: string;
  options: { emoji: string; label: string }[];
}

export const SENTENCE_MATCH_ITEMS: SentenceMatchItem[] = [
  {
    id: 'sm1',
    sentence: 'The princess lives in a big stone castle.',
    hebrewTranslation: 'הנסיכה גרה בטירת אבן גדולה.',
    correctEmoji: '🏰',
    correctLabel: 'טירה / ארמון (Castle)',
    options: [
      { emoji: '🏰', label: 'טירה / ארמון (Castle)' },
      { emoji: '🚗', label: 'מכונית (Car)' },
      { emoji: '⛺', label: 'אוהל (Tent)' },
      { emoji: '🚤', label: 'סירה (Boat)' },
    ],
  },
  {
    id: 'sm2',
    sentence: 'The hungry dog likes to eat meat.',
    hebrewTranslation: 'הכלב הרעב אוהב לאכול בשר.',
    correctEmoji: '🥩',
    correctLabel: 'בשר (Meat)',
    options: [
      { emoji: '🥩', label: 'בשר (Meat)' },
      { emoji: '🍦', label: 'גלידה (Ice cream)' },
      { emoji: '🥕', label: 'גזר (Carrot)' },
      { emoji: '🍕', label: 'פיצה (Pizza)' },
    ],
  },
  {
    id: 'sm3',
    sentence: 'The cute baby sits on the comfortable chair.',
    hebrewTranslation: 'התינוק החמוד יושב על הכיסא הנוח.',
    correctEmoji: '🪑',
    correctLabel: 'כיסא (Chair)',
    options: [
      { emoji: '🪑', label: 'כיסא (Chair)' },
      { emoji: '🚪', label: 'דלת (Door)' },
      { emoji: '🛏️', label: 'מיטה (Bed)' },
      { emoji: '🪜', label: 'סולם (Ladder)' },
    ],
  },
  {
    id: 'sm4',
    sentence: 'The round clock is on the wooden table.',
    hebrewTranslation: 'השעון העגול נמצא על שולחן העץ.',
    correctEmoji: '⏰',
    correctLabel: 'שעון (Clock)',
    options: [
      { emoji: '⏰', label: 'שעון (Clock)' },
      { emoji: '📱', label: 'טלפון (Phone)' },
      { emoji: '📻', label: 'רדיו (Radio)' },
      { emoji: '🧲', label: 'מגנט (Magnet)' },
    ],
  },
  {
    id: 'sm5',
    sentence: 'The pink flamingo can fly high in the sky.',
    hebrewTranslation: 'הפלמינגו הוורוד יכול לעוף גבוה בשמיים.',
    correctEmoji: '🦩',
    correctLabel: 'פלמינגו (Flamingo)',
    options: [
      { emoji: '🦩', label: 'פלמינגו (Flamingo)' },
      { emoji: '🐟', label: 'דג (Fish)' },
      { emoji: '🐢', label: 'צב (Turtle)' },
      { emoji: '🐸', label: 'צפרדע (Frog)' },
    ],
  },
  {
    id: 'sm6',
    sentence: 'The funny clown is very tall and nice.',
    hebrewTranslation: 'הליצן המצחיק גבוה מאוד ונחמד.',
    correctEmoji: '🤡',
    correctLabel: 'ליצן (Clown)',
    options: [
      { emoji: '🤡', label: 'ליצן (Clown)' },
      { emoji: '🧙‍♂️', label: 'קוסם (Wizard)' },
      { emoji: '👮‍♂️', label: 'שוטר (Police officer)' },
      { emoji: '🧑‍🚀', label: 'אסטרונאוט (Astronaut)' },
    ],
  },
  {
    id: 'sm7',
    sentence: 'The spotted cow eats near the house.',
    hebrewTranslation: 'הפרה המנוקדת אוכלת ליד הבית.',
    correctEmoji: '🐄',
    correctLabel: 'פרה (Cow)',
    options: [
      { emoji: '🐄', label: 'פרה (Cow)' },
      { emoji: '🦁', label: 'אריה (Lion)' },
      { emoji: '🐻', label: 'דוב (Bear)' },
      { emoji: '🐘', label: 'פיל (Elephant)' },
    ],
  },
  {
    id: 'sm8',
    sentence: 'Do not touch the hot fire, it can burn.',
    hebrewTranslation: 'אל תיגע באש החמה, היא עלולה לשרוף.',
    correctEmoji: '🔥',
    correctLabel: 'אש ששורפת (Fire / Burn)',
    options: [
      { emoji: '🔥', label: 'אש ששורפת (Fire / Burn)' },
      { emoji: '💧', label: 'מים קרים (Water)' },
      { emoji: '❄️', label: 'שלג (Snow)' },
      { emoji: '🍃', label: 'עלה (Leaf)' },
    ],
  },
];

// Short Reading Passages & Questions for Reading Comprehension
export interface ReadingStory {
  id: string;
  title: string;
  text: string;
  questions: {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }[];
}

export const READING_STORIES: ReadingStory[] = [
  {
    id: 'story1',
    title: 'The Princess and the Pink Flamingo',
    text: 'Princess Maya lives in a big stone castle with a nice garden. Near the castle, there is a clear blue lake. Every morning, she sits on a wooden chair by the table and eats fresh fruit. One sunny day, she sees a tall pink flamingo fly high in the blue sky. The princess thinks it is her favorite animal. Her teacher says: "Flamingos are very special and beautiful birds."',
    questions: [
      {
        id: 1,
        question: 'Where does Princess Maya live?',
        options: ['In a big stone castle', 'In a small tent', 'In a tall school', 'In a quiet boat'],
        correctAnswer: 'In a big stone castle',
        explanation: 'כתוב בטקסט: "Princess Maya lives in a big stone castle"',
      },
      {
        id: 2,
        question: 'What does Maya see in the blue sky?',
        options: ['A tall pink flamingo fly', 'A barking dog run', 'A yellow balloon fall', 'A big airplane'],
        correctAnswer: 'A tall pink flamingo fly',
        explanation: 'כתוב בטקסט: "she sees a tall pink flamingo fly high in the blue sky"',
      },
      {
        id: 3,
        question: 'What does Princess Maya think about the flamingo?',
        options: ['It is her favorite animal', 'It is very scary', 'It is too small', 'It is loud'],
        correctAnswer: 'It is her favorite animal',
        explanation: 'כתוב בטקסט: "The princess thinks it is her favorite animal"',
      },
      {
        id: 4,
        question: 'Who says that flamingos are special birds?',
        options: ['Her teacher', 'The funny clown', 'The tall man', 'The doctor'],
        correctAnswer: 'Her teacher',
        explanation: 'כתוב בטקסט: "Her teacher says: Flamingos are very special and beautiful birds"',
      },
    ],
  },
  {
    id: 'story2',
    title: 'The Friendly Farm and the Nice Clown',
    text: 'Dan is a tall man and Sarah is a kind woman. They live in a warm house near a green field. They have a spotted cow and a playful dog. The dog likes to eat meat and catch a small red ball. On Friday afternoon, their friend Benny the clown comes to visit. The clown is very nice and tells funny jokes. The clock on the wall shows three o\'clock when they all sit together at the table.',
    questions: [
      {
        id: 1,
        question: 'Who lives in the warm house near the green field?',
        options: ['Dan and Sarah', 'Two kings', 'A princess and a queen', 'Only the clown'],
        correctAnswer: 'Dan and Sarah',
        explanation: 'כתוב בטקסט: "Dan is a tall man and Sarah is a kind woman. They live in a warm house..."',
      },
      {
        id: 2,
        question: 'What does the dog like to eat and catch?',
        options: ['Eat meat and catch a ball', 'Eat vegetables and catch fish', 'Eat ice cream', 'Eat grass'],
        correctAnswer: 'Eat meat and catch a ball',
        explanation: 'כתוב בטקסט: "The dog likes to eat meat and catch a small red ball"',
      },
      {
        id: 3,
        question: 'Who comes to visit on Friday afternoon?',
        options: ['Benny the clown', 'The teacher', 'The pilot', 'The prince'],
        correctAnswer: 'Benny the clown',
        explanation: 'כתוב בטקסט: "their friend Benny the clown comes to visit"',
      },
      {
        id: 4,
        question: 'What time does the clock on the wall show?',
        options: ['Three o\'clock', 'Five o\'clock', 'Ten o\'clock', 'Twelve o\'clock'],
        correctAnswer: 'Three o\'clock',
        explanation: 'כתוב בטקסט: "The clock on the wall shows three o\'clock"',
      },
    ],
  },
];

export const CONFIDENCE_MESSAGES_CORRECT = [
  'איזה תותח/ית! תשובה מושלמת! 🌟',
  'וואו, את/ה שולט/ת בחומר כמו מקצוען! 🚀',
  'גאווה של בית ספר צמרות באר יעקב! 🏫✨',
  'מדהים! התקדמות מעולה לקראת המבחן! 🌟🎉',
  'הביטחון שלך מזנק למעלה! כל הכבוד! 💫',
  'אלופים אמיתיים! המשיכו ככה! 🏅',
  'בול בפוני! עוד צעד גדול אל עבר ציון 100! 🎯',
  'איזה דיוק מופלא! המוח שלך על טורבו! 🧠⚡',
];

export const CONFIDENCE_MESSAGES_ENCOURAGING = [
  'כמעט! ככה לומדים הכי טוב, עוד ניסיון ואת/ה שם! 💪',
  'לא נורא בכלל! טעויות הן שלב מעולה בלמידה, מנסים שוב ומצליחים! ✨',
  'לומדים מכל ניסיון! בואו ננסה שוב! 🌟',
  'את/ה מסוגל/ת לגמרי! קחו נשימה ונמשיך קדימה! 🌈',
  'אנחנו מאמינים בך! כל תרגול מחזק את הזיכרון! 🧠💖',
];

export const AVATARS = [
  { id: 'lion', emoji: '🦁', name: 'אריה אמיץ' },
  { id: 'star', emoji: '⭐', name: 'כוכב זוהר' },
  { id: 'rocket', emoji: '🚀', name: 'טייס חלל' },
  { id: 'owl', emoji: '🦉', name: 'ינשוף חכם' },
  { id: 'unicorn', emoji: '🦄', name: 'חד-קרן קסום' },
  { id: 'robot', emoji: '🤖', name: 'רובוט על' },
];
