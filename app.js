
const API_KEY = window.QWEATHER_API_KEY || '959f2414e163470f82303a13c9e14319';
const API_HOST = window.QWEATHER_API_HOST || 'https://n473jt7ygj.re.qweatherapi.com';
let searchRequest = null;
let searchRequestId = 0;

// 热门城市 (城市名, locationId)
const HOT_CITIES = [
  { name: '北京', province: '北京市', city: '北京', locationId: '101010100' },
  { name: '上海', province: '上海市', city: '上海', locationId: '101020100' },
  { name: '广州', province: '广东省', city: '广州', locationId: '101280101' },
  { name: '深圳', province: '广东省', city: '深圳', locationId: '101280601' },
  { name: '成都', province: '四川省', city: '成都', locationId: '101270101' },
  { name: '杭州', province: '浙江省', city: '杭州', locationId: '101210101' },
  { name: '武汉', province: '湖北省', city: '武汉', locationId: '101200101' },
  { name: '南京', province: '江苏省', city: '南京', locationId: '101190101' },
  { name: '西安', province: '陕西省', city: '西安', locationId: '101110101' },
  { name: '重庆', province: '重庆市', city: '重庆', locationId: '101040100' },
  { name: '天津', province: '天津市', city: '天津', locationId: '101030100' },
  { name: '苏州', province: '江苏省', city: '苏州', locationId: '101190401' },
  { name: '长沙', province: '湖南省', city: '长沙', locationId: '101250101' },
  { name: '青岛', province: '山东省', city: '青岛', locationId: '101120201' },
  { name: '郑州', province: '河南省', city: '郑州', locationId: '101180101' },
  { name: '大连', province: '辽宁省', city: '大连', locationId: '101070201' },
  { name: '厦门', province: '福建省', city: '厦门', locationId: '101230201' },
  { name: '昆明', province: '云南省', city: '昆明', locationId: '101290101' },
  { name: '哈尔滨', province: '黑龙江省', city: '哈尔滨', locationId: '101050101' },
  { name: '三亚', province: '海南省', city: '三亚', locationId: '101310201' },
];

// 城市搜索数据库
const CITY_DATABASE = [
  ...HOT_CITIES,
  { name: '珠海', province: '广东省', city: '珠海', locationId: '101280701' },
  { name: '东莞', province: '广东省', city: '东莞', locationId: '101281601' },
  { name: '佛山', province: '广东省', city: '佛山', locationId: '101280801' },
  { name: '福州', province: '福建省', city: '福州', locationId: '101230101' },
  { name: '合肥', province: '安徽省', city: '合肥', locationId: '101220101' },
  { name: '济南', province: '山东省', city: '济南', locationId: '101120101' },
  { name: '沈阳', province: '辽宁省', city: '沈阳', locationId: '101070101' },
  { name: '长春', province: '吉林省', city: '长春', locationId: '101060101' },
  { name: '石家庄', province: '河北省', city: '石家庄', locationId: '101090101' },
  { name: '太原', province: '山西省', city: '太原', locationId: '101100101' },
  { name: '呼和浩特', province: '内蒙古', city: '呼和浩特', locationId: '101080101' },
  { name: '南宁', province: '广西', city: '南宁', locationId: '101300101' },
  { name: '贵阳', province: '贵州省', city: '贵阳', locationId: '101260101' },
  { name: '拉萨', province: '西藏', city: '拉萨', locationId: '101140101' },
  { name: '兰州', province: '甘肃省', city: '兰州', locationId: '101160101' },
  { name: '西宁', province: '青海省', city: '西宁', locationId: '101150101' },
  { name: '银川', province: '宁夏', city: '银川', locationId: '101170101' },
  { name: '乌鲁木齐', province: '新疆', city: '乌鲁木齐', locationId: '101130101' },
  { name: '海口', province: '海南省', city: '海口', locationId: '101310101' },
  { name: '南昌', province: '江西省', city: '南昌', locationId: '101240101' },
  { name: '宁波', province: '浙江省', city: '宁波', locationId: '101210401' },
  { name: '无锡', province: '江苏省', city: '无锡', locationId: '101190201' },
  { name: '温州', province: '浙江省', city: '温州', locationId: '101210701' },
  { name: '烟台', province: '山东省', city: '烟台', locationId: '101120501' },
  { name: '桂林', province: '广西', city: '桂林', locationId: '101300501' },
  { name: '丽江', province: '云南省', city: '丽江', locationId: '101291401' },
  { name: '秦皇岛', province: '河北省', city: '秦皇岛', locationId: '101091101' },
  { name: '大理', province: '云南省', city: '大理', locationId: '101290201' },
];

// 天气码 → C1-C9 背景类
function getWeatherBgClass(iconCode) {
  const code = parseInt(iconCode);
  if (code === 100) return 'C1';                         // 晴
  if (code >= 101 && code <= 103) return 'C2';           // 多云 / 少云
  if (code === 104) return 'C4';                         // 阴
  if (code >= 150 && code <= 153) return 'C1';           // 夜间晴/多云
  if (code === 154) return 'C4';                         // 夜间阴
  if (code >= 300 && code <= 304) return 'C6';           // 阵雨/雷阵雨
  if (code >= 305 && code <= 307) return 'C7';           // 小雨/中雨
  if (code >= 308 && code <= 313) return 'C8';           // 大雨
  if (code >= 314 && code <= 318) return 'C9';           // 暴雨
  if (code >= 350 && code <= 351) return 'C7';           // 毛毛雨
  if (code >= 400 && code <= 404) return 'C6';           // 雪
  if (code >= 405 && code <= 410) return 'C8';           // 大雪
  if (code >= 500 && code <= 515) return 'C9';           // 雾霾沙尘
  if (code === 900) return 'C7';                         // 热
  if (code === 901) return 'C9';                         // 冷
  return 'C1';                                           // 默认
}

// 风力等级 → wind-X 图标类
function getWindClass(iconCode) {
  return 'wind-0'; // 使用默认风力图标，原CSS有wind-0到wind-9
}

// 风向360° → wind-X 图标类
function getWindDirClass(wind360) {
  const d = parseInt(wind360);
  if (d >= 337.5 || d < 22.5) return 'wind-0';     // 北
  if (d >= 22.5 && d < 67.5) return 'wind-1';      // 东北
  if (d >= 67.5 && d < 112.5) return 'wind-2';     // 东
  if (d >= 112.5 && d < 157.5) return 'wind-3';    // 东南
  if (d >= 157.5 && d < 202.5) return 'wind-4';    // 南
  if (d >= 202.5 && d < 247.5) return 'wind-5';    // 西南
  if (d >= 247.5 && d < 292.5) return 'wind-6';    // 西
  if (d >= 292.5 && d < 337.5) return 'wind-7';    // 西北
  return 'wind-0';
}

// AQI 等级 → CSS 类
function getAqiClass(level) {
  return 'air-level' + Math.max(1, Math.min(6, parseInt(level, 10) || 1));
}

// 预警等级
function getWarningClass(level) {
  const map = { '蓝色': 'level01', '黄色': 'level02', '橙色': 'level03', '红色': 'level04' };
  return map[level] || 'level01';
}

// 生活指数 type → 图标CSS类
function getIndexIconClass(type) {
  const map = {
    '1': 'icon_yundong',    // 运动
    '2': 'icon_xiche',      // 洗车
    '3': 'icon_chuanyi',    // 穿衣
    '4': 'icon_diaoyu',     // 钓鱼
    '5': 'icon_fangsai',    // 紫外线/防晒 (原页面的防晒)
    '6': 'icon_lvyou',      // 旅游
    '7': 'icon_guomin',     // 过敏
    '8': 'icon_shushidu',   // 舒适度
    '9': 'icon_ganmao',     // 感冒
    '10': 'icon_wurankuosan', // 空气污染扩散
    '11': 'icon_airconditioner', // 空调
    '12': 'icon_sunglasses', // 太阳镜
    '13': 'icon_huazhuang', // 化妆
    '14': 'icon_liangshai', // 晾晒
    '15': 'icon_jiaotong',  // 交通
    '16': 'icon_fangsai',   // 防晒
  };
  return map[type] || 'icon_chuanyi';
}

// 星期
const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

// 限行规则：工作日（周一~周五）尾号限行，[周一, 周二, 周三, 周四, 周五]
const LIMIT_RULES = {
  '北京': [[4, 9], [5, 0], [1, 6], [2, 7], [3, 8]],
  '西安': [[1, 6], [2, 7], [3, 8], [4, 9], [5, 0]],
  '杭州': [[2, 7], [3, 8], [4, 9], [5, 0], [1, 6]],
  '成都': [[1, 6], [2, 7], [3, 8], [4, 9], [5, 0]],
  '天津': [[1, 6], [2, 7], [3, 8], [4, 9], [5, 0]],
  '郑州': [[1, 6], [2, 7], [3, 8], [4, 9], [5, 0]],
};

// 根据城市和日期返回限行尾号（如 "5和0"），无限行返回 null
function getLimitInfo(city) {
  if (!city) return null;
  const rules = LIMIT_RULES[city.name];
  if (!rules) return null;
  const day = new Date().getDay(); // 0=周日, 6=周六
  if (day === 0 || day === 6) return null; // 周末不限行
  const pair = rules[day - 1];
  return pair[0] + '和' + pair[1];
}

// 取某项污染物浓度值
function pollutantValue(air, code) {
  if (!air) return '—';
  const list = air.pollutants || [];
  const found = list.find(function (p) { return p.code === code; });
  const value = found && found.concentration && found.concentration.value;
  return value != null ? escapeHTML(String(value)) : '—';
}

// ==================== 状态管理 ====================

let currentCity = null;          // 当前选中城市
let weatherData = null;         // 完整的天气数据
let loading = false;
let weatherRequestId = 0;
let chartResizeHandler = null;

// ==================== localStorage 操作 ====================

function getAttentionCities() {
  try {
    return JSON.parse(localStorage.getItem('tq_attention') || '[]');
  } catch (e) { return []; }
}

function saveAttentionCities(list) {
  try {
    localStorage.setItem('tq_attention', JSON.stringify(list));
  } catch (e) { }
}

function getSearchHistory() {
  try {
    return JSON.parse(localStorage.getItem('tq_history') || '[]');
  } catch (e) { return []; }
}

function saveSearchHistory(list) {
  try {
    localStorage.setItem('tq_history', JSON.stringify(list));
  } catch (e) { }
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>'"]/g, function (char) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char];
  });
}

// 和风天气码 -> 本地图标
// 100 晴 / 101-103 多云少云晴间多云 / 104 阴
// 150 夜间晴 / 151-153 夜间多云少云晴间多云 / 154 夜间阴
// 300-305 阵雨小雨 / 306-318 中雨大雨暴雨 / 400+ 雪

// 是否使用大图标
function weatherIconUrl(code, isLarge) {
  const iconCode = Number(code || 100);
  const dir = './页面资源_副本/';
  // 夜间
  if (iconCode === 150) return dir + '夜间晴.png';
  if (iconCode >= 151 && iconCode <= 153) return dir + '夜间多云.png';
  if (iconCode === 154) return dir + '阴.png';
  // 白天晴：大图标（右侧当前天气）/ 小图标（逐小时、7日）
  if (iconCode === 100) return isLarge ? dir + '晴天（大）.png' : dir + '晴（小）.png';
  // 多云 / 少云 / 晴间多云 —— 用阴图标
  if (iconCode >= 101 && iconCode <= 103) return dir + '阴.png';
  // 阴
  if (iconCode === 104) return dir + '阴.png';
  // 雨
  if (iconCode >= 300 && iconCode <= 305) return dir + '小雨.png';
  if (iconCode >= 306 && iconCode <= 399) return dir + '中雨.png';
  // 默认兜底
  return dir + '阴.png';
}

// 把城市对象转换成页面顶部导航栏要显示的中文城市名标签，处理各种"省/市/县"命名差异。
function getCityLabel(city) {
  if (!city) return '';
  const province = city.province || city.adm1 || '';
  let cityName = city.adm2 || city.city || city.name || '';
  if (province && (province === cityName || province === cityName + '市')) return province;
  if (cityName && !/[市区县旗州盟]$/.test(cityName)) cityName += '市';
  // 把省份和城市两个词拼成一个字符串，中间用空格隔开
  return [province, cityName].filter(Boolean).join(' ');
}

// ==================== API 请求 ====================

async function api(path, params, options) {
  // axios 自动序列化 params（含中文/特殊字符编码），无需手动 encodeURIComponent
  const resp = await axios.get(API_HOST + path, {
    params: Object.assign({ key: API_KEY }, params || {}),
    signal: options && options.signal,
  });

  const data = resp.data;
  if (data.code !== undefined && data.code !== '200') {
    throw new Error('API error: ' + (data.error || data.code));
  }
  return data;
}

async function fetchAllWeather(city) {
  const lid = city.locationId;
  const [nowRes, d7Res, h24Res, idxRes, airRes, warningRes] = await Promise.all([
    api('/v7/weather/now', { location: lid }),
    api('/v7/weather/7d', { location: lid }),
    api('/v7/weather/24h', { location: lid }),
    api('/v7/indices/1d', { type: 0, location: lid }),
    fetchAirQuality(city),
    api('/v7/warning/now', { location: lid }).catch(function () { return null; }),
  ]);
  return {
    now: nowRes.now,
    daily: d7Res.daily,
    hourly: h24Res.hourly,
    indices: idxRes.daily,
    air: airRes || null,
    warnings: warningRes ? (warningRes.warning || []) : [],
    updateTime: nowRes.updateTime,
    yesterday: await fetchYesterdayWeather(city).catch(function () { return null; }),
  };
}

// 获取昨天的历史天气，拼装成与 7d daily 一致的结构
// 昨天天气的 api 接口地址和上一个函数的地址不一样，单独写一个
async function fetchYesterdayWeather(city) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.getFullYear() +
    String(yesterday.getMonth() + 1).padStart(2, '0') +
    String(yesterday.getDate()).padStart(2, '0');
  const data = await api('/v7/historical/weather', { location: city.locationId, date: dateStr });
  const wd = data.weatherDaily;
  const wh = data.weatherHourly || [];
  // 用 12:00 代表白天、21:00 代表夜间
  const dayHour = wh.find(function (h) { return /T12:00/.test(h.time); }) || {};
  const nightHour = wh.find(function (h) { return /T21:00/.test(h.time); }) || {};
  return {
    fxDate: wd.date,
    tempMax: wd.tempMax,
    tempMin: wd.tempMin,
    iconDay: dayHour.icon || '104',
    textDay: dayHour.text || '—',
    iconNight: nightHour.icon || '154',
    textNight: nightHour.text || '—',
    windDirDay: dayHour.windDir || '—',
    windScaleDay: dayHour.windScale || '—',
  };
}

async function fetchAirQuality(city) {
  try {
    let lat = city.lat;
    let lon = city.lon;
    if (!lat || !lon) {
      const geo = await api('/geo/v2/city/lookup', { location: city.locationId, number: 1, lang: 'zh' });
      const location = geo.location && geo.location[0];
      lat = location && location.lat;
      lon = location && location.lon;
    }
    if (!lat || !lon) return null;
    const data = await api('/airquality/v1/current/' + lat + '/' + lon, { lang: 'zh' });
    const indexes = data.indexes || [];
    const matched = indexes.find(function (index) { return /^cn-/.test(index.code); }) || indexes.find(function (index) { return index.code === 'qaqi'; }) || indexes[0] || null;
    return matched ? Object.assign({}, matched, { pollutants: data.pollutants || [] }) : null;
  } catch (error) {
    return null;
  }
}

async function lookupCities(query, signal) {
  const q = query.trim();
  if (!q) return [];
  try {
    const data = await api('/geo/v2/city/lookup', { location: q, range: 'cn', number: 10, lang: 'zh' }, { signal: signal });
    return (data.location || []).map(function (item) {
      return {
        name: item.name,
        city: item.adm2 || item.name,
        adm1: item.adm1,
        adm2: item.adm2,
        province: item.adm1 || item.adm2 || '',
        locationId: item.id,
        lat: item.lat,
        lon: item.lon,
      };
    });
  } catch (error) {
    return searchCities(q);
  }
}

// 数据格式化 (api 返回的数据转换成人看的格式)

function formatTime(timeStr) {
  // fxTime: "2026-07-30T15:00+08:00"
  const m = timeStr.match(/T(\d{2}:\d{2})/);
  return m ? m[1] : timeStr;
}

function formatDate(dateStr) {
  // fxDate: "2026-07-30" —— 用 split 解析，避免 new Date 时区偏移
  const parts = dateStr.split('-');
  return parseInt(parts[1], 10) + '/' + parseInt(parts[2], 10);
}

function formatPubTime(timeStr) {
  // updateTime: "2026-07-30T14:04+08:00"
  const m = timeStr.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}:\d{2})/);
  return m ? m[1] + '-' + m[2] + '-' + m[3] + ' ' + m[4] : timeStr;
}

// 给定某天的日期字符串和它在列表里的位置序号，返回中文标签——"昨天/今天/明天/后天/星期四
function getDayLabel(dateStr, index) {
  // index 0=昨天 1=今天 2=明天 3=后天，其余按日期算星期
  if (index === 0) return '昨天';
  if (index === 1) return '今天';
  if (index === 2) return '明天';
  if (index === 3) return '后天';
  const parts = dateStr.split('-').map(Number);
  return WEEKDAYS[new Date(parts[0], parts[1] - 1, parts[2]).getDay()];
}

// 把逐小时预报的时间字符串，转成"今天 15:00"这种友好格式
function getHourLabel(fxTime) {
  // fxTime: "2026-07-30T15:00+08:00"
  const m = fxTime.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}:\d{2})/);
  if (!m) return fxTime;
  const d = new Date(m[1], m[2] - 1, m[3]);
  const today = new Date();
  const diff = Math.floor((d - today.setHours(0, 0, 0, 0)) / 86400000);
  const timeStr = m[4];
  if (diff === 0) return '今天 ' + timeStr;
  if (diff === 1) return '明天 ' + timeStr;
  if (diff === 2) return '后天 ' + timeStr;
  return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + timeStr;
}

// ==================== 渲染函数 ====================

// --- 当前天气 ---
function renderCurrentWeather(data) {
  const { now, indices, air, warnings } = data;

  // 背景类 (C1-C9)
  const ct = document.querySelector('.header');
  ct.className = 'header ' + getWeatherBgClass(now.icon);

  // 发布时间
  document.querySelector('.header-top').textContent = '发布于 ' + formatPubTime(data.updateTime);

  // 温度
  document.querySelector('.tem').textContent = now.temp + '°';

  // 天气名称
  document.querySelector('.header-mid .weather').textContent = now.text;

  // 天气图标
  const iconEl = document.querySelector('.header-weather-icon');
  iconEl.innerHTML = '<img src="' + weatherIconUrl(now.icon, true) + '" alt="' + escapeHTML(now.text) + '">';

  // AQI：等级类加在 .aqi 容器上（匹配 CSS 祖先选择器 .air-levelX .info-aqi），
  // 悬停胶囊时由 CSS :hover 显示 .popwindow 悬浮窗（含 6 项污染物）
  const aqiBox = document.querySelector('.aqi');
  if (air && air.aqi != null) {
    const aqiLevel = parseInt(air.level, 10) || (air.aqi <= 50 ? 1 : air.aqi <= 100 ? 2 : air.aqi <= 150 ? 3 : air.aqi <= 200 ? 4 : air.aqi <= 300 ? 5 : 6);
    const aqiText = (air.aqiDisplay || air.aqi) + ' ' + (air.category || '空气质量');
    aqiBox.className = 'aqi ' + getAqiClass(aqiLevel);
    aqiBox.innerHTML =
      '<span class="info-aqi">' +
      '<img class="aqi-icon" src="./空气质量.png" alt="">' +
      '<span class="aqi-text">' + escapeHTML(aqiText) + '</span>' +
      '</span>' +
      '<div class="popwindow">' +
      '<div class="header">空气质量指数 ' + escapeHTML(aqiText) + '</div>' +
      '<div class="detail"><div class="inner">' +
      '<table class="air-detail-table">' +
      '<tr class="line1">' +
      '<td><p class="val">' + pollutantValue(air, 'pm2p5') + '</p><p class="titl">PM2.5</p></td>' +
      '<td class="nth-2"><p class="val">' + pollutantValue(air, 'pm10') + '</p><p class="titl">PM10</p></td>' +
      '<td><p class="val">' + pollutantValue(air, 'so2') + '</p><p class="titl">SO2</p></td>' +
      '</tr>' +
      '<tr>' +
      '<td><p class="val">' + pollutantValue(air, 'no2') + '</p><p class="titl">NO2</p></td>' +
      '<td class="nth-2"><p class="val">' + pollutantValue(air, 'o3') + '</p><p class="titl">O3</p></td>' +
      '<td><p class="val">' + pollutantValue(air, 'co') + '</p><p class="titl">CO</p></td>' +
      '</tr>' +
      '</table>' +
      '</div></div>' +
      '</div>';
    aqiBox.onclick = null;
  } else {
    aqiBox.className = 'aqi';
    aqiBox.innerHTML = '<span class="info-aqi air-unavailable">空气质量暂无数据</span>';
    aqiBox.onclick = null;
  }

  renderWarnings(warnings);

  // 风力图标
  const windIcon = document.querySelector('.icon-wind');
  windIcon.className = 'icon ' + getWindDirClass(now.wind360);

  // 风力文字
  document.querySelector('.header-bottom .wind').textContent = now.windDir + ' ' + now.windScale + '级';

  // 湿度
  document.querySelector('.header-bottom .wet').textContent = '湿度 ' + now.humidity + '%';

  // 气压
  document.querySelector('.header-bottom .ap').textContent = '气压 ' + now.pressure + ' hPa';

  // 限行信息
  const limitEl = document.querySelector('.ban');
  const limitNum = getLimitInfo(currentCity);
  if (limitNum) {
    limitEl.classList.add('show');
    document.querySelector('.limit-text').textContent = '限行 ' + limitNum;
  } else {
    limitEl.classList.remove('show');
  }

  // 官网首页不显示生活指数长文案，舒适度信息只在右侧“生活指数”卡片中展示。
  const tipEl = document.querySelector('.tips-text');
  if (tipEl) {
    tipEl.textContent = '';
    tipEl.style.display = 'none';
  }
}

function renderWarnings(warnings) {
  const list = document.querySelector('.warning-list');
  if (!list) return;
  list.innerHTML = (warnings || []).map(function (item) {
    const level = getWarningClass(item.level);
    const title = [item.typeName, item.level].filter(Boolean).join(' ');
    return '<li class="tag ' + level + '" title="' + escapeHTML(item.text || title) + '">' + escapeHTML(title || '天气预警') + '</li>';
  }).join('');
}

function openAirQuality() {
  const modal = document.querySelector('.air-window');
  const content = document.querySelector('.air-window-content');
  const air = weatherData && weatherData.air;
  if (!modal || !content || !air) return;
  const pollutant = air.primaryPollutant && air.primaryPollutant.name ? air.primaryPollutant.name : '暂无';
  content.innerHTML = '<div class="air-summary"><strong>' + escapeHTML(air.aqiDisplay || air.aqi) + '</strong><span>' + escapeHTML(air.category || '空气质量') + '</span></div>' +
    '<p>首要污染物：' + escapeHTML(pollutant) + '</p>' +
    '<p>' + escapeHTML((air.health && air.health.effect) || '暂无健康提示') + '</p>' +
    '<p class="air-advice">' + escapeHTML((air.health && air.health.advice && air.health.advice.generalPopulation) || '') + '</p>';
  modal.hidden = false;
  modal.classList.add('is-open');
}

function closeAirQuality() {
  const modal = document.querySelector('.air-window');
  if (!modal) return;
  modal.hidden = true;
  modal.classList.remove('is-open');
}

// --- 逐小时预报 ---
function renderHourlyForecast(data) {
  const { hourly } = data;
  const list = document.querySelector('.hours-list');
  let html = '';

  hourly.forEach(h => {
    html += '<li class="item">' +
      '<p class="txt-time">' + escapeHTML(getHourLabel(h.fxTime)) + '</p>' +
      '<img class="icon" src="' + weatherIconUrl(h.icon) + '" alt="' + escapeHTML(h.text) + '">' +
      '<p class="txt-degree">' + escapeHTML(h.temp) + '°</p>' +
      '</li>';
  });

  list.innerHTML = html;

  // 翻页
  setupHourlyPagination(hourly.length);
}

function setupHourlyPagination(totalItems) {
  const container = document.querySelector('.hours .weather-track');
  const prev = document.querySelector('.hours .btn-prev');
  const next = document.querySelector('.hours .btn-next');

  let currentPage = 0;
  const itemsPerPage = 8;
  const maxPage = Math.ceil(totalItems / itemsPerPage) - 1;
  const itemWidth = 100; // 40px item + 60px margin

  function goPage(page) {
    currentPage = Math.max(0, Math.min(page, maxPage));
    container.style.marginLeft = -(currentPage * itemsPerPage * itemWidth) + 'px';
  }

  prev.onclick = function () { goPage(currentPage - 1); };
  next.onclick = function () { goPage(currentPage + 1); };

  // 初始化
  goPage(0);
}

// --- 7日预报 ---
function renderDailyForecast(data) {
  // 拼装 7 列：昨天（若有） + 今天起 6 天（去掉 7d 最后一天）
  let daily = data.daily.slice();
  if (data.yesterday) {
    daily = [data.yesterday].concat(daily.slice(0, 6));
  }
  const list = document.querySelector('.days-list');
  let html = '';

  daily.forEach((d, i) => {
    let itemClass = 'item';
    if (i === 0) itemClass += ' first';        // 昨天：灰色
    else if (i === 1) itemClass += ' second';  // 今天：高亮
    if (i === daily.length - 1) itemClass += ' last';

    html += '<li class="' + itemClass + '">' +
      '<p class="day">' + escapeHTML(getDayLabel(d.fxDate, i)) + '</p>' +
      '<p class="date">' + escapeHTML(formatDate(d.fxDate)) + '</p>' +
      '<div class="ct-daytime">' +
      '<img class="icon" src="' + weatherIconUrl(d.iconDay) + '" alt="' + escapeHTML(d.textDay) + '">' +
      '<p class="weather">' + escapeHTML(d.textDay) + '</p>' +
      '</div>' +
      '<div class="ct-night">' +
      '<img class="icon" src="' + weatherIconUrl(d.iconNight) + '" alt="' + escapeHTML(d.textNight) + '">' +
      '<p class="weather">' + escapeHTML(d.textNight) + '</p>' +
      '</div>' +
      '<p class="wind">' + escapeHTML(d.windDirDay) + ' ' + escapeHTML(d.windScaleDay) + '级</p>' +
      '</li>';
  });

  list.innerHTML = html;

  // ECharts 图表
  renderChart(daily);
}

function renderChart(daily) {
  const chartDom = document.querySelector('.chart-days');
  if (!chartDom) return;

  // 如果 ECharts 尚未加载，稍后重试
  if (typeof echarts === 'undefined') {
    setTimeout(function () { renderChart(daily); }, 500);
    return;
  }

  // 销毁旧实例
  const existingInstance = echarts.getInstanceByDom(chartDom);
  if (existingInstance) existingInstance.dispose();

  const chart = echarts.init(chartDom);
  const labels = daily.map(function (d, i) { return getDayLabel(d.fxDate, i); });
  const highs = daily.map(function (d) { return parseInt(d.tempMax); });
  const lows = daily.map(function (d) { return parseInt(d.tempMin); });
  const minT = Math.min.apply(null, lows) - 3;
  const maxT = Math.max.apply(null, highs) + 3;

  chart.setOption({
    // .item 共 7 个 × 92px = 644px，居中后左右各留 48px；
    // chart 宽 740px，绘图区 644px（left:48, right:48），节点中心对齐各 .item 中心
    grid: { top: 28, right: 48, bottom: 18, left: 48 },
    xAxis: {
      type: 'category',
      data: labels,
      boundaryGap: true,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false }
    },
    yAxis: {
      type: 'value',
      min: minT,
      max: maxT,
      show: false
    },
    series: [
      {
        name: '最高温',
        type: 'line',
        data: highs,
        smooth: true,
        symbol: 'circle',
        symbolSize: 10,
        lineStyle: { color: '#f5a623', width: 2 },
        itemStyle: { color: '#f5a623' },
        label: { show: true, position: 'top', distance: 6, formatter: '{c}°', color: '#f5a623', fontSize: 13, fontWeight: 'bold' }
      },
      {
        name: '最低温',
        type: 'line',
        data: lows,
        smooth: true,
        symbol: 'circle',
        symbolSize: 10,
        lineStyle: { color: '#4a90d9', width: 2 },
        itemStyle: { color: '#4a90d9' },
        label: { show: true, position: 'bottom', distance: 6, formatter: '{c}°', color: '#4a90d9', fontSize: 13, fontWeight: 'bold' }
      }
    ]
  });

  // 响应式：城市切换时复用同一个监听器，避免重复绑定。
  if (chartResizeHandler) window.removeEventListener('resize', chartResizeHandler);
  chartResizeHandler = function () { chart.resize(); };
  window.addEventListener('resize', chartResizeHandler);
}

// --- 生活指数 ---
function renderLivingIndex(data) {
  const hiddenTypes = new Set(['7', '11', '12', '13']);
  const indices = (data.indices || []).filter(function (item) {
    return !hiddenTypes.has(String(item.type));
  });
  const itemsPerPage = 6; // 2行×3列...实际2列，所以是3行×2列=6
  const totalPages = Math.max(1, Math.ceil(indices.length / itemsPerPage));
  const contentEl = document.querySelector('.living-content');

  // 清空旧的 page 元素
  contentEl.innerHTML = '';

  // 动态创建 page 元素
  for (let p = 0; p < totalPages; p++) {
    const pageUl = document.createElement('ul');
    pageUl.className = 'page';
    // page 元素统一用 .page 类，无需 id

    let html = '';
    const start = p * itemsPerPage;
    const pageItems = indices.slice(start, start + itemsPerPage);

    pageItems.forEach(function (item, i) {
      const oddClass = (i % 2 === 0) ? 'odd' : '';
      html += '<li class="item ' + oddClass + '">' +
        '<div class="ct-sub">' +
        '<span class="icon ' + getIndexIconClass(item.type) + '"></span>' +
        '<p class="content">' + escapeHTML(String(item.name || '').replace(/指数$/, '')) + ' ' + escapeHTML(item.category) + '</p>' +
        '</div>' +
        '<div class="ct-detail">' +
        '<p class="detail">' + escapeHTML(item.text) + '</p>' +
        '</div>' +
        '</li>';
    });

    pageUl.innerHTML = html;
    contentEl.appendChild(pageUl);
  }

  // 调整 content 宽度以适应所有页面
  contentEl.style.width = (totalPages * 445) + 'px';

  // 翻页
  setupIndexPagination(totalPages);
}

function setupIndexPagination(totalPages) {
  const content = document.querySelector('.living-content');
  const prevBtn = document.querySelector('.living .btn-prev');
  const nextBtn = document.querySelector('.living .btn-next');
  let currentPage = 0;
  const pageWidth = 445;

  function goPage(p) {
    currentPage = Math.max(0, Math.min(p, totalPages - 1));
    content.style.marginLeft = -(currentPage * pageWidth) + 'px';
  }

  prevBtn.onclick = function () { goPage(currentPage - 1); };
  nextBtn.onclick = function () { goPage(currentPage + 1); };
  goPage(0);
}

// --- 城市管理 ---
function renderAttentionList() {
  const list = getAttentionCities();
  const ol = document.querySelector('.attention-list');

  if (list.length === 0) {
    ol.innerHTML = '<p class="attention-empty">暂无关注城市</p>';
    return;
  }

  let html = '';
  list.forEach(function (c, i) {
    const isDefault = (i === 0);
    html += '<li class="city" data-lid="' + escapeHTML(c.locationId) + '">' +
      '<div class="ct-location">' +
      '<span class="location">' + escapeHTML(c.name) + '</span>' +
      (isDefault
        ? '<span class="mark">当前默认</span>' +
          '<a href="javascript:;" class="btn btn-cancel" title="取消默认">取消默认</a>'
        : '<a href="javascript:;" class="btn btn-set-default" title="设为默认">设为默认</a>') +
      '</div>' +
      '<span class="weather">--</span>' +
      '<span class="temperature">--°</span>' +
      '<a href="javascript:;" class="btn btn-delete" data-index="' + i + '" title="取消关注">' +
        '<img class="btn-delete-icon" src="./垃圾桶.png" alt="删除">' +
      '</a>' +
      '</li>';
  });
  ol.innerHTML = html;

  // 设为默认：把该城市移到列表第一个
  ol.querySelectorAll('.btn-set-default').forEach(function (btn) {
    btn.onclick = function (e) {
      e.stopPropagation();
      const lid = this.closest('.city').dataset.lid;
      const cities = getAttentionCities();
      const idx = cities.findIndex(function (c) { return c.locationId === lid; });
      if (idx <= 0) return;
      const city = cities.splice(idx, 1)[0];
      cities.unshift(city);
      saveAttentionCities(cities);
      renderAttentionList();
      updateAttentionButton();
    };
  });

  // 取消默认：把默认城市移到列表末尾
  ol.querySelectorAll('.btn-cancel').forEach(function (btn) {
    btn.onclick = function (e) {
      e.stopPropagation();
      const cities = getAttentionCities();
      if (cities.length < 2) return; // 只有一个城市，无法取消默认
      const city = cities.shift();
      cities.push(city);
      saveAttentionCities(cities);
      renderAttentionList();
      updateAttentionButton();
    };
  });

  // 删除事件
  ol.querySelectorAll('.btn-delete').forEach(function (btn) {
    btn.onclick = function (e) {
      e.stopPropagation();
      const idx = parseInt(this.dataset.index);
      const cities = getAttentionCities();
      cities.splice(idx, 1);
      saveAttentionCities(cities);
      renderAttentionList();
      updateAttentionButton();
    };
  });

  // 点击城市切换显示该城市天气（不设默认，默认由按钮控制）
  ol.querySelectorAll('.city').forEach(function (el) {
    el.onclick = function () {
      const lid = this.dataset.lid;
      const city = getAttentionCities().find(function (c) { return c.locationId === lid; });
      if (city) {
        selectCity(city);
        hideAttentionDropdown();
      }
    };
  });

  refreshAttentionSummaries();
}

async function refreshAttentionSummaries() {
  const cities = getAttentionCities();
  await Promise.all(cities.map(async function (city) {
    try {
      const data = await api('/v7/weather/7d', { location: city.locationId });
      const today = data.daily && data.daily[0];
      const row = document.querySelector('.attention-list .city[data-lid="' + city.locationId + '"]');
      if (!row || !today) return;
      // 天气格式：白天转夜间，如 "小雨转中雨"；相同则只显示一个；前面带白天天气小图标
      const dayW = today.textDay || '--';
      const nightW = today.textNight || '--';
      const iconSrc = encodeURI(weatherIconUrl(today.iconDay));
      row.querySelector('.weather').innerHTML =
        '<img class="icon" src="' + iconSrc + '" alt="">' +
        '<span class="weather-text">' + escapeHTML((dayW === nightW) ? dayW : dayW + '转' + nightW) + '</span>';
      // 温度格式：最低/最高
      row.querySelector('.temperature').textContent = (today.tempMin || '--') + '/' + (today.tempMax || '--') + '°';
    } catch (error) {
      // 关注城市摘要失败不影响主天气页。
    }
  }));
}

function updateAttentionButton() {
  const btn = document.querySelector('.btn-attention');
  const list = getAttentionCities();
  const isAttended = list.some(function (c) {
    return c.locationId === currentCity.locationId;
  });

  if (isAttended) {
    btn.textContent = '已关注';
    btn.classList.add('hasAttention');
  } else {
    btn.textContent = '+关注';
    btn.classList.remove('hasAttention');
  }
  btn.style.display = 'inline-block';
}

function addAttention(city) {
  const list = getAttentionCities();
  const exists = list.some(function (c) { return c.locationId === city.locationId; });
  if (exists) return;

  if (list.length >= 5) {
    showAttentionTip();
    return;
  }

  list.push(city);
  saveAttentionCities(list);
  renderAttentionList();
  updateAttentionButton();
}

function showAttentionTip() {
  const tip = document.querySelector('.attention-tip');
  tip.style.display = 'block';
  setTimeout(function () { tip.style.display = 'none'; }, 2000);
}

function hideAttentionDropdown() {
  document.querySelector('.attention-dropdown').style.display = 'none';
}

// --- 城市搜索 ---
function searchCities(query) {
  if (!query.trim()) return [];
  const q = query.trim().toLowerCase();
  return CITY_DATABASE.filter(function (c) {
    return c.name.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.province.toLowerCase().includes(q);
  }).slice(0, 10);
}

function renderSearchResults(results, query) {
  const ul = document.querySelector('.search-match');
  if (results.length === 0) {
    ul.innerHTML = '<li class="item tips">未找到相关城市</li>';
  } else {
    let html = '';
    results.forEach(function (c) {
      html += '<li class="item" data-lid="' + c.locationId + '">' +
        escapeHTML(c.name) + ' - ' + escapeHTML(c.province) +
        '</li>';
    });
    ul.innerHTML = html;

    // 点击事件
    ul.querySelectorAll('.item:not(.tips)').forEach(function (item) {
      item.onclick = function () {
        const lid = this.dataset.lid;
        const city = results.find(function (c) { return c.locationId === lid; }) || CITY_DATABASE.find(function (c) { return c.locationId === lid; });
        if (city) {
          selectCity(city);
          document.querySelector('.search-match').style.display = 'none';
          document.querySelector('.search-input').value = '';

          // 保存搜索历史
          const history = getSearchHistory();
          const filtered = history.filter(function (h) { return h.locationId !== city.locationId; });
          filtered.unshift(city);
          saveSearchHistory(filtered.slice(0, 10));
          renderSearchHistory();
        }
      };
    });
  }
  ul.style.display = 'block';
}

function renderHotCities() {
  const ul = document.querySelector('.hot-city-list');
  let html = '';
  HOT_CITIES.forEach(function (c) {
    html += '<li class="opts"><span data-lid="' + c.locationId + '">' + c.name + '</span></li>';
  });
  ul.innerHTML = html;

  ul.querySelectorAll('span').forEach(function (span) {
    span.onclick = function () {
      const lid = this.dataset.lid;
      const city = CITY_DATABASE.find(function (c) { return c.locationId === lid; });
      if (city) {
        selectCity(city);
        document.querySelector('.hot-city').style.display = 'none';
        document.querySelector('.search-input').value = '';
      }
    };
  });
}

function renderSearchHistory() {
  const history = getSearchHistory();
  const ul = document.querySelector('.history-list');
  if (history.length === 0) {
    ul.innerHTML = '';
    return;
  }
  let html = '';
  history.forEach(function (c) {
    html += '<li class="opts"><span data-lid="' + c.locationId + '">' + c.name + '</span></li>';
  });
  ul.innerHTML = html;

  ul.querySelectorAll('span').forEach(function (span) {
    span.onclick = function () {
      const lid = this.dataset.lid;
      const city = history.find(function (c) { return c.locationId === lid; }) || CITY_DATABASE.find(function (c) { return c.locationId === lid; });
      if (city) {
        selectCity(city);
        document.querySelector('.hot-city').style.display = 'none';
        document.querySelector('.search-input').value = '';
      }
    };
  });
}

// --- 城市选择 ---
async function selectCity(city) {
  currentCity = city;
  const requestId = ++weatherRequestId;
  loading = true;
  document.querySelector('.nav-location-text').textContent = getCityLabel(city);

  // 保存到 localStorage
  try {
    localStorage.setItem('tq_current_city', JSON.stringify(city));
  } catch (e) { }

  updateAttentionButton();
  renderAttentionList();

  // 加载天气数据
  try {
    weatherData = await fetchAllWeather(city);
    if (requestId !== weatherRequestId) return;
    renderAll(weatherData);
  } catch (err) {
    console.error('获取天气数据失败:', err);
  } finally {
    if (requestId === weatherRequestId) loading = false;
  }
}

// --- 全部渲染 ---
function renderAll(data) {
  renderCurrentWeather(data);
  renderHourlyForecast(data);
  renderDailyForecast(data);
  renderLivingIndex(data);
}

// ==================== 事件绑定 ====================

function bindEvents() {
  // 城市搜索输入
  const searchInput = document.querySelector('.search-input');
  const matchList = document.querySelector('.search-match');
  const hotCityPanel = document.querySelector('.hot-city');

  searchInput.addEventListener('input', async function () {
    const query = this.value.trim();
    if (query.trim()) {
      hotCityPanel.style.display = 'none';
      matchList.innerHTML = '<li class="item tips">正在搜索…</li>';
      matchList.style.display = 'block';
      const requestId = ++searchRequestId;
      if (searchRequest) searchRequest.abort();
      searchRequest = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const results = await lookupCities(query, searchRequest && searchRequest.signal);
      if (requestId !== searchRequestId || searchInput.value.trim() !== query) return;
      renderSearchResults(results, query);
    } else {
      ++searchRequestId;
      matchList.style.display = 'none';
      hotCityPanel.style.display = 'block';
    }
  });

  searchInput.addEventListener('focus', function () {
    if (this.value.trim()) {
      matchList.style.display = 'block';
    } else {
      hotCityPanel.style.display = 'block';
    }
  });

  document.querySelector('.air-window .detail-window__close').onclick = closeAirQuality;
  document.querySelector('.air-window').addEventListener('click', function (event) {
    if (event.target === this) closeAirQuality();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeAirQuality();
  });

  // 点击页面其他地方关闭下拉
  document.addEventListener('click', function (e) {
    const searchBox = document.querySelector('.search');
    if (!searchBox.contains(e.target)) {
      matchList.style.display = 'none';
      hotCityPanel.style.display = 'none';
    }
    // 关闭关注列表
    const attentionBox = document.querySelector('.nav-location');
    if (!attentionBox.contains(e.target)) {
      hideAttentionDropdown();
    }
  });

  // 鼠标移入城市名时，清除 hideAttentionDropdown 设的内联 display:none，
  // 让 CSS 的 .nav-location:hover .attention-dropdown { display:block } 重新生效
  document.querySelector('.nav-location').addEventListener('mouseenter', function () {
    document.querySelector('.attention-dropdown').style.display = '';
  });

  // 关注按钮
  document.querySelector('.btn-attention').onclick = function () {
    const list = getAttentionCities();
    const isAttended = list.some(function (c) { return c.locationId === currentCity.locationId; });
    if (!isAttended) {
      addAttention(currentCity);
    }
  };

  // 清除历史
  document.querySelector('.btn-clean').onclick = function () {
    saveSearchHistory([]);
    renderSearchHistory();
  };
}

// ==================== 初始化 ====================

async function init() {
  bindEvents();
  renderHotCities();
  renderSearchHistory();

  // 1. 从 localStorage 读取上次的城市
  let savedCity = null;
  try {
    savedCity = JSON.parse(localStorage.getItem('tq_current_city'));
  } catch (e) { }

  // 2. 从关注列表读取默认城市
  if (!savedCity) {
    const attention = getAttentionCities();
    if (attention.length > 0) {
      savedCity = attention[0];
    }
  }

  // 3. 默认北京
  if (!savedCity) {
    savedCity = CITY_DATABASE[0]; // 北京
  }

  await selectCity(savedCity);
}

// 启动
document.addEventListener('DOMContentLoaded', init);
