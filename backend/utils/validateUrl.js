function validateUrl(url) {
    const urlRegex = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
    return urlRegex.test(url);
  }
  module.exports = validateUrl;