import type { NextApiRequest, NextApiResponse } from "next"

const accountSid = process.env.TWILIO_TEST_SID
const authToken = process.env.TWILIO_TEST_AUTH_TOKEN

const client = require('twilio')(accountSid, authToken);

type Data = {
    message: string,
    success: boolean
}

export default async function handler(req : NextApiRequest, res: NextApiResponse<Data>) {
  const {to,  message } = req.body;

  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    })
    
    console.log(result);
    res.status(200).json({ success: true, message: 'SMS sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: `Failed to send SMS ${error}` });
  }
}