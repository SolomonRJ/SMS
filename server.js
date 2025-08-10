import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// SOS endpoint
app.post('/sos', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ success: false, message: 'Username is required' });
  }

  try {
    await client.messages.create({
      to: process.env.MENTOR_PHONE,
      messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
      body: `${username} is in an emergency, please contact them immediately`
    });

    res.json({ success: true, message: 'SOS alert sent' });
  } catch (error) {
    console.error('Twilio error:', error);
    res.status(500).json({ success: false, message: 'Failed to send SOS' });
  }
});

app.get('/', (req, res) => {
  res.send('SOS Backend is running 🚨');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
