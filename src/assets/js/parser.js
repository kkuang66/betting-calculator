// 文本解析器
class BettingParser {
    constructor() {
        this.keywords = {
            '三有': 'you_3', '三连': 'you_3', '三个': 'you_3',
            '四有': 'you_4', '四连': 'you_4', '四个': 'you_4',
            '二有': 'you_2', '二连': 'you_2', '两个': 'you_2', '两连': 'you_2',
            '五有': 'you_5', '五连': 'you_5', '五个': 'you_5',
            '复式': 'fu_you',
            '特码': 'te_number',
            '特肖': 'te_zodiac', '平特': 'te_zodiac', '平特一肖': 'te_zodiac',
        };
        
        this.learnedKeywords = {};
        this.loadLearned();
    }
    
    // 加载已学习的规则
    loadLearned() {
        try {
            const saved = localStorage.getItem('learned_keywords');
            if (saved) {
                this.learnedKeywords = JSON.parse(saved);
            }
        } catch (e) {}
    }
    
    // 保存学习的规则
    saveLearned() {
        try {
            localStorage.setItem('learned_keywords', JSON.stringify(this.learnedKeywords));
        } catch (e) {}
    }
    
    // 从反馈中学习
    learn(text, correctIntent) {
        const words = text.replace(/[，,。、；;：:！!？?]/g, ' ').split(/\s+/);
        
        for (const word of words) {
            if (word.length >= 2 && word.length <= 6) {
                const key = `${word}_${correctIntent}`;
                this.learnedKeywords[key] = (this.learnedKeywords[key] || 0) + 1;
                
                if (this.learnedKeywords[key] >= 2 && !this.keywords[word]) {
                    this.keywords[word] = correctIntent;
                    console.log(`[学习] 新关键词: "${word}" -> ${correctIntent}`);
                }
            }
        }
        
        this.saveLearned();
    }
    
    // 解析文本
    parse(text) {
        const normalized = text
            .replace(/[，,。、；;：:！!？?]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        
        // 1. 检查关键词
        for (const [keyword, intent] of Object.entries(this.keywords)) {
            if (normalized.includes(keyword)) {
                return {
                    intent,
                    confidence: 0.9,
                    source: 'keyword',
                    matched: keyword,
                    entities: this.extractEntities(text)
                };
            }
        }
        
        // 2. 基础解析
        return this.basicParse(normalized, text);
    }
    
    // 基础解析
    basicParse(normalized, originalText) {
        // 特肖玩法
        if (/平特一肖|特肖|平特/.test(normalized)) {
            return { intent: 'te_zodiac', confidence: 0.8, source: 'basic', entities: this.extractEntities(originalText) };
        }
        
        // 复式玩法
        if (/复式/.test(normalized)) {
            return { intent: 'fu_you', confidence: 0.8, source: 'basic', entities: this.extractEntities(originalText) };
        }
        
        // 三有/四有/五有/二有
        const youMatch = normalized.match(/([二三四五])有|([二三四五])连/);
        if (youMatch) {
            const count = youMatch[1] || youMatch[2];
            const countMap = { '二': 'you_2', '三': 'you_3', '四': 'you_4', '五': 'you_5' };
            return { intent: countMap[count], confidence: 0.8, source: 'basic', entities: this.extractEntities(originalText) };
        }
        
        // 特码玩法
        if (/特码|特\b/.test(normalized) && /\d+/.test(normalized)) {
            return { intent: 'te_number', confidence: 0.8, source: 'basic', entities: this.extractEntities(originalText) };
        }
        
        // 号码玩法
        const hasNumbers = /\d+\s*号/.test(normalized) || /^\d+\s+\d+/.test(normalized);
        if (hasNumbers) {
            return { intent: 'number_bet', confidence: 0.7, source: 'basic', entities: this.extractEntities(originalText) };
        }
        
        // 生肖玩法
        const zodiacs = extractZodiacs(normalized);
        if (zodiacs.length > 0) {
            return { intent: 'zodiac_bet', confidence: 0.7, source: 'basic', entities: this.extractEntities(originalText) };
        }
        
        return { intent: 'unknown', confidence: 0.5, source: 'basic', entities: this.extractEntities(originalText) };
    }
    
    // 提取实体
    extractEntities(text) {
        const zodiacs = extractZodiacs(text);
        
        const numbers = [];
        const matches = text.match(/\d+/g);
        if (matches) {
            matches.forEach(m => {
                const num = parseInt(m);
                if (num >= 1 && num <= 49) {
                    numbers.push(num);
                }
            });
        }
        
        let amount = 100;
        const amountMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:元|米|块)/);
        if (amountMatch) {
            amount = parseFloat(amountMatch[1]);
        }
        
        return { zodiacs, numbers, amount };
    }
    
    // 获取统计
    getStats() {
        return {
            keywords: Object.keys(this.keywords).length,
            learned: Object.keys(this.learnedKeywords).length
        };
    }
    
    // 重置学习
    resetLearning() {
        this.learnedKeywords = {};
        localStorage.removeItem('learned_keywords');
        
        // 重置为默认关键词
        this.keywords = {
            '三有': 'you_3', '三连': 'you_3', '三个': 'you_3',
            '四有': 'you_4', '四连': 'you_4', '四个': 'you_4',
            '二有': 'you_2', '二连': 'you_2', '两个': 'you_2', '两连': 'you_2',
            '五有': 'you_5', '五连': 'you_5', '五个': 'you_5',
            '复式': 'fu_you',
            '特码': 'te_number',
            '特肖': 'te_zodiac', '平特': 'te_zodiac', '平特一肖': 'te_zodiac',
        };
    }
}

// 创建全局实例
const parser = new BettingParser();
