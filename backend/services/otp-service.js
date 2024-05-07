// const crypto = require('crypto');
// const hashService = require('./hash-service');

// const smsSid = process.env.SMS_SID;
// const smsAuthToken = process.env.SMS_AUTH_TOKEN;
// const twilio = require('twilio')(smsSid, smsAuthToken, {
//     lazyLoading: true,
// });

// class OtpService {
//     async generateOtp() {
//         const otp = crypto.randomInt(1000, 9999);
//         return otp;
//     }

//     async sendBySms(phone, otp) {
//         return await twilio.messages.create({
//             to: phone,
//             from: process.env.SMS_FROM_NUMBER,
//             body: `Your codershouse OTP is ${otp}`,
//         });
//     }

//     verifyOtp(hashedOtp, data) {
//         let computedHash = hashService.hashOtp(data);
//         return computedHash === hashedOtp;
//     }
// }

// module.exports = new OtpService();


const crypto = require('crypto');
const hashService = require('./hash-service');
const twilio = require('twilio');

// Load environment variables
require('dotenv').config();

// Extract Twilio credentials from environment variables
const smsSid = process.env.TWILIO_ACCOUNT_SID;
const smsAuthToken = process.env.TWILIO_AUTH_TOKEN;

// Initialize Twilio client
const twilioClient = twilio(smsSid, smsAuthToken);

class OtpService {
    async generateOtp() {
        const otp = crypto.randomInt(1000, 9999);
        return otp;
    }

    async sendBySms(phone, otp) {
        try {
            // Send SMS using Twilio client
            const message = await twilioClient.messages.create({
                to: phone,
                from: process.env.SMS_FROM_NUMBER,
                body: `Your codershouse OTP is ${otp}`,
            });
            console.log('OTP sent successfully:', message.sid);
            return message;
        } catch (error) {
            console.error('Error sending OTP:', error);
            throw error; // Rethrow the error for handling elsewhere
        }
    }

    verifyOtp(hashedOtp, data) {
        let computedHash = hashService.hashOtp(data);
        return computedHash === hashedOtp;
    }
}

module.exports = new OtpService();
