// Seeds the real menu from Shri Sanware Sarkar Caterers' menu PDF.
// Replaces any existing MenuCategory/MenuItem documents with this data.
import 'dotenv/config';

import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import MenuCategory from '../src/models/MenuCategory.js';
import MenuItem from '../src/models/MenuItem.js';

const PLACEHOLDER_IMG = (seed, w = 800, h = 600) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const MENU = [
  {
    name: 'Rolls',
    items: [
      'Paneer Roll', 'Mini Frangi Roll', 'Palak Roll', 'Golden Roll', 'Papad Roll', 'Cheese Roll',
      'Cheese Paneer Roll', 'Corn Cheese Roll', 'Cottage Roll', 'Khus Khus Roll', 'Tilli Roll',
      'Cheese Tilli Roll', 'African Roll', 'Cheese Corn Chilli Roll', 'Potato Roll', 'Pahadi Roll',
      'Baby Corn Singhara', 'Matar Pump', 'Paneer Tapu', 'Mushroom Kali', 'Rajdhani Roll',
      'Black Corn Garlic Roll', 'Cheese & Vegetable Roll', 'Spider Roll', 'String Roll', 'Jain Spring Roll',
    ],
  },
  {
    name: 'Italian',
    items: [
      'Cheese Pizza', 'Mushroom Pizza', 'Corn Cheese Pizza', 'Paneer Pizza', 'Queen Pizza',
      'Corn Palak Pizza', 'Jain Pizza', 'Italian Pizza', 'Important Pizza', 'Baked Corn Pizza',
      'Corn Special Toaster', 'Italian Rosti', 'Italian Momos', 'Veg Momos (Italian)', 'Mexican Ezharada',
      'Veg Cheese Burger', 'Thai Steak Pancake', 'Warby Cue Mongolian', 'Mexican Potato',
      'Pasta Three Flavour', 'Veg Lasagna', 'Baked Cheese Macaroni', 'Baked Pineapple Cheese Macaroni',
      'Baked Pineapple with Honey Sauce', 'Corn Baked Veg', 'Almond Baked Veg', 'Vegetable Baked Veg',
      'Nachos', 'Tacos', 'Italian Paneer Lifafa', 'Italian String Roll',
    ],
  },
  {
    name: 'Soups',
    items: [
      'Tomato Soup', 'Manchow Soup', 'Sweet Corn Soup', 'Corn Palak Soup', 'Lemon Coriander Soup',
      'Almond Soup', 'Green Peas Soup', 'Veg Sweet Corn Soup', 'Mini Stone Soup',
      'Tomato Corn Cheese Soup', 'Hot & Sour Soup', 'Tomato Shorba', 'Veg Coriander Soup',
    ],
  },
  {
    name: 'Salads & Chutneys',
    items: [
      'Sprouts Salad', 'Parmal Salad', 'Fruit Salad', 'Green Salad', 'Mixed Pickle', 'Keri Jholaya',
      'Nesi Coffee', 'Garlic Chutney', 'Jaggery Chutney', 'Date Chutney', 'Amla Murabba',
    ],
  },
  {
    name: 'Dry Fruit Sweets',
    items: [
      'Kaju Katli', 'Kaju Kesar Roll', 'Kaju Dry Fruit Katli', 'Kaju Anjeer Katli', 'Kaju Anjeer Sandwich',
      'Kaju Pista Cutlet', 'Kaju Anjeer Cutlet', 'Kaju Anjeer Roll', 'Dry Fruit Cutlet', 'Pista Cutlet',
      'Kaju Tiranga Katli', 'Kaju Tiranga Sandwich', 'Kaju Kalash', 'Kaju Samosa (Sweet)', 'Kaju Pista Paan',
      'Butterscotch Katli', 'Butterscotch Dry Fruit Katli', 'Butterscotch Orange Katli', 'Rose Katli',
      'Pista Cone', 'Badam Katli', 'Badam Barfi', 'Kaju Tarbuj', 'Kaju Kamal Bhog', 'Kaju Gulkand Katli',
      'Kaju Mysore Pak', 'Kaju Anjeer Khaskhas', 'Kaju Panchmukhi Roll', 'Dry Fruit Gulab Laddu',
      'Kaju Gulkand Petis', 'Kaju Lot Pot', 'Pista Lonch', 'Anjeer Petis', 'Kesar Katli', 'Kaju Mor Pankhi',
      'Kaju Chocolate Bite', 'Kaju Green Diamond', 'Dry Fruit Basket', 'Dry Fruit Trimurti',
      'Dry Fruit Tiranga', 'Dry Fruit Shankh', 'Dry Fruit Gulab', 'Pista Pan Katli', 'Pista Badam Barfi',
      'Badam Sandwich', 'Dry Fruit Cream Kalash', 'Kaju Bite', 'Kaju Gajak', 'Kaju Sohan', 'Badam Cutless',
      'Dry Fruit Rose Katli Choco', 'Square Tiranga Roll', 'Pista Khaskhas Roll', 'Jelly Dry Fruit Laddu',
      'Pista Barfi', 'Dry Fruit Kesar Tilak', 'Kesar Sandesh', 'Dry Fruit Mango Roll',
      'Dry Fruit Strawberry Roll', 'Akhrot Pista Laddu', 'Dry Fruit Parleji', 'Baked Badam Tikiya',
      'Kaju Mango', 'Kaju Apple', 'Kaju Sitafal', 'Dry Fruit Khajur Bite', 'American Nuts Bite',
    ],
  },
  {
    name: 'Chaat',
    items: [
      'Paneer Tikki', 'Hariyali Tikki', 'Hare Chhole ki Tikki', 'Vegetable Tikki', 'Bengali Tikki',
      'Pop Tikki', 'Matar Ragda Patties', 'Paneer Bhalla', 'Kela Lachha Tikki', 'Dahi Bada', 'Kanji Bada',
      'Pav Bhaji', 'Paneer Pav Bhaji', 'Butter Pav Bhaji', 'Jain Pav Bhaji', 'Vada Pav', 'Matar Tikki',
      'Chole Bhature', 'Pudina Paneer Tikka', 'Kaju Dahi Bada', 'Aloo Stuffed Dahi Bada',
      'Corn Stuffed Dahi Bada', 'Anguri Dahi Bada', 'Mango Bada', 'Ramchakra Bada', 'Dahi Cream Bada',
      'Gujarati Dahi Bada', 'Dahi Gujiya', 'Dahi Chandiya', 'Nakhlavi Tikki', 'South Indian Tikki',
      'Lachha Tikki', 'Agre ka Bhalla', 'Cheese Tikki', 'Corn Tikki', 'Delhi Chaat', 'Delhi Darbar',
      'Chaat Bazaar', 'Dahi Papdi Chaat', 'Paneer Papdi Chaat', 'Palak Patta Chaat', 'Mathura Chaat',
      'Nagina Chaat', 'Katori Chaat', 'Lachha Tokri Chaat', 'Dry Fruit Chaat', 'Khasta Chaat',
      'Matar Handi Chaat', 'Sakargandi Chaat', 'Fruit Kulle Chaat', 'Fruit Chaat', 'Paneer Tatka Tak',
      'Aloo Garadu Chaat', 'Garadu Chaat', 'Kela Garadu Chaat', 'Moong Paneer Sandwich', 'Moong Let',
      'Corn Chilla', 'Kerala Paratha with Malai Pyaz Sabzi', 'Kerala Paratha with Sev Pyaz Sabzi',
      'Paneer Tikka Masala', 'Paneer Tikka Sigdi', 'Paneer Tikka Mushroom', 'Baby Corn Tikka',
      'Barbecue Tikka', 'Potato Tikka', 'Paneer Chilla', 'Sada Chilla', 'Hyderabadi Chilla', 'Pop Chilla',
      'Shimla Kangan Chaat', 'Hyderabadi Paneer', 'Raj Kachori Chaat', 'Corn Chaat', 'Italy Chaat',
      'Pan Patta Chaat', 'Tawa Hot Chaat', 'Clip Kachodi', 'Patasa Bada', 'Aloo Tikki', 'Kela Tikki',
      'Aloo Chhole Tikki', 'Kela Chhole Tikki',
    ],
  },
  {
    name: 'Bengali Sweets',
    items: [
      'Ras Malai', 'Pudding Rasmalai', 'Coconut Rasmalai', 'Orange Rasmalai', 'Mango Rasmalai',
      'Santra Rasmalai', 'Rasgulla', 'Rajbhog', 'Rabdi Rajbhog', 'Santra Rajbhog', 'Chum Chum (3 Items)',
      'Ras Madhuri', 'Malai Chaap', 'Mango Indrani', 'Malai Gajra', 'Badam Pastry', 'Choco Sandwich',
      'Malai Gujiya', 'Gupchup', 'Makhan Imarti', 'Makhan Santra', 'Kesar Baati', 'Kesar Chaap',
      'Hiramani', 'Pakeeza', 'Chhena Sandwich', 'Chhena Toast', 'Kamal Rajbhog', 'Rainbow Chhena Roll',
      'Malai Chhena Roll', 'Makhan Tikiya',
    ],
  },
  {
    name: 'South Indian',
    items: [
      'Dosa', 'Plain Dosa', 'Masala Dosa', 'Mini Dosa', 'Sambar Dosa', 'Kaju Bada Dosa', 'String Dosa',
      'Paper Dosa', 'Neer Dosa', 'Rava Dosa', 'Kashmiri Dosa', 'Navratna Dosa', 'Paper Masala Dosa',
      'Corn Special Dosa', 'Chinese Dosa', 'Cheese Dosa', 'Paneer Butter Dosa', 'Mysore Dosa',
      'Mysore Masala Dosa', 'Capsicum Dosa', 'Onion Dosa', 'Cheese Chilli Dosa', 'Idli Parlour',
      'Mysore Idli', 'Butter Idli', 'Rasam Pakodi', 'Paneerum Panchadi', 'Bangalore Bada',
      'Bangalore Appe', 'Bangalore Cheese Appe', 'Mendu Vada', 'Sambar Bada', 'Idli Sambar', 'Sambar',
      'Cheese Butter Dosa',
    ],
  },
  {
    name: 'Fried Rice',
    items: [
      'Veg Rice', 'Jeera Rice', 'Ring Rice', 'Singapuri Rice', 'Sizwan Rice', 'Fried Rice',
      'Important Rice', 'Tawa Rice', 'Chillian Coriander Rice', 'Potato Surprise Rice', 'Bamboo Rice',
      'Cheese Corn Rice',
    ],
  },
  {
    name: 'Chinese',
    items: [
      'Jain Manchurian', 'Corn Manchurian', 'Mushroom Manchurian', 'Paneer Manchurian', 'Cheese Manchurian',
      'Baby Corn Manchurian', 'Potato Manchurian', 'Gravy Manchurian', 'Veg Manchurian', 'Dry Manchurian',
      'Corn Salt & Pepper', 'Paneer Momos', 'Cheese Momos', 'Veg Momos', 'Tandoori Momos', 'Corn Crispy',
      'Corn Spanish Potato', 'Chinese Idli', 'Green China Town', 'Cheese Chilli Dynamite', 'Honey Potato',
      'Lily Potato', 'Chinese Potato Spicy', 'Seek Aloo', 'Veg Lollipop', 'Chinese Hungama',
      'Paneer Baby Corn Hot Soldier', 'Veg Firangi', 'Veg Kothe with Honey Sauce', 'Veg Finger',
      'Veg Noodles', 'Veg Chowmein', 'Tasty Noodles', 'Mushroom Noodles', 'Sizwan Noodles',
      'Singapuri Noodles', 'Chinese Bhel', 'Tawa Noodles', 'Important Noodles', 'Baby Corn Noodles',
      'Thai Plate Noodles', 'Akkha Noodles', 'Chinese Maggi', 'Maggi Masala', 'Punjabi Maggi',
      'Maggi Granny Chilli Garlic', 'Butter Maggi', 'Butter Cheese Maggi', 'Garlic Maggi',
      'Important Maggi', 'Paneer Lifafa', 'Manchurian', 'Dahi Manchurian', 'Rice Manchurian',
      'Sizzler Manchurian', 'Veg Angara', 'Paneer Jaljala', 'Veg Hong Kong', 'Potato Jaljala',
      'Baby Corn Jaljala', 'Mushroom Jaljala', 'Important Jaljala', 'Italy Angara', 'Paneer-65',
      'Paneer Chilli', 'Mushroom Chilli', 'Baby Corn Chilli', 'Italy Chilli', 'Veg Baby Chilli',
      'Potato Chilli', 'Veg Pepper Chilli', 'Veg Sizwan Paneer', 'Green Finger Chips',
      'Veg Capsicum Roll Onion', 'Spring Roll', 'American Chopsy', 'Lemon Fruit Chopsy',
    ],
  },
  {
    name: 'Mawa Sweets',
    items: [
      'Mawa Barfi Plain', 'Mawa Kesar Barfi', 'Mawa Kesar Katli', 'Chocolate Barfi',
      'Mawa Panchmukhi Roll', 'Mawa Cutlet Dry Fruit', 'Mawa Jee Roll', 'Mawa Mishri Laddu',
      'Mawa Double Decker Barfi', 'Tiranga Barfi', 'Aam Barfi', 'Khajur Barfi', 'Butterscotch Barfi',
      'Butterscotch Roll', 'Bournvita Barfi', 'Malai Barfi', 'Malai Petha', 'Kesariya Peda', 'Seeka Peda',
      'Shakkar Chadha Petha', 'Akhrot Barfi', 'Anjeer Barfi', 'Pineapple Barfi', 'Pista Barfi (Mawa)',
      'Pineapple Malai Tikiya', 'Rose Malai Tikiya', 'Khopra Pak', 'Kesari Khoprapak Gila', 'Green Barfi',
      'Aam Pak Lachhewala', 'Til ki Barfi', 'Lehriya Roll', 'Nariyal Kalakand', 'Khajur Kalakand',
      'Gulab Jamun', 'Mini Gulab Jamun with Rabdi', 'Mini Gulab Jamun with Ice Cream', 'Kala Jaam',
      'Kathiyawadi Jamun Karela', 'Indrani Jamun', 'Mawa Bati', 'Makhana Mawa Bati', 'Gulkand Mawa Bati',
      'Kesar Kalakand', 'Pineapple Kalakand', 'Sevfal Kalakand', 'Gulkand Roll', 'Gulkand Petis',
      'Aam Kalakand Sada', 'Mawa Khaskhas Barfi', 'Dry Fruit Kalakand', 'Red Velvet Laddu',
      'Orange Choco Barfi', 'Malai Tikiya', 'Mango Malai Tikiya', 'Baal Mithai',
    ],
  },
  {
    name: 'All Is Gold',
    items: [
      'Chakki', 'Malai Chakki', 'Besan Laddu', 'Magaz Laddu', 'Currant Laddu', 'Motichoor Laddu',
      'Boondi Laddu', 'Doodhiya Laddu', 'Makhan Vada', 'Rabdi Makhan Bada', 'Ghevar', 'Rabdi Ghevar',
      'Besan Mysore Pak Meda', 'Khurma', 'Shakkar Chadha Khurma', 'Motipak Sada', 'Motipak Malai',
      'Shahi Dry Fruit Boondi', 'Colourful Ghevar with Rabdi', 'Lavender Boondi Laddu', 'Diljani',
      'Santra Diljani', 'Diljani Rabdi', 'Mango Diljani', 'Doodh ki Boondi', 'Motipak Doodhiya',
      'Moong Malai Chakki', 'Ratlami Chakki', 'Jalebi', 'Imarti', 'Sohan Papdi', 'Orange Sohan Papdi',
      'Garam Katori Chakki', 'Mithi Kachori', 'Sangam Chakki', 'Suji Laddu', 'Sattu Churma Rajasthani',
      'Bajra Churma', 'Feeni', 'Aam Nugdi', 'Kiwi Chakki',
    ],
  },
  {
    name: 'Ground Service',
    items: [
      'Hara Bhara Kabab', 'Dahi Kabab', 'Corn Kabab', 'Methi Aloo Kabab', 'Sasar Paneer',
      'Pudina Paneer Tikka (Ground Service)', 'Sejwan Paneer', 'Baby Corn Crispy', 'Veg Satay',
      'Cheese Canapes', 'Paneer Canapes', 'Chaap Corn', 'Saffron Paneer', 'Paneer Papadi',
      'Cheese Chocobar Candy', 'Veg Koth', 'Mushroom Chilli (Ground Service)', 'Paneer Pan Cutlass',
      'Hariyali Tikki (Ground Service)', 'Coconut Paneer', 'Sesame Steak', 'Veg Lollipop (Ground Service)',
      'Cheese Samosa', 'Chinese Samosa', 'Corn Flake Lollipop', 'Crepsican Ring', 'Onion Ring', 'Gold Coin',
    ],
  },
  {
    name: 'Halwa',
    items: [
      'Moong Dal Halwa', 'Badam Halwa', 'Badam Khaskhas Halwa', 'Gajar Halwa', 'Bhutta Halwa',
      'Jhanjhariya', 'Tiranga Halwa', 'Akhrot Halwa', 'Akhrot Badam Halwa', 'Khajur Badam Halwa',
      'Anjeer Badam Halwa', 'Suji Halwa', 'Atta Halwa', 'Aloo Halwa', 'Khaskhas Halwa', 'Pista Halwa',
      'Kaju Rabdi Halwa', 'Singade ka Halwa', 'Rajgira Halwa', 'Moong Badam Halwa',
      'Strawberry Halwa Suji', 'Cream Kiwi Halwa',
    ],
  },
  {
    name: 'Rabdi',
    items: [
      'Plain Rabdi', 'Lachha Rabdi', 'Pineapple Rabdi', 'Dry Fruit Rabdi', 'Hapus Rabdi', 'Sitafal Rabdi',
      'Fruit Mix Rabdi', 'Cherry Pineapple Rabdi', 'Chiku Rabdi', 'Apple Rabdi', 'Gulkand Rabdi',
      'Coconut Rabdi', 'Lychee Vanilla Rabdi', 'Pista Rabdi', 'Fruit Custard', 'Badam Shake',
      'Guruji Thandai', 'Wheat Khichda', 'Sattu ki Rabdi', 'Chinese Rabdi', 'Orange Rabdi',
      'Oreo Dry Fruit Rabdi', 'Thandai Rabdi', 'Anjeer Rabdi', 'Khajur Rabdi',
    ],
  },
  {
    name: 'Petha Sweets',
    items: [
      'Petha Sukha', 'Petha Chashniwala', 'Petha Ball', 'Paan Gelori', 'Pineapple Gelori', 'Mango Gelori',
      'Kesar Gandheri',
    ],
  },
  {
    name: 'Chocolate Sweets',
    items: [
      'Boondi Chocolate Laddu', 'Choco Bite', 'Litchi Chocolate', 'Jelly Chocolate', 'Anjeer Chocolate',
      'Strawberry Chocolate', 'Strawberry Bite', 'Kiwi Bite', 'Choco Bahar', 'Chocolate Tiranga',
      'Kuwait Khajur Chocolate', 'Chocolate Laddu', 'Mango Chocolate', 'Mango Bite',
    ],
  },
  {
    name: 'Live Stalls & Beverages',
    items: [
      'Pomegranate Juice', 'Papaya Juice', 'Pineapple Juice', 'Sugarcane Juice', 'Watermelon Juice',
      'Lemon Shikanji', 'Mojito', 'Butterscotch Shake', 'Coconut Shake', 'Chiku Shake', 'Mango Shake',
      'Chocolate Shake', 'Mocktail', 'Mango Juice', 'Pudina Shikanji', 'Pani Patase', 'Coffee',
      'Cold Coffee', 'Ice Cream Scoop', 'Brownie with Ice Cream', 'Tawa Ice Cream', 'Roller Ice Cream',
      'Matka Kulfi', 'Ice Dish', 'Amla Shikanji',
    ],
  },
  {
    name: 'Tandoori Breads',
    items: [
      'Rumali Roti', 'Sadi Roti', 'Khasta Naan', 'Missi Roti', 'Makhan Roti', 'Bajra Roti', 'Biscuit Roti',
      'Shirmal Roti', 'Vagar Rawani', 'Family Naan', 'Staff Naan', 'Kandhari Naan', 'Lachha Paratha',
      'Paneer Paratha (Tandoor)', 'Gobhi Paratha (Tandoor)', 'Matar Masala Paratha', 'Pudina Lachha Paratha',
      'Laal Roti', 'Jungli Roti', 'Cheese Naan', 'Palak Paratha (Tandoor)', 'Chinese Paratha',
      'Achaar Paratha',
    ],
  },
  {
    name: 'Buttermilk & Curd',
    items: [
      'Shrikhand', 'Pineapple Shrikhand', 'Mango Shrikhand', 'Butterscotch Shrikhand', 'Kesariya Lassi',
      'Vanilla Shrikhand', 'Fruit Shrikhand', 'Nagori Shikanji', 'Dhamandi Lassi', 'Dry Fruit Raita',
      'Fruit Raita', 'Pineapple Raita', 'Dry Fruit Shrikhand', 'Rajbhog Shrikhand',
    ],
  },
  {
    name: 'Hot Milk Counter',
    items: [
      'Kesariya Doodh', 'Khajur Doodh', 'Bournvita Doodh', 'Feni Doodh', 'Jalebi Doodh', 'Lachha Doodh',
      'Rabdi Doodh', 'Chyawanprash Doodh', 'Cold Doodh', 'Butterscotch Doodh', 'Dry Fruit Doodh',
    ],
  },
  {
    name: 'Kheer',
    items: [
      'Sabudana Kheer', 'Chawal Kheer', 'Dry Fruit Kheer', 'Seviyan Kheer', 'Aal Kheer', 'Kaddu Kheer',
      'Khajur Kheer',
    ],
  },
  {
    name: 'Roti, Puri & Parathe',
    items: [
      'Sadi Puri', 'Namkeen Puri', 'Palak Puri', 'Methi Puri', 'Missi Puri', 'Disco Puri', 'Doodh Puri',
      'Makka Roti', 'Bajra Roti (Puri Course)', 'Jowar Roti', 'Tawa Roti', 'Gajakde', 'Makka Dhokli',
      'Gehu Dhokli', 'Gehu Bafla', 'Makki Bafla', 'Namkeen Bafla', 'Sadi Baati', 'Talma Baati',
      'Do Pud ki Roti', 'Teen Pud ki Roti', 'Aloo Paratha', 'Paneer Paratha (Course)', 'Mawa Paratha',
      'Rabdi Paratha', 'Mooli Paratha', 'Palak Paratha (Course)', 'Gajar Paratha', 'Arbi Paratha',
      'Haldi Paratha', 'Khaskhas Paratha', 'Methi Paratha', 'Pyaz Paratha', 'Lahsun Paratha',
      'Doodh Paratha', 'Gobhi Paratha (Course)', 'Galva Paratha', 'Punjabi Paratha', 'Khandani Paratha',
      'Makka Paratha', 'Chane ka Paratha',
    ],
  },
  {
    name: 'Live Sabzis',
    items: [
      'Kaccha Kela Sabzi', 'Jamfal ki Sabzi', 'Tindori ki Sabzi', 'Tinsi ki Sabzi', 'Kakdi-Angur',
      'Kaccha Kela Matar', 'Baigan ka Bharta', 'Khatti-Mithi Mirchi', 'Methi ki Sabzi',
      'Patta Gobhi Matar', 'Chawle ki Sabzi', 'Papad ki Sabzi', 'Papad Methidana', 'Odhwa ki Sabzi',
      'Pachkuta ki Sabzi', 'Ker Sangri', 'Balor Tamatar', 'Moong Dal Palak', 'Bhindi Tamatar',
      'Udiya (Gujarati)', 'Matar Kadi', 'Tawa Sabzi', 'Bharma Tensy', 'Bhindi', 'Gilki', 'Taroi',
      'Bhutta Taroi', 'Chawla Fali Taroi', 'Bharva Gilki', 'Kaccha Tamatar', 'Gwarfali',
      'Mogri ki Sabzi', 'Aloo Mogri', 'Karela', 'Besan Karela', 'Patta Gobhi', 'Phool Gobhi',
      'Malai Kofta', 'Aloo Kofta', 'Moong Mogar Paneer', 'Sarso ka Saag', 'Amal ki Bhaji',
      'Pyaz ki Sabzi', 'Kakdi ki Sabzi', 'Kaccha Papita ki Sabzi', 'Lonji Keri Angur',
      'Lonji Pind Khajur ki', 'Aloo ki Sabzi', 'Aloo Gobhi ki Sabzi', 'Aloo Matar ki Sabzi',
      'Aloo Bhindi ki Sabzi', 'Aloo Matar Methi', 'Matar Shimla Mirch Tamatar',
    ],
  },
  {
    name: 'Hot Namkeen',
    items: [
      'Kachori', 'Samosa Aloo', 'Samosa Kela', 'Patties Masala', 'Chhola Tikiya', 'Kela Bada', 'Aloo Bada',
      'Chilla Sada', 'Moong Chilla', 'Paneer Chilla (Namkeen)', 'Chhola Bhatura', 'Kela Finger',
      'Aloo Finger', 'Garadu', 'Garam Sev (5 Types)', 'Bhutta Kachori', 'Chhod Kachori', 'Matar Kachori',
      'Bread Bada', 'Karan Bhajiya', 'Matar Bhajiya', 'Mirchi Bada', 'Kachori Dahi-Daana', 'Samosa',
      'Dahi Bada (Namkeen)', 'Dahi Khasta', 'Khaman', 'Bada Sambhar', 'Idli Sambhar',
      'Idli Fry Taka Tak', 'Dry Fruit Upma', 'Aloo Patties', 'Makai Chaat', "Bhutte ka Keas",
      'Sabudana Khichdi', 'Sev Lahsun ki', 'Kadi Pakoda', 'Paneer Pakoda', 'Mix Bhajiya', 'Chhod Bhajiya',
    ],
  },
  {
    name: 'Dry Namkeen',
    items: [
      'Sev Ratlami', 'Gathiya Sada', 'Gathiya Lasan Lal Mirchi', 'Pudina Gathiya', 'Lal Dal Hing',
      'Green Dal Dry Fruit', 'Mewa Masur', 'Papad Mixture', 'Navratna Mixture', 'Kashmiri Mixture',
      'Tasty Peanuts', 'Kaju Tasty', 'Fika Gathiya Sal', 'Bhavnagari Gathiya', 'Poha Chivda',
      'Makai Chivda', 'Kaju Fry', 'Badam Fry', 'Aloo Chivda', 'Kela Chivda', 'Fiki Sev', 'Namkeen Papdi',
      'Fiki Papdi', 'Fafda (4 Types)', 'Tomato Sev', 'Palak Sev', 'Dal Moth', 'Dal Sev',
      'Peanut Daana Lal', 'Peanut Daana Green', 'Peanut Daana Black Pepper', 'Tasty Green Daana',
      'Sev Chatpata', 'Dankal', 'Mogar Moong Dry Fruit', 'Jodhpuri Gathiya', 'Papad Katran 420',
      'Papad Disco 420', 'Papad-Papdi Chura', 'Singdana Khatta Meetha', 'Khakhra', 'Namkeen Khurma',
      'Papad Khichda', 'Masala',
    ],
  },
  {
    name: 'Rice (Pulao & Khichdi)',
    items: [
      'Sada Chawal', 'Sada Pulao', 'Kashmiri Pulao', 'Gatta Pulao', 'Jeera Fry', 'Pulao Khatta Meetha',
      'Dry Fruit Pulao', 'Chawal Moong Khichdi', 'Dahi ka Karva', 'Matar Pulao', 'Chhod Pulao',
      'Fruit Pulao', 'Gulab Katari Pulao', 'Katha Dal Chawal', 'Kesariya Bhaat', 'Jodhpuri Pulao',
      'Rabdi Kesariya Bhaat', 'Vegetable Pulao', 'Sattu Khichdi Rajasthani',
    ],
  },
  {
    name: 'Evergreen Sabzis',
    items: [
      'Matar Paneer Masala', 'Butter Paneer Masala', 'Shahi Paneer Masala', 'Palak Paneer Masala',
      'Makhani Paneer Masala', 'Paneer Bhurji', 'Kaju Paneer', 'Paneer Chatpata', 'Paneer Pasanda',
      'Malai Paneer', 'Chilli Paneer Masala', 'Chhod Paneer Masala', 'Chholi Paneer Masala',
      'Kaju Masala', 'Kaju Curry', 'Cheese Paneer Masala', 'Chhod Kaju', 'Kaju Tamatar Masala',
      'Cheese Kaju Masala', 'Malai Methi Matar', 'Malai Methi Corn', 'Malai Pyaz', 'Paneer Do Pyaza',
      'Kashmiri Dum Aloo', 'Bharma Aloo Pyaza', 'Hyderabadi Paneer Masala', 'Paneer Tikka Masala (Sabzi)',
      'Stuffed Tamatar Paneer', 'Stuffed Shimla Paneer', 'Sev Tamatar', 'Sev Mawa Masala',
      'Sev Doodh Masala', 'Kaju Khoya Masala', 'Veg Kolhapuri Masala', 'Tawa Veg Masala', 'Mawa Matar',
      'Chhod Mawa', 'Dum Aloo',
    ],
  },
  {
    name: 'Dry Dal Sabzis',
    items: [
      'Tuvar Dal', 'Urad Chana Dal', 'Moong Dal', 'Chane ki Dal', 'Chhola', 'Moong Mogar',
      'Amritsari Chhole', 'Panchmeri Dal', 'Dal Makhani', 'Dal Maharani', 'Rajma Masala',
      'Chane ki Dal with Loki', 'Chana Dal Kakdi', 'Mix Dal',
    ],
  },
  {
    name: 'Besan Sabzis',
    items: [
      'Besan Gatta Dahi ka', 'Besan Gatta Khaskhas ka', 'Patod', 'Chhod ka Besan', 'Plain Besan',
      'Pyaz Besan', 'Besan Mirchi', 'Kadi Pakoda (Besan)', 'Jodhpuri Besan Gatta', 'Kadi',
    ],
  },
];

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function main() {
  await connectDB();

  await Promise.all([MenuCategory.deleteMany({}), MenuItem.deleteMany({})]);

  let totalItems = 0;
  for (let catIndex = 0; catIndex < MENU.length; catIndex++) {
    const { name, items } = MENU[catIndex];
    const category = await MenuCategory.create({
      name,
      slug: slugify(name),
      sortOrder: catIndex,
      isActive: true,
    });

    const seenSlugs = new Set();
    const docs = [];
    for (let i = 0; i < items.length; i++) {
      const itemName = items[i];
      let slug = slugify(itemName);
      if (seenSlugs.has(slug)) slug = `${slug}-${i}`;
      seenSlugs.add(slug);

      docs.push({
        name: itemName,
        slug,
        categoryId: category._id,
        description: '',
        image: PLACEHOLDER_IMG(`${category.slug}-${i}`),
        cuisine: 'Indian',
        dietaryTags: ['veg'],
        availability: true,
        status: 'published',
        sortOrder: i,
      });
    }
    await MenuItem.insertMany(docs);
    totalItems += docs.length;
    console.log(`Seeded ${docs.length} items in "${name}"`);
  }

  console.log(`Done. ${MENU.length} categories, ${totalItems} items.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
