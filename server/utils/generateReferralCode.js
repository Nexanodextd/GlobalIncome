const generateRadomCode = ()=>{
      const  random = Math.random()
      .toString(36)
      .substring(2,8)
      .toLocaleUpperCase();
      return `CRYPTO-${random}`;
}

module.exports = generateRadomCode;