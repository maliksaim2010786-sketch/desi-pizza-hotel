/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Flame, 
  ShoppingBag, 
  ChefHat, 
  Plus, 
  Minus, 
  Trash2, 
  Sparkles, 
  Check, 
  Truck, 
  UtensilsCrossed,
  Heart, 
  Search, 
  X, 
  Clock, 
  Phone, 
  MapPin, 
  Coins, 
  ChevronRight, 
  MessageSquare,
  RefreshCw,
  Award
} from "lucide-react";
import { 
  MENU_ITEMS, 
  REVIEWS, 
  DESI_TOPPINGS, 
  DESI_CRUSTS, 
  DESI_SAUCES, 
  HOTEL_TABLES,
  HOTEL_COMBOS,
  MenuItem, 
  Review,
  HotelTableSpot,
  HotelComboDeal
} from "./data.ts";

export default function App() {
  // Application State
  const [lang, setLang] = useState<"en" | "ur" | "roman">("en");
  const [globalSpice, setGlobalSpice] = useState<1 | 2 | 3>(2); // 1: Mild, 2: Spicy, 3: Extreme
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCategory, setCurrentCategory] = useState<"all" | "veg" | "spicy">("all");
  const [activeFoodCategory, setActiveFoodCategory] = useState<"all" | "pizza" | "starter" | "beverage" | "dessert">("all");
  
  // Custom Pizza Builder State
  const [customSize, setCustomSize] = useState<"Small" | "Medium" | "Large" | "Extra Large">("Medium");
  const [customCrust, setCustomCrust] = useState(DESI_CRUSTS[0]); // Traditional Naan
  const [customSauce, setCustomSauce] = useState(DESI_SAUCES[0]); // Spicy Tandoori Masala
  const [selectedToppings, setSelectedToppings] = useState<string[]>(["tikka", "onion", "mint"]); // pre-populate some yummy ones!
  const [activeTab, setActiveTab] = useState<"menu" | "customizer" | "reviews">("menu");

  // Cart State
  const [cart, setCart] = useState<any[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  // Delivery & Order Simulator State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  
  // Hotel fulfilment type: delivery | dinein | pickup
  const [fulfillmentType, setFulfillmentType] = useState<"delivery" | "dinein" | "pickup">("delivery");
  const [selectedTableSpot, setSelectedTableSpot] = useState<string>("table-ac");
  const [dineinTime, setDineinTime] = useState<string>("20:00");
  const [dineinDate, setDineinDate] = useState<string>("2026-06-18");
  const [dineinGuests, setDineinGuests] = useState<number>(4);
  const [riderBuzzedTimes, setRiderBuzzedTimes] = useState<number>(0);
  const [riderExtraChat, setRiderExtraChat] = useState<string>("");

  const [activeOrder, setActiveOrder] = useState<any | null>(null);
  const [orderStep, setOrderStep] = useState<0 | 1 | 2 | 3 | 4>(0); // 0: Idle, 1: Prep, 2: Clay Oven, 3: Rider On Way, 4: Delivered
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Stats / Interaction counts
  const [reviewsList, setReviewsList] = useState<Review[]>(REVIEWS);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewRating, setNewReviewRating] = useState("5");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewUrduComment, setNewReviewUrduComment] = useState("");
  const [loyaltyCoins, setLoyaltyCoins] = useState(() => {
    const saved = localStorage.getItem("desi_loyalty_coins_key");
    return saved ? parseInt(saved, 10) : 120; // Start with 120 welcoming Dosti Coins!
  });
  const [redeemCoinsToggle, setRedeemCoinsToggle] = useState(false);

  const [likes, setLikes] = useState<Record<string, number>>({
    "chicken-tikka": 142,
    "chapli-kabab": 210,
    "seekh-kabab": 98,
    "butter-chicken": 156,
    "achari-paneer": 74,
    "malai-boti": 115,
  });
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});

  // Translation Dictionaries (Dual Language Power!)
  const TRANSLATIONS = {
    en: {
      title: "Desi Pizza Restaurant",
      tagline: "Spicy Tandoori Magic, Fresh Tandoor Naan Crust!",
      taglineUrdu: "سوادی بوٹیاں، تندوری خوشبو، اور پیزا کا تڑکہ!",
      searchPlaceholder: "Search regional specials (e.g., Tikka, Kabab, Paneer)...",
      navMenu: "Dastarkhwan (Menu)",
      navCustom: "Pizza Lab (Banaen Apni!)",
      navReviews: "Baithak (Reviews)",
      spiceLabel: "Spice Meter / تیزی مسالہ",
      spiceMild: "Mild / میاں والی ہلکا",
      spiceSpicy: "Medium Spicy / دیسی مزیدار",
      spiceLahori: "Extreme / لاہوری بمبوکا! 🌶️🌶️",
      menuTitle: "Khas Desi Pizzas",
      menuSubtitle: "Hand-kneaded dough baked like naans, loaded with charcoal-grilled spicy botis",
      customizerTitle: "Banaen Apni Pizza (Desi Lab)",
      customizerSubtitle: "Become Chef of the Day! Select tandoor crust, traditional base, and fresh meat toppings.",
      crustHeader: "Select your Tandoori Crust Style / نان کرسٹ",
      sauceHeader: "Pick Curried Base Sauce / کڑاہی ساس",
      toppingsHeader: "Loaded Toppings / دیسی بوٹیاں اور لوازمات",
      toppingsNote: "Each meat boti is marinated overnight in organic spices",
      sizeLabel: "Choose Size / پیزا کا سائز",
      cartHeader: "Aap Ka Thaal (Basket)",
      emptyCart: "Your Thaal is empty! Grab a delicious sizzling slice.",
      addToCart: "Add to Basket",
      customBtn: "Customize / اپنی مرضی کا بنائیں",
      total: "Total Bill",
      checkoutBtn: "Place Order / تندور پر چڑھیں",
      checkoutHeader: "Aap Ka Thaqaza (Delivery Details)",
      checkoutPrompt: "Please fill delivery details to start the clay oven",
      fullName: "Full Name / آپ کا نام",
      phoneField: "Phone Number / موبائل نمبر (e.g. 0300-xxxxxxx)",
      addressField: "Address / ڈیلیوری پتہ",
      instructionsField: "Spicy Customizations / خاص فرمائش (more chat masala?)",
      submitOrder: "Simulate Live Baking!",
      cancelBtn: "Go Back",
      promoPlaceholder: "Enter Dosti Promo Code (DESI20)",
      applyBtn: "Apply",
      billSubtotal: "Subtotal",
      billDelivery: "Tandoor Delivery",
      billDiscount: "Dosti Discount",
      billTotal: "Final Bill (PKR)",
      trackerTitle: "Live Clay-Oven & Rider Tracker",
      stepPrep: "Rolling Dough / پیڑا غوندنا",
      stepPrepDesc: "Chef Shamshad is hand-rolling the fresh sourdough Naan.",
      stepBake: "Tandoor Baking / تندوری بھٹی",
      stepBakeDesc: "Baking at sizzling 450°C in clay tandoor over real wood embers.",
      stepRoute: "Rider On Bike / رائڈر روانہ",
      stepRouteDesc: "Rider Sajawal has accelerated his step-through bike. Hot & Fresh!",
      stepDelivered: "Arrived Garam Garam! / دسترخوان پر حاضر",
      stepDeliveredDesc: "Bismillah! Sizzling fresh Desi Pizza has arrived. Enjoy with cold drink!",
      suggestSurprise: "Chef's Recommendation",
      suggestDesc: "Confused? Let chef Shamshad pick a customized surprise for you!",
      surpriseBtn: "Surprise Me!",
      reviewTitle: "Khas Mehman Reviews (Baithak Feedback)",
      reviewSubtitle: "What our food lovers say about our pure tandoori twists",
    },
    ur: {
      title: "دیسی پیزا ریسٹورنٹ",
      tagline: "تندور کی کلاسک مہک اور پیزا کا شاہی روایتی تڑکہ!",
      taglineUrdu: "سوادی بوٹیاں، تندوری خوشبو، اور پیزا کا تڑکہ!",
      searchPlaceholder: "شاہی پیزا تلاش کریں (مثلاً تکہ، کباب، ملائی)...",
      navMenu: "دسترخوان (مینو)",
      navCustom: "تیار کریں (بنائیں اپنی!)",
      navReviews: "بیٹھک (ریویوز)",
      spiceLabel: "روایتی مسالہ میٹر",
      spiceMild: "ہلکا پھلکا (Mild)",
      spiceSpicy: "مزیدار تیز (Medium)",
      spiceLahori: "لاہوری بارود بم (Extreme!) 🔥",
      menuTitle: "خاص دیسی پیزا مینو",
      menuSubtitle: "پشاور، کراچی اور لاہور کے خالص روایتی تندوری فلیورز",
      customizerTitle: "اپنی پیزا خود بنائیں (لیب)",
      customizerSubtitle: "خان صاحب بنے اور اپنی من پسند روایتی پیزا تیار کریں!",
      crustHeader: "۱۔ ٹیکنیکل تندوری کرسٹ منتخب کریں",
      sauceHeader: "۲۔ کڑاہی چٹنی ساس منتخب کریں",
      toppingsHeader: "۳۔ دیسی بوٹیاں اور لوازمات",
      toppingsNote: "تمام گوشت خالص مصالحوں میں میرینیٹ کیا گیا ہے",
      sizeLabel: "پیزا کا سائز منتخب کیجیے",
      cartHeader: "لیجیے آپ کا تھال (ٹوکری)",
      emptyCart: "آرڈر کی ٹوکری ابھی خالی ہے۔ جلدی سے لذیذ پیزا منتخب کیجیے!",
      addToCart: "ٹوکری میں ڈالیں",
      customBtn: "اپنی پسند کا بنائیں",
      total: "کل قیمت",
      checkoutBtn: "تازہ تازہ آرڈر بک کریں",
      checkoutHeader: "ڈیلیوری پتہ درج کیجیے",
      checkoutPrompt: "آرڈر تندور میں ڈالنے کے لیے پتہ درج کریں",
      fullName: "آپ کا پیارا نام",
      phoneField: "موبائل فون نمبر (جیسے 0300-1234567)",
      addressField: "گھر کا پتہ / گلی اور شہر",
      instructionsField: "خاص فرمائش (مثلاً ہری مرچیں زیادہ کریں!)",
      submitOrder: "چولہا آن کریں (بیکنگ شروع!)",
      cancelBtn: "پیچھے جائیں",
      promoPlaceholder: "دوستی کوپن (DESI20)",
      applyBtn: "لگائیں",
      billSubtotal: "پیزا قیمت",
      billDelivery: "رائڈر ڈیلیوری چارجز",
      billDiscount: "کوپن ڈسکاؤنٹ",
      billTotal: "کل قابلِ ادائی بل",
      trackerTitle: "تندور و ڈیلیوری ٹریکر (Live Oven)",
      stepPrep: "پیڑا تیار ہے",
      stepPrepDesc: "استاد شمشاد تازہ آٹے کے پیڑے بنا کر نان کی طرح بیل رہے ہیں۔",
      stepBake: "تندوری مٹی کی بھٹی",
      stepBakeDesc: "پیزا کو ۴۵۰ ڈگری پر سرخ کوئلوں پر پکا کر پنیر پگھلایا جا رہا ہے۔",
      stepRoute: "رائڈر سجاول بائیک پر",
      stepRouteDesc: "سجاول بھائی نے بھیا بائیک تیز کر دی ہے۔ خوشبو آپ کے محلے میں پہنچ رہی ہے!",
      stepDelivered: "گرم گرم حاضر ہے!",
      stepDeliveredDesc: "بسم اللہ! پیزا آپ کے دسترخوان پر پہنچ چکا ہے۔ مزے سے کھائیں اور دعائیں دیں!",
      suggestSurprise: "استاد کی خاص تجویز",
      suggestDesc: "سمجھ نہیں آرہا کیا کھائیں؟ استاد شمشاد کو خود حیران کن پیزا بنانے دیں!",
      surpriseBtn: "مجھے حیران کریں!",
      reviewTitle: "روایتی بیٹھک (لوگوں کی رائیں)",
      reviewSubtitle: "ہمارے پیزا کے کلاسک تندوری فلیورز کی تعریفیں",
    },
    roman: {
      title: "Desi Pizza Restaurant",
      tagline: "Spicy Tandoori Magic, Fresh Tandoor Naan Crust!",
      taglineUrdu: "Swadi botian, tandoori khushboo, aur pizza ka tadka!",
      searchPlaceholder: "Khas Desi pizza dhoondein (Tikka, Kabab, Paneer)...",
      navMenu: "Dastarkhwan (Menu)",
      navCustom: "Pizza Lab (Apna Banaen!)",
      navReviews: "Baithak (Reviews)",
      spiceLabel: "Spice Meter / Masala Level",
      spiceMild: "Halka / Mianwali Mild",
      spiceSpicy: "Medium / Desi Mazedar",
      spiceLahori: "Lashkara / Lahori Bambooka! 🌶️🌶️",
      menuTitle: "Khas Desi Pizza Menu",
      menuSubtitle: "Tandoori naan style baked crust, loaded with woodcoal grilled spicy botian",
      customizerTitle: "Apna Pizza Khud Banaen",
      customizerSubtitle: "Aaj ke Chef aap hain! Select karein tandoor crust, traditional sauce, aur fresh meat toppings.",
      crustHeader: "1. Select karein Tandoori Crust Style / Naan Crust",
      sauceHeader: "2. Curry Sauce chunein / Tandoori Masala Base",
      toppingsHeader: "3. Loaded Toppings / Desi Botian aur Masalay",
      toppingsNote: "Her ek boti tandoori masalon me pura raat marinated hoti hai",
      sizeLabel: "Choose Pizza Size / Size Chunein",
      cartHeader: "Aap Ka Thaal (Your Basket)",
      emptyCart: "Aap ka Thaal khali hai! Jaldi se garam pizza slice shamil karein.",
      addToCart: "Thaal me Dalein",
      customBtn: "Dil khol ke Customize karein",
      total: "Total Bill (Pura Hisab)",
      checkoutBtn: "Confirm Order / Tandoor par Charhaen",
      checkoutHeader: "Aap Ka Thaqaza (Fulfillment Options)",
      checkoutPrompt: "Apna pata ya baithak details dalen taake mitti ka tandoor garam kia jaye",
      fullName: "Host Name / Aap ka Naam",
      phoneField: "Contact/WhatsApp Number (e.g. 0300-1234567)",
      addressField: "Address / Ghar ka Pata",
      instructionsField: "Special Kitchen Instructions (extra chat masala?)",
      submitOrder: "Simulate Live Baking!",
      cancelBtn: "Wapas Jayein",
      promoPlaceholder: "Enter Dosti Promo Code (DESI20)",
      applyBtn: "Lagain!",
      billSubtotal: "Pizza Price",
      billDelivery: "Rider Delivery Charges",
      billDiscount: "Dosti Discount",
      billTotal: "Final Payable Bill (PKR)",
      trackerTitle: "Live Clay-Oven & Rider Tracker",
      stepPrep: "Rolling Sourdough / Pera Ghundna",
      stepPrepDesc: "Ustad Shamshad taza aatay ka pera bana ker naan jesa bail rahay hain.",
      stepBake: "Tandoor Baking / Tandoori Bhatti",
      stepBakeDesc: "Pizza ko 450°C mitti ke tandoor me red coal fire par pakaya ja raha hai.",
      stepRoute: "Rider On Way / Sajawal Bike par",
      stepRouteDesc: "Rider Sajawal ne motorcycle accelerator bacha dia hai, Garam Garam!",
      stepDelivered: "Arrived Garam Garam!! / Dastarkhwan par hazir",
      stepDeliveredDesc: "Bismillah! Sizzling fresh Desi Pizza thali me hazir hai. Coca-Cola ke sath enjoy karein!",
      suggestSurprise: "Ustad ki Khas Recommendation",
      suggestDesc: "Samajh nahi araha? Ustad Shamshad ko apnay hath se ek mast surprise pizza banany dein!",
      surpriseBtn: "Mujhe Hairan Karein!",
      reviewTitle: "Khas Mehman Reviews (Baithak)",
      reviewSubtitle: "Hamare pizza premion ki muft aur sachi tareefain",
    }
  };

  const t = TRANSLATIONS[lang];

  // Load cart from localStorage once on load
  useEffect(() => {
    const savedCart = localStorage.getItem("desi_pizza_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart");
      }
    }
  }, []);

  // Sync cart to localStorage
  const saveCartToLocalStorage = (newCart: any[]) => {
    setCart(newCart);
    localStorage.setItem("desi_pizza_cart", JSON.stringify(newCart));
  };

  // Live order tracker status simulator
  useEffect(() => {
    let interval: any;
    if (activeOrder && orderStep < 4) {
      interval = setInterval(() => {
        setOrderStep((prev) => {
          if (prev >= 4) {
            clearInterval(interval);
            return 4;
          }
          return (prev + 1) as any;
        });
      }, 5000); // Step updates every 5 seconds for simulation speed!
    }
    return () => clearInterval(interval);
  }, [activeOrder, orderStep]);

  // Liked items handler
  const toggleLike = (itemId: string) => {
    const wasLiked = likedItems[itemId];
    setLikedItems({ ...likedItems, [itemId]: !wasLiked });
    setLikes({
      ...likes,
      [itemId]: wasLiked ? likes[itemId] - 1 : likes[itemId] + 1
    });
  };

  // Quick customizer toggler
  const toggleToppingInCustomizer = (toppingId: string) => {
    if (selectedToppings.includes(toppingId)) {
      setSelectedToppings(selectedToppings.filter((id) => id !== toppingId));
    } else {
      setSelectedToppings([...selectedToppings, toppingId]);
    }
  };

  // Setup dynamic list with search & category filters
  const filteredMenuItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.urduName.includes(searchQuery) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCategory =
        currentCategory === "all" ||
        (currentCategory === "veg" && item.isVegetarian) ||
        (currentCategory === "spicy" && item.spiciness >= 2);

      const matchFoodCategory =
        activeFoodCategory === "all" ||
        item.category === activeFoodCategory;

      return matchSearch && matchCategory && matchFoodCategory;
    });
  }, [searchQuery, currentCategory, activeFoodCategory]);

  // Dynamic price calculation helper for building customized pizza
  const currentCustomPizzaPrice = useMemo(() => {
    let price = 1000; // base price for Medium
    if (customSize === "Small") price = 800;
    if (customSize === "Large") price = 1350;
    if (customSize === "Extra Large") price = 1650;

    // Add crust cost
    price += customCrust.price;

    // Add toppings cost
    selectedToppings.forEach((topId) => {
      const topping = DESI_TOPPINGS.find((t) => t.id === topId);
      if (topping) {
        price += topping.price;
      }
    });

    // Spiciness surcharge (Extreme spicy gets slight pepper seasoning boost)
    if (globalSpice === 3) {
      price += 30; // Just for extra peppers & green chilis
    }

    return price;
  }, [customSize, customCrust, selectedToppings, globalSpice]);

  // Push customized pizza to cart
  const addCustomizedPizzaToCart = () => {
    const toppingsSelectedObjects = selectedToppings.map((id) => {
      const top = DESI_TOPPINGS.find((t) => t.id === id);
      return { id, name: top?.name || id, price: top?.price || 0 };
    });

    const customPizzaItem = {
      cartId: "custom-" + Date.now(),
      name: `Custom ${customCrust.name.split("/")[0].trim()}`,
      urduName: lang === "en" ? "Custom Crafted Pizza" : lang === "roman" ? "Aap Ka Farmaishi Pizza" : "آپ کا فرمائشی پیزا",
      size: customSize,
      crust: customCrust,
      sauce: customSauce,
      toppings: toppingsSelectedObjects,
      price: currentCustomPizzaPrice,
      quantity: 1,
      isCustom: true,
      spiciness: globalSpice,
    };

    const newCart = [...cart, customPizzaItem];
    saveCartToLocalStorage(newCart);
    setActiveTab("menu"); // switch tab to show cart on right!
    
    // Smooth toast indicator
    const feedbackEl = document.getElementById("cart-notification");
    if (feedbackEl) {
      feedbackEl.classList.remove("opacity-0");
      feedbackEl.classList.add("opacity-100");
      setTimeout(() => {
        feedbackEl.classList.add("opacity-0");
        feedbackEl.classList.remove("opacity-100");
      }, 2000);
    }
  };

  // Push pre-configured items to cart
  const addPreconfiguredToCart = (item: MenuItem, size: "Small" | "Medium" | "Large" | "Extra Large" = "Medium") => {
    let price = item.basePrice;
    if (size === "Small") price -= 200;
    if (size === "Large") price += 250;
    if (size === "Extra Large") price += 450;

    const cartInstance = {
      cartId: `${item.id}-${size}-${Date.now()}`,
      id: item.id,
      name: item.name,
      urduName: item.urduName,
      size,
      crust: { id: "naan", name: "Traditional Naan Crust / نان کرسٹ", price: 100 },
      sauce: { id: "masala", name: "Spicy Tandoori Sauce" },
      toppings: [],
      price,
      quantity: 1,
      isCustom: false,
      spiciness: item.spiciness,
    };

    const newCart = [...cart, cartInstance];
    saveCartToLocalStorage(newCart);

    // Bounce notification
    const feedbackEl = document.getElementById("cart-notification");
    if (feedbackEl) {
      feedbackEl.classList.remove("opacity-0");
      feedbackEl.classList.add("opacity-100");
      setTimeout(() => {
        feedbackEl.classList.add("opacity-0");
        feedbackEl.classList.remove("opacity-100");
      }, 2000);
    }
  };

  // Push combo package to cart
  const addComboToCart = (combo: any) => {
    const cartInstance = {
      cartId: `${combo.id}-${Date.now()}`,
      id: combo.id,
      name: combo.name,
      urduName: combo.urduName,
      size: "Family Thaal",
      crust: { id: "naan", name: "Traditional Naan / نان کرسٹ", price: 0 },
      sauce: { id: "masala", name: "Tandoori Sauce" },
      toppings: [],
      price: combo.basePrice,
      quantity: 1,
      isCustom: false,
      isCombo: true,
      itemsSummary: combo.itemsSummary,
    };

    const newCart = [...cart, cartInstance];
    saveCartToLocalStorage(newCart);

    // Bounce notification
    const feedbackEl = document.getElementById("cart-notification");
    if (feedbackEl) {
      feedbackEl.classList.remove("opacity-0");
      feedbackEl.classList.add("opacity-100");
      setTimeout(() => {
        feedbackEl.classList.add("opacity-0");
        feedbackEl.classList.remove("opacity-100");
      }, 2000);
    }
  };

  // Cart action helpers
  const updateQuantity = (cartId: string, delta: number) => {
    const updated = cart.map((item) => {
      if (item.cartId === cartId) {
        const nextQty = item.quantity + delta;
        return { ...item, quantity: nextQty > 0 ? nextQty : 1 };
      }
      return item;
    });
    saveCartToLocalStorage(updated);
  };

  const removeCartItem = (cartId: string) => {
    const updated = cart.filter((item) => item.cartId !== cartId);
    saveCartToLocalStorage(updated);
  };

  // Dynamic surprise generator representing Chef's Special
  const handleSurpriseSelect = () => {
    // Pick random size, random crust, and random subset of toppings
    const sizes: ("Small" | "Medium" | "Large" | "Extra Large")[] = ["Medium", "Large", "Extra Large"];
    const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
    const randomCrust = DESI_CRUSTS[Math.floor(Math.random() * DESI_CRUSTS.length)];
    const randomSauce = DESI_SAUCES[Math.floor(Math.random() * DESI_SAUCES.length)];
    
    // Pick 3-5 random toppings
    const shuffledToppings = [...DESI_TOPPINGS].sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * 3) + 3; // 3 to 5 toppings
    const randomToppingIds = shuffledToppings.slice(0, count).map((t) => t.id);

    setCustomSize(randomSize);
    setCustomCrust(randomCrust);
    setCustomSauce(randomSauce);
    setSelectedToppings(randomToppingIds);
    setActiveTab("customizer");

    // Scroll smoothly to customizer area
    document.getElementById("desi-pizza-lab")?.scrollIntoView({ behavior: "smooth" });
  };

  // Totals calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [cart]);

  const selectedTableSpotObj = useMemo(() => {
    return HOTEL_TABLES.find((tbl) => tbl.id === selectedTableSpot) || HOTEL_TABLES[0];
  }, [selectedTableSpot]);

  const tableReservationCharges = useMemo(() => {
    if (fulfillmentType === "dinein" && cartSubtotal > 0) {
      return selectedTableSpotObj ? selectedTableSpotObj.price : 0;
    }
    return 0;
  }, [fulfillmentType, selectedTableSpotObj, cartSubtotal]);

  const deliveryCharges = useMemo(() => {
    if (fulfillmentType === "delivery" && cartSubtotal > 0) {
      return 150;
    }
    return 0;
  }, [fulfillmentType, cartSubtotal]);

  const appliedDiscountValue = useMemo(() => {
    return Math.round((cartSubtotal * discountPercent) / 100);
  }, [cartSubtotal, discountPercent]);

  const loyaltyPointsDiscount = useMemo(() => {
    if (redeemCoinsToggle && loyaltyCoins >= 100 && cartSubtotal > 0) {
      return 200; // Rs 200 discount for 100 loyalty points
    }
    return 0;
  }, [redeemCoinsToggle, loyaltyCoins, cartSubtotal]);

  const finalCartTotal = useMemo(() => {
    const calculated = cartSubtotal + deliveryCharges + tableReservationCharges - appliedDiscountValue - loyaltyPointsDiscount;
    return Math.max(0, calculated);
  }, [cartSubtotal, deliveryCharges, tableReservationCharges, appliedDiscountValue, loyaltyPointsDiscount]);

  // Apply Coupon Code
  const applyDostiCode = () => {
    if (promoCode.trim().toUpperCase() === "DESI20") {
      setDiscountPercent(20);
      setPromoApplied("DESI20");
    } else if (promoCode.trim().toUpperCase() === "DOSTI50") {
      setDiscountPercent(50);
      setPromoApplied("DOSTI50");
    } else {
      alert("Uh oh! Code not found. Try 'DESI20' for a friendly 20% discount!");
    }
  };

  // Submit Order Details
  const handlePlaceOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert(lang === "en" ? "Please fill in Name and Phone details!" : lang === "roman" ? "Meherbani farma kar apna Naam aur Phone number likhein!" : "برائے کرم اپنا نام اور فون نمبر درج کریں!");
      return;
    }

    if (fulfillmentType === "delivery" && !address) {
      alert(lang === "en" ? "Please enter your delivery address!" : lang === "roman" ? "Meherbani farma kar delivery ka pata likhein!" : "برائے کرم ڈیلیوری ایڈریس درج کریں!");
      return;
    }

    let computedAddress = address;
    if (fulfillmentType === "dinein") {
      computedAddress = `${selectedTableSpotObj.name} - Slot: ${dineinTime} (${dineinDate}) for ${dineinGuests} guests`;
    } else if (fulfillmentType === "pickup") {
      computedAddress = "Self-Pickup from Main Tandoor Counter (Takeaway / خود اٹھانا)";
    }

    const orderDetails = {
      id: "DPR-" + Math.floor(Math.random() * 90000 + 10000),
      clientName: name,
      clientPhone: phone,
      clientAddress: computedAddress,
      clientInstructions: instructions,
      fulfillmentType: fulfillmentType,
      selectedTableSpot: fulfillmentType === "dinein" ? selectedTableSpotObj : null,
      dineinGuests: fulfillmentType === "dinein" ? dineinGuests : 0,
      dineinTime: fulfillmentType === "dinein" ? dineinTime : "",
      dineinDate: fulfillmentType === "dinein" ? dineinDate : "",
      items: [...cart],
      billTotal: finalCartTotal,
      time: new Date().toLocaleTimeString(),
    };

    // Loyalty coins logic
    let nextCoins = loyaltyCoins;
    if (redeemCoinsToggle && nextCoins >= 100) {
      nextCoins -= 100;
    }
    const earned = Math.round(cartSubtotal * 0.1);
    nextCoins += earned;
    setLoyaltyCoins(nextCoins);
    localStorage.setItem("desi_loyalty_coins_key", nextCoins.toString());
    setRedeemCoinsToggle(false);

    setActiveOrder(orderDetails);
    setOrderStep(1); // Set step to Roll Sourdough
    setIsCheckingOut(false);
    
    // Empty cart and save
    saveCartToLocalStorage([]);
  };

  const resetOrderTracker = () => {
    setActiveOrder(null);
    setOrderStep(0);
    // Clear form
    setName("");
    setPhone("");
    setAddress("");
    setInstructions("");
    setFulfillmentType("delivery");
    setRiderBuzzedTimes(0);
    setRiderExtraChat("");
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName || !newReviewComment) {
      alert("Please fill your Name and comment details! / برائے مہربانی نام اور کمنٹ درج کریں!");
      return;
    }
    const valRating = parseFloat(newReviewRating) || 5;
    const finalValRating = Math.max(1, Math.min(5, valRating));
    
    // Auto translate comment to urdu in a funny way if not provided
    const defaultUrduComments = [
      "بہت اعلیٰ ذائقہ ہے بھائی، مزہ آگیا کلاسک تندور کا پیزا کھا کر!",
      "شمشاد کلاسک استاد کی کمال کاریگری ہے بھائی، نان کرسٹ کا الگ ہی سواد ہے۔",
      "گرما گرم کوئلے کی کلاسک مہک اور پیزا کا مصالحے دار دیسی تڑکہ!",
      "فیملی کے ساتھ دیسی بیٹھک میں ڈنر کا مزہ دوبالا ہوگیا۔ شاندار سروس!",
    ];
    const randomUrdu = defaultUrduComments[Math.floor(Math.random() * defaultUrduComments.length)];
    const finalUrdu = newReviewUrduComment || randomUrdu;

    const newRevObj = {
      id: reviewsList.length + 1,
      name: newReviewName,
      location: lang === "en" ? "VIP Guest Host" : "معزز مہمان",
      rating: finalValRating,
      comment: newReviewComment,
      urduComment: finalUrdu,
      avatar: ["👨🏼‍🍳", "🦁", "🔥", "👑", "🍕", "💖"][Math.floor(Math.random() * 6)],
    };

    setReviewsList([newRevObj, ...reviewsList]);

    // Alert & clean up
    const originalName = newReviewName;
    setNewReviewName("");
    setNewReviewComment("");
    setNewReviewUrduComment("");
    
    // Trigger simulated reply from Chef Shamshad
    setTimeout(() => {
      alert(`Master Chef Shamshad replies: "Shukriya ${originalName} Sahib! SubhanAllah for your appreciation! Your words keep our clay ovens burning with pride! 🪵🔥"`);
    }, 1200);
  };

  const copyWhatsAppSlip = () => {
    if (!activeOrder) return;
    const itemString = activeOrder.items.map((it: any) => `  * ${it.quantity}x ${it.name} (${it.size}) - Rs. ${it.price * it.quantity}`).join("\n");
    const textSlip = `🔥 *DESI PIZZA RESTAURANT ORDER SLIP* 🔥\n\n` +
      `*Order ID:* ${activeOrder.id}\n` +
      `*Guest Name:* ${activeOrder.clientName}\n` +
      `*Contact Phone:* ${activeOrder.clientPhone}\n` +
      `*Fulfillment Type:* ${activeOrder.fulfillmentType.toUpperCase()}\n` +
      `*Address/Sitting:* ${activeOrder.clientAddress}\n\n` +
      `*🍽️ Menu Items Chosen:*\n${itemString}\n\n` +
      `*💵 Grand Final Bill:* Rs. ${activeOrder.billTotal}\n\n` +
      `*Chef Comment:* Baked right in master clay tandoor on red woodcoal fire! Thank you for ordering from Desi Pizza Restaurant! 🍕✨`;
      
    navigator.clipboard.writeText(textSlip);
    alert("Shukriya! Order Slip loaded beautifully onto your clipboard. Go ahead and share it with Chef / Rider on WhatsApp!");
  };

  return (
    <div id="hotel_applet_root" className="min-h-screen bg-amber-50 text-stone-800 font-sans leading-relaxed selection:bg-amber-400 selection:text-amber-950 pb-16 antialiased">
      {/* Toast Notification for additions */}
      <div 
        id="cart-notification" 
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-amber-300 px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl transition-all duration-300 transform opacity-0 pointer-events-none text-sm font-semibold border border-amber-500/20"
      >
        <Sparkles className="w-5 h-5 text-amber-500 animate-pulse animate-duration-1000" />
        <span>{lang === "en" ? "Garam Garam slice added to basket! 🍕" : lang === "roman" ? "Garam Garam slice basket me shamil ho gya hai! 🍕" : "پیزا ٹوکری میں شامل کر دیا گیا! 🍕"}</span>
      </div>

      {/* Hero Header Banner */}
      <header className="relative bg-stone-950 text-white min-h-[360px] md:min-h-[420px] flex flex-col justify-between overflow-hidden">
        {/* Background Image with elegant amber vignette overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/src/assets/images/desi_pizza_hero_1781781893038.jpg" 
            alt="Desi Pizza Header Logo" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transform scale-105 filter brightness-[0.34] select-none contrast-[1.05]"
          />
          {/* Subtle gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-transparent to-transparent" />
        </div>

        {/* Top bar controls */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-4 md:pt-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-amber-500 text-stone-950 font-black text-xl md:text-2xl px-3 py-1.5 rounded-lg rotate-[-2deg] shadow-lg border border-amber-300 flex items-center gap-2">
              <ChefHat className="w-5 h-5 md:w-6 md:h-6" /> Desi Pizza
            </span>
            <span className="hidden sm:inline-block text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full font-mono">
              EST. 2026
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Global Language Selector (Supporting English, Urdu, and Roman Urdu / Zuban!) */}
            <div id="language_pills" className="flex bg-stone-900/90 rounded-full p-1 border border-amber-500/30 shadow-md">
              {[
                { id: "en", label: "English" },
                { id: "ur", label: "اردو" },
                { id: "roman", label: "Roman" }
              ].map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLang(l.id as any)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-black transition-all cursor-pointer ${
                    lang === l.id 
                      ? "bg-amber-500 text-stone-950 font-black scale-105 shadow-sm" 
                      : "text-stone-300 hover:text-amber-200"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Quick Basket button */}
            <button 
              id="header_quick_basket"
              onClick={() => {
                setActiveTab("menu");
                setTimeout(() => {
                  document.getElementById("aap-ka-thaal")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="relative bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-full transition-all flex items-center gap-2 shadow-md hover:scale-105 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs md:text-sm">{lang === "en" ? "Thaal" : "تھال"}</span>
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold animate-bounce shadow-md">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Hero Central Content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-10 md:py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight text-white drop-shadow-lg leading-tight uppercase">
              {t.title}
            </h1>
            <p className="text-amber-400 font-display text-lg md:text-2xl font-semibold tracking-wide max-w-2xl mx-auto drop-shadow">
              {t.tagline}
            </p>
            <p className="text-stone-300 font-serif text-sm md:text-lg italic opacity-95">
              "{t.taglineUrdu}"
            </p>
            
            {/* Spice levels global warning / tag banner */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-stone-900/80 border border-stone-800 px-4 py-2.5 rounded-2xl max-w-lg mx-auto">
              <span className="text-xs text-stone-400 font-semibold">{t.spiceLabel}:</span>
              <div className="flex gap-1.5">
                {[1, 2, 3].map((s) => (
                  <button
                    key={s}
                    id={`spice_meter_btn_${s}`}
                    onClick={() => setGlobalSpice(s as any)}
                    className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
                      globalSpice === s
                        ? s === 1
                          ? "bg-emerald-500 text-stone-950 font-bold scale-105"
                          : s === 2
                          ? "bg-amber-500 text-stone-950 font-bold scale-105"
                          : "bg-red-600 text-white font-bold scale-105 animate-pulse"
                        : "bg-stone-800 text-stone-400 hover:text-white"
                    }`}
                  >
                    {s === 1 ? t.spiceMild : s === 2 ? t.spiceSpicy : t.spiceLahori}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Global Tab Bar with authentic vibes */}
        <div className="relative z-10 bg-stone-900/90 border-t border-stone-800/80 py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 md:gap-4 flex-wrap">
            <button
              id="tab_menu_btn"
              onClick={() => setActiveTab("menu")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all focus:outline-none ${
                activeTab === "menu"
                  ? "bg-amber-500 text-stone-950 shadow-md"
                  : "text-stone-300 hover:bg-stone-800 hover:text-white"
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>{t.navMenu}</span>
            </button>
            <button
              id="tab_custom_btn"
              onClick={() => setActiveTab("customizer")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all focus:outline-none relative ${
                activeTab === "customizer"
                  ? "bg-amber-500 text-stone-950 shadow-md"
                  : "text-stone-300 hover:bg-stone-800 hover:text-white"
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>{t.navCustom}</span>
              <span className="absolute -top-1 -right-2 bg-red-600 text-[9px] text-white font-black px-1.5 py-0.5 rounded-full tracking-tighter uppercase animate-pulse">
                Lab
              </span>
            </button>
            <button
              id="tab_reviews_btn"
              onClick={() => setActiveTab("reviews")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all focus:outline-none ${
                activeTab === "reviews"
                  ? "bg-amber-500 text-stone-950 shadow-md"
                  : "text-stone-300 hover:bg-stone-800 hover:text-white"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t.navReviews}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        
        {/* LEFT COLUMN: Main content dynamic tabs (8 cols) */}
        <section className="lg:col-span-8 space-y-8">
          
          {/* REALTIME KITCHEN METRICS / DIGITAL COUNTERS (Jo go go hotel me hota hai) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-stone-900 text-white p-4.5 rounded-3xl border border-stone-800 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-0.5 text-center md:text-left">
              <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider">🔥 Tandoor Temp</span>
              <div className="flex items-center justify-center md:justify-start gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="font-mono font-black text-xs text-red-400">450°C Clay Oven</span>
              </div>
            </div>

            <div className="space-y-0.5 text-center md:text-left border-l border-stone-800">
              <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider pl-0 md:pl-4">🥖 Naan Batches</span>
              <div className="flex items-center justify-center md:justify-start gap-1 pl-0 md:pl-4">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                <span className="font-mono font-black text-xs text-stone-100 font-mono">Hot & Fresh</span>
              </div>
            </div>

            <div className="space-y-0.5 text-center md:text-left border-l border-stone-800">
              <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider pl-0 md:pl-4">🛋️ Table Seats</span>
              <div className="flex items-center justify-center md:justify-start gap-1 pl-0 md:pl-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="font-mono font-black text-xs text-emerald-400">9 Active Sittings</span>
              </div>
            </div>

            <div className="space-y-0.5 text-center md:text-left border-l border-stone-800">
              <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider pl-0 md:pl-4">🛵 Wait Time</span>
              <div className="flex items-center justify-center md:justify-start gap-1 pl-0 md:pl-4">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="font-mono font-black text-xs text-amber-300">18 - 25 Mins</span>
              </div>
            </div>
          </div>
          
          {/* SEARCH & CATEGORY SELECTOR CARD (Hidden in customizer mode to reduce clutter) */}
          {activeTab === "menu" && (
            <div id="search_and_filter_card" className="bg-white p-4 rounded-3xl shadow-sm border border-stone-100 flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Custom search bar */}
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5 pointer-events-none" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-stone-50 rounded-2xl text-stone-800 border-none outline-none focus:ring-2 focus:ring-amber-400 font-medium text-sm transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quick filter tabs */}
              <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                <button
                  id="category_all"
                  onClick={() => setCurrentCategory("all")}
                  className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all whitespace-nowrap ${
                    currentCategory === "all"
                      ? "bg-stone-900 border-stone-900 text-amber-300"
                      : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  🌶️ {lang === "en" ? "All Flavors / سب" : lang === "roman" ? "Sab Flavors" : "سب پیزے"}
                </button>
                <button
                  id="category_spicy"
                  onClick={() => setCurrentCategory("spicy")}
                  className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all whitespace-nowrap ${
                    currentCategory === "spicy"
                      ? "bg-red-600 border-red-600 text-white"
                      : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  🔥 {lang === "en" ? "Spicy / مسالے دار" : lang === "roman" ? "Chilkara Spicy" : "تیز مرچ"}
                </button>
                <button
                  id="category_veg"
                  onClick={() => setCurrentCategory("veg")}
                  className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all whitespace-nowrap ${
                    currentCategory === "veg"
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  🌿 {lang === "en" ? "Vegetarian / پنیر مکس" : lang === "roman" ? "Paneer / Sabzi" : "صرف سبزی/پنیر"}
                </button>
              </div>
            </div>
          )}

          {/* DYNAMIC TAB COMPONENT 1: THE MENU */}
          <AnimatePresence mode="wait">
            {activeTab === "menu" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-display font-extrabold text-stone-900 flex items-center gap-2">
                      <UtensilsCrossed className="w-6 h-6 text-amber-500" />
                      {t.menuTitle}
                    </h2>
                    <p className="text-sm text-stone-500 font-medium">
                      {t.menuSubtitle}
                    </p>
                  </div>

                  {/* Surprise Button helper inside menu header */}
                  <div className="hidden md:block">
                    <button
                      id="action_surprise_me"
                      onClick={handleSurpriseSelect}
                      className="bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 group cursor-pointer transition-all border border-stone-800"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500 animate-spin animate-duration-3000 group-hover:scale-110" />
                      <span>{t.surpriseBtn}</span>
                    </button>
                  </div>
                </div>

                {/* Food Category Selector Tabs */}
                <div id="food_category_tabs" className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5 bg-stone-50 p-2 rounded-3xl border border-stone-100">
                  {[
                    { id: "all", labelEn: "All Thaal", labelUr: "سب کچھ", icon: "🍽️" },
                    { id: "pizza", labelEn: "Royale Pizzas", labelUr: "شاہی پیزا", icon: "🍕" },
                    { id: "starter", labelEn: "Appetizers", labelUr: "کباب و رول", icon: "🍢" },
                    { id: "beverage", labelEn: "Sweet Drinks", labelUr: "ٹھنڈی لسی و جوس", icon: "🥤" },
                    { id: "dessert", labelEn: "Desserts", labelUr: "شیریں میٹھا", icon: "🍧" }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveFoodCategory(cat.id as any)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer border ${
                        activeFoodCategory === cat.id
                          ? "bg-amber-500 border-amber-500 text-stone-950 shadow-sm"
                          : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      <span className="text-base">{cat.icon}</span>
                      <div className="text-left leading-none">
                        <div className="text-[9px] uppercase font-bold tracking-wider opacity-65">
                          {cat.labelEn}
                        </div>
                        <div className="font-display text-xs font-bold mt-0.5">
                          {cat.labelUr}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* HOTEL EXCLUSIVE SPECIAL COMBO PLATTERS SECTION */}
                {(activeFoodCategory === "all" || activeFoodCategory === "pizza") && searchQuery === "" && (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🔥</span>
                      <div>
                        <h3 className="text-lg md:text-xl font-display font-extrabold text-stone-900 leading-none">
                          {lang === "en" ? "Exclusive Hotel Combo Platters" : "ہوٹل کے خصوصی شاہی فیملی تھال"}
                        </h3>
                        <p className="text-xs text-stone-500 font-medium mt-0.5">
                          {lang === "en" ? "Huge savings & traditional pairings crafted for gatherings" : "کلاسک جوڑے اور شاندار بچت، جو فیملی بیٹھک کی زینت بنیں"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {HOTEL_COMBOS.map((combo) => (
                        <div 
                          key={combo.id}
                          className="bg-gradient-to-br from-stone-950 to-stone-900 text-white rounded-3xl overflow-hidden border border-amber-500/10 shadow-lg flex flex-col justify-between"
                        >
                          <div className="relative h-44 w-full bg-stone-950/45">
                            <img 
                              src={combo.image} 
                              alt={combo.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover select-none brightness-75 filter contrast-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
                            <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                              {combo.tags.map((tag) => (
                                <span key={tag} className="bg-amber-500 text-stone-950 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-md">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="absolute bottom-3 right-3 bg-amber-500 text-stone-950 font-mono font-black px-3.5 py-1 rounded-xl text-sm shadow-md">
                              Rs. {combo.basePrice}
                            </div>
                          </div>

                          <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                            <div className="space-y-2">
                              <div>
                                <h4 className="text-sm font-black text-amber-400">{combo.name}</h4>
                                <h5 className="text-xs font-bold text-stone-300 font-serif mt-0.5">{combo.urduName}</h5>
                              </div>
                              <p className="text-[11px] text-stone-400 leading-relaxed">
                                {combo.description}
                              </p>
                              <p className="text-[11px] text-amber-300/95 font-serif italic">
                                "{combo.urduDescription}"
                              </p>

                              {/* Included list items */}
                              <div className="pt-2.5 border-t border-stone-800">
                                <span className="text-[10px] text-stone-400 uppercase tracking-widest font-black block mb-1.5">
                                  {lang === "en" ? "Platter contains:" : "تھال میں شامل لوازمات:"}
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px] text-stone-300 font-medium">
                                  {combo.itemsSummary.map((subItem, idx) => (
                                    <div key={idx} className="flex items-center gap-1.5 bg-stone-900/60 p-1.5 rounded-lg border border-stone-850">
                                      <span className="text-amber-400 font-bold">✓</span>
                                      <span>{subItem}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <button
                              id={`add_combo_btn_${combo.id}`}
                              onClick={() => addComboToCart(combo)}
                              className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.01] active:scale-95 mt-4"
                            >
                              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                              <span>{lang === "en" ? "Add Platter to Basket" : "شاہی تھال ٹوکری میں ڈالیں"}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filteredMenuItems.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-stone-100">
                    <Trash2 className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                    <p className="text-stone-500 font-medium">
                      {lang === "en" ? "No sizzling pizzas found! Try resetting the filter or search term." : "کوئی پیزا نہیں ملا! متبادل لفظ تلاش کریں۔"}
                    </p>
                    <button 
                      onClick={() => { setSearchQuery(""); setCurrentCategory("all"); }}
                      className="mt-4 bg-amber-500 text-stone-950 px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-400"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredMenuItems.map((item) => (
                      <div 
                        key={item.id} 
                        id={`pizza_card_${item.id}`}
                        className="bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-300 flex flex-col justify-between"
                      >
                        {/* Item image layer */}
                        <div className="relative h-48 md:h-52 w-full overflow-hidden bg-stone-100">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover select-none transition-all duration-700 hover:scale-105"
                          />
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                            {item.tags.map((tag) => (
                              <span key={tag} className="bg-stone-950/90 text-amber-400 text-[10px] font-mono px-2.5 py-1 rounded-full border border-amber-500/10 backdrop-blur-xs">
                                {tag}
                              </span>
                            ))}
                            {item.isVegetarian && (
                              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                                🟢 Veg
                              </span>
                            )}
                          </div>

                          {/* Interactive Like component */}
                          <button
                            onClick={() => toggleLike(item.id)}
                            className="absolute top-3 right-3 bg-white/90 hover:bg-white text-rose-500 p-2 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 flex items-center justify-center border border-stone-100"
                          >
                            <Heart className={`w-4 h-4 ${likedItems[item.id] ? "fill-current scale-110" : ""}`} />
                            <span className="text-[10px] font-bold ml-1 text-stone-700">{likes[item.id]}</span>
                          </button>

                          {/* Dynamic heat index badge */}
                          <div className="absolute bottom-3 right-3 bg-stone-950/90 text-stone-200 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-xs">
                            <Flame className={`w-3.5 h-3.5 ${item.spiciness >= 2 ? "text-red-500" : "text-amber-500"}`} />
                            <span>
                              {item.spiciness === 1 ? "Mild" : item.spiciness === 2 ? "Desi Hot" : "Explosive 🔥"}
                            </span>
                          </div>
                        </div>

                        {/* Title and details details */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-lg font-display font-extrabold text-stone-900 group-hover:text-amber-600">
                                {item.name}
                              </h3>
                              <span className="bg-amber-100 dark:bg-amber-100 text-amber-900 font-mono text-sm font-black px-2.5 py-1 rounded-lg">
                                Rs. {item.basePrice}
                              </span>
                            </div>

                            {/* Nastaliq script presentation */}
                            <p className="text-amber-600 font-display font-bold text-sm tracking-wide">
                              {item.urduName}
                            </p>

                            <p className="text-xs text-stone-500 line-clamp-2">
                              {item.description}
                            </p>
                            <p className="text-xs text-stone-400 font-serif italic">
                              "{item.urduDescription}"
                            </p>
                          </div>

                          {/* Size selector & Addition button */}
                          <div className="pt-3 border-t border-stone-100 grid grid-cols-2 gap-3 items-center">
                            {/* Short quick select sizes */}
                            <div className="flex flex-col">
                              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                                {item.category === "pizza" ? "Size Option" : "Portion Serving"}
                              </span>
                              <span className="text-xs text-stone-700 font-bold">
                                {item.category === "pizza" && (lang === "en" ? "Standard Medium" : "درمیانہ سائز")}
                                {item.category === "starter" && (lang === "en" ? "Fresh Portion" : "ایک پلیٹ سرونگ")}
                                {item.category === "beverage" && (lang === "en" ? "Chilled Bottle/Mug" : "ٹھنڈی بوتل / گلاس")}
                                {item.category === "dessert" && (lang === "en" ? "Dulcet Sweet" : "شیریں تھال")}
                              </span>
                            </div>

                            <button
                              id={`add_to_cart_btn_${item.id}`}
                              onClick={() => addPreconfiguredToCart(item)}
                              className="bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 group cursor-pointer shadow-xs active:scale-95 transition-transform"
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[3]" />
                              <span>{t.addToCart}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Mobile version chef's recommendation banner */}
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-stone-950 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm border border-amber-400/20">
                  <div className="space-y-1 text-center md:text-left">
                    <h3 className="text-lg font-display font-extrabold text-stone-900 flex items-center justify-center md:justify-start gap-1.5 leading-none">
                      <Award className="w-5 h-5 text-stone-950 animate-bounce" />
                      {t.suggestSurprise}
                    </h3>
                    <p className="text-sm font-medium opacity-90 max-w-md">
                      {t.suggestDesc}
                    </p>
                  </div>
                  <button
                    id="mobile_surprise_button"
                    onClick={handleSurpriseSelect}
                    className="w-full md:w-auto bg-stone-950 text-amber-300 font-black py-3 px-6 rounded-2xl text-xs hover:bg-stone-900 transition-all uppercase tracking-wide cursor-pointer active:scale-95 flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{t.surpriseBtn}</span>
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

          {/* DYNAMIC TAB COMPONENT 2: INTERACTIVE PIZZA CUSTOMIZER (THE DESI LAB) */}
          <AnimatePresence mode="wait">
            {activeTab === "customizer" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
                id="desi-pizza-lab"
              >
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-extrabold text-stone-900 flex items-center gap-2">
                    <ChefHat className="w-7 h-7 text-amber-500 animate-pulse" />
                    {t.customizerTitle}
                  </h2>
                  <p className="text-sm text-stone-500 font-medium">
                    {t.customizerSubtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
                  
                  {/* Visually Stunning Pizza representation canvas (5 grid cols) */}
                  <div className="md:col-span-5 flex flex-col justify-between items-center bg-stone-950 p-6 rounded-2xl relative overflow-hidden text-center min-h-[380px]">
                    <span className="absolute top-3 left-3 bg-stone-900 text-amber-400 text-[10px] font-extrabold px-2.5 py-1 rounded-md tracking-wider uppercase">
                      Live Tandoor Preview
                    </span>

                    {/* PIZZA CANVAS CONTAINER */}
                    <div className="my-auto relative w-56 h-56 md:w-64 md:h-64 flex items-center justify-center z-10">
                      {/* Tandoori Platter ring */}
                      <div className="absolute inset-0 rounded-full border-[8px] border-amber-950 bg-stone-900 shadow-2xl desi-glow" />

                      {/* 1. Crust Layer */}
                      <div 
                        className={`absolute inset-4 rounded-full transition-all duration-500 ${
                          customCrust.id === "naan" 
                            ? "bg-amber-600 border-[6px] border-amber-700/80 shadow-inner" 
                            : customCrust.id === "garlic_naan"
                            ? "bg-yellow-600 border-[6px] border-yellow-700/80 shadow-md ring-2 ring-yellow-400/20"
                            : customCrust.id === "pan"
                            ? "bg-amber-700 border-[8px] border-amber-850"
                            : "bg-amber-500 border-4 border-amber-600"
                        } flex items-center justify-center overflow-hidden`}
                      >
                        {/* Golden speckles for cooked/baked naan texture */}
                        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#b45309_1.5px,transparent_1.5px)] [background-size:12px_12px]" />
                        
                        {/* 2. Sauce Base Layer overlay */}
                        <div 
                          className={`absolute inset-4 rounded-full transition-all duration-500 ${
                            customSauce.id === "masala"
                              ? "bg-red-700/90 shadow-lg"
                              : customSauce.id === "makhani"
                              ? "bg-amber-600/90"
                              : customSauce.id === "garlic_yoghurt"
                              ? "bg-stone-100/90"
                              : "bg-red-600/80"
                          } mix-blend-multiply flex items-center justify-center`}
                        />

                        {/* Cheese Melting Glaze */}
                        <div className="absolute inset-5 rounded-full bg-yellow-300/60 mix-blend-screen animate-pulse animate-duration-3000" />
                        <div className="absolute inset-8 rounded-full bg-yellow-400/40 mix-blend-multiply" />

                        {/* 3. DYNAMIC TOPPING PLACEMENTS (SVG coordinate offsets mapped beautifully!) */}
                        {DESI_TOPPINGS.map((topObj, index) => {
                          const isActive = selectedToppings.includes(topObj.id);
                          if (!isActive) return null;

                          // Map distinct coordinate grids for toppings scatter
                          const coordinates = [
                            { top: "25%", left: "30%", scale: 1 },
                            { top: "20%", left: "65%", scale: 0.95 },
                            { top: "50%", left: "50%", scale: 1.1 },
                            { top: "70%", left: "35%", scale: 1 },
                            { top: "65%", left: "70%", scale: 1.05 },
                            { top: "45%", left: "20%", scale: 0.9 },
                            { top: "45%", left: "75%", scale: 1 },
                            { top: "72%", left: "55%", scale: 0.85 },
                            { top: "30%", left: "50%", scale: 1.02 }
                          ];

                          return (
                            <div key={topObj.id} className="absolute inset-0 z-20 pointer-events-none">
                              {coordinates.slice(0, 7).map((coord, cIdx) => (
                                <motion.span
                                  key={`${topObj.id}_item_${cIdx}`}
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: coord.scale, opacity: 1 }}
                                  transition={{ type: "spring", stiffness: 150, delay: cIdx * 0.05 }}
                                  style={{
                                    absolute: "absolute",
                                    top: coord.top,
                                    left: coord.left,
                                    transform: `translate(-50%, -50%) rotate(${cIdx * 43}deg)`
                                  }}
                                  className="absolute text-lg md:text-xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                                >
                                  {topObj.icon}
                                </motion.span>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Interactive pricing & meta inside Lab column */}
                    <div className="z-10 bg-stone-900 p-3 rounded-xl w-full border border-stone-800">
                      <div className="flex justify-between items-center text-xs text-stone-400 mb-1">
                        <span>{customSize} size with {selectedToppings.length} elements</span>
                        <span className="font-bold text-amber-400">Rs. {currentCustomPizzaPrice}</span>
                      </div>
                      <p className="text-[10px] text-stone-500 font-serif leading-tight">
                        {lang === "en" 
                          ? "Baked fresh inside clay tandoor. Smoked charcoal aroma included for free." 
                          : "کولہے اور سچے تندور کے چولہے کی کلاسک تیار کردہ پیزا۔"}
                      </p>
                    </div>
                  </div>

                  {/* Settings selector panels (7 grid cols) */}
                  <div className="md:col-span-7 space-y-5">
                    {/* Choose Size */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">{t.sizeLabel}</label>
                      <div className="grid grid-cols-4 gap-2">
                        {(["Small", "Medium", "Large", "Extra Large"] as const).map((size) => (
                          <button
                            key={size}
                            onClick={() => setCustomSize(size)}
                            className={`py-2 px-1 text-center rounded-xl border font-bold text-xs transition-all ${
                              customSize === size
                                ? "bg-stone-900 border-stone-900 text-amber-300"
                                : "bg-stone-50 border-stone-100 text-stone-600 hover:bg-stone-100"
                            }`}
                          >
                            <div>{size}</div>
                            <div className="text-[9.5px] opacity-70 font-mono mt-0.5">
                              {size === "Small" ? "Rs. 800" : size === "Medium" ? "Rs. 1000" : size === "Large" ? "Rs. 1350" : "Rs. 1650"}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Crust Selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">{t.crustHeader}</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {DESI_CRUSTS.map((crust) => (
                          <button
                            key={crust.id}
                            id={`crust_option_${crust.id}`}
                            onClick={() => setCustomCrust(crust)}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              customCrust.id === crust.id
                                ? "bg-amber-100/50 border-amber-400 text-stone-900 ring-1 ring-amber-400"
                                : "bg-stone-50 border-stone-100 text-stone-700 hover:bg-stone-100/60"
                            }`}
                          >
                            <div className="font-bold text-xs flex justify-between">
                              <span>{crust.name.split("/")[0].trim()}</span>
                              {crust.price > 0 && <span className="text-amber-700 font-mono">+Rs.{crust.price}</span>}
                            </div>
                            <span className="text-[10px] text-stone-500 block leading-tight mt-0.5">{crust.name.split("/")[1] || ""}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Curried Sauce Selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">{t.sauceHeader}</label>
                      <div className="grid grid-cols-2 gap-2">
                        {DESI_SAUCES.map((sauce) => (
                          <button
                            key={sauce.id}
                            id={`sauce_option_${sauce.id}`}
                            onClick={() => setCustomSauce(sauce)}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              customSauce.id === sauce.id
                                ? "bg-amber-100/50 border-amber-400 text-stone-900"
                                : "bg-stone-50 border-stone-100 text-stone-600 hover:bg-stone-100/60"
                            }`}
                          >
                            <div className="font-bold text-xs">{sauce.name.split("/")[0]}</div>
                            <div className="text-[9.5px] text-red-600 font-bold mt-0.5">
                              {"🔥".repeat(sauce.heat)}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Loaded Toppings Checklist */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                        {t.toppingsHeader}
                        <span className="text-[10px] text-stone-400 block lowercase font-normal italic font-serif">
                          * {t.toppingsNote}
                        </span>
                      </label>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[160px] overflow-y-auto pr-1">
                        {DESI_TOPPINGS.map((topping) => {
                          const isAdded = selectedToppings.includes(topping.id);
                          return (
                            <button
                              key={topping.id}
                              id={`topping_checkbox_${topping.id}`}
                              onClick={() => toggleToppingInCustomizer(topping.id)}
                              className={`p-2 rounded-xl border text-left flex items-center justify-between gap-1.5 transition-all text-xs ${
                                isAdded
                                  ? "bg-amber-500 border-amber-500 text-stone-950 font-black shadow-xs"
                                  : "bg-stone-50 border-stone-100 text-stone-700 hover:bg-stone-100"
                              }`}
                            >
                              <div className="flex items-center gap-1.5 overflow-hidden">
                                <span>{topping.icon}</span>
                                <span className="truncate">{topping.name.split("/")[0].trim()}</span>
                              </div>
                              <span className="text-[9.5px] font-mono opacity-80 whitespace-nowrap">+Rs.{topping.price}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Push customized Pizza to basket */}
                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
                      <div className="text-left">
                        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{t.totalPrice}</span>
                        <div className="text-xl font-mono font-black text-amber-700">Rs. {currentCustomPizzaPrice}</div>
                      </div>
                      
                      <button
                        id="custom_add_to_cart"
                        onClick={addCustomizedPizzaToCart}
                        className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-6 py-3 rounded-2xl flex items-center gap-2 cursor-pointer transition-all shadow-md group hover:scale-[1.02] active:scale-95"
                      >
                        <ShoppingBag className="w-4 h-4 text-stone-950 group-hover:animate-bounce" />
                        <span>{t.addToCart}</span>
                      </button>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* DYNAMIC TAB COMPONENT 3: REVIEWS & MEHMAN BAITHAK */}
          <AnimatePresence mode="wait">
            {activeTab === "reviews" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-extrabold text-stone-900 flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-amber-500" />
                    {t.reviewTitle}
                  </h2>
                  <p className="text-sm text-stone-500 font-medium">
                    {t.reviewSubtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {reviewsList.map((rev) => (
                    <div 
                      key={rev.id} 
                      className="bg-white p-6 rounded-3xl border border-stone-100 shadow-xs space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        {/* Rating stars */}
                        <div className="flex text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className="text-sm">★</span>
                          ))}
                          <span className="text-xs font-bold text-stone-500 ml-1.5 font-mono">{rev.rating}</span>
                        </div>
                        
                        <p className="text-xs text-stone-600 italic">
                          "{rev.comment}"
                        </p>
                        <p className="text-xs text-amber-600 font-bold font-serif">
                          "{rev.urduComment}"
                        </p>
                      </div>

                      <div className="flex items-center gap-3 pt-3 border-t border-stone-50">
                        <span className="text-2xl">{rev.avatar}</span>
                        <div>
                          <h4 className="text-xs font-bold text-stone-800">{rev.name}</h4>
                          <span className="text-[10px] text-stone-400 font-semibold">{rev.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Simulated review submit box */}
                <form onSubmit={handleSubmitReview} className="bg-stone-900 text-white p-6 rounded-3xl border border-stone-800 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-display font-bold text-amber-400">Write a Review / اپنے خیالات شیئر کریں</h3>
                    <p className="text-xs text-stone-400 font-medium">Have you eaten our hot tandoor crust pizza? Let other customers know!</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input 
                      type="text" 
                      required
                      placeholder="Your Name / آپ کا نام" 
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      className="bg-stone-800 border-none text-xs p-3 rounded-2xl text-stone-200 outline-none focus:ring-1 focus:ring-amber-400"
                    />
                    <select
                      value={newReviewRating}
                      onChange={(e) => setNewReviewRating(e.target.value)}
                      className="bg-stone-800 border-none text-xs p-3 rounded-2xl text-stone-200 outline-none focus:ring-1 focus:ring-amber-400"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                      <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                      <option value="3">⭐⭐⭐ (3 Stars)</option>
                      <option value="2">⭐⭐ (2 Stars)</option>
                      <option value="1">⭐ (1 Star)</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Optional Urdu / اردو کمنٹ (or leave blank)" 
                      value={newReviewUrduComment}
                      onChange={(e) => setNewReviewUrduComment(e.target.value)}
                      className="bg-stone-800 border-none text-xs p-3 rounded-2xl text-stone-200 outline-none focus:ring-1 focus:ring-amber-400"
                    />
                  </div>
                  <textarea 
                    required
                    placeholder="Describe your pizza experience... / پیزا کا ذائقہ کیسا لگا؟"
                    rows={2}
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className="w-full bg-stone-800 border-none text-xs p-3 rounded-2xl text-stone-200 outline-none focus:ring-1 focus:ring-amber-400"
                  />
                  <button 
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer hover:scale-105"
                  >
                    Submit Feedback
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

        </section>

        {/* RIGHT COLUMN: Aap Ka Thaal (Basket) & Order checkout panel (4 cols) */}
        <section className="lg:col-span-4 space-y-6" id="aap-ka-thaal">
          
          {/* TRACKER WINDOW: If order is active, lock right container into live cooking simulator! */}
          {activeOrder ? (
            <div id="active_tracker_box" className="bg-stone-950 text-white rounded-3xl p-5 border border-amber-500/20 shadow-xl space-y-5">
              
              {/* Tracker Header */}
              <div className="flex justify-between items-start border-b border-stone-800 pb-3">
                <div>
                  <span className="text-[10px] text-amber-400 font-extrabold uppercase block tracking-wider">
                    {activeOrder.fulfillmentType === "dinein" ? "🏨 Dine-In Ticket" : activeOrder.fulfillmentType === "pickup" ? "🛍️ Takeaway Ticket" : "🛵 Live Pizza Tracker"}
                  </span>
                  <h3 className="text-sm font-mono font-black text-stone-100 flex items-center gap-1.5 mt-0.5">
                    <span>Reference:</span>
                    <span className="bg-stone-900 border border-stone-800 px-2 py-0.5 rounded text-amber-300 font-bold">{activeOrder.id}</span>
                  </h3>
                </div>
                <button
                  onClick={resetOrderTracker}
                  className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-all cursor-pointer"
                  title="Close Tracker"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* DYNAMIC STEPS ACCORDING TO FULFILLMENT METHOD */}
              <div className="space-y-3.5">
                {/* Step 1 */}
                <div id="tracker_step_1" className={`p-3 rounded-2xl flex gap-3.5 items-start transition-all ${orderStep >= 1 ? "bg-stone-900/90 border border-stone-800" : "opacity-30"}`}>
                  <span className={`p-1.5 rounded-lg font-black text-xs flex items-center justify-center w-7 h-7 flex-shrink-0 ${orderStep === 1 ? "bg-amber-500 text-stone-950 animate-pulse" : "bg-stone-800 text-amber-400"}`}>
                    {orderStep > 1 ? "✓" : "1"}
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-amber-400">
                      {activeOrder.fulfillmentType === "dinein" 
                        ? (lang === "en" ? "Table Preparation" : "میز کی سجاوٹ") 
                        : (lang === "en" ? "Fresh Dough & Spice Roll" : "خمیر اور مصالحہ رول")}
                    </h4>
                    <p className="text-[10px] text-stone-400 leading-normal mt-0.5">
                      {activeOrder.fulfillmentType === "dinein"
                        ? (lang === "en" ? "Table spot sanitized and decorated with red clay plates." : "دیسی پلیٹوں اور گلاس کے ساتھ بیٹھک کی تیاری جاری ہے۔")
                        : (lang === "en" ? "Traditional flour kneaded and spiced with tandoori powder." : "خمیر شدہ پیڑے پر تندوری چٹنی اور تازہ مرچوں کا تڑکہ۔")}
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div id="tracker_step_2" className={`p-3 rounded-2xl flex gap-3.5 items-start transition-all ${orderStep >= 2 ? "bg-stone-900/90 border border-stone-800 animate-fade-in" : "opacity-30"}`}>
                  <span className={`p-1.5 rounded-lg font-black text-xs flex items-center justify-center w-7 h-7 flex-shrink-0 ${orderStep === 2 ? "bg-red-500 text-white animate-bounce" : "bg-stone-800 text-amber-400"}`}>
                    {orderStep > 2 ? "✓" : "2"}
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-amber-400">
                      {lang === "en" ? "Clay Oven Wood FIRE baking" : "مٹی کے تندور کی بھٹی"}
                    </h4>
                    <p className="text-[10px] text-stone-400 leading-normal mt-0.5">
                      {lang === "en" ? "Pizza slapped inside real clay tandoor oven at 450°C wood fire." : "پیزا کرسٹ کو روایتی مٹی کے گھڑے دار لال تندور میں پکایا جا رہا ہے۔"}
                    </p>
                    {orderStep === 2 && (
                      <div className="mt-2 bg-red-950/70 border border-red-500/20 rounded-lg p-1.5 text-[9.5px] text-red-300 font-mono flex items-center gap-1.5 animate-pulse">
                        <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                        <span>Core embers fanned! baking hot slice in under 2 minutes</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 3 */}
                <div id="tracker_step_3" className={`p-3 rounded-2xl flex gap-3.5 items-start transition-all ${orderStep >= 3 ? "bg-stone-900/90 border border-stone-800 animate-fade-in" : "opacity-30"}`}>
                  <span className={`p-1.5 rounded-lg font-black text-xs flex items-center justify-center w-7 h-7 flex-shrink-0 ${orderStep === 3 ? "bg-amber-400 text-stone-950 animate-pulse" : "bg-stone-800 text-amber-400"}`}>
                    {orderStep > 3 ? "✓" : "3"}
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-amber-400">
                      {activeOrder.fulfillmentType === "dinein" 
                        ? (lang === "en" ? "Server Sajawal carrying hot platter" : "گرما گرم میز سرویس")
                        : activeOrder.fulfillmentType === "pickup"
                        ? (lang === "en" ? "Aroma packed in heat thermal package" : "تھال گرم پیکنگ")
                        : (lang === "en" ? "Rider Sajawal out on motorcycle" : "سجاول بائیک پر روانہ")}
                    </h4>
                    <p className="text-[10px] text-stone-400 leading-normal mt-0.5">
                      {activeOrder.fulfillmentType === "dinein"
                        ? (lang === "en" ? "Waiter Sajawal bringing sizzling plates on wooden table." : "گرما گرم لکڑی کے تختے پر پیزا سجاول آپ کی طرف لا رہا ہے۔")
                        : activeOrder.fulfillmentType === "pickup"
                        ? (lang === "en" ? "Kept in hot chamber. Please proceed directly to Main Counter." : "ہاٹ چیمبر میں پیزا ریڈی ہے۔ برائے مہربانی مین کاؤنٹر سے وصول کریں۔")
                        : (lang === "en" ? "Rider Sajawal speeding fast via GT road boulevard." : "سجاول بائیک کک مار کر پیزا گرم رکھنے والے باکس میں لے کر روانہ ہو چکا۔")}
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div id="tracker_step_4" className={`p-3 rounded-2xl flex gap-3.5 items-start transition-all ${orderStep >= 4 ? "bg-emerald-950/85 border border-emerald-500/20" : "opacity-30"}`}>
                  <span className={`p-1.5 rounded-lg font-black text-xs flex items-center justify-center w-7 h-7 flex-shrink-0 bg-emerald-500 text-stone-950`}>
                    ✓
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-stone-100">
                      {activeOrder.fulfillmentType === "dinein"
                        ? (lang === "en" ? "Served & Bismillah!" : "میز سج گئی ہے، بسم اللہ کریں")
                        : (lang === "en" ? "Handed over safely!" : "محفوظ طریقے سے پہنچادیا گیا")}
                    </h4>
                    <p className="text-[10px] text-stone-300 leading-normal mt-0.5">
                      {activeOrder.fulfillmentType === "dinein"
                        ? (lang === "en" ? "Meal placed on table #12. Fresh mint raita has been uncorked." : "میز نمبر ۱۲ چمک اٹھی۔ دیسی پودینے کا رائتہ تندوری سلائس کے ساتھ ریڈی!")
                        : (lang === "en" ? "Dasti cash collected. Enjoy the traditional firewood scent!" : "نقد رقم موصول ہو گئی۔ لکڑی والے کوئلے کی بھیمی خوشبو کے مزے لیں!")}
                    </p>
                  </div>
                </div>
              </div>

              {/* CASE-SPECIFIC INTERACTIVE SIMULATOR WIDGETS */}
              {activeOrder.fulfillmentType === "delivery" && orderStep >= 3 && (
                <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 space-y-3">
                  
                  {/* Interactive Rider Mini Map */}
                  <div className="space-y-1">
                    <span className="text-[9.5px] uppercase tracking-wider block text-stone-400 font-extrabold font-mono">
                      🗺️ Road GPS route simulation:
                    </span>
                    <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-850 relative overflow-hidden flex items-center text-xs justify-between font-mono">
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-dashed bg-stone-800 -translate-y-1/2" />
                      
                      <span className="z-10 bg-stone-900 px-1 py-0.5 rounded text-[10px]">🏪 Tandoor</span>
                      
                      {/* Rider Icon offset movement based on orderStep */}
                      <span className={`z-10 animate-bounce duration-1000 ${orderStep === 4 ? "translate-x-12 opacity-0" : "animate-bounce"}`}>
                        🛵 Sajawal
                      </span>

                      <span className="z-10 bg-stone-900 px-1 py-0.5 rounded text-[10px]">🏠 Home</span>
                    </div>
                  </div>

                  {/* Interacting Buttons (Jo hotel me hota hai, interactively call rider) */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setRiderBuzzedTimes(prev => prev + 1);
                        setRiderExtraChat("Sajawal says: 'Bhai g, bike par hoon! GT bridge block tha, F-11 turn par hoon 3 minute me door-bell bajaon ga!'");
                      }}
                      className="bg-stone-850 hover:bg-stone-800 border border-stone-750 text-amber-400 text-[10px] font-black px-3 py-1.5 rounded-xl transition-all active:scale-95 cursor-pointer"
                    >
                      📣 Buzz Rider {riderBuzzedTimes > 0 && `(Buzzed x${riderBuzzedTimes})`}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRiderExtraChat("Sajawal says: 'Noted boss! Main counter se extra dasti Raita cup and chili pepper pack lift kar lya hai. Befikar rahen!'");
                      }}
                      className="bg-stone-850 hover:bg-stone-800 border border-stone-750 text-lime-400 text-[10px] font-black px-3 py-1.5 rounded-xl transition-all active:scale-95 cursor-pointer"
                    >
                      🌶️ Request Extra Raita cup
                    </button>
                  </div>

                  {/* Rider Feedback messages logs */}
                  {riderExtraChat && (
                    <div className="bg-amber-950/20 border border-amber-500/10 p-2 rounded-xl text-[10.5px] text-amber-300 font-serif leading-relaxed animate-fade-in">
                      {riderExtraChat}
                    </div>
                  )}

                </div>
              )}

              {activeOrder.fulfillmentType === "dinein" && (
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-stone-950 p-4 rounded-2xl border-4 border-double border-amber-300 space-y-3.5 shadow-inner">
                  
                  {/* VIP Dine In Ticket pass representational slip */}
                  <div className="text-center border-b-2 border-dashed border-amber-750/30 pb-2">
                    <span className="text-[9.5px] uppercase tracking-widest font-black block">Desi Pizza Restaurant</span>
                    <h4 className="font-display font-extrabold text-sm uppercase tracking-wide">VIP GUEST BOARDING PASS</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[10.5px] font-bold text-stone-900 border-b-2 border-dashed border-amber-750/30 pb-2">
                    <div>
                      <span className="text-[9.5px] text-stone-850 block font-normal uppercase">Guest Host</span>
                      <span className="truncate block font-black">{activeOrder.clientName}</span>
                    </div>
                    <div>
                      <span className="text-[9.5px] text-stone-850 block font-normal uppercase">Reserved Sitting</span>
                      <span className="font-black text-amber-950 block">{activeOrder.selectedTableSpot?.name || "AC Family Hall"}</span>
                    </div>
                    <div>
                      <span className="text-[9.5px] text-stone-850 block font-normal uppercase">Guests Count</span>
                      <span className="font-mono font-black block">{activeOrder.dineinGuests} Seats Blocked</span>
                    </div>
                    <div>
                      <span className="text-[9.5px] text-stone-850 block font-normal uppercase">Estimated Arrival</span>
                      <span className="font-black block">{activeOrder.dineinTime} ({activeOrder.dineinDate})</span>
                    </div>
                  </div>

                  {/* Dine In Interactive Triggers */}
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    <button
                      type="button"
                      onClick={() => setRiderExtraChat("Waiter Sajawal SMS: 'I have polished the clay glasses and poured organic rose syrup into them! Welcome, family! Seating ready.'")}
                      className="bg-stone-950 text-amber-300 text-[9px] font-black px-2.5 py-1.5 rounded-lg active:scale-95 cursor-pointer hover:bg-stone-900 transition-all"
                    >
                      ✨ Check Seating status
                    </button>
                    <button
                      type="button"
                      onClick={() => setRiderExtraChat("Head Chef SMS: 'Double saffron tandoor tea requests queued for checkout! Gift from our hot kitchen side to you.'")}
                      className="bg-stone-950 text-amber-300 text-[9px] font-black px-2.5 py-1.5 rounded-lg active:scale-95 cursor-pointer hover:bg-stone-900 transition-all"
                    >
                      ☕ Comp Saffron Tea Request
                    </button>
                  </div>

                  {/* Dine In updates logs */}
                  {riderExtraChat && (
                    <div className="bg-stone-950 text-amber-400 p-2.5 rounded-xl text-[10px] leading-relaxed border border-stone-800 animate-fade-in font-serif">
                      {riderExtraChat}
                    </div>
                  )}

                </div>
              )}

              {/* Order total bill checklist */}
              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-850 space-y-3 text-xs text-stone-300">
                <div className="flex justify-between font-bold border-b border-stone-850 pb-2">
                  <span>Contact Host:</span>
                  <span className="font-mono text-white">{activeOrder.clientPhone}</span>
                </div>
                
                {/* Specific details */}
                <div className="text-[10.5px] text-stone-400 space-y-1">
                  <span className="block font-black text-stone-300 uppercase tracking-wider text-[9px]">📍 Target Destination Location:</span>
                  <p className="bg-stone-900 p-2 rounded border border-stone-800 font-mono text-stone-300 italic max-h-[50px] overflow-y-auto">
                    {activeOrder.clientAddress}
                  </p>
                </div>

                {/* Items loop */}
                <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                  {activeOrder.items?.map((it: any, index: number) => (
                    <div key={index} className="flex justify-between items-center text-[11px] text-stone-400">
                      <span className="truncate max-w-[170px]">{it.quantity}x {it.name} ({it.size})</span>
                      <span className="font-mono text-stone-200">Rs. {it.price * it.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-850 flex justify-between items-center text-xs font-black text-amber-400">
                  <span>Grand Final Bill:</span>
                  <span className="font-mono text-sm text-lime-400">Rs. {activeOrder.billTotal}</span>
                </div>

                <button 
                  type="button" 
                  onClick={copyWhatsAppSlip} 
                  className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2 rounded-xl text-xs transition-all active:scale-95 cursor-pointer text-center flex items-center justify-center gap-2 mt-1 shadow-md"
                >
                  💬 Copy WhatsApp Order Slip
                </button>
              </div>

              {/* Dynamic feedback request */}
              {orderStep === 4 && (
                <div className="pt-2">
                  <span className="text-[11px] text-lime-400 font-bold block text-center animate-bounce">
                    🎉 Bismillah! Your warm Desi oven cooked pizza slice is ready at your service! Enjoy!
                  </span>
                </div>
              )}
            </div>
          ) : (
            // STANDARD CART WINDOW
            <div id="standard_cart_container" className="bg-white rounded-3xl p-5 border border-stone-100 shadow-sm space-y-5">
              
              <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-500" />
                  <h3 className="font-display font-extrabold text-stone-900 text-lg">
                    {t.cartHeader}
                  </h3>
                </div>
                
                {cart.length > 0 && (
                  <button 
                    onClick={() => {
                      if (confirm("Clear your entire pizza container?")) {
                        saveCartToLocalStorage([]);
                      }
                    }}
                    className="text-[10px] text-red-500 font-bold tracking-wider hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto text-amber-600 animate-pulse">
                    🍕
                  </div>
                  <p className="text-xs text-stone-400 font-semibold max-w-[200px] mx-auto leading-relaxed">
                    {t.emptyCart}
                  </p>
                  
                  {/* Call to action: Customize a Naan */}
                  <button
                    id="cart_build_pizza_cta"
                    onClick={() => {
                      setActiveTab("customizer");
                      document.getElementById("desi-pizza-lab")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="bg-stone-900 text-amber-400 hover:text-white hover:bg-stone-800 text-[10px] font-black px-4 py-2 rounded-xl"
                  >
                    {t.navCustom}
                  </button>
                </div>
              ) : (
                // CART CONTENT HAS ITEMS
                <div className="space-y-4">
                  {/* Cart Item Row List */}
                  <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                    {cart.map((item, index) => {
                      return (
                        <div 
                          key={item.cartId || index} 
                          id={`item_row_${index}`}
                          className="p-3 bg-stone-50 rounded-2xl flex flex-col gap-2 border border-stone-100/50"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <h4 className="text-xs font-black text-stone-800 flex items-center gap-1">
                                {item.isCustom && <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
                                <span className="truncate max-w-[120px]">{item.name}</span>
                                <span className="text-[10px] bg-amber-200/60 text-amber-950 font-bold px-1.5 py-0.5 rounded-md ml-1 text-center scale-95">
                                  {item.size.charAt(0)}
                                </span>
                              </h4>
                              
                              {/* If customized, show listed toppings summary */}
                              {item.isCustom && item.toppings?.length > 0 && (
                                <p className="text-[9.5px] text-stone-500 leading-relaxed max-w-[150px] line-clamp-1 truncate mt-0.5">
                                  {item.toppings.map((topObj: any) => topObj.name.split("/")[0].trim()).join(", ")}
                                </p>
                              )}
                              <p className="text-[10px] text-amber-600 font-semibold">{item.urduName}</p>
                            </div>

                            <button 
                              onClick={() => removeCartItem(item.cartId)}
                              className="text-stone-400 hover:text-red-500 p-1 rounded-md transition-all ml-auto focus:outline-none"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Controls (quantity & pricing details) */}
                          <div className="flex items-center justify-between pt-1 border-t border-stone-100/60">
                            <span className="font-mono text-amber-700 text-xs font-black">
                              Rs. {item.price * item.quantity}
                            </span>

                            <div className="flex items-center gap-2.5 bg-white px-2 py-1 rounded-xl shadow-xs border border-stone-100">
                              <button 
                                onClick={() => updateQuantity(item.cartId, -1)}
                                className="w-5 h-5 rounded-md bg-stone-50 hover:bg-stone-100 flex items-center justify-center text-stone-600 focus:outline-none"
                              >
                                <Minus className="w-3 h-3 text-stone-800" />
                              </button>
                              <span className="font-mono text-xs font-bold text-stone-800">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.cartId, 1)}
                                className="w-5 h-5 rounded-md bg-stone-50 hover:bg-stone-100 flex items-center justify-center text-stone-600 focus:outline-none"
                              >
                                <Plus className="w-3 h-3 text-stone-800" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Promo Code section */}
                  <div className="bg-stone-50 p-2.5 rounded-2xl border border-stone-100 flex items-center justify-between gap-2">
                    <input
                      type="text"
                      placeholder={t.promoPlaceholder}
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={!!promoApplied}
                      className="bg-transparent text-xs p-1 px-1.5 focus:outline-none placeholder-stone-400 text-stone-800 flex-1 font-semibold uppercase"
                    />
                    <button
                      id="apply_coupon_btn"
                      onClick={applyDostiCode}
                      disabled={!!promoApplied}
                      className={`text-xs font-bold py-2 px-3.5 rounded-xl transition-all ${
                        promoApplied 
                          ? "bg-emerald-600 text-white" 
                          : "bg-stone-900 border-none text-amber-300 hover:text-white"
                      }`}
                    >
                      {promoApplied ? "Applied✓" : t.applyBtn}
                    </button>
                  </div>

                  {/* Sajawal loyalty bonus coin rewards */}
                  <div className="bg-stone-900 text-stone-100 p-3.5 rounded-2xl border border-stone-800 space-y-1 relative overflow-hidden shadow-xs">
                    {/* Glowing highlight */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
                    
                    <div className="flex justify-between items-center text-xs font-bold text-amber-400">
                      <span className="flex items-center gap-1">⚜️ {lang === "en" ? "Sajawal Coins Club" : "سجاول کوائنز کلب"}</span>
                      <span className="font-mono text-xs bg-amber-400/20 text-amber-300 font-extrabold px-2 py-0.5 rounded-lg border border-amber-500/10">
                        {loyaltyCoins} Coins
                      </span>
                    </div>
                    
                    <p className="text-[10px] text-stone-400 leading-normal font-medium">
                      {lang === "en" 
                        ? "Earn 10% points! Claim free Rs. 200 off for every 100 coins." 
                        : "ہر آرڈر پر ۱۰ فیصد کوائنز پائیں۔ ۱۰۰ کوائنز پر ۲۰۰ روپے رعایت حاصل کریں!"}
                    </p>

                    {loyaltyCoins >= 100 ? (
                      <button
                        type="button"
                        onClick={() => setRedeemCoinsToggle(!redeemCoinsToggle)}
                        className={`w-full mt-2 text-[10.5px] font-black py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
                          redeemCoinsToggle 
                            ? "bg-amber-500 text-stone-950 font-black shadow-md border-none"
                            : "bg-stone-800 text-amber-300 hover:bg-stone-750 border border-amber-500/15"
                        }`}
                      >
                        {redeemCoinsToggle ? "✓ Coins Redeemed (Rs. 200 off!)" : "⚡ Redeem 100 Coins (Get Rs. 200 Off)"}
                      </button>
                    ) : (
                      <div className="text-[9.5px] text-stone-500 leading-none pt-1">
                        🔒 Claim {100 - loyaltyCoins} more coins to unlock free Rs. 200 cash reward!
                      </div>
                    )}
                  </div>

                  {/* Pricing Breakdown Summary list */}
                  <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100 space-y-2 text-xs text-stone-600">
                    <div className="flex justify-between">
                      <span>{t.billSubtotal}</span>
                      <span className="font-mono text-stone-800 font-bold">Rs. {cartSubtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t.billDelivery}</span>
                      <span className="font-mono text-stone-800 font-bold">Rs. {deliveryCharges}</span>
                    </div>
                    {discountPercent > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>{t.billDiscount} ({discountPercent}%)</span>
                        <span className="font-mono">-Rs. {appliedDiscountValue}</span>
                      </div>
                    )}
                    {loyaltyPointsDiscount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Sajawal Coins Discount:</span>
                        <span className="font-mono">-Rs. {loyaltyPointsDiscount}</span>
                      </div>
                    )}
                    <div className="border-t border-stone-200/60 pt-2.5 flex justify-between font-black text-amber-800 text-sm">
                      <span>{t.total}</span>
                      <span className="font-mono text-amber-900">Rs. {finalCartTotal}</span>
                    </div>
                  </div>

                  {/* Bottom Proceed Checkout buttons toggle */}
                  {isCheckingOut ? (
                    <form onSubmit={handlePlaceOrderSubmit} id="checkout_form_container" className="bg-amber-100/50 p-4 rounded-2xl border border-amber-200 space-y-4">
                      {/* Form Header */}
                      <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                        <span className="text-[10px] text-amber-950 font-black uppercase tracking-wider block">
                          {t.checkoutHeader}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsCheckingOut(false)}
                          className="text-xs text-stone-500 hover:text-stone-800 font-extrabold"
                        >
                          {t.cancelBtn}
                        </button>
                      </div>

                      {/* FULFILLMENT INTERACTIVE SELECTION TABS */}
                      <div id="checkout_fulfillment_tabs" className="grid grid-cols-3 gap-1.5 p-1 bg-amber-200/40 rounded-xl">
                        {[
                          { id: "delivery", label: lang === "en" ? "Home Delivery" : lang === "roman" ? "Ghar Delivery" : "ہوم ڈیلیوری", icon: "🛵" },
                          { id: "dinein", label: lang === "en" ? "VIP Dine-In" : lang === "roman" ? "Dera Baithak" : "ہوٹل بیٹھک", icon: "🏨" },
                          { id: "pickup", label: lang === "en" ? "Takeaway" : lang === "roman" ? "Takeaway/Pickup" : "ٹیک اوے", icon: "🛍️" }
                        ].map((btn) => (
                          <button
                            key={btn.id}
                            type="button"
                            onClick={() => setFulfillmentType(btn.id as any)}
                            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-[9.5px] font-black transition-all cursor-pointer ${
                              fulfillmentType === btn.id
                                ? "bg-stone-900 text-amber-400 shadow-sm"
                                : "text-stone-700 hover:bg-stone-200/50"
                            }`}
                          >
                            <span className="text-xs mb-0.5">{btn.icon}</span>
                            <span className="leading-none text-center">{btn.label}</span>
                          </button>
                        ))}
                      </div>

                      <div className="space-y-3 text-left">
                        {/* Common: Name */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-600 uppercase block">
                            👤 {lang === "en" ? "Host Full Name" : lang === "roman" ? "Host Name" : "میزبان کا مکمل نام"}
                          </label>
                          <input 
                            type="text" 
                            required
                            id="cust_name_field"
                            placeholder={lang === "en" ? "e.g. Arsalan Chaudhry" : lang === "roman" ? "e.g. Arsalan Chaudhry" : "مثلاً ارسلان چوہدری"}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white text-xs p-2 rounded-xl text-stone-800 outline-none border border-stone-100/80 focus:ring-1 focus:ring-amber-400 font-semibold"
                          />
                        </div>
                        
                        {/* Common: Phone */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-600 uppercase block">
                            📞 {lang === "en" ? "WhatsApp/Mobile Contact" : lang === "roman" ? "WhatsApp/Contact Number" : "موبائل / رابطہ نمبر"}
                          </label>
                          <input 
                            type="text" 
                            required
                            id="cust_phone_field"
                            placeholder="e.g. 0300-1234567"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-white text-xs p-2 rounded-xl text-stone-800 outline-none border border-stone-100/80 focus:ring-1 focus:ring-amber-400 font-semibold"
                          />
                        </div>

                        {/* CASE 1: DELIVERY ADDRESS */}
                        {fulfillmentType === "delivery" && (
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-stone-600 uppercase block animate-fade-in">
                              📍 {lang === "en" ? "Standard Delivery Address" : lang === "roman" ? "Delivery address" : "ہوم ڈیلیوری کا پتہ"}
                            </label>
                            <textarea 
                              rows={2}
                              required
                              id="cust_address_field"
                              placeholder={lang === "en" ? "e.g. House 42-B, Sector F-11, Islamabad" : lang === "roman" ? "e.g. House 42-B, Sector F-11, Islamabad" : "مثلاً مکان نمبر ۴۲، الٰہی روڈ لاہور"}
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="w-full bg-white text-xs p-2 rounded-xl text-stone-800 outline-none border border-stone-100/80 focus:ring-1 focus:ring-amber-400 font-semibold"
                            />
                          </div>
                        )}

                        {/* CASE 2: DINE-IN TABLE BOOKING DETAILS */}
                        {fulfillmentType === "dinein" && (
                          <div className="space-y-3.5 bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/40 animate-fade-in text-[11px]">
                            
                            {/* Table Spot Visual Selector */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-amber-950 uppercase tracking-wider block">
                                🛋️ {lang === "en" ? "Choose Seating Area Dera" : lang === "roman" ? "Seating area chunein" : "نشست گاہ کا انتخاب کریں"}
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                {HOTEL_TABLES.map((tbl) => (
                                  <button
                                    key={tbl.id}
                                    type="button"
                                    onClick={() => setSelectedTableSpot(tbl.id)}
                                    className={`p-2 rounded-xl text-left border flex flex-col justify-between transition-all cursor-pointer ${
                                      selectedTableSpot === tbl.id
                                        ? "bg-stone-900 text-amber-300 border-stone-900"
                                        : "bg-white text-stone-800 border-stone-200 hover:bg-stone-50"
                                    }`}
                                  >
                                    <div className="flex items-center gap-1.5 justify-between w-full">
                                      <span className="text-sm">{tbl.icon}</span>
                                      <span className="text-[9px] font-mono bg-amber-400 text-stone-900 px-1 rounded">
                                        {tbl.seats}
                                      </span>
                                    </div>
                                    <span className="font-extrabold text-[9.5px] mt-1.5 block leading-none">{tbl.name}</span>
                                    <span className="text-[9px] opacity-75 mt-0.5 font-serif">{tbl.urduName}</span>
                                    <span className="text-[9px] font-bold text-amber-500 mt-1 block">
                                      {tbl.price === 0 ? "Free seat" : `+ Rs. ${tbl.price}`}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Booking Date & Time slot fields */}
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-stone-500 uppercase block">🕒 Booking Time</label>
                                <input 
                                  type="time" 
                                  value={dineinTime}
                                  onChange={(e) => setDineinTime(e.target.value)}
                                  className="w-full bg-white text-xs p-1.5 rounded-lg border border-stone-200 text-stone-800"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-stone-500 uppercase block">🗓️ Date Select</label>
                                <input 
                                  type="date" 
                                  value={dineinDate}
                                  onChange={(e) => setDineinDate(e.target.value)}
                                  className="w-full bg-white text-xs p-1.5 rounded-lg border border-stone-200 text-stone-800"
                                />
                              </div>
                            </div>

                            {/* Expected Family members limit counter */}
                            <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-stone-150">
                              <div>
                                <span className="font-bold text-xs text-stone-800">🍽️ Expected Guests</span>
                                <span className="text-[9.5px] text-stone-400 block font-serif">مہمانوں کی کل تعداد</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setDineinGuests(Math.max(1, dineinGuests - 1))}
                                  className="w-6 h-6 rounded bg-stone-100 flex items-center justify-center font-bold text-stone-700"
                                >
                                  -
                                </button>
                                <span className="font-mono font-black text-xs text-stone-900 w-4 text-center">{dineinGuests}</span>
                                <button
                                  type="button"
                                  onClick={() => setDineinGuests(dineinGuests + 1)}
                                  className="w-6 h-6 rounded bg-stone-100 flex items-center justify-center font-bold text-stone-700"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                          </div>
                        )}

                        {/* CASE 3: TAKEAWAY NOTE */}
                        {fulfillmentType === "pickup" && (
                          <div className="bg-stone-900 text-amber-300 p-3 rounded-xl border border-amber-500/20 text-xs space-y-1 animate-fade-in">
                            <h4 className="font-bold">🛍️ {lang === "en" ? "Self Pickup counter ready" : "خود آکر پیزا اٹھائیں!"}</h4>
                            <p className="text-[10px] text-stone-400 leading-relaxed font-serif">
                              {lang === "en" 
                                ? "Zero service charge! Walk up to Desi Pizza main Tandoor counter on GT road in 15-20 min. Your packaging box is pre-kept fully warm."
                                : "ہاٹ چیمبر اور تندور سے براہِ راست ٹوکری میں گرم پیزا پیک کیا جائے گا۔ کوئی اضافی چارجز نہیں ہیں۔"}
                            </p>
                          </div>
                        )}

                        {/* Instruction Note */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-600 uppercase block">
                            ✏️ {lang === "en" ? "Special Kitchen Instructions" : "خاص کچن ہدایات"}
                          </label>
                          <input 
                            type="text" 
                            placeholder={lang === "en" ? "e.g. extra spicy yogurt, charcoal tandoor extra crisp" : "مثلاً پودینہ چٹنی ڈبل، نان نرم رکھیں"}
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            className="w-full bg-white text-xs p-2 rounded-xl text-stone-800 outline-none border border-stone-100/80 focus:ring-1 focus:ring-amber-400 font-semibold"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        id="submit_checkout_btn"
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs uppercase font-black py-3 rounded-xl transition-all cursor-pointer shadow-md"
                      >
                        {fulfillmentType === "dinein" 
                          ? (lang === "en" ? "Reserve Table & Confirm Platter" : "بیٹھک بک کریں اور آرڈر بھیجیں")
                          : (lang === "en" ? "Confirm order" : "آرڈر کی تصدیق کریں")}
                      </button>
                    </form>
                  ) : (
                    <button
                      id="checkout_trigger_btn"
                      onClick={() => setIsCheckingOut(true)}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black py-3.5 rounded-2xl transition-all tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.01] active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                      <span>{t.checkoutBtn}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Sizzling highlights stats widget */}
          <div className="bg-stone-950 text-white p-4 rounded-3xl border border-stone-850 space-y-3.5">
            <h4 className="text-[11px] text-amber-400 uppercase tracking-wider font-bold block">
              💡 Chef Shamshad's Secret Tip / خاص ٹپ
            </h4>
            <p className="text-[10.5px] text-stone-400 leading-relaxed font-serif">
              "{lang === "en" 
                ? "Always pair the Sizzling Chapli Pizza with our cool Mint Yogurt drizzle! It tames the Peshawari spice while letting the pomegranate tang burst beautifully on your palate." 
                : "چپلی کباب پیزا کے ساتھ ہری پودینے کے رائتے کا آرڈر لازمی دیں۔ یہ مرچوں کو متوازن کر کے انار دانے کی کھٹاس کو نکھارتا ہے۔"}"
            </p>
            <div className="flex items-center gap-3 pt-2 text-[10px] text-amber-500 font-semibold">
              <Clock className="w-3.5 h-3.5 text-amber-500 animate-spin animate-duration-[10000ms]" />
              <span>Clay oven is fully fired: 450°C 🪵 ready!</span>
            </div>
          </div>

        </section>

      </main>

      {/* Footer information section */}
      <footer className="max-w-7xl mx-auto px-4 mt-16 text-center text-xs text-stone-400 space-y-4 border-t border-stone-200 pt-8">
        <div className="flex items-center justify-center gap-4 text-stone-500 text-xs flex-wrap font-bold">
          <span>{lang === "en" ? "© 2026 Desi Pizza Restaurant. All Rights Reserved." : "© ۲۰۲۶ دیسی پیزا ریسٹورنٹ۔ جملہ حقوق محفوظ ہیں۔"}</span>
          <span>•</span>
          <span>Halal Certified ingredients</span>
          <span>•</span>
          <span>100% Authentic Clay Tandoor</span>
          <span>•</span>
          <span>Dosti Discount code: DESI20 (20% off)</span>
        </div>
        
        <p className="max-w-2xl mx-auto text-[11px] text-stone-400/80 leading-relaxed font-serif italic">
          "Zaiqa bilkul dukan jaisa, sneh-purn taseer tandoor ki! Made with premium flour, local hand-ground tandoori spice blends, and custom clay ovens."
        </p>
      </footer>
    </div>
  );
}
