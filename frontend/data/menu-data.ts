import { MenuItem, MenuCategory } from '@/types/menu'

export const menuCategories: MenuCategory[] = [
  {
    id: 'appetizers',
    name: 'Appetizers',
    description: 'Start your meal with our delicious appetizers',
    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'main-courses',
    name: 'Main Courses',
    description: 'Explore our selection of satisfying main dishes',
    image: 'https://images.pexels.com/photos/675951/pexels-photo-675951.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'sides',
    name: 'Sides',
    description: 'Perfect companions to complete your meal',
    image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'desserts',
    name: 'Desserts',
    description: 'Sweet treats to end your dining experience',
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'drinks',
    name: 'Drinks',
    description: 'Refreshing beverages to complement your meal',
    image: 'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
]

export const menuItems: MenuItem[] = [
  {
    id: 'bruschetta',
    name: 'Classic Bruschetta',
    description: 'Grilled bread rubbed with garlic and topped with diced tomatoes, fresh basil, and extra-virgin olive oil',
    price: 8.99,
    image: 'https://images.pexels.com/photos/2762942/pexels-photo-2762942.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Appetizers',
    cuisine: 'Italian',
    tags: ['vegetarian', 'shareable'],
    popular: true,
    preparationTime: 10,
    allergens: ['gluten'],
    nutritionalInfo: {
      calories: 220,
      protein: 5,
      carbs: 25,
      fat: 12
    }
  },
  {
    id: 'calamari',
    name: 'Crispy Calamari',
    description: 'Tender calamari lightly dusted in seasoned flour and fried to golden perfection. Served with marinara sauce',
    price: 12.99,
    image: 'https://images.pexels.com/photos/8512525/pexels-photo-8512525.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Appetizers',
    cuisine: 'Mediterranean',
    tags: ['seafood', 'fried'],
    popular: true,
    preparationTime: 15,
    allergens: ['gluten', 'shellfish'],
    nutritionalInfo: {
      calories: 340,
      protein: 18,
      carbs: 30,
      fat: 16
    }
  },
  {
    id: 'spring-rolls',
    name: 'Vegetable Spring Rolls',
    description: 'Crispy spring rolls filled with cabbage, carrots, mushrooms, and glass noodles. Served with sweet chili sauce',
    price: 7.99,
    image: 'https://images.pexels.com/photos/955137/pexels-photo-955137.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Appetizers',
    cuisine: 'Asian',
    tags: ['vegetarian', 'fried'],
    popular: false,
    preparationTime: 10,
    allergens: ['gluten', 'soy'],
    nutritionalInfo: {
      calories: 280,
      protein: 6,
      carbs: 32,
      fat: 14
    }
  },
  {
    id: 'buffalo-wings',
    name: 'Buffalo Wings',
    description: 'Crispy chicken wings tossed in spicy buffalo sauce. Served with celery sticks and blue cheese dressing',
    price: 13.99,
    image: 'https://images.pexels.com/photos/8992923/pexels-photo-8992923.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Appetizers',
    cuisine: 'American',
    tags: ['spicy', 'meat'],
    popular: true,
    spiceLevel: 2,
    preparationTime: 15,
    allergens: ['dairy'],
    nutritionalInfo: {
      calories: 450,
      protein: 28,
      carbs: 12,
      fat: 32
    }
  },
  {
    id: 'mozzarella-sticks',
    name: 'Mozzarella Sticks',
    description: 'Breaded mozzarella sticks fried to a golden brown. Served with marinara sauce',
    price: 9.99,
    image: 'https://images.pexels.com/photos/10838425/pexels-photo-10838425.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Appetizers',
    cuisine: 'American',
    tags: ['vegetarian', 'fried', 'cheese'],
    popular: false,
    preparationTime: 10,
    allergens: ['dairy', 'gluten'],
    nutritionalInfo: {
      calories: 320,
      protein: 14,
      carbs: 26,
      fat: 18
    }
  },
  {
    id: 'beef-burger',
    name: 'Classic Beef Burger',
    description: 'Juicy beef patty topped with lettuce, tomato, onion, pickles, and special sauce on a toasted brioche bun',
    price: 14.99,
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Main Courses',
    cuisine: 'American',
    tags: ['meat', 'sandwich'],
    popular: true,
    preparationTime: 15,
    allergens: ['gluten', 'dairy', 'eggs'],
    nutritionalInfo: {
      calories: 650,
      protein: 32,
      carbs: 45,
      fat: 38
    }
  },
  {
    id: 'margherita-pizza',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, fresh mozzarella, and basil on a thin, crispy crust',
    price: 13.99,
    image: 'https://images.pexels.com/photos/2714722/pexels-photo-2714722.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Main Courses',
    cuisine: 'Italian',
    tags: ['vegetarian', 'cheese'],
    popular: true,
    preparationTime: 20,
    allergens: ['gluten', 'dairy'],
    nutritionalInfo: {
      calories: 760,
      protein: 28,
      carbs: 88,
      fat: 32
    }
  },
  {
    id: 'pad-thai',
    name: 'Pad Thai',
    description: 'Stir-fried rice noodles with eggs, tofu, bean sprouts, and peanuts in a savory tamarind sauce',
    price: 15.99,
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Main Courses',
    cuisine: 'Asian',
    tags: ['vegetarian', 'noodles', 'spicy'],
    popular: true,
    spiceLevel: 2,
    preparationTime: 15,
    allergens: ['peanuts', 'soy', 'eggs'],
    nutritionalInfo: {
      calories: 580,
      protein: 18,
      carbs: 78,
      fat: 22
    }
  },
  {
    id: 'chicken-alfredo',
    name: 'Chicken Alfredo',
    description: 'Fettuccine pasta tossed with grilled chicken and creamy alfredo sauce. Topped with parmesan cheese',
    price: 16.99,
    image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Main Courses',
    cuisine: 'Italian',
    tags: ['pasta', 'meat', 'cheese'],
    popular: true,
    preparationTime: 20,
    allergens: ['gluten', 'dairy'],
    nutritionalInfo: {
      calories: 820,
      protein: 42,
      carbs: 68,
      fat: 46
    }
  },
  {
    id: 'salmon-fillet',
    name: 'Grilled Salmon Fillet',
    description: 'Fresh Atlantic salmon grilled and topped with lemon butter sauce. Served with seasonal vegetables',
    price: 19.99,
    image: 'https://images.pexels.com/photos/3763847/pexels-photo-3763847.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Main Courses',
    cuisine: 'American',
    tags: ['seafood', 'healthy', 'grilled'],
    popular: false,
    preparationTime: 20,
    allergens: ['fish', 'dairy'],
    nutritionalInfo: {
      calories: 480,
      protein: 42,
      carbs: 12,
      fat: 28
    }
  },
  {
    id: 'french-fries',
    name: 'French Fries',
    description: 'Crispy golden french fries seasoned with sea salt',
    price: 4.99,
    image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Sides',
    cuisine: 'American',
    tags: ['vegetarian', 'fried'],
    popular: true,
    preparationTime: 10,
    allergens: ['gluten'],
    nutritionalInfo: {
      calories: 320,
      protein: 4,
      carbs: 42,
      fat: 16
    }
  },
  {
    id: 'caesar-salad',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce tossed with caesar dressing, parmesan cheese, and croutons',
    price: 7.99,
    image: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Sides',
    cuisine: 'Italian',
    tags: ['vegetarian', 'salad'],
    popular: false,
    preparationTime: 10,
    allergens: ['dairy', 'gluten', 'eggs'],
    nutritionalInfo: {
      calories: 260,
      protein: 8,
      carbs: 12,
      fat: 22
    }
  },
  {
    id: 'garlic-bread',
    name: 'Garlic Bread',
    description: 'Toasted baguette with garlic butter and herbs',
    price: 5.99,
    image: 'https://images.pexels.com/photos/1108611/pexels-photo-1108611.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Sides',
    cuisine: 'Italian',
    tags: ['vegetarian', 'bread'],
    popular: true,
    preparationTime: 8,
    allergens: ['gluten', 'dairy'],
    nutritionalInfo: {
      calories: 280,
      protein: 6,
      carbs: 32,
      fat: 14
    }
  },
  {
    id: 'chocolate-cake',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center. Served with vanilla ice cream',
    price: 8.99,
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Desserts',
    cuisine: 'French',
    tags: ['vegetarian', 'chocolate', 'sweet'],
    popular: true,
    preparationTime: 15,
    allergens: ['gluten', 'dairy', 'eggs'],
    nutritionalInfo: {
      calories: 480,
      protein: 6,
      carbs: 58,
      fat: 26
    }
  },
  {
    id: 'tiramisu',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream',
    price: 7.99,
    image: 'https://images.pexels.com/photos/6489822/pexels-photo-6489822.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Desserts',
    cuisine: 'Italian',
    tags: ['vegetarian', 'coffee', 'sweet'],
    popular: true,
    preparationTime: 0, // Pre-made
    allergens: ['gluten', 'dairy', 'eggs'],
    nutritionalInfo: {
      calories: 420,
      protein: 6,
      carbs: 46,
      fat: 24
    }
  },
  {
    id: 'cheesecake',
    name: 'New York Cheesecake',
    description: 'Creamy cheesecake with a graham cracker crust. Topped with fresh berries',
    price: 7.99,
    image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Desserts',
    cuisine: 'American',
    tags: ['vegetarian', 'cheese', 'sweet'],
    popular: false,
    preparationTime: 0, // Pre-made
    allergens: ['dairy', 'gluten', 'eggs'],
    nutritionalInfo: {
      calories: 450,
      protein: 8,
      carbs: 42,
      fat: 28
    }
  },
  {
    id: 'soda',
    name: 'Soft Drinks',
    description: 'Choice of Coca-Cola, Diet Coke, Sprite, or Fanta',
    price: 2.99,
    image: 'https://images.pexels.com/photos/2531186/pexels-photo-2531186.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Drinks',
    cuisine: 'American',
    tags: ['cold', 'carbonated'],
    popular: true,
    preparationTime: 2,
    allergens: [],
    nutritionalInfo: {
      calories: 140,
      protein: 0,
      carbs: 39,
      fat: 0
    }
  },
  {
    id: 'iced-tea',
    name: 'Iced Tea',
    description: 'Fresh brewed iced tea. Choice of sweetened or unsweetened',
    price: 2.99,
    image: 'https://images.pexels.com/photos/544113/pexels-photo-544113.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Drinks',
    cuisine: 'American',
    tags: ['cold', 'tea'],
    popular: false,
    preparationTime: 2,
    allergens: [],
    nutritionalInfo: {
      calories: 80,
      protein: 0,
      carbs: 20,
      fat: 0
    }
  },
  {
    id: 'lemonade',
    name: 'Fresh Lemonade',
    description: 'Freshly squeezed lemonade with a hint of mint',
    price: 3.99,
    image: 'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Drinks',
    cuisine: 'American',
    tags: ['cold', 'fresh'],
    popular: true,
    preparationTime: 5,
    allergens: [],
    nutritionalInfo: {
      calories: 120,
      protein: 0,
      carbs: 30,
      fat: 0
    }
  }
]