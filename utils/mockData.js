const mockFeaturedCategories = [
  {
    _id: "feat-1",
    title: "Popular Near You",
    short_description: "Top rated restaurants in your area",
    restaurants: [
      {
        _id: "rest-1",
        name: "Bella Italia",
        image: "https://picsum.photos/seed/bella-italia/400/300",
        rating: 4.8,
        deliveryTime: "25-35 min",
        deliveryFee: 2.99,
        cuisine: "Italian",
        type: { name: "Italian" },
        dishes: [
          { _id: "dish-1", name: "Margherita Pizza", price: 14.99, image: "https://picsum.photos/seed/margherita/300/200" },
          { _id: "dish-2", name: "Spaghetti Carbonara", price: 16.99, image: "https://picsum.photos/seed/carbonara/300/200" },
        ],
      },
      {
        _id: "rest-2",
        name: "Sushi Master",
        image: "https://picsum.photos/seed/sushi-master/400/300",
        rating: 4.9,
        deliveryTime: "30-40 min",
        deliveryFee: 3.49,
        cuisine: "Japanese",
        type: { name: "Japanese" },
        dishes: [
          { _id: "dish-3", name: "Salmon Nigiri (8pc)", price: 18.99, image: "https://picsum.photos/seed/salmon-nigiri/300/200" },
          { _id: "dish-4", name: "Dragon Roll", price: 15.99, image: "https://picsum.photos/seed/dragon-roll/300/200" },
        ],
      },
      {
        _id: "rest-3",
        name: "Burger Joint",
        image: "https://picsum.photos/seed/burger-joint/400/300",
        rating: 4.6,
        deliveryTime: "20-30 min",
        deliveryFee: 1.99,
        cuisine: "American",
        type: { name: "American" },
        dishes: [
          { _id: "dish-5", name: "Classic Cheeseburger", price: 12.99, image: "https://picsum.photos/seed/cheeseburger/300/200" },
          { _id: "dish-6", name: "Truffle Fries", price: 6.99, image: "https://picsum.photos/seed/truffle-fries/300/200" },
        ],
      },
    ],
  },
  {
    _id: "feat-2",
    title: "Healthy Options",
    short_description: "Nutritious and delicious meals",
    restaurants: [
      {
        _id: "rest-4",
        name: "Green Bowl",
        image: "https://picsum.photos/seed/green-bowl/400/300",
        rating: 4.7,
        deliveryTime: "25-35 min",
        deliveryFee: 2.49,
        cuisine: "Healthy",
        type: { name: "Healthy" },
        dishes: [
          { _id: "dish-7", name: "Quinoa Buddha Bowl", price: 13.99, image: "https://picsum.photos/seed/buddha-bowl/300/200" },
          { _id: "dish-8", name: "Kale Caesar Salad", price: 11.99, image: "https://picsum.photos/seed/kale-salad/300/200" },
        ],
      },
      {
        _id: "rest-5",
        name: "Fresh Press",
        image: "https://picsum.photos/seed/fresh-press/400/300",
        rating: 4.5,
        deliveryTime: "15-25 min",
        deliveryFee: 1.99,
        cuisine: "Juice Bar",
        type: { name: "Juice Bar" },
        dishes: [
          { _id: "dish-9", name: "Green Detox Juice", price: 7.99, image: "https://picsum.photos/seed/green-juice/300/200" },
          { _id: "dish-10", name: "Acai Bowl", price: 12.99, image: "https://picsum.photos/seed/acai-bowl/300/200" },
        ],
      },
    ],
  },
  {
    _id: "feat-3",
    title: "Late Night Cravings",
    short_description: "Open late for your midnight hunger",
    restaurants: [
      {
        _id: "rest-6",
        name: "Midnight Tacos",
        image: "https://picsum.photos/seed/midnight-tacos/400/300",
        rating: 4.4,
        deliveryTime: "30-45 min",
        deliveryFee: 2.99,
        cuisine: "Mexican",
        type: { name: "Mexican" },
        dishes: [
          { _id: "dish-11", name: "Carne Asada Tacos (3)", price: 11.99, image: "https://picsum.photos/seed/carne-tacos/300/200" },
          { _id: "dish-12", name: "Loaded Nachos", price: 13.99, image: "https://picsum.photos/seed/loaded-nachos/300/200" },
        ],
      },
    ],
  },
];

export default mockFeaturedCategories;