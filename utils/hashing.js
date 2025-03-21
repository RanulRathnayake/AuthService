const hash = require('bcryptjs');
const createHmac = require('crypto')
exports.doHash =(value, saltValue)=> {
    const result = hash(value,saltValue);
    return result;
};

exports.doHashValidatoin = (value,hashedValue) =>{
    const result = compare(value,hashedValue);
    return result;
};

exports.hmacprocess = (value,key) => {
    const result = createHmac('sha256',key).update(value).digest('hex');
    return result;
}