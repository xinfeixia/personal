const express = require('express');
const router = express.Router();
const { Order } = require('../models');
const { authenticateUser } = require('../middleware/auth');
const { createUnifiedOrder, verifyNotifySign } = require('../utils/wechat');
const xml2js = require('xml2js');

// 创建支付订单
router.post('/create', authenticateUser, async (req, res) => {
  try {
    const { order_id } = req.body;

    const order = await Order.findOne({
      where: {
        id: order_id,
        user_id: req.user.id
      }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: '订单不存在' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ success: false, message: '订单状态不允许支付' });
    }

    // 创建微信支付订单
    const paymentData = await createUnifiedOrder({
      body: '餐饮订单',
      orderNo: order.order_no,
      totalAmount: order.total_amount,
      openid: req.user.openid,
      ip: req.ip
    });

    res.json({
      success: true,
      data: paymentData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 微信支付回调
router.post('/notify', async (req, res) => {
  try {
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(req.body);
    const data = result.xml;

    // 验证签名
    if (!verifyNotifySign(data)) {
      return res.send('<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[签名验证失败]]></return_msg></xml>');
    }

    if (data.return_code === 'SUCCESS' && data.result_code === 'SUCCESS') {
      const order = await Order.findOne({
        where: { order_no: data.out_trade_no }
      });

      if (order && order.status === 'pending') {
        await order.update({
          status: 'paid',
          payment_method: 'wechat',
          transaction_id: data.transaction_id,
          paid_at: new Date()
        });

        // 更新销量
        const items = await order.getItems();
        for (const item of items) {
          await Dish.increment('sales', {
            by: item.quantity,
            where: { id: item.dish_id }
          });
        }
      }

      res.send('<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>');
    } else {
      res.send('<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[支付失败]]></return_msg></xml>');
    }
  } catch (error) {
    console.error('支付回调处理失败:', error);
    res.send('<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[处理失败]]></return_msg></xml>');
  }
});

module.exports = router;

