// 生肖数据
const ZODIAC_DATA = {
    '鼠': [6, 18, 30, 42],
    '牛': [5, 17, 29, 41],
    '虎': [4, 16, 28, 40],
    '兔': [3, 15, 27, 39],
    '龙': [2, 14, 26, 38],
    '蛇': [1, 13, 25, 37, 49],
    '马': [12, 24, 36, 48],
    '羊': [11, 23, 35, 47],
    '猴': [10, 22, 34, 46],
    '鸡': [9, 21, 33, 45],
    '狗': [8, 20, 32, 44],
    '猪': [7, 19, 31, 43]
};

// 生肖别名
const ZODIAC_ALIASES = {
    '老鼠': '鼠', '耗子': '鼠', '子鼠': '鼠',
    '黄牛': '牛', '丑牛': '牛',
    '老虎': '虎', '大虫': '虎', '寅虎': '虎', '白虎': '虎',
    '兔子': '兔', '玉兔': '兔', '卯兔': '兔', '小白兔': '兔',
    '神龙': '龙', '龙王': '龙', '辰龙': '龙', '金龙': '龙',
    '小龙': '蛇', '巳蛇': '蛇', '白蛇': '蛇',
    '骏马': '马', '午马': '马', '白马': '马', '宝马': '马',
    '山羊': '羊', '绵羊': '羊', '未羊': '羊', '喜羊羊': '羊',
    '猴子': '猴', '申猴': '猴', '悟空': '猴', '孙悟空': '猴',
    '公鸡': '鸡', '凤凰': '鸡', '酉鸡': '鸡', '金鸡': '鸡',
    '犬': '狗', '戌狗': '狗', '旺财': '狗',
    '八戒': '猪', '亥猪': '猪', '佩奇': '猪', '金猪': '猪'
};

// 号码转生肖
function numberToZodiac(num) {
    num = parseInt(num);
    for (const [zodiac, numbers] of Object.entries(ZODIAC_DATA)) {
        if (numbers.includes(num)) {
            return zodiac;
        }
    }
    return null;
}

// 获取生肖列表
function getZodiacList() {
    return Object.entries(ZODIAC_DATA).map(([name, numbers]) => ({
        name,
        numbers,
        numbersStr: numbers.join(', ')
    }));
}

// 从文本提取生肖
function extractZodiacs(text) {
    const found = [];
    const normalized = text.toLowerCase();
    
    // 先检查别名
    for (const [alias, zodiac] of Object.entries(ZODIAC_ALIASES)) {
        if (normalized.includes(alias) && !found.includes(zodiac)) {
            found.push(zodiac);
        }
    }
    
    // 再检查标准名
    for (const zodiac of Object.keys(ZODIAC_DATA)) {
        if (normalized.includes(zodiac) && !found.includes(zodiac)) {
            found.push(zodiac);
        }
    }
    
    return found;
}

// 渲染生肖表格
function renderZodiacGrid() {
    const grid = document.getElementById('zodiacGrid');
    if (!grid) return;
    
    const zodiacs = getZodiacList();
    grid.innerHTML = zodiacs.map(z => `
        <div class="zodiac-item">
            <div class="zodiac-name">${z.name}</div>
            <div class="zodiac-numbers">${z.numbersStr}</div>
        </div>
    `).join('');
}
