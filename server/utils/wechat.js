const axios = require('axios');
const crypto = require('crypto');
const xml2js = require('xml2js');

// 获取微信access_token
exports.getAccessToken = async () => {
  try {
    const response = await axios.get('https://api.weixin.qq.com/cgi-bin/token', {
      params: {
        grant_type: 'client_credential',
        appid: process.env.WECHAT_APPID,
        secret: process.env.WECHAT_SECRET
      }
    });
    return response.data.access_token;
  } catch (error) {
    throw new Error('获取access_token失败');
  }
};

// 通过code获取openid
exports.getOpenId = async (code) => {
  try {
    const response = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid: process.env.WECHAT_APPID,
        secret: process.env.WECHAT_SECRET,
        js_code: code,
        grant_type: 'authorization_code'
      }
    });
    
    if (response.data.errcode) {
      throw new Error(response.data.errmsg);
    }
    
    return response.data.openid;
  } catch (error) {
    throw new Error('获取openid失败');
  }
};

// 生成随机字符串
const generateNonceStr = () => {
  return crypto.randomBytes(16).toString('hex');
};

// 生成签名
const generateSign = (params, key) => {
  const sortedKeys = Object.keys(params).sort();
  const stringA = sortedKeys.map(k => `${k}=${params[k]}`).join('&');
  const stringSignTemp = `${stringA}&key=${key}`;
  return crypto.createHash('md5').update(stringSignTemp).digest('hex').toUpperCase();
};

// 创建统一下单
exports.createUnifiedOrder = async (orderData) => {
  const params = {
    appid: process.env.WECHAT_APPID,
    mch_id: process.env.WECHAT_MCH_ID,
    nonce_str: generateNonceStr(),
    body: orderData.body,
    out_trade_no: orderData.orderNo,
    total_fee: Math.floor(orderData.totalAmount * 100), // 转换为分
    spbill_create_ip: orderData.ip || '127.0.0.1',
    notify_url: process.env.WECHAT_NOTIFY_URL,
    trade_type: 'JSAPI',
    openid: orderData.openid
  };

  params.sign = generateSign(params, process.env.WECHAT_PAY_KEY);

  const builder = new xml2js.Builder({ rootName: 'xml', headless: true });
  const xml = builder.buildObject(params);

  try {
    const response = await axios.post('https://api.mch.weixin.qq.com/pay/unifiedorder', xml, {
      headers: { 'Content-Type': 'application/xml' }
    });

    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(response.data);

    if (result.xml.return_code === 'SUCCESS' && result.xml.result_code === 'SUCCESS') {
      const prepayId = result.xml.prepay_id;
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const nonceStr = generateNonceStr();

      const paySign = generateSign({
        appId: process.env.WECHAT_APPID,
        timeStamp: timestamp,
        nonceStr: nonceStr,
        package: `prepay_id=${prepayId}`,
        signType: 'MD5'
      }, process.env.WECHAT_PAY_KEY);

      return {
        timeStamp: timestamp,
        nonceStr: nonceStr,
        package: `prepay_id=${prepayId}`,
        signType: 'MD5',
        paySign: paySign
      };
    } else {
      throw new Error(result.xml.err_code_des || '创建订单失败');
    }
  } catch (error) {
    throw new Error('微信支付请求失败');
  }
};

// 验证支付回调签名
exports.verifyNotifySign = (data) => {
  const sign = data.sign;
  delete data.sign;
  const calculatedSign = generateSign(data, process.env.WECHAT_PAY_KEY);
  return sign === calculatedSign;
};

