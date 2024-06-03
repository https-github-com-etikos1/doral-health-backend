const axios = require('axios');

async function getFeaturedContent() {
  try {
    const year = '2024'; // Change to a known recent year
    const month = '06';  // Change to a known recent month
    const day = '02';    // Change to a known recent day

    const url = `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${year}/${month}/${day}`;
    
    // Log the URL to verify it's correct
    console.log(`Requesting URL: ${url}`);
    
    const response = await axios.get(url);
    console.log('Response:', response.data);
  } catch (error) {
    if (error.response) {
      // Log detailed error information
      console.error('Error response:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

getFeaturedContent();
