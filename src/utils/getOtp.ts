import crypto from "crypto";

function generateSecureOTP(): number {
  // Generates a random integer between 100000 (inclusive) and 1000000 (exclusive)
  // This guarantees a perfect 6-digit number every time.
  const otp = crypto.randomInt(100000, 1000000);
  return otp;
}

export default generateSecureOTP;
