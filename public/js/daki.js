// Dakimakura Cover Tier List JavaScript
(async function() {
    'use strict';

    // DOM Elements
    const loadingElement = document.getElementById('loading');
    const statsElement = document.getElementById('stats');
    const tierContainer = document.getElementById('tier-container');
    const tooltip = document.getElementById('tooltip');

    // State
    let dakiData = null;
    let currentTooltipItem = null;

    // API Base URL (production domain)
    const API_BASE = window.location.hostname === 'localhost'
        ? 'http://localhost:5000'
        : 'https://quark-hardcore.com';

    /**
     * データを取得する
     */
    async function fetchDakiData() {
        try {
            const response = await fetch(`${API_BASE}/daki_contents`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'データの取得に失敗しました');
            }

            return result;
        } catch (error) {
            console.error('Error fetching daki data:', error);
            throw error;
        }
    }

    /**
     * 統計情報を更新する
     */
    function updateStats(data) {
        const totalCount = data.total;
        const sCounts = data.data.S.length;
        const aCounts = data.data.A.length;
        const bCounts = data.data.B.length;
        const cCounts = data.data.C.length;

        // 所持枚数の総和を計算
        const allData = [...data.data.S, ...data.data.A, ...data.data.B, ...data.data.C];
        const totalPieces = allData.reduce((sum, item) => {
            const count = parseInt(item.count) || 0;
            return sum + count;
        }, 0);

        document.getElementById('total-pieces').textContent = totalPieces;
        document.getElementById('total-count').textContent = totalCount;
        document.getElementById('s-count').textContent = sCounts;
        document.getElementById('a-count').textContent = aCounts;
        document.getElementById('b-count').textContent = bCounts;
        document.getElementById('c-count').textContent = cCounts;
    }

    /**
     * キャラクターアイテムを作成する
     */
    function createCharacterItem(character, index) {
        const item = document.createElement('div');
        item.className = 'character-item';
        item.dataset.index = index;
        item.dataset.character = JSON.stringify(character);

        const img = document.createElement('img');
        img.alt = character.name;
        img.loading = 'lazy'; // 遅延読み込み
        img.className = 'loading';

        // 画像読み込み完了時の処理
        img.onload = function() {
            this.classList.remove('loading');
        };

        // 画像読み込み失敗時の処理
        img.onerror = function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgODAgMTAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiM0NDQiLz48dGV4dCB4PSI0MCIgeT0iNTAiIGZpbGw9IiNhYWEiIGZvbnQtc2l6ZT0iMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj5JbWFnZSBOL0E8L3RleHQ+PC9zdmc+';
            this.classList.remove('loading');
        };

        img.src = character.imageUrl;
        item.appendChild(img);

        // ホバーイベント
        item.addEventListener('mouseenter', (e) => {
            console.log('Mouse enter:', character);
            showTooltip(e, character);
        });
        item.addEventListener('mouseleave', () => {
            console.log('Mouse leave');
            hideTooltip();
        });
        item.addEventListener('mousemove', updateTooltipPosition);

        return item;
    }

    /**
     * ツールチップを表示する
     */
    function showTooltip(event, character) {
        console.log('showTooltip called:', character);

        // 既存のツールチップを削除
        const existingTooltip = document.querySelector('.custom-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }

        currentTooltipItem = event.currentTarget;

        const tooltipContent = [
            `<strong>${character.name}</strong>`,
            `出展元: ${character.source}`,
            `絵師: ${character.artist}`,
            `所持枚数: ${character.count}`,
            character.comment ? `コメント: ${character.comment}` : ''
        ].filter(Boolean).join('<br>');

        console.log('Creating new tooltip');

        // 新しいツールチップ要素を作成
        const newTooltip = document.createElement('div');
        newTooltip.className = 'custom-tooltip';
        newTooltip.innerHTML = tooltipContent;

        // スタイルを直接設定
        Object.assign(newTooltip.style, {
            position: 'fixed',
            background: '#000',
            color: '#fff',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '14px',
            lineHeight: '1.4',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            zIndex: '999999',
            pointerEvents: 'none',
            maxWidth: '300px',
            border: '2px solid #fff',
            display: 'block',
            opacity: '1',
            visibility: 'visible'
        });

        document.body.appendChild(newTooltip);

        // 位置を設定
        const rect = currentTooltipItem.getBoundingClientRect();
        const tooltipRect = newTooltip.getBoundingClientRect();

        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 15;

        // 画面外調整
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 10) {
            top = rect.bottom + 15;
        }

        newTooltip.style.left = left + 'px';
        newTooltip.style.top = top + 'px';

        console.log('Tooltip created at:', { left, top });
    }

    /**
     * ツールチップの位置を更新する
     */
    function updateTooltipPosition(event) {
        if (!currentTooltipItem || tooltip.style.display === 'none') return;

        const rect = currentTooltipItem.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 10;

        // 画面外に出る場合の調整
        if (left < 10) left = 10;
        if (left + tooltipRect.width > viewportWidth - 10) {
            left = viewportWidth - tooltipRect.width - 10;
        }
        if (top < 10) {
            top = rect.bottom + 10;
        }

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';

        console.log('Tooltip positioned at:', { left, top, rect, tooltipRect });
    }

    /**
     * ツールチップを隠す
     */
    function hideTooltip() {
        const existingTooltip = document.querySelector('.custom-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
        currentTooltipItem = null;
    }

    /**
     * Tierリストを構築する
     */
    function buildTierList(data) {
        const tiers = ['S', 'A', 'B', 'C'];
        const tierColors = {
            'S': 'tier-s',
            'A': 'tier-a',
            'B': 'tier-b',
            'C': 'tier-c'
        };

        tierContainer.innerHTML = '';

        tiers.forEach(tier => {
            const tierData = data.data[tier] || [];

            // Tier行を作成
            const tierRow = document.createElement('div');
            tierRow.className = 'tier-row';

            // Tierラベル
            const tierLabel = document.createElement('div');
            tierLabel.className = `tier-label ${tierColors[tier]}`;
            tierLabel.textContent = tier;

            // Tierコンテンツ
            const tierContent = document.createElement('div');
            tierContent.className = 'tier-content';

            // キャラクターアイテムを追加
            tierData.forEach((character, index) => {
                const characterItem = createCharacterItem(character, index);
                tierContent.appendChild(characterItem);
            });

            // 空のTierの場合のメッセージ
            if (tierData.length === 0) {
                const emptyMessage = document.createElement('div');
                emptyMessage.className = 'text-muted';
                emptyMessage.style.padding = '20px';
                emptyMessage.textContent = 'このTierにはアイテムがありません';
                tierContent.appendChild(emptyMessage);
            }

            tierRow.appendChild(tierLabel);
            tierRow.appendChild(tierContent);
            tierContainer.appendChild(tierRow);
        });
    }

    /**
     * エラー表示
     */
    function showError(message) {
        loadingElement.innerHTML = `
            <div class="text-danger">
                <i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>
                エラー: ${message}
            </div>
        `;
    }

    /**
     * スクロール位置を調整（キーボード操作対応）
     */
    function handleKeyboardNavigation(event) {
        const tierContents = document.querySelectorAll('.tier-content');

        tierContents.forEach(content => {
            if (event.key === 'ArrowLeft') {
                content.scrollBy({ left: -100, behavior: 'smooth' });
            } else if (event.key === 'ArrowRight') {
                content.scrollBy({ left: 100, behavior: 'smooth' });
            }
        });
    }

    /**
     * 初期化
     */
    async function initialize() {
        try {
            // データを取得
            dakiData = await fetchDakiData();

            // UI更新
            updateStats(dakiData);
            buildTierList(dakiData);

            // 要素の表示切り替え
            loadingElement.style.display = 'none';
            statsElement.style.display = 'block';
            tierContainer.style.display = 'block';

            // キーボードイベント
            document.addEventListener('keydown', handleKeyboardNavigation);

            // ウィンドウリサイズ時のツールチップ調整
            window.addEventListener('resize', () => {
                if (currentTooltipItem) {
                    hideTooltip();
                }
            });

            console.log('Dakimakura Tier List loaded successfully:', dakiData);

        } catch (error) {
            console.error('Failed to initialize dakimakura tier list:', error);
            showError(error.message);
        }
    }

    // ページ読み込み完了後に初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
