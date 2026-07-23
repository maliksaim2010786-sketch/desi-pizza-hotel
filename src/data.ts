export interface MenuItem {
  id: string;
  name: string;
  urduName: string;
  description: string;
  urduDescription: string;
  basePrice: number; // in PKR
  image: string; // Unsplash fallback or general delicious representation
  spiciness: 1 | 2 | 3; // 1: Mild, 2: Medium/Spicy, 3: Fire/Desi Extreme
  tags: string[];
  isVegetarian?: boolean;
  category: "pizza" | "starter" | "beverage" | "dessert";
}

export interface Review {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  comment: string;
  urduComment: string;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "chicken-tikka",
    name: "Chicken Tikka Feast",
    urduName: "چکن تکہ فیسٹ",
    description: "Sizzling charcoal-grilled chicken tikka, marinated in tandoori spices, topped with red onions, fresh green chillies, and a mint yogurt swirl.",
    urduDescription: "کوئلے پر پکا ہوا تندوری مصالحہ دار چکن تکہ، پیاز، ہری مرچیں اور پودینے کی چٹنی کا تڑکہ۔",
    basePrice: 1250,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80", 
    spiciness: 2,
    tags: ["Best Seller", "Tandoori Style", "Halal"],
    category: "pizza",
  },
  {
    id: "chapli-kabab",
    name: "Chapli Kabab Fusion",
    urduName: "چپلی کباب فیوژن",
    description: "Spicy Peshawar-style minced beef patty crumbles, fresh tomatoes, fresh coriander, crushed chillies, and a sprinkle of tangy pomegranate powder.",
    urduDescription: "پشاور کا روایتی پسا ہوا چپلی کباب، ٹماٹر، ہرا دھنیا اور انار دانہ کے چٹ پٹے مصالحے۔",
    basePrice: 1450,
    spiciness: 3,
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80",
    tags: ["Peshawari Special", "Spicy", "Chef Choice"],
    category: "pizza",
  },
  {
    id: "seekh-kabab",
    name: "Seekh Kabab Sizzler",
    urduName: "سیخ کباب سزلر",
    description: "Flame-grilled chicken/beef seekh kabab slices on dynamic garlic herb base, red onions, sweet bell peppers, and a sprinkle of chat masala.",
    urduDescription: "آگ پر بنے جوسی سیخ کباب کی سلائس، لذیذ لہسن ساس، پیاز، شملہ مرچ اور خاص چاٹ مصالحہ۔",
    basePrice: 1350,
    spiciness: 2,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80",
    tags: ["Meaty Premium", "Smoked"],
    category: "pizza",
  },
  {
    id: "mutton-karahi-pizza",
    name: "Royal Mutton Karahi",
    urduName: "شاہی دنبہ کڑاہی پیزا",
    description: "Premium shredded slow-cooked mutton, thick savory Karahi gravy base, julienne ginger, fresh green chillies, and melted buttery cheese.",
    urduDescription: "خالص دنبہ کڑاہی کا مصالحہ دار گوشت، باریک کٹی ادرک، ہری مرچیں اور مکھنی پنیر کی کوٹنگ۔",
    basePrice: 1790,
    spiciness: 3,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
    tags: ["Premium King", "Traditional Handi"],
    category: "pizza",
  },
  {
    id: "butter-chicken",
    name: "Butter Chicken Supreme",
    urduName: "بٹر چکن سپریم",
    description: "Rich, creamy butter tomato sauce base topped with smoky chicken handi strips, caramelized onions, mozzarella, and aromatic kasuri methi.",
    urduDescription: "شاہی مکھن ٹماٹر گریوی، تندوری بوٹی پٹیاں، کیریمل پیاز اور خوشبودار قصوری میتھی کا حسین امتزاج۔",
    basePrice: 1390,
    spiciness: 1,
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=600&q=80",
    tags: ["Creamy", "Kids Friendly"],
    category: "pizza",
  },
  {
    id: "achari-paneer",
    name: "Achari Paneer Delight",
    urduName: "اچاری پنیر ڈیلائٹ",
    description: "Tangy pickled paneer cubes (cottage cheese), red onion rings, sliced green chillies, ginger slivers, and spicy coriander mint chutney.",
    urduDescription: "چٹ پٹا اچاری پنیر، پیاز، ہری مرچیں، ادرک اور تازہ ہرا دھنیا پودینہ چٹنی کی چاشنی۔",
    basePrice: 1150,
    spiciness: 2,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80",
    tags: ["Vegetarian", "Tangy Twist"],
    isVegetarian: true,
    category: "pizza",
  },
  {
    id: "malai-boti",
    name: "Creamy Malai Boti Heaven",
    urduName: "کریمی ملائی بوٹی ہیون",
    description: "Melt-in-the-mouth chicken malai boti pieces, creamy garlic base, green cardamom flavor, mild green chillies, and caramelized onions.",
    urduDescription: "منہ میں گھل جانے والی چکن ملائی بوٹی، سفید مکھنی لہسن ساس اور ہلکے مصالحے دارمیکس۔",
    basePrice: 1300,
    spiciness: 1,
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80",
    tags: ["Royal Taste", "Creamy & Mild"],
    category: "pizza",
  },
  // Appetizers & Starters
  {
    id: "samosa-chaat-bites",
    name: "Samosa Pizza Dippers",
    urduName: "سموسہ پیزا ڈپرز",
    description: "Crispy tandoori samosa pastry bites stuffed with mild spiced potatoes, sweet tamarind glaze, and melted mozzarella drizzle.",
    urduDescription: "خستہ سموسہ پاپڑی، آلو کا خاص مصالحہ، املی کی چٹنی اور پگھلا ہوا پنیر مکس۔",
    basePrice: 450,
    spiciness: 2,
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80",
    tags: ["Quick Crunchy", "Street Special"],
    isVegetarian: true,
    category: "starter",
  },
  {
    id: "seekh-kabab-rolls",
    name: "Lakhnavi Kabab Rollers",
    urduName: "لکھنوی کباب رولر",
    description: "Soft buttered tandoori naan rolled with juicy barbecued chicken seekh kabab, cabbage crunch, and mint raita.",
    urduDescription: "لہسن مکھن نان میںلپیٹا ہوا جوسی سرخ چکن سیخ کباب، بند گوبھی اور کلاسک پودینہ چٹنی۔",
    basePrice: 590,
    spiciness: 2,
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80",
    tags: ["Fulfilling", "Barbecue Twist"],
    category: "starter",
  },
  // Beverages & Coolers
  {
    id: "mango-lassi",
    name: "Patiala Mango Lassi",
    urduName: "پٹیالہ آم کی لسی",
    description: "Traditional sweet thick yogurt blend with premium Multani mango pulp, topped with sliced saffron almonds and pure cream.",
    urduDescription: "ملتانی آم کا گودا، کلاسک گاڑھا دہی، پستہ اور زعفران سے سجی ہوئی شاہی لسی۔",
    basePrice: 350,
    spiciness: 1,
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80",
    tags: ["Royal Drink", "Chilled Summer"],
    isVegetarian: true,
    category: "beverage",
  },
  {
    id: "peshawari-kahwa",
    name: "Kashmiri Elaichi Tea",
    urduName: "کشمیری الائچی چائے",
    description: "Rich pink herbal tea infused with crushed green cardamoms, star anise, garnished with crushed almonds and pistachios.",
    urduDescription: "گلابی کشمیری کڑک چائے، سبز الائچی کا تڑکہ اور پستہ بادام چورا رونق۔",
    basePrice: 240,
    spiciness: 1,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    tags: ["Warm Sip", "Authentic Kashmiri"],
    isVegetarian: true,
    category: "beverage",
  },
  {
    id: "mint-margarita",
    name: "Lyallpur Mint Margarita",
    urduName: "پودینہ لیموں مارگریٹا",
    description: "Ultra-refreshing slush made with fresh garden mint leaves, squeezed lemons, black salt, and sparkling ice soda.",
    urduDescription: "باغ کے تازہ پودینے کے پتے، لیموں کا رس، کالا نمک اور ٹھنڈا سوڈا مکس کا جادو۔",
    basePrice: 280,
    spiciness: 1,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
    tags: ["Refreshing", "Digestive Best"],
    isVegetarian: true,
    category: "beverage",
  },
  // Desserts
  {
    id: "gulab-jamun-delight",
    name: "Gulab Jamun Sweet Slices",
    urduName: "گلاب جامن سمر ٹریٹ",
    description: "Warm sweet milk dumplings (Gulab Jamun) baked on a sweet Naan crust, topped with sugar syrup, pistachios, and thickened Rabri condensed milk.",
    urduDescription: "میٹھے نان کرسٹ پر گرم کلاسک گلاب جامن کی سلائس، پستہ اور ریوڑی والی ربڑی ساس۔",
    basePrice: 650,
    spiciness: 1,
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80",
    tags: ["Delectable Sweet", "Mehman Khaas"],
    isVegetarian: true,
    category: "dessert",
  }
];

export const REVIEWS: Review[] = [
  {
    id: "rev-1",
    name: "Arsalan Khan",
    location: "Lahore",
    avatar: "👨‍💻",
    rating: 5,
    comment: "Yaar, Chapli Kabab pizza literally tasted like I was sitting in Namak Mandi, Peshawar. The crust is soft like a tandoori naan. Kamal taste tha!",
    urduComment: "یار چپلی کباب پیزا کا ذائقہ تو بالکل پشاور کے نمک منڈی جیسا تھا۔ نان کرسٹ نرم اور اندر سے خستہ ہے، کمال ٹیسٹ ہے!"
  },
  {
    id: "rev-2",
    name: "Sobia Malik",
    location: "Karachi",
    avatar: "👩‍🍳",
    rating: 5,
    comment: "Finally, a pizza that matches our spice standards! The Chicken Tikka has the authentic mint cream drizzle. Double chat masala makes it even better.",
    urduComment: "آخیر کار، ہمارے کراچی کے مسالوں پر پورا اترنے والا پیزا مل ہی گیا! سچی پودینے کی چٹنی والی ٹکڑا کمال کا ذائقہ دیتا ہے۔"
  },
  {
    id: "rev-3",
    name: "Zainab Ali",
    location: "Islamabad",
    avatar: "👩",
    rating: 4.8,
    comment: "The Butter Chicken Pizza is phenomenal! Very creamy and balanced, not sweet. I've recommended this to all my friends in F-10.",
    urduComment: "بٹر چکن پیزا تو لاجواب ہے! کریمی اور خوشبودار قصوری میتھی کا ذائقہ۔ تمام دوستوں کو اس کی سفارش کی ہے۔"
  }
];

export const DESI_TOPPINGS = [
  { id: "tikka", name: "Chicken Tikka Chunks / چکن تکہ بوٹی", price: 200, icon: "🍗" },
  { id: "chapli", name: "Peshawari Chapli Kabab / چپلی کباب", price: 250, icon: "🥩" },
  { id: "seekh", name: "Beef Seekh Kabab / سلائس سیخ کباب", price: 220, icon: "🍢" },
  { id: "paneer", name: "Achari Paneer Tikka / اچاری پنیر", price: 180, icon: "🧀" },
  { id: "onion", name: "Red Onions / ہری پیاز رنگز", price: 50, icon: "🧅" },
  { id: "chillies", name: "Desi Green Chillies / تیکھی ہری مرچ", price: 40, icon: "🌶️" },
  { id: "coriander", name: "Fresh Dhaniya (Cilantro) / تازہ ہرا دھنیا", price: 30, icon: "🌿" },
  { id: "mint", name: "Mint Yogurt Swirl / رائتہ ڈرژل", price: 40, icon: "🥛" },
  { id: "chat_masala", name: "Special Chat Masala / چچا چاٹ مصالحہ", price: 20, icon: "✨" }
];

export const DESI_CRUSTS = [
  { id: "naan", name: "Traditional Tandoori Naan Crust / نان کرسٹ", price: 100, desc: "Baked in authentic clay oven, soft & fluffy" },
  { id: "garlic_naan", name: "Garlic Butter Naan Crust / لہسن مکھن نان", price: 150, desc: "Infused with minced garlic and brushed with pure desi ghee" },
  { id: "pan", name: "Classic Pan Crust / کلاسک موٹا پین کرسٹ", price: 50, desc: "Thick and fluffy standard pizza base" },
  { id: "thin", name: "Crispy Patla Naan / خستہ پتلا کرسٹ", price: 0, desc: "Super thin and crispy flatbread base" }
];

export const DESI_SAUCES = [
  { id: "masala", name: "Spicy Tandoori Masala Sauce / مسالے دار چٹنی ساس", heat: 3 },
  { id: "makhani", name: "Royal Butter Makhani Sauce / شاہی مکھن گریوی", heat: 1 },
  { id: "garlic_yoghurt", name: "Garlic Mayo Mint Swirl / لہسن پودینے کا ساس", heat: 1 },
  { id: "classic", name: "Classic Spicy Tomato / کلاسک ٹماٹر ساس", heat: 2 }
];

export interface HotelTableSpot {
  id: string;
  name: string;
  urduName: string;
  description: string;
  urduDescription: string;
  price: number;
  icon: string;
  seats: string;
}

export const HOTEL_TABLES: HotelTableSpot[] = [
  {
    id: "table-standard",
    name: "Standard Tandoor Aura Table",
    urduName: "معیاری تندوری ماحول میز",
    description: "Centrally placed near clay tandoor layout, surrounded by live woodwood sizzles.",
    urduDescription: "تندور کے بالکل قریب، تازہ ہوا اور دہکتے کوئلوں کی مدہم گرمائش۔",
    price: 0,
    icon: "🪑",
    seats: "2 - 4 seats"
  },
  {
    id: "table-ac",
    name: "VIP air-conditioned Family Hall",
    urduName: "خصوصی ائیر کنڈیشنڈ فیملی ہال",
    description: "Quiet aircon luxury enclosure with premium privacy partitions for respectable family feasts.",
    urduDescription: "سکون اور پردے کے انتظام کے ساتھ فیملی ہال کا ٹھنڈا لگژری ماحول۔",
    price: 150,
    icon: "❄️",
    seats: "4 - 8 seats"
  },
  {
    id: "table-rooftop",
    name: "Open-Air Sky Rooftop Dera",
    urduName: "کھلی فضا روف ٹاپ ڈیرہ",
    description: "Starlight view high seating, aesthetic night bulbs, fresh breeze and traditional clay decorations.",
    urduDescription: "ڈھلتی شام، چمکتے ستارے اور ٹھنڈی ہوا کے جھونکوں کے ساتھ چھت پر حسین ڈیرہ۔",
    price: 120,
    icon: "🌌",
    seats: "4 - 10 seats"
  },
  {
    id: "table-takht",
    name: "Traditional Charpai floor carpet sitting",
    urduName: "شاہی تخت اور تکیہ پوش قالین",
    description: "Authentic luxury! Sit on low hand-woven Charpais with soft cow-pillow backrests under cultural light.",
    urduDescription: "خالص پنجابی و پٹھان بیٹھک، نرم گاؤ تکیے، تکیہ دار چٹائی اور روایتی تخت صوفے۔",
    price: 200,
    icon: "🕌",
    seats: "4 - 12 seats"
  }
];

export interface HotelComboDeal {
  id: string;
  name: string;
  urduName: string;
  description: string;
  urduDescription: string;
  basePrice: number;
  image: string;
  itemsSummary: string[];
  tags: string[];
}

export const HOTEL_COMBOS: HotelComboDeal[] = [
  {
    id: "combo-dosti",
    name: "Double Deradar Combo (Dosti Share Platter)",
    urduName: "ڈبل ڈیرہ دار کمبو (دوستی تھال)",
    description: "One Medium Chicken Tikka Pizza + Crispy Samosa Pizza Dippers + Two traditional Chilled Patiala Mango Lassis.",
    urduDescription: "ایک درمیانہ چکن تکہ پیزا، سموسہ پیزا ڈپرز اور دو گلاس ٹھنڈی پٹیالہ آم کی کلاسک لسی کا شاندار جوڑا۔",
    basePrice: 1750,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    itemsSummary: ["1x Chicken Tikka Feast (Medium)", "1x Samosa Pizza Dippers", "2x Patiala Mango Lassi"],
    tags: ["Super Value", "Dosti Favorite"]
  },
  {
    id: "combo-shehenshah",
    name: "Shehenshah Maharaja Royal Platter",
    urduName: "شہنشاہ مہاراجہ شاہی تھال",
    description: "One Large Mutton Karahi Pizza + One Lakhnavi Kabab Roller + One warm Gulab Jamun Sweet slices + Two Lyallpur Mint Margaritas.",
    urduDescription: "ایک بڑا شاہی دنبہ کڑاہی پیزا، لکھنوی کباب رولر، گلاب جامن سمر ٹریٹ اور دو گلاس منٹ مارگریٹا ٹھنڈا سوڈا۔",
    basePrice: 2850,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
    itemsSummary: ["1x Royal Mutton Karahi (Large)", "1x Lakhnavi Kabab Rollers", "1x Gulab Jamun Delight", "2x Mint Margarita"],
    tags: ["Best For 3-4 Persons", "Royal Treat"]
  }
];

