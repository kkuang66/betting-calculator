// 主应用
(function() {
    'use strict';
    
    // 状态
    let currentPrediction = null;
    let currentText = '';
    let history = [];
    
    // 初始化
    document.addEventListener('DOMContentLoaded', function() {
        initTabs();
        initCalculator();
        initFeedback();
        initSettings();
        renderZodiacGrid();
        loadHistory();
        updateAIStats();
    });
    
    // Tab切换
    function initTabs() {
        const tabItems = document.querySelectorAll('.tab-item');
        
        tabItems.forEach(item => {
            item.addEventListener('click', function() {
                const tabId = this.dataset.tab;
                
                // 更新Tab状态
                tabItems.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // 更新内容
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // 计算器
    function initCalculator() {
        const btnParse = document.getElementById('btnParse');
        const btnCalculate = document.getElementById('btnCalculate');
        
        btnParse.addEventListener('click', handleParse);
        
        document.getElementById('betInput').addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleParse();
            }
        });
        
        btnCalculate.addEventListener('click', handleCalculate);
    }
    
    // 解析
    function handleParse() {
        const input = document.getElementById('betInput');
        const text = input.value.trim();
        
        if (!text) {
            showToast('请输入下注信息');
            return;
        }
        
        currentText = text;
        currentPrediction = parser.parse(text);
        
        displayResult(currentPrediction);
        
        // 显示反馈卡片
        document.getElementById('feedbackCard').style.display = 'block';
    }
    
    // 显示结果
    function displayResult(prediction) {
        const resultCard = document.getElementById('resultCard');
        const resultContent = document.getElementById('resultContent');
        
        const intentLabels = {
            'number_bet': '号码玩法',
            'te_number': '特码玩法',
            'zodiac_bet': '生肖玩法',
            'te_zodiac': '特肖玩法',
            'you_2': '二有',
            'you_3': '三有',
            'you_4': '四有',
            'you_5': '五有',
            'fu_you': '复式玩法',
            'unknown': '未知'
        };
        
        let html = `
            <div class="result-item">
                <span class="result-label">玩法类型</span>
                <span class="result-value">${intentLabels[prediction.intent] || prediction.intent}</span>
            </div>
            <div class="result-item">
                <span class="result-label">置信度</span>
                <span class="result-value">${(prediction.confidence * 100).toFixed(0)}%</span>
            </div>
        `;
        
        if (prediction.entities.zodiacs.length > 0) {
            html += `
                <div class="result-item">
                    <span class="result-label">生肖</span>
                    <span class="result-value">${prediction.entities.zodiacs.join('、')}</span>
                </div>
            `;
        }
        
        if (prediction.entities.numbers.length > 0) {
            html += `
                <div class="result-item">
                    <span class="result-label">号码</span>
                    <span class="result-value">${prediction.entities.numbers.join('、')}</span>
                </div>
            `;
        }
        
        html += `
            <div class="result-item">
                <span class="result-label">金额</span>
                <span class="result-value">¥${prediction.entities.amount}</span>
            </div>
        `;
        
        resultContent.innerHTML = html;
        resultCard.style.display = 'block';
    }
    
    // 反馈
    function initFeedback() {
        const btnCorrect = document.getElementById('btnCorrect');
        const btnWrong = document.getElementById('btnWrong');
        const btnCloseModal = document.getElementById('btnCloseModal');
        
        btnCorrect.addEventListener('click', function() {
            if (currentPrediction) {
                handleFeedback(currentPrediction.intent);
            }
        });
        
        btnWrong.addEventListener('click', function() {
            document.getElementById('correctionModal').style.display = 'flex';
        });
        
        btnCloseModal.addEventListener('click', function() {
            document.getElementById('correctionModal').style.display = 'none';
        });
        
        // 纠正选项
        document.querySelectorAll('.modal-option').forEach(option => {
            option.addEventListener('click', function() {
                const intent = this.dataset.intent;
                handleFeedback(intent);
                document.getElementById('correctionModal').style.display = 'none';
            });
        });
    }
    
    // 处理反馈
    function handleFeedback(correctIntent) {
        if (!currentPrediction || !currentText) return;
        
        // 学习
        if (currentPrediction.intent !== correctIntent) {
            parser.learn(currentText, correctIntent);
        }
        
        // 保存历史
        saveToHistory(currentText, currentPrediction, correctIntent);
        
        // 更新统计
        updateAIStats();
        
        showToast('感谢反馈！AI已学习');
        
        // 隐藏反馈卡片
        document.getElementById('feedbackCard').style.display = 'none';
    }
    
    // 计算收益
    function handleCalculate() {
        if (!currentPrediction) {
            showToast('请先解析下注信息');
            return;
        }
        
        const pingNumbers = [
            parseInt(document.getElementById('ping1').value),
            parseInt(document.getElementById('ping2').value),
            parseInt(document.getElementById('ping3').value),
            parseInt(document.getElementById('ping4').value),
            parseInt(document.getElementById('ping5').value),
            parseInt(document.getElementById('ping6').value)
        ].filter(n => !isNaN(n));
        
        const teNumber = parseInt(document.getElementById('teMa').value);
        
        if (pingNumbers.length < 6 || isNaN(teNumber)) {
            showToast('请输入完整的开奖号码');
            return;
        }
        
        const profit = calculateProfit(currentPrediction, pingNumbers, teNumber);
        displayProfit(profit);
    }
    
    // 计算收益
    function calculateProfit(prediction, pingNumbers, teNumber) {
        const settings = loadSettings();
        const entities = prediction.entities;
        let totalCost = 0;
        let totalWin = 0;
        let details = [];
        
        switch (prediction.intent) {
            case 'number_bet':
                entities.numbers.forEach(num => {
                    totalCost += entities.amount;
                    if (num === teNumber) {
                        totalWin += entities.amount * settings.oddsTe;
                        details.push(`${num}号 中特码!`);
                    } else if (pingNumbers.includes(num)) {
                        totalWin += entities.amount * settings.oddsPing;
                        details.push(`${num}号 中平码!`);
                    } else {
                        details.push(`${num}号 未中`);
                    }
                });
                break;
                
            case 'te_number':
                entities.numbers.forEach(num => {
                    totalCost += entities.amount;
                    if (num === teNumber) {
                        totalWin += entities.amount * settings.oddsTe;
                        details.push(`特码${num} 中!`);
                    } else {
                        details.push(`特码${num} 未中`);
                    }
                });
                break;
                
            case 'zodiac_bet':
                const teZodiac = numberToZodiac(teNumber);
                entities.zodiacs.forEach(zodiac => {
                    totalCost += entities.amount;
                    if (zodiac === teZodiac) {
                        totalWin += entities.amount * settings.oddsTeZodiac;
                        details.push(`${zodiac} 中特肖!`);
                    } else if (isZodiacInNumbers(zodiac, pingNumbers)) {
                        totalWin += entities.amount * settings.oddsPingZodiac;
                        details.push(`${zodiac} 中平肖!`);
                    } else {
                        details.push(`${zodiac} 未中`);
                    }
                });
                break;
                
            case 'te_zodiac':
                const teZodiac2 = numberToZodiac(teNumber);
                entities.zodiacs.forEach(zodiac => {
                    totalCost += entities.amount;
                    if (zodiac === teZodiac2) {
                        totalWin += entities.amount * settings.oddsTeZodiac;
                        details.push(`${zodiac} 中特肖!`);
                    } else {
                        details.push(`${zodiac} 未中`);
                    }
                });
                break;
                
            case 'you_2':
            case 'you_3':
            case 'you_4':
            case 'you_5':
                const required = parseInt(prediction.intent.split('_')[1]);
                totalCost += entities.amount;
                
                const allDrawZodiacs = new Set();
                pingNumbers.forEach(n => allDrawZodiacs.add(numberToZodiac(n)));
                allDrawZodiacs.add(numberToZodiac(teNumber));
                
                let matchCount = 0;
                entities.zodiacs.forEach(z => {
                    if (allDrawZodiacs.has(z)) matchCount++;
                });
                
                const oddsKey = `odds${prediction.intent.charAt(0).toUpperCase() + prediction.intent.slice(1).replace('_', '')}`;
                const odds = settings[oddsKey] || 10;
                
                if (matchCount >= required) {
                    totalWin += entities.amount * odds;
                    details.push(`中${matchCount}个，赔率${odds}倍`);
                } else {
                    details.push(`需${required}个，实际${matchCount}个`);
                }
                break;
        }
        
        return {
            totalCost,
            totalWin,
            profit: totalWin - totalCost,
            details
        };
    }
    
    // 检查生肖是否在号码中
    function isZodiacInNumbers(zodiac, numbers) {
        return numbers.some(n => numberToZodiac(n) === zodiac);
    }
    
    // 显示收益
    function displayProfit(profit) {
        const profitCard = document.getElementById('profitCard');
        const profitContent = document.getElementById('profitContent');
        
        const isWin = profit.profit >= 0;
        
        let html = `
            <div class="result-item">
                <span class="result-label">总投入</span>
                <span class="result-value">¥${profit.totalCost.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">总退回</span>
                <span class="result-value">¥${profit.totalWin.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">${isWin ? '盈利' : '亏损'}</span>
                <span class="result-value ${isWin ? 'win' : 'lose'}">${isWin ? '+' : ''}¥${profit.profit.toFixed(2)}</span>
            </div>
        `;
        
        if (profit.details.length > 0) {
            html += `<div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border);">`;
            profit.details.forEach(d => {
                html += `<div style="font-size:14px;color:var(--text-light);padding:2px 0;">• ${d}</div>`;
            });
            html += `</div>`;
        `;
        }
        
        profitContent.innerHTML = html;
        profitCard.style.display = 'block';
    }
    
    // 设置
    function initSettings() {
        const btnSave = document.getElementById('btnSaveSettings');
        const btnReset = document.getElementById('btnResetAI');
        
        btnSave.addEventListener('click', function() {
            saveSettings();
            showToast('设置已保存');
        });
        
        btnReset.addEventListener('click', function() {
            if (confirm('确定要重置AI学习数据吗？')) {
                parser.resetLearning();
                updateAIStats();
                showToast('AI学习数据已重置');
            }
        });
        
        loadSettingsToForm();
    }
    
    // 保存设置
    function saveSettings() {
        const settings = {
            oddsTe: parseFloat(document.getElementById('oddsTe').value) || 49,
            oddsPing: parseFloat(document.getElementById('oddsPing').value) || 49,
            oddsTeZodiac: parseFloat(document.getElementById('oddsTeZodiac').value) || 4.7,
            oddsPingZodiac: parseFloat(document.getElementById('oddsPingZodiac').value) || 4.7,
            oddsYou2: parseFloat(document.getElementById('oddsYou2').value) || 4,
            oddsYou3: parseFloat(document.getElementById('oddsYou3').value) || 10,
            oddsYou4: parseFloat(document.getElementById('oddsYou4').value) || 30,
            oddsYou5: parseFloat(document.getElementById('oddsYou5').value) || 100
        };
        
        localStorage.setItem('betting_settings', JSON.stringify(settings));
    }
    
    // 加载设置
    function loadSettings() {
        try {
            const saved = localStorage.getItem('betting_settings');
            if (saved) return JSON.parse(saved);
        } catch (e) {}
        
        return {
            oddsTe: 49,
            oddsPing: 49,
            oddsTeZodiac: 4.7,
            oddsPingZodiac: 4.7,
            oddsYou2: 4,
            oddsYou3: 10,
            oddsYou4: 30,
            oddsYou5: 100
        };
    }
    
    // 加载设置到表单
    function loadSettingsToForm() {
        const settings = loadSettings();
        document.getElementById('oddsTe').value = settings.oddsTe;
        document.getElementById('oddsPing').value = settings.oddsPing;
        document.getElementById('oddsTeZodiac').value = settings.oddsTeZodiac;
        document.getElementById('oddsPingZodiac').value = settings.oddsPingZodiac;
        document.getElementById('oddsYou2').value = settings.oddsYou2;
        document.getElementById('oddsYou3').value = settings.oddsYou3;
        document.getElementById('oddsYou4').value = settings.oddsYou4;
        document.getElementById('oddsYou5').value = settings.oddsYou5;
    }
    
    // 历史记录
    function saveToHistory(text, prediction, correctIntent) {
        const item = {
            id: Date.now(),
            text,
            predicted: prediction.intent,
            correct: correctIntent,
            timestamp: new Date().toISOString()
        };
        
        history.unshift(item);
        if (history.length > 50) history.pop();
        
        localStorage.setItem('betting_history', JSON.stringify(history));
        renderHistory();
    }
    
    function loadHistory() {
        try {
            const saved = localStorage.getItem('betting_history');
            if (saved) history = JSON.parse(saved);
        } catch (e) {}
        
        renderHistory();
        
        document.getElementById('btnClearHistory').addEventListener('click', function() {
            if (confirm('确定要清空历史记录吗？')) {
                history = [];
                localStorage.removeItem('betting_history');
                renderHistory();
                showToast('历史已清空');
            }
        });
    }
    
    function renderHistory() {
        const list = document.getElementById('historyList');
        
        if (history.length === 0) {
            list.innerHTML = '<p class="empty-text">暂无记录</p>';
            return;
        }
        
        const intentLabels = {
            'number_bet': '号码', 'te_number': '特码', 'zodiac_bet': '生肖',
            'te_zodiac': '特肖', 'you_2': '二有', 'you_3': '三有',
            'you_4': '四有', 'you_5': '五有', 'fu_you': '复式'
        };
        
        list.innerHTML = history.slice(0, 20).map(item => `
            <div class="history-item">
                <div>
                    <div class="history-text">${item.text}</div>
                    <div class="history-result">${intentLabels[item.predicted] || item.predicted} → ${intentLabels[item.correct] || item.correct}</div>
                </div>
                <div class="history-time">${new Date(item.timestamp).toLocaleDateString()}</div>
            </div>
        `).join('');
    }
    
    // AI统计
    function updateAIStats() {
        const stats = parser.getStats();
        const el = document.getElementById('aiStats');
        
        el.innerHTML = `
            <div class="stat-row">
                <span class="stat-label">关键词数</span>
                <span class="stat-value">${stats.keywords}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">已学习规则</span>
                <span class="stat-value">${stats.learned}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">历史记录</span>
                <span class="stat-value">${history.length}</span>
            </div>
        `;
    }
    
    // Toast提示
    function showToast(message, duration = 2000) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.style.display = 'block';
        
        setTimeout(() => {
            toast.style.display = 'none';
        }, duration);
    }
    
})();
