require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Product = require('../models/Product');

// Sample solar products data
const solarProducts = [
  // {
  //   _id: "prod001",
  //   name: "Loom Solar Panel 440W",
  //   type: "Monocrystalline",
  //   watt: 440,
  //   price: 10500,
  //   stock: 18,
  //   features: ["25 Year Warranty", "High Efficiency", "Weather Resistant"]
  // },
  // {
  //   _id: "prod002",
  //   name: "Luminous Solar Panel 330W",
  //   type: "Polycrystalline",
  //   watt: 330,
  //   price: 7800,
  //   stock: 25,
  //   features: ["20 Year Warranty", "Anti-Reflective Coating"]
  // },
  // {
  //   _id: "prod003",
  //   name: "Waaree Solar Panel 550W",
  //   type: "Monocrystalline PERC",
  //   watt: 550,
  //   price: 12500,
  //   stock: 10,
  //   features: ["30 Year Warranty", "Highest Efficiency", "Salt Mist Resistant"]
  // },
  // {
  //   _id: "prod004",
  //   name: "Tata Power Solar Panel 380W",
  //   type: "Monocrystalline",
  //   watt: 380,
  //   price: 9200,
  //   stock: 22,
  //   features: ["25 Year Warranty", "Made in India", "PID Resistant"]
  // },
  // {
  //   _id: "prod005",
  //   name: "Adani Solar Panel 400W",
  //   type: "Monocrystalline",
  //   watt: 400,
  //   price: 9800,
  //   stock: 15,
  //   features: ["25 Year Warranty", "Low Light Performance"]
  // },
  // {
  //   _id: "prod006",
  //   name: "Vikram Solar Panel 360W",
  //   type: "Polycrystalline",
  //   watt: 360,
  //   price: 8500,
  //   stock: 20,
  //   features: ["20 Year Warranty", "Hail Resistant"]
  // },
  // {
  //   _id: "prod007",
  //   name: "Havells Solar Inverter 3kW",
  //   type: "Grid-Tie Inverter",
  //   watt: 3000,
  //   price: 45000,
  //   stock: 8,
  //   features: ["5 Year Warranty", "LCD Display", "MPPT Technology"]
  // },
  // {
  //   _id: "prod008",
  //   name: "Luminous Solar Battery 150Ah",
  //   type: "Tubular Battery",
  //   watt: 1800,
  //   price: 18500,
  //   stock: 12,
  //   features: ["4 Year Warranty", "Deep Cycle", "Low Maintenance"]
  // },
  // {
  //   _id: "prod009",
  //   name: "Microtek Solar PCU 2kVA",
  //   type: "Power Conditioning Unit",
  //   watt: 2000,
  //   price: 28000,
  //   stock: 7,
  //   features: ["2 Year Warranty", "Digital Display", "Overload Protection"]
  // },
  // {
  //   _id: "prod010",
  //   name: "Loom Solar Charge Controller 60A",
  //   type: "MPPT Controller",
  //   watt: 0,
  //   price: 12000,
  //   stock: 15,
  //   features: ["3 Year Warranty", "LCD Display", "Auto System Voltage"]
  // },
  // {
  //   _id: "prod011",
  //   name: "UTL Solar Battery 200Ah",
  //   type: "Gel Battery",
  //   watt: 2400,
  //   price: 24500,
  //   stock: 9,
  //   features: ["5 Year Warranty", "Maintenance Free", "Deep Discharge Recovery"]
  // },
  // {
  //   _id: "prod012",
  //   name: "Waaree Bifacial Solar Panel 500W",
  //   type: "Bifacial Monocrystalline",
  //   watt: 500,
  //   price: 14000,
  //   stock: 6,
  //   features: ["30 Year Warranty", "Dual-Side Power Generation", "High Efficiency"]
  // },
  // {
  //   _id: "prod013",
  //   name: "Tata Power Solar Water Heater 200L",
  //   type: "Evacuated Tube Collector",
  //   watt: 0,
  //   price: 32000,
  //   stock: 5,
  //   features: ["7 Year Warranty", "Insulated Tank", "Pressurized System"]
  // },
  // {
  //   _id: "prod014",
  //   name: "Luminous Solar Home Lighting System",
  //   type: "Complete Kit",
  //   watt: 200,
  //   price: 15000,
  //   stock: 10,
  //   features: ["2 Year Warranty", "3 LED Bulbs", "Mobile Charging"]
  // },
  // {
  //   _id: "prod015",
  //   name: "Havells Solar Water Pump 2HP",
  //   type: "Submersible Pump",
  //   watt: 1500,
  //   price: 65000,
  //   stock: 4,
  //   features: ["3 Year Warranty", "Stainless Steel", "High Flow Rate"]
  // },
  // {
  //   _id: "prod016",
  //   name: "Vikram Solar Rooftop Kit 5kW",
  //   type: "Complete System",
  //   watt: 5000,
  //   price: 350000,
  //   stock: 3,
  //   features: ["25 Year Panel Warranty", "5 Year System Warranty", "Grid Connected"]
  // },
  // {
  //   _id: "prod017",
  //   name: "Loom Solar DC Fan 12V",
  //   type: "Solar DC Appliance",
  //   watt: 25,
  //   price: 2500,
  //   stock: 30,
  //   features: ["1 Year Warranty", "Low Power Consumption", "High Air Flow"]
  // },
  // {
  //   _id: "prod018",
  //   name: "Microtek Solar Street Light 40W",
  //   type: "Integrated Solar Light",
  //   watt: 40,
  //   price: 8500,
  //   stock: 15,
  //   features: ["2 Year Warranty", "Motion Sensor", "Dusk to Dawn Operation"]
  // },
  // {
  //   _id: "prod019",
  //   name: "Adani Solar Mounting Structure",
  //   type: "Rooftop Mounting",
  //   watt: 0,
  //   price: 12000,
  //   stock: 8,
  //   features: ["10 Year Warranty", "Galvanized Steel", "Wind Resistant"]
  // },
  // {
  //   _id: "prod020",
  //   name: "UTL Solar Hybrid Inverter 5kW",
  //   type: "Hybrid Inverter",
  //   watt: 5000,
  //   price: 85000,
  //   stock: 5,
  //   features: ["5 Year Warranty", "Grid + Solar Input", "Battery Backup"]
  // }
];

// Connect to MongoDB
const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert new products
    await Product.insertMany(solarProducts);
    console.log(`Added ${solarProducts.length} products to the database`);
    
    // Close connection
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

// Run the seed function
seedDB();