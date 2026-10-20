
const API_KEY = window.QWEATHER_API_KEY || '959f2414e163470f82303a13c9e14319';
const API_HOST = window.QWEATHER_API_HOST || 'https://n473jt7ygj.re.qweatherapi.com';
let searchRequest = null;
let searchRequestId = 0;

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

function getWeatherBgClass(iconCode) {
  const code = parseInt(iconCode);
  if (code === 100) return 'C1';
  if (code >= 101 && code <= 103) return 'C2';
  if (code === 104) return 'C4';
  if (code >= 150 && code <= 153) return 'C1';
  if (code === 154) return 'C4';
  if (code >= 300 && code <= 304) return 'C6';
  if (code >= 305 && code <= 307) return 'C7';
  if (code >= 308 && code <= 313) return 'C8';
  if (code >= 314 && code <= 318) return 'C9';
  if (code >= 350 && code <= 351) return 'C7';
  if (code >= 400 && code <= 404) return 'C6';
  if (code >= 405 && code <= 410) return 'C8';
  if (code >= 500 && code <= 515) return 'C9';
  if (code === 900) return 'C7';
  if (code === 901) return 'C9';
  return 'C1';
}

function getWindClass(iconCode) {
  return 'wind-0';
}

function getWindDirClass(wind360) {
  const d = parseInt(wind360);
  if (d >= 337.5 || d < 22.5) return 'wind-0';
  if (d >= 22.5 && d < 67.5) return 'wind-1';
  if (d >= 67.5 && d < 112.5) return 'wind-2';
  if (d >= 112.5 && d < 157.5) return 'wind-3';
  if (d >= 157.5 && d < 202.5) return 'wind-4';
  if (d >= 202.5 && d < 247.5) return 'wind-5';
  if (d >= 247.5 && d < 292.5) return 'wind-6';
  if (d >= 292.5 && d < 337.5) return 'wind-7';
  return 'wind-0';
}

function getAqiClass(level) {
  return 'air-level' + Math.max(1, Math.min(6, parseInt(level, 10) || 1));
}

function getWarningClass(level) {
  const map = {
    '蓝色': 'level01', 'yellow': 'level01', 'blue': 'level01',
    '黄色': 'level02', 'orange': 'level03',
    '橙色': 'level03', 'red': 'level04',
    '红色': 'level04'
  };
  return map[String(level || '').toLowerCase()] || map[level] || 'level01';
}

function getIndexIconClass(type) {
  const map = {
    '1': 'icon_yundong',
    '2': 'icon_xiche',
    '3': 'icon_chuanyi',
    '4': 'icon_diaoyu',
    '5': 'icon_fangsai',
    '6': 'icon_lvyou',
    '7': 'icon_guomin',
    '8': 'icon_shushidu',
    '9': 'icon_ganmao',
    '10': 'icon_wurankuosan',
    '11': 'icon_airconditioner',
    '12': 'icon_sunglasses',
    '13': 'icon_huazhuang',
    '14': 'icon_liangshai',
    '15': 'icon_jiaotong',
    '16': 'icon_fangsai',
  };
  return map[type] || 'icon_chuanyi';
}

const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

const LIMIT_RULES = {
  '北京': [[4, 9], [5, 0], [1, 6], [2, 7], [3, 8]],
  '西安': [[1, 6], [2, 7], [3, 8], [4, 9], [5, 0]],
  '杭州': [[2, 7], [3, 8], [4, 9], [5, 0], [1, 6]],
  '成都': [[1, 6], [2, 7], [3, 8], [4, 9], [5, 0]],
  '天津': [[1, 6], [2, 7], [3, 8], [4, 9], [5, 0]],
  '郑州': [[1, 6], [2, 7], [3, 8], [4, 9], [5, 0]],
};

function getLimitInfo(city) {
  if (!city) return null;
  const rules = LIMIT_RULES[city.name];
  if (!rules) return null;
  const day = new Date().getDay();
  if (day === 0 || day === 6) return null;
  const pair = rules[day - 1];
  return pair[0] + '和' + pair[1];
}

function pollutantValue(air, code) {
  if (!air) return '—';
  const list = air.pollutants || [];
  const found = list.find(function (p) { return p.code === code; });
  const value = found && found.concentration && found.concentration.value;
  return value != null ? escapeHTML(String(value)) : '—';
}

let currentCity = null;
let weatherData = null;
let loading = false;
let weatherRequestId = 0;
let chartResizeHandler = null;

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

function weatherIconUrl(code, isLarge) {
  const iconCode = Number(code || 100);
  const dir = './页面资源_副本/';

  if (iconCode === 150) return dir + '夜间晴.png';
  if (iconCode >= 151 && iconCode <= 153) return dir + '夜间多云.png';
  if (iconCode === 154) return dir + '阴.png';

  if (iconCode === 100) return isLarge ? dir + '晴天（大）.png' : dir + '晴（小）.png';

  if (iconCode >= 101 && iconCode <= 103) return dir + '阴.png';

  if (iconCode === 104) return dir + '阴.png';

  if (iconCode >= 300 && iconCode <= 305) return dir + '小雨.png';
  if (iconCode >= 306 && iconCode <= 399) return dir + '中雨.png';

  return dir + '阴.png';
}

function getCityLabel(city) {
  if (!city) return '';
  const province = city.province || city.adm1 || '';
  let cityName = city.adm2 || city.city || city.name || '';
  if (province && (province === cityName || province === cityName + '市')) return province;
  if (cityName && !/[市区县旗州盟]$/.test(cityName)) cityName += '市';

  return [province, cityName].filter(Boolean).join(' ');
}

async function api(path, params, options) {

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
    fetchWarnings(city),
  ]);
  return {
    now: nowRes.now,
    daily: d7Res.daily,
    hourly: h24Res.hourly,
    indices: idxRes.daily,
    air: airRes || null,
    warnings: warningRes,
    sun: await fetchSunTimes(city).catch(function () { return null; }),
    updateTime: nowRes.updateTime,
    yesterday: await fetchYesterdayWeather(city).catch(function () { return null; }),
  };
}

async function fetchYesterdayWeather(city) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.getFullYear() +
    String(yesterday.getMonth() + 1).padStart(2, '0') +
    String(yesterday.getDate()).padStart(2, '0');
  const data = await api('/v7/historical/weather', { location: city.locationId, date: dateStr });
  const wd = data.weatherDaily;
  const wh = data.weatherHourly || [];

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

async function fetchWarnings(city) {
  try {
    let lat = city.lat;
    let lon = city.lon;
    if (!lat || !lon) {
      const geo = await api('/geo/v2/city/lookup', { location: city.locationId, number: 1, lang: 'zh' });
      const location = geo.location && geo.location[0];
      lat = location && location.lat;
      lon = location && location.lon;
    }
    if (!lat || !lon) return [];
    const data = await api('/weatheralert/v1/current/' + lat + '/' + lon, { lang: 'zh' });
    return data.alerts || [];
  } catch (error) {
    return [];
  }
}

async function fetchSunTimes(city) {
  try {
    function dateStrOf(d) {
      return d.getFullYear() +
        String(d.getMonth() + 1).padStart(2, '0') +
        String(d.getDate()).padStart(2, '0');
    }
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [d1, d2] = await Promise.all([
      api('/v7/astronomy/sun', { location: city.locationId, date: dateStrOf(today) }),
      api('/v7/astronomy/sun', { location: city.locationId, date: dateStrOf(tomorrow) }),
    ]);
    return {
      sunrise: d1.sunrise || null,
      sunset: d1.sunset || null,
      sunriseTomorrow: d2.sunrise || null,
      sunsetTomorrow: d2.sunset || null
    };
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

function formatTime(timeStr) {

  const m = timeStr.match(/T(\d{2}:\d{2})/);
  return m ? m[1] : timeStr;
}

function formatDate(dateStr) {
  const parts = dateStr.split('-');
  return parseInt(parts[1], 10) + '/' + parseInt(parts[2], 10);
}

function formatPubTime(timeStr) {

  const m = timeStr.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}:\d{2})/);
  return m ? m[1] + '-' + m[2] + '-' + m[3] + ' ' + m[4] : timeStr;
}

function getDayLabel(dateStr, index) {

  if (index === 0) return '昨天';
  if (index === 1) return '今天';
  if (index === 2) return '明天';
  if (index === 3) return '后天';
  const parts = dateStr.split('-').map(Number);
  return WEEKDAYS[new Date(parts[0], parts[1] - 1, parts[2]).getDay()];
}

function getHourLabel(fxTime) {

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

function renderCurrentWeather(data) {
  const { now, indices, air, warnings } = data;

  const ct = document.querySelector('.header');
  ct.className = 'header ' + getWeatherBgClass(now.icon);

  document.querySelector('.header-top').textContent = '发布于 ' + formatPubTime(data.updateTime);

  document.querySelector('.tem').textContent = now.temp + '°';

  document.querySelector('.header-mid .weather').textContent = now.text;

  const iconEl = document.querySelector('.header-weather-icon');
  iconEl.innerHTML = '<img src="' + weatherIconUrl(now.icon, true) + '" alt="' + escapeHTML(now.text) + '">';

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
  } else {
    aqiBox.className = 'aqi';
    aqiBox.innerHTML = '<span class="info-aqi air-unavailable">空气质量暂无数据</span>';
  }

  renderWarnings(warnings);

  const windIcon = document.querySelector('.icon-wind');
  windIcon.className = 'icon ' + getWindDirClass(now.wind360);

  document.querySelector('.header-bottom .wind').textContent = now.windDir + ' ' + now.windScale + '级';

  document.querySelector('.header-bottom .wet').textContent = '湿度 ' + now.humidity + '%';

  document.querySelector('.header-bottom .ap').textContent = '气压 ' + now.pressure + ' hPa';

  const limitEl = document.querySelector('.ban');
  const limitNum = getLimitInfo(currentCity);
  if (limitNum) {
    limitEl.classList.add('show');
    document.querySelector('.limit-text').textContent = '限行 ' + limitNum;
  } else {
    limitEl.classList.remove('show');
  }

}

function renderWarnings(warnings) {
  const list = document.querySelector('.warning-list');
  if (!list) return;
  list.innerHTML = (warnings || []).map(function (item) {

    const typeName = (item.eventType && item.eventType.name) || (item.typeName) || '天气预警';
    const colorCode = (item.color && item.color.code) || '';
    const levelClass = getWarningClass(colorCode || item.level);

    const colorNames = { 'blue': '蓝色', 'yellow': '黄色', 'orange': '橙色', 'red': '红色' };
    const colorName = colorNames[String(colorCode).toLowerCase()] || '';
    const title = typeName + colorName + '预警';
    const detail = item.description || item.text || '';

    return '<li class="tag ' + levelClass + '">' +
      escapeHTML(typeName || '天气预警') +
      '<div class="popwindow">' +
      '<div class="header">' + escapeHTML(title) + '</div>' +
      '<div class="detail"><div class="inner">' +
      '<p class="warning-desc">' + escapeHTML(detail) + '</p>' +
      '</div></div>' +
      '</div>' +
      '</li>';
  }).join('');
}

function renderHourlyForecast(data) {
  const { hourly, sun } = data;
  const list = document.querySelector('.hours-list');

  function toTimestamp(fxTime) {
    return new Date(fxTime).getTime();
  }

  let items = hourly.map(function (h) {
    const time = h.fxTime.match(/T(\d{2}:\d{2})/)[1];
    return {
      type: 'hour',
      time: time,
      ts: toTimestamp(h.fxTime),
      html: '<p class="txt-time">' + escapeHTML(getHourLabel(h.fxTime)) + '</p>' +
        '<img class="icon" src="' + weatherIconUrl(h.icon) + '" alt="' + escapeHTML(h.text) + '">' +
        '<p class="txt-degree">' + escapeHTML(h.temp) + '°</p>'
    };
  });

  if (sun) {

    const firstTs = items.length > 0 ? items[0].ts : 0;
    const lastTs = items.length > 0 ? items[items.length - 1].ts : Infinity;

    [['sunrise', sun.sunrise, './页面资源_副本/日出.png', '日出'],
    ['sunset', sun.sunset, './页面资源_副本/日落.png', '日落'],
    ['sunrise', sun.sunriseTomorrow, './页面资源_副本/日出.png', '日出'],
    ['sunset', sun.sunsetTomorrow, './页面资源_副本/日落.png', '日落']].forEach(function (cfg) {
      const key = cfg[0], fullTime = cfg[1], icon = cfg[2], label = cfg[3];
      if (!fullTime) return;
      const ts = toTimestamp(fullTime);

      if (ts < firstTs || ts > lastTs) return;
      const time = fullTime.match(/T(\d{2}:\d{2})/)[1];
      const iconSrc = encodeURI(icon);
      const timeLabel = getHourLabel(fullTime);

      const insertIdx = items.findIndex(function (it) { return it.ts >= ts; });
      const insertAt = insertIdx === -1 ? items.length : insertIdx;
      items.splice(insertAt, 0, {
        type: key,
        time: time,
        ts: ts,
        html: '<p class="txt-time">' + escapeHTML(timeLabel) + '</p>' +
          '<img class="icon" src="' + iconSrc + '" alt="' + label + '">' +
          '<p class="txt-degree">' + label + '</p>'
      });
    });
  }

  let html = '';
  items.forEach(function (it) {
    html += '<li class="item">' + it.html + '</li>';
  });
  list.innerHTML = html;

  setupHourlyPagination(items.length);
}

function setupHourlyPagination(totalItems) {
  const container = document.querySelector('.hours .weather-track');
  const prev = document.querySelector('.hours .btn-prev');
  const next = document.querySelector('.hours .btn-next');

  const itemsPerPage = 12;
  const itemWidth = 100;

  const maxIndex = Math.max(0, totalItems - itemsPerPage);

  let currentIndex = 0;

  function goIndex(index) {
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    container.style.marginLeft = -(currentIndex * itemWidth) + 'px';
  }

  prev.addEventListener('click', function () { goIndex(currentIndex - itemsPerPage); });
  next.addEventListener('click', function () { goIndex(currentIndex + itemsPerPage); });

  goIndex(0);
}

function renderDailyForecast(data) {
  let daily = data.daily.slice();
  if (data.yesterday) {
    daily = [data.yesterday].concat(daily.slice(0, 6));
  }
  const list = document.querySelector('.days-list');
  let html = '';

  daily.forEach((d, i) => {
    let itemClass = 'item';
    if (i === 0) itemClass += ' first';
    else if (i === 1) itemClass += ' second';
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

  renderChart(daily);
}

function renderChart(daily) {
  const chartDom = document.querySelector('.chart-days');
  if (!chartDom) return;

  if (typeof echarts === 'undefined') {
    setTimeout(function () { renderChart(daily); }, 500);
    return;
  }

  const existingInstance = echarts.getInstanceByDom(chartDom);
  if (existingInstance) existingInstance.dispose();

  const chart = echarts.init(chartDom);
  const labels = daily.map(function (d, i) { return getDayLabel(d.fxDate, i); });
  const highs = daily.map(function (d) { return parseInt(d.tempMax); });
  const lows = daily.map(function (d) { return parseInt(d.tempMin); });
  const minT = Math.min.apply(null, lows) - 3;
  const maxT = Math.max.apply(null, highs) + 3;

  chart.setOption({

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

  if (chartResizeHandler) window.removeEventListener('resize', chartResizeHandler);
  chartResizeHandler = function () { chart.resize(); };
  window.addEventListener('resize', chartResizeHandler);
}

function renderLivingIndex(data) {
  const hiddenTypes = new Set(['7', '11', '12', '13']);
  const indices = (data.indices || []).filter(function (item) {
    return !hiddenTypes.has(String(item.type));
  });
  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(indices.length / itemsPerPage));
  const contentEl = document.querySelector('.living-content');

  contentEl.innerHTML = '';

  for (let p = 0; p < totalPages; p++) {
    const pageUl = document.createElement('ul');
    pageUl.className = 'page';

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

  contentEl.style.width = (totalPages * 445) + 'px';

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

  prevBtn.addEventListener('click', function () { goPage(currentPage - 1); });
  nextBtn.addEventListener('click', function () { goPage(currentPage + 1); });
  goPage(0);
}

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

  ol.querySelectorAll('.btn-set-default').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
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
    });
  });

  ol.querySelectorAll('.btn-cancel').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const cities = getAttentionCities();
      if (cities.length < 2) return;
      const city = cities.shift();
      cities.push(city);
      saveAttentionCities(cities);
      renderAttentionList();
      updateAttentionButton();
    });
  });

  ol.querySelectorAll('.btn-delete').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const idx = parseInt(this.dataset.index);
      const cities = getAttentionCities();
      cities.splice(idx, 1);
      saveAttentionCities(cities);
      renderAttentionList();
      updateAttentionButton();
    });
  });

  ol.querySelectorAll('.city').forEach(function (el) {
    el.addEventListener('click', function () {
      const lid = this.dataset.lid;
      const city = getAttentionCities().find(function (c) { return c.locationId === lid; });
      if (city) {
        selectCity(city);
        hideAttentionDropdown();
      }
    });
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

      const dayW = today.textDay || '--';
      const nightW = today.textNight || '--';
      const iconSrc = encodeURI(weatherIconUrl(today.iconDay));
      row.querySelector('.weather').innerHTML =
        '<img class="icon" src="' + iconSrc + '" alt="">' +
        '<span class="weather-text">' + escapeHTML((dayW === nightW) ? dayW : dayW + '转' + nightW) + '</span>';

      row.querySelector('.temperature').textContent = (today.tempMin || '--') + '/' + (today.tempMax || '--') + '°';
    } catch (error) {

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

window.goDefaultCity = function () {
  const defaultCity = CITY_DATABASE.find(function (c) { return c.locationId === '101110101'; });
  if (defaultCity) {
    selectCity(defaultCity);
    hideAttentionDropdown();
    document.querySelector('.search-input').value = '';
  }
};

function searchCities(query) {
  if (!query.trim()) return [];
  const q = query.trim().toLowerCase();

  return CITY_DATABASE.filter(function (c) {
    return c.name.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.province.toLowerCase().includes(q);
  }).slice(0, 10);
}

function highlightMatch(text, query) {
  const safeText = escapeHTML(text);
  const q = (query || '').trim();
  if (!q) return safeText;
  const escapedQ = escapeHTML(q);

  try {
    const re = new RegExp('(' + escapedQ.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return safeText.replace(re, '<em>$1</em>');
  } catch (e) {
    return safeText;
  }
}

function renderSearchResults(results, query) {
  const ul = document.querySelector('.search-match');
  if (results.length === 0) {
    ul.innerHTML = '<li class="item tips">未找到相关城市</li>';
  } else {
    let html = '';
    results.forEach(function (c) {

      var province = c.adm1 || c.province || '';
      var city = c.adm2 || c.city || '';
      var district = c.name || '';
      var parts = [];
      if (province) parts.push(highlightMatch(province, query));
      if (city) parts.push(highlightMatch(city, query));
      if (district) parts.push(highlightMatch(district, query));
      html += '<li class="item" data-lid="' + c.locationId + '">' +
        parts.join('，') +
        '</li>';
    });
    ul.innerHTML = html;

    ul.querySelectorAll('.item:not(.tips)').forEach(function (item) {
      item.addEventListener('click', function () {
        const lid = this.dataset.lid;
        const city = results.find(function (c) { return c.locationId === lid; }) || CITY_DATABASE.find(function (c) { return c.locationId === lid; });
        if (city) {
          selectCity(city);
          document.querySelector('.search-match').style.display = 'none';
          document.querySelector('.search-input').value = '';

          const history = getSearchHistory();
          const filtered = history.filter(function (h) { return h.locationId !== city.locationId; });
          filtered.unshift(city);
          saveSearchHistory(filtered.slice(0, 10));
          renderSearchHistory();
        }
      });
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
    span.addEventListener('click', function () {
      const lid = this.dataset.lid;
      const city = CITY_DATABASE.find(function (c) { return c.locationId === lid; });
      if (city) {
        selectCity(city);
        document.querySelector('.hot-city').style.display = 'none';
        document.querySelector('.search-input').value = '';
      }
    });
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
    span.addEventListener('click', function () {
      const lid = this.dataset.lid;
      const city = history.find(function (c) { return c.locationId === lid; }) || CITY_DATABASE.find(function (c) { return c.locationId === lid; });
      if (city) {
        selectCity(city);
        document.querySelector('.hot-city').style.display = 'none';
        document.querySelector('.search-input').value = '';
      }
    });
  });
}

async function selectCity(city) {
  currentCity = city;
  const requestId = ++weatherRequestId;
  loading = true;
  document.querySelector('.nav-location-text').textContent = getCityLabel(city);

  try {
    localStorage.setItem('tq_current_city', JSON.stringify(city));
  } catch (e) { }

  updateAttentionButton();
  renderAttentionList();

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

function renderAll(data) {
  renderCurrentWeather(data);
  renderHourlyForecast(data);
  renderDailyForecast(data);
  renderLivingIndex(data);
}

function bindEvents() {

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

  document.addEventListener('click', function (e) {
    const searchBox = document.querySelector('.search');
    if (!searchBox.contains(e.target)) {
      matchList.style.display = 'none';
      hotCityPanel.style.display = 'none';
    }

    const attentionBox = document.querySelector('.nav-location');
    if (!attentionBox.contains(e.target)) {
      hideAttentionDropdown();
    }
  });

  document.querySelector('.nav-location').addEventListener('mouseenter', function () {
    document.querySelector('.attention-dropdown').style.display = '';
  });

  document.querySelector('.btn-attention').addEventListener('click', function () {
    const list = getAttentionCities();
    const isAttended = list.some(function (c) { return c.locationId === currentCity.locationId; });
    if (!isAttended) {
      addAttention(currentCity);
    }
  });

  document.querySelector('.btn-clean').addEventListener('click', function () {
    saveSearchHistory([]);
    renderSearchHistory();
  });
}

async function init() {

  bindEvents();
  renderHotCities();
  renderSearchHistory();

  let savedCity = null;
  const attention = getAttentionCities();
  if (attention.length > 0) {
    savedCity = attention[0];
  }

  if (!savedCity) {
    try {
      savedCity = JSON.parse(localStorage.getItem('tq_current_city'));
    } catch (e) { }
  }

  if (!savedCity) {
    savedCity = CITY_DATABASE[0];
  }

  await selectCity(savedCity);
}

document.addEventListener('DOMContentLoaded', init);
