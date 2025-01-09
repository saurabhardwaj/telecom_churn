const crypto = require('crypto');

const key = crypto.randomBytes(32);

const encryptData = (text) => {
  const randomKey = generatePassword()
  var m = crypto.createHash('md5');
  m.update(randomKey);
  var key = m.digest('hex');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex'), key : randomKey };
};

const decryptData = (text) => {
  var m = crypto.createHash('md5');
  m.update(text.key);
  var key = m.digest('hex');
  const iv = Buffer.from(text.iv, 'hex');
  const encryptedText = Buffer.from(text.encryptedData, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

const generatePassword = () => {
  var length = 8,
      charset = "abcdefghijklmnopqrstuvwxyz0123456789",
      charCapitalset = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`,
      specialset = `!@#$%^&*`,
      retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n))
      retVal += charCapitalset.charAt(Math.floor(Math.random() * n));
      retVal += specialset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

module.exports = {
  encryptData,
  decryptData,
  generatePassword
};
