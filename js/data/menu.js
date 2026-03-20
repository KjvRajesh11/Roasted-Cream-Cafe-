/* =========================================================
   Roasted Cream – js/data/menu.js
   Single source of truth for all menu items
   ========================================================= */
'use strict';

/**
 * Full menu catalogue.
 * image paths are relative to index.html (root)
 * categories: 'dessert' | 'pizza' | 'momo' | 'sandwich' | 'drinks' | 'snacks'
 */
export const menuItems = [
  /* ─── Desserts ─── */
  {
    id: 1,
    name: 'Roasted Dream Cream',
    price: 149,
    image: 'images/dessert.jpg',
    category: 'dessert',
    badge: '🏆 Signature',
    badgeClass: 'bg-yellow-100 text-yellow-800',
    description: 'Our legendary layered dessert — velvety vanilla cream, dark chocolate ganache, and a caramelised biscuit crunch. Absolute bliss.',
    isVeg: true,
  },
  {
    id: 2,
    name: 'Nutella Waffle Stack',
    price: 159,
    image: 'images/waffle.jpg',
    category: 'dessert',
    badge: null,
    description: 'Golden Belgian waffles stacked with Nutella, fresh bananas, and a scoop of vanilla ice cream. Dessert heaven.',
    isVeg: true,
  },
  {
    id: 3,
    name: 'Dark Chocolate Brownie',
    price: 99,
    image: 'images/brownie.jpg',
    category: 'dessert',
    badge: null,
    description: 'Warm, fudgy dark chocolate brownie served with a scoop of vanilla ice cream and chocolate drizzle.',
    isVeg: true,
  },
  {
    id: 4,
    name: 'Mango Panna Cotta',
    price: 129,
    image: 'images/pannacotta.jpg',
    category: 'dessert',
    badge: '🌟 New',
    badgeClass: 'bg-green-100 text-green-800',
    description: 'Silky Italian panna cotta with fresh Alphonso mango coulis — light, creamy, and absolutely refreshing.',
    isVeg: true,
  },

  /* ─── Pizzas ─── */
  {
    id: 5,
    name: 'Margherita Magic',
    price: 199,
    image: 'images/pizza.jpg',
    category: 'pizza',
    badge: '🔥 Bestseller',
    badgeClass: 'bg-red-100 text-red-700',
    description: 'Classic thin-crust pizza with tangy tomato sauce, fresh mozzarella & fragrant basil. Crispy edges, gooey centre — perfection.',
    isVeg: true,
  },
  {
    id: 6,
    name: 'Paneer Tikka Pizza',
    price: 229,
    image: 'images/pizza-paneer.jpg',
    category: 'pizza',
    badge: '🌶 Spicy',
    badgeClass: 'bg-orange-100 text-orange-700',
    description: 'Tandoori-spiced paneer, capsicum & onion on a smoky tomato base. The Indian pizza you never knew you needed.',
    isVeg: true,
  },
  {
    id: 7,
    name: 'BBQ Chicken Pizza',
    price: 269,
    image: 'images/pizza-chicken.jpg',
    category: 'pizza',
    badge: null,
    description: 'Smoky BBQ sauce, grilled chicken, jalapeños, and sharp cheddar on a hand-stretched base. A meat-lover\'s dream.',
    isVeg: false,
  },

  /* ─── Momos ─── */
  {
    id: 8,
    name: 'Steamed Momo Basket',
    price: 99,
    image: 'images/momos.jpg',
    category: 'momo',
    badge: null,
    description: 'Soft-steamed dumplings stuffed with spiced veggies or chicken, served with fiery red chutney. 6 pieces of pure comfort.',
    isVeg: true,
  },
  {
    id: 9,
    name: 'Fried Momo Basket',
    price: 119,
    image: 'images/momos-fried.jpg',
    category: 'momo',
    badge: '🍟 Crispy',
    badgeClass: 'bg-amber-100 text-amber-800',
    description: 'Golden-fried momos with a crispy shell and juicy filling inside. Served with our signature red chutney. 6 pieces.',
    isVeg: true,
  },

  /* ─── Sandwiches ─── */
  {
    id: 10,
    name: 'Loaded Club Sandwich',
    price: 129,
    image: 'images/sandwich.jpg',
    category: 'sandwich',
    badge: null,
    description: 'Triple-decker toasted sandwich with fresh veggies, creamy spread, and melted cheese. Filling, flavourful, and fast.',
    isVeg: true,
  },
  {
    id: 11,
    name: 'Grilled Chicken Sandwich',
    price: 159,
    image: 'images/sandwich-chicken.jpg',
    category: 'sandwich',
    badge: '🔥 Hot Pick',
    badgeClass: 'bg-red-100 text-red-700',
    description: 'Juicy grilled chicken with lettuce, tomato, caramelised onions, and chipotle mayo on toasted brioche bread.',
    isVeg: false,
  },

  /* ─── Drinks & Shakes ─── */
  {
    id: 12,
    name: 'Thick Oreo Shake',
    price: 119,
    image: 'images/shake.jpg',
    category: 'drinks',
    badge: '🥤 Fan Fav',
    badgeClass: 'bg-purple-100 text-purple-700',
    description: 'Crushed Oreos blended with creamy vanilla ice cream and chilled milk — thick, indulgent, and absolutely addictive.',
    isVeg: true,
  },
  {
    id: 13,
    name: 'Mango Tango Shake',
    price: 109,
    image: 'images/shake-mango.jpg',
    category: 'drinks',
    badge: null,
    description: 'Fresh Alphonso mango pulp blended into a thick, tropical shake. Every sip feels like summer in Hyderabad.',
    isVeg: true,
  },
  {
    id: 14,
    name: 'Cold Brew Coffee',
    price: 89,
    image: 'images/cold-brew.jpg',
    category: 'drinks',
    badge: '☕ New',
    badgeClass: 'bg-amber-100 text-amber-800',
    description: '16-hour slow-steeped Arabica cold brew — smooth, bold, and never bitter. Served over ice with a splash of cream.',
    isVeg: true,
  },

  /* ─── Snacks ─── */
  {
    id: 15,
    name: 'Loaded Cheese Fries',
    price: 129,
    image: 'images/fries.jpg',
    category: 'snacks',
    badge: '🧀 Cheesy',
    badgeClass: 'bg-yellow-100 text-yellow-700',
    description: 'Crispy golden fries smothered in molten cheddar cheese sauce, jalapeños, and sour cream. Pure guilty pleasure.',
    isVeg: true,
  },
];

/** Get unique categories from menu */
export const menuCategories = [
  { value: 'all',      label: 'All' },
  { value: 'dessert',  label: 'Desserts' },
  { value: 'pizza',    label: 'Pizza' },
  { value: 'momo',     label: 'Momos' },
  { value: 'sandwich', label: 'Sandwiches' },
  { value: 'drinks',   label: 'Drinks' },
  { value: 'snacks',   label: 'Snacks' },
];

/**
 * Get items filtered by category
 * @param {string} category  'all' | 'dessert' | 'pizza' | etc.
 * @returns {Array}
 */
export function getItemsByCategory(category) {
  if (category === 'all') return menuItems;
  return menuItems.filter(item => item.category === category);
}

/**
 * Get item by id
 * @param {number} id
 * @returns {object|undefined}
 */
export function getItemById(id) {
  return menuItems.find(item => item.id === Number(id));
}
