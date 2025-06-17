const axios = require('axios');

/**
 * Service to interact with Mistral AI API
 */
class MistralService {
  constructor() {
    this.apiKey = process.env.MISTRAL_API_KEY;
    this.apiUrl = process.env.MISTRAL_API_URL;
    
    // Check if API key and URL are available, but don't throw error
    if (!this.apiKey || !this.apiUrl) {
      console.warn('Warning: Mistral API configuration missing. Using dynamic response from database.');
      this.useMockResponses = true;
    } else {
      this.useMockResponses = false;
    }
  }

  /**
   * Generate a dynamic response based on database products
   * @param {string} userQuestion - The user's question
   * @param {Array} products - Product data from database
   * @param {string} language - The preferred language (en, hi, hinglish, gu)
   * @returns {string} - A dynamic response based on products
   */
  generateDynamicResponse(userQuestion, products, language = 'en') {
    // Convert question to lowercase for easier matching
    const question = userQuestion.toLowerCase();
    let response = '';
    
    // Language-specific templates
    const templates = {
      en: {
        panels: {
          found: (count) => `We have ${count} types of solar panels available: \n`,
          item: (panel) => `- ${panel.name}: ${panel.watt}W, ₹${panel.price}, Stock: ${panel.stock}, Features: ${panel.features.join(', ')}\n`,
          notFound: 'Sorry, we currently don\'t have any solar panels available.'
        },
        batteries: {
          found: (count) => `We have ${count} types of solar batteries available: \n`,
          item: (battery) => `- ${battery.name}: ₹${battery.price}, Stock: ${battery.stock}, Features: ${battery.features.join(', ')}\n`,
          notFound: 'Sorry, we currently don\'t have any solar batteries available.'
        },
        inverters: {
          found: (count) => `We have ${count} types of solar inverters available: \n`,
          item: (inverter) => `- ${inverter.name}: ${inverter.watt}W, ₹${inverter.price}, Stock: ${inverter.stock}, Features: ${inverter.features.join(', ')}\n`,
          notFound: 'Sorry, we currently don\'t have any solar inverters available.'
        },
        all: {
          intro: (count) => `We have a total of ${count} solar products available: \n`,
          typeHeader: (type, count) => `\n${type} (${count} products):\n`,
          item: (product) => `- ${product.name}: ₹${product.price}, Stock: ${product.stock}\n`,
          footer: '\nFor more information about a specific product, please ask.'
        }
      },
      hi: {
        panels: {
          found: (count) => `हमारे पास ${count} प्रकार के सोलर पैनल उपलब्ध हैं: \n`,
          item: (panel) => `- ${panel.name}: ${panel.watt}W, ₹${panel.price}, स्टॉक: ${panel.stock}, विशेषताएं: ${panel.features.join(', ')}\n`,
          notFound: 'क्षमा करें, वर्तमान में हमारे पास कोई सोलर पैनल उपलब्ध नहीं है।'
        },
        batteries: {
          found: (count) => `हमारे पास ${count} प्रकार की सोलर बैटरी उपलब्ध हैं: \n`,
          item: (battery) => `- ${battery.name}: ₹${battery.price}, स्टॉक: ${battery.stock}, विशेषताएं: ${battery.features.join(', ')}\n`,
          notFound: 'क्षमा करें, वर्तमान में हमारे पास कोई सोलर बैटरी उपलब्ध नहीं है।'
        },
        inverters: {
          found: (count) => `हमारे पास ${count} प्रकार के सोलर इन्वर्टर उपलब्ध हैं: \n`,
          item: (inverter) => `- ${inverter.name}: ${inverter.watt}W, ₹${inverter.price}, स्टॉक: ${inverter.stock}, विशेषताएं: ${inverter.features.join(', ')}\n`,
          notFound: 'क्षमा करें, वर्तमान में हमारे पास कोई सोलर इन्वर्टर उपलब्ध नहीं है।'
        },
        all: {
          intro: (count) => `हमारे पास कुल ${count} सोलर उत्पाद उपलब्ध हैं: \n`,
          typeHeader: (type, count) => `\n${type} (${count} उत्पाद):\n`,
          item: (product) => `- ${product.name}: ₹${product.price}, स्टॉक: ${product.stock}\n`,
          footer: '\nकिसी विशेष उत्पाद के बारे में अधिक जानकारी के लिए कृपया पूछें।'
        }
      },
      hinglish: {
        panels: {
          found: (count) => `Humare pass ${count} types ke solar panels available hain: \n`,
          item: (panel) => `- ${panel.name}: ${panel.watt}W, ₹${panel.price}, Stock: ${panel.stock}, Features: ${panel.features.join(', ')}\n`,
          notFound: 'Sorry, abhi humare pass koi solar panel available nahi hai.'
        },
        batteries: {
          found: (count) => `Humare pass ${count} types ki solar batteries available hain: \n`,
          item: (battery) => `- ${battery.name}: ₹${battery.price}, Stock: ${battery.stock}, Features: ${battery.features.join(', ')}\n`,
          notFound: 'Sorry, abhi humare pass koi solar battery available nahi hai.'
        },
        inverters: {
          found: (count) => `Humare pass ${count} types ke solar inverters available hain: \n`,
          item: (inverter) => `- ${inverter.name}: ${inverter.watt}W, ₹${inverter.price}, Stock: ${inverter.stock}, Features: ${inverter.features.join(', ')}\n`,
          notFound: 'Sorry, abhi humare pass koi solar inverter available nahi hai.'
        },
        all: {
          intro: (count) => `Humare pass total ${count} solar products available hain: \n`,
          typeHeader: (type, count) => `\n${type} (${count} products):\n`,
          item: (product) => `- ${product.name}: ₹${product.price}, Stock: ${product.stock}\n`,
          footer: '\nKisi specific product ke bare mein aur information ke liye, please puchein.'
        }
      },
      gu: {
        panels: {
          found: (count) => `અમારી પાસે ${count} પ્રકારના સોલાર પેનલ ઉપલબ્ધ છે: \n`,
          item: (panel) => `- ${panel.name}: ${panel.watt}W, ₹${panel.price}, સ્ટોક: ${panel.stock}, વિશેષતાઓ: ${panel.features.join(', ')}\n`,
          notFound: 'માફ કરશો, અત્યારે અમારી પાસે કોઈ સોલાર પેનલ ઉપલબ્ધ નથી.'
        },
        batteries: {
          found: (count) => `અમારી પાસે ${count} પ્રકારની સોલાર બેટરીઓ ઉપલબ્ધ છે: \n`,
          item: (battery) => `- ${battery.name}: ₹${battery.price}, સ્ટોક: ${battery.stock}, વિશેષતાઓ: ${battery.features.join(', ')}\n`,
          notFound: 'માફ કરશો, અત્યારે અમારી પાસે કોઈ સોલાર બેટરી ઉપલબ્ધ નથી.'
        },
        inverters: {
          found: (count) => `અમારી પાસે ${count} પ્રકારના સોલાર ઇન્વર્ટર ઉપલબ્ધ છે: \n`,
          item: (inverter) => `- ${inverter.name}: ${inverter.watt}W, ₹${inverter.price}, સ્ટોક: ${inverter.stock}, વિશેષતાઓ: ${inverter.features.join(', ')}\n`,
          notFound: 'માફ કરશો, અત્યારે અમારી પાસે કોઈ સોલાર ઇન્વર્ટર ઉપલબ્ધ નથી.'
        },
        all: {
          intro: (count) => `અમારી પાસે કુલ ${count} સોલાર પ્રોડક્ટ્સ ઉપલબ્ધ છે: \n`,
          typeHeader: (type, count) => `\n${type} (${count} પ્રોડક્ટ્સ):\n`,
          item: (product) => `- ${product.name}: ₹${product.price}, સ્ટોક: ${product.stock}\n`,
          footer: '\nકોઈ ચોક્કસ પ્રોડક્ટ વિશે વધુ માહિતી માટે, કૃપા કરીને પૂછો.'
        }
      }
    };
    
    // Default to English if language not supported
    const t = templates[language] || templates.en;
    
    // Filter products based on keywords in the question
    if (question.includes('panel') || question.includes('पैनल') || question.includes('પેનલ')) {
      const panels = products.filter(p => 
        p.type.toLowerCase().includes('panel') || 
        p.type.toLowerCase().includes('crystalline') ||
        p.name.toLowerCase().includes('panel')
      );
      
      if (panels.length > 0) {
        response = t.panels.found(panels.length);
        panels.forEach(panel => {
          response += t.panels.item(panel);
        });
      } else {
        response = t.panels.notFound;
      }
    } 
    else if (question.includes('battery') || question.includes('बैटरी') || question.includes('બેટરી')) {
      const batteries = products.filter(p => 
        p.type.toLowerCase().includes('battery') || 
        p.name.toLowerCase().includes('battery')
      );
      
      if (batteries.length > 0) {
        response = t.batteries.found(batteries.length);
        batteries.forEach(battery => {
          response += t.batteries.item(battery);
        });
      } else {
        response = t.batteries.notFound;
      }
    }
    else if (question.includes('inverter') || question.includes('इन्वर्टर') || question.includes('ઇन્वર્टર')) {
      const inverters = products.filter(p => 
        p.type.toLowerCase().includes('inverter') || 
        p.name.toLowerCase().includes('inverter')
      );
      
      if (inverters.length > 0) {
        response = t.inverters.found(inverters.length);
        inverters.forEach(inverter => {
          response += t.inverters.item(inverter);
        });
      } else {
        response = t.inverters.notFound;
      }
    }
    // If no specific product type is mentioned, return all products
    else {
      response = t.all.intro(products.length);
      
      // Group products by type
      const productsByType = {};
      products.forEach(product => {
        if (!productsByType[product.type]) {
          productsByType[product.type] = [];
        }
        productsByType[product.type].push(product);
      });
      
      // Add summary of each product type
      for (const type in productsByType) {
        response += t.all.typeHeader(type, productsByType[type].length);
        productsByType[type].forEach(product => {
          response += t.all.item(product);
        });
      }
      
      response += t.all.footer;
    }
    
    return response;
  }

  /**
   * Generate a response from Mistral AI based on user question and product data
   * @param {string} userQuestion - The user's question about solar products
   * @param {Array} products - Array of product objects from MongoDB
   * @param {string} language - The preferred language (en, hi, hinglish, gu)
   * @returns {Promise<string>} - The AI-generated response
   */
  async generateResponse(userQuestion, products, language = 'en') {
    try {
      // If using mock responses, return a dynamic response based on database products
      if (this.useMockResponses) {
        return this.generateDynamicResponse(userQuestion, products, language);
      }
      
      // Format products for the prompt
      const formattedProducts = products.map((product, index) => {
        return `${index + 1}. ${product.name} (${product.type}): ${product.watt}W, ₹${product.price}, Stock: ${product.stock}, Features: ${product.features.join(', ')}`;
      }).join('\n');

      // Language-specific system prompts
      const systemPrompts = {
        en: "You are a helpful assistant for a solar products company. Answer questions based only on the product information provided. Respond in English. If the user's message is in English, always respond in English regardless of the language parameter.",
        hi: "आप एक सोलर प्रोडक्ट्स कंपनी के लिए सहायक हैं। केवल दी गई उत्पाद जानकारी के आधार पर प्रश्नों का उत्तर दें। यदि उपयोगकर्ता का संदेश अंग्रेजी में है, तो हमेशा अंग्रेजी में उत्तर दें, अन्यथा हिंदी में जवाब दें।",
        hinglish: "Aap ek solar products company ke liye helpful assistant hain. Sirf di gayi product information ke basis par questions ke jawab dein. Agar user ka message English mein hai, to English mein jawab dein, warna Hinglish mein jawab dein.",
        gu: "તમે સોલાર પ્રોડક્ટ્સ કંપની માટે મદદગાર સહાયક છો. માત્ર આપેલી પ્રોડક્ટ માહિતીના આધારે પ્રશ્નોના જવાબ આપો. જો વપરાશકર્તાનો સંદેશ અંગ્રેજીમાં હોય, તો અંગ્રેજીમાં જવાબ આપો, અન્યથા ગુજરાતીમાં જવાબ આપો."
      };

      // Create the prompt with user question and product data
      const prompt = `User Question: "${userQuestion}"

Available Products:
${formattedProducts}

Answer based on the above product data in a friendly manner. IMPORTANT: If the user's message is in English, respond in English regardless of the language parameter. Do not repeat greetings like "Namaste" or "Hello" in every message if you've already greeted the user once.`;

      // Call Mistral API
      const response = await axios.post(
        this.apiUrl,
        {
          model: "mistral-medium", // Changed from mistral-small to mistral-medium as requested
          messages: [
            { role: "system", content: systemPrompts[language] || systemPrompts.en },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 500
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      // Extract and return the AI response
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling Mistral API:', error.message);
      if (error.response) {
        console.error('API response:', error.response.data);
      }
      // Fallback to dynamic response in case of API error
      return this.generateDynamicResponse(userQuestion, products, language);
    }
  }
}

module.exports = new MistralService();