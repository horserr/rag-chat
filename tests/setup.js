const dotenv = require('dotenv');
dotenv.config({ path: '.env.test' });

global.fetch = require('node-fetch');

// 添加全局测试配置
global.TEST_CONFIG = {
  API_BASE_URL: process.env.API_BASE_URL || 'https://home.si-qi.wang',
  AUTH_TOKEN: process.env.AUTH_TOKEN || '',
};
