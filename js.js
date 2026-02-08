// ====================
// PLANT DATABASE
// ====================
const PLANT_TYPES = {
    rose: {
        name: 'Rose',
        emoji: '🌹',
        price: 400,
        waterNeed: 'high',
        sunlightNeed: 'high',
        growthTime: 5,
        carbonPerDay: 15,
        description: 'Beautiful but demanding'
    },
    tulip: {
        name: 'Tulip',
        emoji: '🌷',
        price: 100,
        waterNeed: 'medium',
        sunlightNeed: 'medium',
        growthTime: 3,
        carbonPerDay: 8,
        description: 'Easy to care for'
    },
    lily: {
        name: 'Lily',
        emoji: '🌸',
        price: 120,
        waterNeed: 'medium',
        sunlightNeed: 'high',
        growthTime: 4,
        carbonPerDay: 10,
        description: 'Loves sunlight'
    },
    sunflower: {
        name: 'Sunflower',
        emoji: '🌻',
        price: 200,
        waterNeed: 'high',
        sunlightNeed: 'very high',
        growthTime: 4,
        carbonPerDay: 12,
        description: 'Bright and cheerful'
    },
    cactus: {
        name: 'Cactus',
        emoji: '🌵',
        price: 80,
        waterNeed: 'very low',
        sunlightNeed: 'high',
        growthTime: 6,
        carbonPerDay: 5,
        description: 'Low maintenance'
    },
    fern: {
        name: 'Fern',
        emoji: '🌿',
        price: 150,
        waterNeed: 'high',
        sunlightNeed: 'low',
        growthTime: 3,
        carbonPerDay: 9,
        description: 'Prefers shade'
    },
    orchid: {
        name: 'Orchid',
        emoji: '🌺',
        price: 350,
        waterNeed: 'low',
        sunlightNeed: 'medium',
        growthTime: 7,
        carbonPerDay: 14,
        description: 'Exotic and elegant'
    },
    daisy: {
        name: 'Daisy',
        emoji: '🌼',
        price: 90,
        waterNeed: 'medium',
        sunlightNeed: 'medium',
        growthTime: 2,
        carbonPerDay: 7,
        description: 'Simple and sweet'
    }
};

// ====================
// ACHIEVEMENTS DATABASE
// ====================
const ACHIEVEMENTS = [
    {
        id: 'first_plant',
        name: 'First Sprout',
        desc: 'Plant your first seed',
        icon: '🌱',
        check: (state) => state.plants.length >= 1
    },
    {
        id: 'water_master',
        name: 'Water Master',
        desc: 'Water plants 10 times',
        icon: '💧',
        check: (state) => state.stats.watersUsed >= 10
    },
    {
        id: 'forest_guardian',
        name: 'Forest Guardian',
        desc: 'Grow 3 plants to maturity',
        icon: '🌳',
        check: (state) => state.plants.filter(p => p.stage === 'Mature').length >= 3
    },
    {
        id: 'planet_saver',
        name: 'Planet Saver',
        desc: 'Save 10kg of CO₂',
        icon: '🌍',
        check: (state) => state.stats.totalCarbonSaved >= 10000
    },
    {
        id: 'coin_collector',
        name: 'Coin Collector',
        desc: 'Earn 1000 credits',
        icon: '💰',
        check: (state) => state.stats.totalCoinsEarned >= 1000
    },
    {
        id: 'green_thumb',
        name: 'Green Thumb',
        desc: 'Keep 5 plants healthy',
        icon: '👍',
        check: (state) => state.plants.filter(p => p.happiness >= 70).length >= 5
    },
    {
        id: 'collector',
        name: 'Plant Collector',
        desc: 'Own 6 different plant types',
        icon: '📚',
        check: (state) => new Set(state.plants.map(p => p.type)).size >= 6
    },
    {
        id: 'dedicated',
        name: 'Dedicated Gardener',
        desc: 'Play for 7 days',
        icon: '📅',
        check: (state) => state.stats.daysPlayed >= 7
    },
    {
        id: 'eco_warrior',
        name: 'Eco Warrior',
        desc: 'Complete 20 eco activities',
        icon: '♻️',
        check: (state) => state.stats.activitiesLogged >= 20
    },
    {
        id: 'perfect_garden',
        name: 'Perfect Garden',
        desc: 'All plants above 80% health',
        icon: '✨',
        check: (state) => state.plants.length >= 3 && state.plants.every(p => p.happiness >= 80)
    }
];

// ====================
// CARBON ACTIVITIES
// ====================
const CARBON_ACTIVITIES = [
    { text: 'Walked instead of driving', amount: 50, category: 'transport', credits: 10 },
    { text: 'Used public transport', amount: 60, category: 'transport', credits: 12 },
    { text: 'Cycled to destination', amount: 70, category: 'transport', credits: 14 },
    { text: 'Used reusable bag', amount: 30, category: 'waste', credits: 6 },
    { text: 'Recycled materials', amount: 40, category: 'waste', credits: 8 },
    { text: 'Composted organic waste', amount: 35, category: 'waste', credits: 7 },
    { text: 'Avoided single-use plastic', amount: 25, category: 'waste', credits: 5 },
    { text: 'Ate plant-based meal', amount: 80, category: 'food', credits: 16 },
    { text: 'Chose local produce', amount: 45, category: 'food', credits: 9 },
    { text: 'Reduced food waste', amount: 55, category: 'food', credits: 11 },
    { text: 'Used renewable energy', amount: 70, category: 'energy', credits: 14 },
    { text: 'Turned off unused lights', amount: 20, category: 'energy', credits: 4 },
    { text: 'Unplugged devices', amount: 15, category: 'energy', credits: 3 },
    { text: 'Air-dried laundry', amount: 40, category: 'energy', credits: 8 },
    { text: 'Planted a tree', amount: 100, category: 'nature', credits: 20 },
    { text: 'Used eco-friendly products', amount: 35, category: 'shopping', credits: 7 },
    { text: 'Participated in clean-up', amount: 90, category: 'community', credits: 18 }
];

// ====================
// GAME STATE
// ====================
let state = {
    coins: 0, // Will be synced with EarthCredits
    water: 20,
    sunlight: 20,
    carbonSaved: 0,
    dailyGoal: 500,
    selectedPlantId: null,
    renamingPlantId: null,
    removingPlantId: null,
    plants: [],
    unlockedAchievements: [],
    carbonHistory: [], // Last 7 days
    stats: {
        totalCarbonSaved: 0,
        totalCoinsEarned: 0,
        watersUsed: 0,
        sunlightsUsed: 0,
        plantsGrown: 0,
        activitiesLogged: 0,
        daysPlayed: 0,
        lastPlayDate: null,
        startDate: new Date().toISOString()
    }
};

// ====================
// INITIALIZATION
// ====================
function init() {
    console.log('Initializing Pocket Garden...');
    
    // Load game state
    loadGame();
    
    // Sync with user's EarthCredits
    syncWithUserEarthCredits();
    
    // Check daily login
    checkDailyLogin();
    
    // Render everything
    renderPlants();
    renderStore();
    renderAchievements();
    updateUI();
    
    // Start game loops
    startGameLoops();
    
    // Auto-save every 30 seconds
    setInterval(saveGame, 30000);
    
    // Sync EarthCredits every 5 seconds
    setInterval(syncWithUserEarthCredits, 5000);
    
    console.log('Game initialized successfully');
}

// ====================
// EARTHCREDITS INTEGRATION
// ====================
function syncWithUserEarthCredits() {
    try {
        const currentUserId = localStorage.getItem('currentUserId');
        if (!currentUserId) return;
        
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        const currentUser = users[currentUserId] || {};
        
        // Get EarthCredits from user data
        const earthCredits = currentUser.earthCredits || 0;
        
        // Update game coins
        state.coins = earthCredits;
        
        // Update UI displays
        updateEarthCreditsDisplays(earthCredits);
        
        // Update header if it exists
        const headerCoins = document.getElementById('earthCoinsCount');
        if (headerCoins) {
            headerCoins.textContent = earthCredits;
        }
        
    } catch (error) {
        console.error('Error syncing EarthCredits:', error);
    }
}

function updateEarthCreditsDisplays(amount) {
    // Update all EarthCredits displays in the game
    const displays = [
        'coinDisplay',
        'storeCoinsDisplay'
    ];
    
    displays.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = amount;
        }
    });
}

function updateUserEarthCredits(newAmount) {
    try {
        const currentUserId = localStorage.getItem('currentUserId');
        if (!currentUserId) return false;
        
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        const currentUser = users[currentUserId] || {};
        
        // Update EarthCredits
        currentUser.earthCredits = newAmount;
        
        // Save back to localStorage
        users[currentUserId] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
        
        return true;
    } catch (error) {
        console.error('Error updating user EarthCredits:', error);
        return false;
    }
}

// ====================
// PERSISTENCE
// ====================
function saveGame() {
    try {
        // Save game state
        localStorage.setItem('pocketGarden', JSON.stringify(state));
        console.log('Game saved');
    } catch (e) {
        console.error('Failed to save game:', e);
    }
}

function loadGame() {
    try {
        const saved = localStorage.getItem('pocketGarden');
        if (saved) {
            const loaded = JSON.parse(saved);
            Object.assign(state, loaded);

            // Ensure stats object exists
            if (!state.stats) {
                state.stats = {
                    totalCarbonSaved: 0,
                    totalCoinsEarned: 0,
                    watersUsed: 0,
                    sunlightsUsed: 0,
                    plantsGrown: 0,
                    activitiesLogged: 0,
                    daysPlayed: 0,
                    lastPlayDate: null,
                    startDate: new Date().toISOString()
                };
            }

            // Convert plant dates to Date objects
            state.plants.forEach(plant => {
                if (plant.plantedAt && typeof plant.plantedAt === 'string') {
                    plant.plantedAt = new Date(plant.plantedAt);
                }
            });
            
            console.log('Game loaded:', state);
        }
    } catch (e) {
        console.error('Failed to load game:', e);
    }
}

function exportData() {
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pocket-garden-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    notify('📥 Garden data exported');
}

function importData() {
    document.getElementById('importFileInput').click();
}

function handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if (confirm('This will replace your current garden. Continue?')) {
                Object.assign(state, imported);
                saveGame();
                location.reload();
            }
        } catch (err) {
            notify('❌ Invalid file format', 'error');
        }
    };
    reader.readAsText(file);
}

function confirmReset() {
    if (confirm('Are you sure? This will delete all your progress permanently.')) {
        if (confirm('Really sure? This cannot be undone!')) {
            localStorage.removeItem('pocketGarden');
            location.reload();
        }
    }
}

// ====================
// DAILY LOGIN
// ====================
function checkDailyLogin() {
    const today = new Date().toDateString();
    const lastPlay = state.stats.lastPlayDate;

    if (lastPlay !== today) {
        state.stats.daysPlayed++;
        state.stats.lastPlayDate = today;

        // Daily login bonus
        if (state.stats.daysPlayed > 1) {
            const bonus = 50;
            state.coins += bonus;
            state.stats.totalCoinsEarned += bonus;
            
            // Update user's EarthCredits
            updateUserEarthCredits(state.coins);
            
            notify(`🎁 Daily login bonus: +${bonus} EarthCredits 🪙`);
        }

        if (lastPlay && lastPlay !== today) {
            // Archive yesterday's carbon
            state.carbonHistory.push({
                date: lastPlay,
                amount: state.carbonSaved
            });
            // Keep only last 7 days
            if (state.carbonHistory.length > 7) {
                state.carbonHistory.shift();
            }
            state.carbonSaved = 0;
        }

        saveGame();
    }
}

// ====================
// PLANT RENDERING
// ====================
function renderPlants() {
    const grid = document.getElementById('plantsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';

    const maxSlots = 6;
    for (let i = 0; i < maxSlots; i++) {
        if (i < state.plants.length) {
            const plant = state.plants[i];
            const card = createPlantCard(plant);
            grid.appendChild(card);
        } else {
            const emptyCard = createEmptySlot(i === maxSlots - 1);
            grid.appendChild(emptyCard);
        }
    }
}

function createPlantCard(plant) {
    const card = document.createElement('div');
    card.className = 'plant-card';

    if (state.selectedPlantId === plant.id) {
        card.classList.add('selected');
    }

    if (plant.water < 30 || plant.sunlight < 30) {
        card.classList.add('needs-care');
    }

    card.onclick = (e) => {
        if (!e.target.closest('.plant-action-btn')) {
            openPlantDetail(plant.id);
        }
    };

    const age = getPlantAge(plant);

    card.innerHTML = `
        <div class="plant-header">
            <div class="plant-icon">${plant.emoji}</div>
            <div class="plant-info">
                <div class="plant-name">${plant.name}</div>
                <div class="plant-stage">${plant.stage}${age ? ` • ${age}` : ''}</div>
            </div>
            <div class="plant-actions">
                <button class="plant-action-btn edit-btn" onclick="event.stopPropagation(); openRenameModal(${plant.id})" 
                    title="Rename plant" aria-label="Rename ${plant.name}">
                    ✏️
                </button>
                <button class="plant-action-btn remove-btn" onclick="event.stopPropagation(); openRemoveModal(${plant.id})" 
                    title="Remove plant" aria-label="Remove ${plant.name}">
                    🗑️
                </button>
            </div>
        </div>
        <div class="plant-stats-mini">
            <div class="mini-stat">
                <div class="mini-stat-icon">💧</div>
                <div class="mini-stat-value">${plant.water}%</div>
            </div>
            <div class="mini-stat">
                <div class="mini-stat-icon">🌤️</div>
                <div class="mini-stat-value">${plant.sunlight}%</div>
            </div>
            <div class="mini-stat">
                <div class="mini-stat-icon">💚</div>
                <div class="mini-stat-value">${plant.happiness}%</div>
            </div>
        </div>
    `;

    return card;
}

function createEmptySlot(isAddSlot) {
    const card = document.createElement('div');
    card.className = 'plant-card empty';

    if (isAddSlot) {
        card.innerHTML = `
            <div class="empty-slot-content">
                <div class="add-plant-box">
                    <span class="plus-icon">+</span>
                </div>
            </div>
        `;
    } else {
        card.innerHTML = `
            <div class="empty-slot-content">
                <div class="empty-slot-icon">🌱</div>
                <div>Empty Slot</div>
                <div style="font-size: 0.75rem; margin-top: 4px; color: var(--text-muted);">
                    Buy a plant from the shop
                </div>
            </div>
        `;
    }

    return card;
}

function getPlantAge(plant) {
    if (!plant.plantedAt) return '';

    const now = new Date();
    const planted = new Date(plant.plantedAt);
    const days = Math.floor((now - planted) / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return '1 day';
    return `${days} days`;
}

// ====================
// PLANT SELECTION
// ====================
function selectPlant(id) {
    state.selectedPlantId = id;
    const plant = state.plants.find(p => p.id === id);

    if (plant) {
        // Render plant visual
        renderPlantDetailVisual(plant);
        
        // Update plant info
        document.getElementById('detailName').textContent = plant.name;
        document.getElementById('detailStage').textContent = plant.stage;

        const age = getPlantAge(plant);
        const ageEl = document.getElementById('detailAge');
        if (age) {
            ageEl.textContent = `Age: ${age}`;
            ageEl.style.display = 'block';
        } else {
            ageEl.style.display = 'none';
        }

        // Update stats
        document.getElementById('waterStat').textContent = plant.water + '%';
        document.getElementById('waterBar').style.width = plant.water + '%';

        document.getElementById('sunStat').textContent = plant.sunlight + '%';
        document.getElementById('sunBar').style.width = plant.sunlight + '%';

        document.getElementById('happyStat').textContent = plant.happiness + '%';
        document.getElementById('happyBar').style.width = plant.happiness + '%';

        // Update care requirements
        const plantType = PLANT_TYPES[plant.type];
        const careItems = document.getElementById('careItems');
        careItems.innerHTML = `
            <div class="care-item">💧 Water: ${capitalize(plantType.waterNeed)}</div>
            <div class="care-item">🌤️ Sunlight: ${capitalize(plantType.sunlightNeed)}</div>
            <div class="care-item">♻️ Carbon: ${plantType.carbonPerDay}g/day</div>
        `;

        // Show stats group
        document.getElementById('statGroup').style.display = 'flex';
        document.getElementById('plantPreview').classList.add('active');

        // Highlight usable items
        updateResourceHighlights(plant);
    }

    renderPlants();
}

function renderPlantDetailVisual(plant) {
    const container = document.getElementById('detailIconContainer');
    if (!container) return;
    
    let leafCount = 0;
    if (plant.stage === 'Seedling') leafCount = 2;
    else if (plant.stage === 'Young') leafCount = 4;
    else if (plant.stage === 'Mature') leafCount = plant.type === 'fern' ? 6 : 4;
    
    if (plant.type === 'cactus') leafCount = 0;
    
    let leavesHTML = '';
    for (let i = 0; i < leafCount; i++) {
        leavesHTML += '<div class="leaf"></div>';
    }
    
    const stageClass = `${plant.type}-${plant.stage.toLowerCase()}`;
    container.innerHTML = `
        <div class="plant-visual" style="height: 120px;">
            <div class="css-plant ${stageClass}">
                <div class="plant-stem"></div>
                ${leavesHTML}
                ${plant.stage === 'Mature' && plant.type !== 'cactus' && plant.type !== 'fern' ? '<div class="plant-flower"></div>' : ''}
            </div>
        </div>
    `;
}

function updateResourceHighlights(plant) {
    const waterItem = document.getElementById('waterItem');
    const sunItem = document.getElementById('sunItem');

    if (plant.water < 100 && state.water > 0) {
        waterItem.classList.add('usable');
    } else {
        waterItem.classList.remove('usable');
    }

    if (plant.sunlight < 100 && state.sunlight > 0) {
        sunItem.classList.add('usable');
    } else {
        sunItem.classList.remove('usable');
    }
}

// ====================
// UI UPDATE
// ====================
function updateUI() {
    // Update EarthCredits displays
    updateEarthCreditsDisplays(state.coins);
    
    // Update resources
    document.getElementById('waterStorage').textContent = state.water;
    document.getElementById('sunInventory').textContent = state.sunlight;
    
    // Update carbon tracking
    document.getElementById('missionText').textContent = `${state.carbonSaved}g / ${state.dailyGoal}g CO₂`;

    const goalPercent = Math.min((state.carbonSaved / state.dailyGoal) * 100, 100);
    document.getElementById('goalBar').style.width = goalPercent + '%';
    document.getElementById('goalText').textContent = `${state.carbonSaved} / ${state.dailyGoal}g CO₂`;

    // Update resource highlights
    if (state.selectedPlantId) {
        const plant = state.plants.find(p => p.id === state.selectedPlantId);
        if (plant) {
            updateResourceHighlights(plant);
        }
    }
}

// ====================
// RESOURCE USAGE
// ====================
function useResource(type) {
    if (!state.selectedPlantId) {
        notify('Select a plant first', 'error');
        return;
    }

    const plant = state.plants.find(p => p.id === state.selectedPlantId);
    if (!plant) return;

    if (type === 'water' && state.water > 0) {
        if (plant.water < 100) {
            state.water--;
            plant.water = Math.min(plant.water + 25, 100);
            state.stats.watersUsed++;
            updateHappiness(plant);
            notify(`💧 Watered ${plant.name}`);
            
            // Re-select to refresh the display
            selectPlant(plant.id);
            updateUI();
            saveGame();
        } else {
            notify('Plant is fully watered', 'error');
        }
    } else if (type === 'sunlight' && state.sunlight > 0) {
        if (plant.sunlight < 100) {
            state.sunlight--;
            plant.sunlight = Math.min(plant.sunlight + 25, 100);
            state.stats.sunlightsUsed++;
            updateHappiness(plant);
            notify(`🌤️ Gave sunlight to ${plant.name}`);
            
            // Re-select to refresh the display
            selectPlant(plant.id);
            updateUI();
            saveGame();
        } else {
            notify('Plant has enough sunlight', 'error');
        }
    } else {
        notify('Not enough resources', 'error');
    }

    renderPlants();
    checkAchievements();
}

// ====================
// PLANT HEALTH
// ====================
function updateHappiness(plant) {
    const oldStage = plant.stage;
    plant.happiness = Math.round((plant.water + plant.sunlight) / 2);

    // Stage evolution based on time and health
    const age = plant.plantedAt ?
        Math.floor((new Date() - new Date(plant.plantedAt)) / (1000 * 60 * 60 * 24)) : 0;
    const plantType = PLANT_TYPES[plant.type];

    if (plant.happiness >= 80 && age >= plantType.growthTime && plant.stage !== 'Mature') {
        plant.stage = 'Mature';
        if (oldStage !== 'Mature') {
            state.stats.plantsGrown++;
            notify(`🌸 ${plant.name} reached maturity!`);
        }
    } else if (plant.happiness >= 60 && age >= Math.floor(plantType.growthTime / 2) && plant.stage === 'Seedling') {
        plant.stage = 'Young';
        notify(`🌱 ${plant.name} is growing!`);
    }
}

// ====================
// STORE
// ====================
function renderStore() {
    const container = document.getElementById('plantStoreItems');
    if (!container) return;
    
    container.innerHTML = '';

    Object.entries(PLANT_TYPES).forEach(([key, plant]) => {
        const btn = document.createElement('button');
        btn.className = 'store-item';
        btn.onclick = () => buyPlant(plant.name, plant.emoji, plant.price, key);
        btn.setAttribute('aria-label', `Buy ${plant.name} for ${plant.price} EarthCredits`);

        btn.innerHTML = `
            <div class="item-left">
                <div class="item-icon">${plant.emoji}</div>
                <div class="item-details">
                    <h4>${plant.name}</h4>
                    <p>${plant.description}</p>
                </div>
            </div>
            <div class="item-price">🪙 ${plant.price}</div>
        `;

        container.appendChild(btn);
    });
}

function buyItem(type, qty, price) {
    // Check if user has enough EarthCredits
    if (state.coins >= price) {
        state.coins -= price;
        
        // Update user's EarthCredits
        updateUserEarthCredits(state.coins);

        if (type === 'water') {
            state.water += qty;
        } else if (type === 'sunlight') {
            state.sunlight += qty;
        }

        notify(`✓ Purchased ${qty}x ${type} for ${price} EarthCredits 🪙`);
        updateUI();
        saveGame();
    } else {
        notify('Not enough EarthCredits', 'error');
    }
}

function buyPlant(name, emoji, price, type) {
    // Check if user has enough EarthCredits
    if (state.coins >= price) {
        if (state.plants.length >= 6) {
            notify('Garden is full', 'error');
            return;
        }

        state.coins -= price;
        
        // Update user's EarthCredits
        updateUserEarthCredits(state.coins);

        const newPlant = {
            id: Date.now(),
            name: name,
            type: type,
            emoji: emoji,
            stage: 'Seedling',
            water: 100,
            sunlight: 100,
            happiness: 100,
            plantedAt: new Date()
        };

        state.plants.push(newPlant);
        notify(`🌱 Planted ${name}!`);
        
        // Auto-select the newly planted plant
        selectPlant(newPlant.id);
        
        renderPlants();
        updateUI();
        saveGame();
        checkAchievements();
    } else {
        notify('Not enough EarthCredits', 'error');
    }
}

// ====================
// ACHIEVEMENTS
// ====================
function renderAchievements() {
    const container = document.getElementById('achievementsGrid');
    if (!container) return;
    
    container.innerHTML = '';

    ACHIEVEMENTS.forEach(achievement => {
        const unlocked = state.unlockedAchievements.includes(achievement.id);

        const div = document.createElement('div');
        div.className = 'achievement-item' + (unlocked ? ' unlocked' : ' locked');

        div.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.desc}</div>
            </div>
        `;

        container.appendChild(div);
    });
}

function checkAchievements() {
    let newUnlocks = 0;

    ACHIEVEMENTS.forEach(achievement => {
        if (!state.unlockedAchievements.includes(achievement.id)) {
            if (achievement.check(state)) {
                state.unlockedAchievements.push(achievement.id);
                newUnlocks++;

                const reward = 50;
                state.coins += reward;
                state.stats.totalCoinsEarned += reward;
                
                // Update user's EarthCredits
                updateUserEarthCredits(state.coins);

                notify(`🏆 Achievement: ${achievement.name} (+${reward} EarthCredits 🪙)`);
            }
        }
    });

    if (newUnlocks > 0) {
        renderAchievements();
        saveGame();
    }
}

// ====================
// CARBON TRACKING
// ====================
function openCarbonLog() {
    const list = document.getElementById('activityList');
    if (!list) return;
    
    list.innerHTML = '';

    CARBON_ACTIVITIES.forEach(activity => {
        const div = document.createElement('div');
        div.className = 'activity-item';
        div.onclick = () => logActivity(activity);

        div.innerHTML = `
            <div style="flex: 1;">
                <span class="activity-text">${activity.text}</span>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">
                    Saves ${activity.amount}g CO₂
                </div>
            </div>
            <div style="text-align: right;">
                <span class="activity-amount">+${activity.amount}g</span>
                <div style="font-size: 0.75rem; color: var(--earthcoin-dark); margin-top: 4px; font-weight: 600;">
                    +${activity.credits} 🪙
                </div>
            </div>
        `;

        list.appendChild(div);
    });

    document.getElementById('carbonModal').classList.add('active');
}

function logActivity(activity) {
    // Add carbon saved
    state.carbonSaved += activity.amount;
    state.stats.totalCarbonSaved += activity.amount;
    state.stats.activitiesLogged++;

    // Add EarthCredits
    state.coins += activity.credits;
    state.stats.totalCoinsEarned += activity.credits;
    
    // Update user's EarthCredits
    updateUserEarthCredits(state.coins);

    notify(`♻️ ${activity.text} (+${activity.amount}g CO₂, +${activity.credits} EarthCredits 🪙)`);

    // Check goal completion
    if (state.carbonSaved >= state.dailyGoal) {
        const bonus = 100;
        state.coins += bonus;
        state.stats.totalCoinsEarned += bonus;
        
        // Update user's EarthCredits
        updateUserEarthCredits(state.coins);
        
        notify(`🎉 Daily goal completed! +${bonus} EarthCredits 🪙`);
        state.carbonSaved = 0;
    }

    updateUI();
    saveGame();
    checkAchievements();
    closeModal('carbonModal');
}

// ====================
// MODALS
// ====================
function openLeaderboard() {
    const leaderboard = [
        { name: 'EcoWarrior', carbon: 15420, isUser: false },
        { name: 'GreenThumb', carbon: 12890, isUser: false },
        { name: 'You', carbon: state.stats.totalCarbonSaved, isUser: true },
        { name: 'PlantLover', carbon: 9560, isUser: false },
        { name: 'NatureFan', carbon: 7340, isUser: false },
        { name: 'EcoHero', carbon: 6120, isUser: false }
    ];

    leaderboard.sort((a, b) => b.carbon - a.carbon);

    const list = document.getElementById('leaderboardList');
    if (!list) return;
    
    list.innerHTML = leaderboard.map((entry, index) => {
        const rankClass = index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : 'other';
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';

        return `
            <div class="leaderboard-entry ${entry.isUser ? 'current-user' : ''}">
                <div class="rank-badge ${rankClass}">
                    ${medal || '#' + (index + 1)}
                </div>
                <div class="player-info">
                    <div class="player-name">${entry.name}</div>
                    <div class="carbon-amount">${entry.carbon}g CO₂ saved</div>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('leaderboardModal').classList.add('active');
}

function showSummary() {
    const healthyPlants = state.plants.filter(p => p.happiness >= 70).length;

    const summaryData = [
        { icon: '🌱', value: state.plants.length, label: 'Total Plants' },
        { icon: '💚', value: healthyPlants, label: 'Healthy Plants' },
        { icon: '♻️', value: state.stats.totalCarbonSaved + 'g', label: 'Total Carbon' },
        { icon: '🪙', value: state.coins, label: 'EarthCredits' },
        { icon: '📅', value: state.stats.daysPlayed, label: 'Days Played' },
        { icon: '🏆', value: state.unlockedAchievements.length, label: 'Achievements' }
    ];

    const grid = document.getElementById('summaryGrid');
    if (!grid) return;
    
    grid.innerHTML = summaryData.map(item => `
        <div class="summary-item">
            <div class="summary-icon">${item.icon}</div>
            <div class="summary-value">${item.value}</div>
            <div class="summary-label">${item.label}</div>
        </div>
    `).join('');

    // Render carbon chart
    renderCarbonChart();

    document.getElementById('summaryModal').classList.add('active');
}

function renderCarbonChart() {
    const container = document.getElementById('carbonChart');
    if (!container) return;
    
    container.innerHTML = '';

    // Get last 7 days of data
    const history = [...state.carbonHistory];
    const today = { date: new Date().toDateString(), amount: state.carbonSaved };
    history.push(today);

    // Fill with zeros if less than 7 days
    while (history.length < 7) {
        history.unshift({ date: '', amount: 0 });
    }

    // Take last 7 only
    const last7 = history.slice(-7);

    const maxAmount = Math.max(...last7.map(d => d.amount), 100);

    last7.forEach((day, index) => {
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        const height = day.amount > 0 ? (day.amount / maxAmount) * 100 : 5;
        bar.style.height = height + '%';

        const label = document.createElement('div');
        label.className = 'chart-label';
        label.textContent = day.date ? new Date(day.date).toLocaleDateString('en', { weekday: 'short' }) : '-';

        const value = document.createElement('div');
        value.className = 'chart-value';
        value.textContent = day.amount + 'g';

        bar.appendChild(label);
        bar.appendChild(value);
        container.appendChild(bar);
    });
}

function openSettings() {
    // Update settings info
    document.getElementById('settingsPlantCount').textContent = state.plants.length;
    document.getElementById('settingsTotalCarbon').textContent = state.stats.totalCarbonSaved + 'g';
    document.getElementById('settingsDaysPlayed').textContent = state.stats.daysPlayed;
    
    // Update EarthCredits in settings
    document.getElementById('settingsEarthCredits').textContent = state.coins;

    document.getElementById('settingsModal').classList.add('active');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('active');
    }
}

// ====================
// PLANT MANAGEMENT
// ====================
function openRenameModal(plantId) {
    state.renamingPlantId = plantId;
    const plant = state.plants.find(p => p.id === plantId);

    if (plant) {
        document.getElementById('renameInput').value = plant.name;
        document.getElementById('renameModal').classList.add('active');

        setTimeout(() => {
            document.getElementById('renameInput').focus();
            document.getElementById('renameInput').select();
        }, 100);
    }
}

function confirmRename() {
    const newName = document.getElementById('renameInput').value.trim();

    if (!newName) {
        notify('Please enter a name', 'error');
        return;
    }

    const plant = state.plants.find(p => p.id === state.renamingPlantId);

    if (plant) {
        const oldName = plant.name;
        plant.name = newName;
        notify(`✓ Renamed to ${newName}`);

        if (state.selectedPlantId === plant.id) {
            document.getElementById('detailName').textContent = plant.name;
        }

        renderPlants();
        saveGame();
    }

    closeModal('renameModal');
    state.renamingPlantId = null;
}

function openRemoveModal(plantId) {
    state.removingPlantId = plantId;
    const plant = state.plants.find(p => p.id === plantId);

    if (plant) {
        document.getElementById('removePlantName').textContent = plant.name;
        document.getElementById('removeModal').classList.add('active');
    }
}

function confirmRemove() {
    const plantIndex = state.plants.findIndex(p => p.id === state.removingPlantId);

    if (plantIndex !== -1) {
        const plant = state.plants[plantIndex];
        state.plants.splice(plantIndex, 1);

        if (state.selectedPlantId === state.removingPlantId) {
            state.selectedPlantId = null;
            document.getElementById('statGroup').style.display = 'none';
            document.getElementById('plantPreview').classList.remove('active');
            document.getElementById('detailIconContainer').innerHTML = `
                <div class="plant-icon-large add-plant-box" id="detailIcon">
                    <span class="plus-icon">+</span>
                </div>
            `;
            document.getElementById('detailName').textContent = 'Select a Plant';
            document.getElementById('detailStage').textContent = 'No plant selected';
        }

        notify(`✓ Removed ${plant.name}`);
        renderPlants();
        saveGame();
    }

    closeModal('removeModal');
    state.removingPlantId = null;
}

// Open detailed plant view
function openPlantDetail(plantId) {
    const plant = state.plants.find(p => p.id === plantId);
    if (!plant) return;

    // Also select the plant in the left panel
    selectPlant(plantId);

    const plantType = PLANT_TYPES[plant.type];

    // Set plant info
    document.getElementById('detailModalPlantName').textContent = plant.name;
    document.getElementById('detailModalType').textContent = plantType.name;
    document.getElementById('detailModalAge').textContent = getPlantAge(plant) || 'Today';
    document.getElementById('detailModalCarbon').textContent = `${plantType.carbonPerDay}g/day`;
    document.getElementById('detailModalStage').textContent = plant.stage;

    // Set stats
    document.getElementById('detailModalWater').textContent = `${plant.water}%`;
    document.getElementById('detailModalWaterBar').style.width = `${plant.water}%`;

    document.getElementById('detailModalSunlight').textContent = `${plant.sunlight}%`;
    document.getElementById('detailModalSunlightBar').style.width = `${plant.sunlight}%`;

    document.getElementById('detailModalHealth').textContent = `${plant.happiness}%`;
    document.getElementById('detailModalHealthBar').style.width = `${plant.happiness}%`;

    // Set care info
    document.getElementById('detailModalCareInfo').innerHTML = `
        <div class="care-item">💧 Water: ${capitalize(plantType.waterNeed)}</div>
        <div class="care-item">🌤️ Sunlight: ${capitalize(plantType.sunlightNeed)}</div>
    `;

    // Render plant visual
    renderPlantVisual(plant);

    document.getElementById('plantDetailModal').classList.add('active');
}

// Render CSS-drawn plant
function renderPlantVisual(plant) {
    const container = document.getElementById('plantVisual');
    if (!container) return;
    
    const stageClass = `${plant.type}-${plant.stage.toLowerCase()}`;
    
    // Determine number of leaves based on stage
    let leafCount = 0;
    if (plant.stage === 'Seedling') leafCount = 2;
    else if (plant.stage === 'Young') leafCount = 4;
    else if (plant.stage === 'Mature') leafCount = plant.type === 'fern' ? 6 : 4;
    
    // Don't render leaves for cactus
    if (plant.type === 'cactus') leafCount = 0;
    
    let leavesHTML = '';
    for (let i = 0; i < leafCount; i++) {
        leavesHTML += '<div class="leaf"></div>';
    }

    container.innerHTML = `
        <div class="css-plant ${stageClass}">
            <div class="plant-stem"></div>
            ${leavesHTML}
            ${plant.stage === 'Mature' && plant.type !== 'cactus' && plant.type !== 'fern' ? '<div class="plant-flower"></div>' : ''}
        </div>
    `;
}

// ====================
// NOTIFICATIONS
// ====================
function notify(message, type = 'success') {
    const container = document.getElementById('notificationContainer');
    if (!container) {
        console.log(message);
        return;
    }
    
    const notif = document.createElement('div');
    notif.className = 'notification ' + type;

    const icon = type === 'error' ? '❌' : '✓';
    notif.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <div class="notification-text">${message}</div>
    `;

    container.appendChild(notif);

    setTimeout(() => {
        notif.style.opacity = '0';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// ====================
// GAME LOOPS
// ====================
function startGameLoops() {
    // Plant decay loop (every 30 seconds)
    setInterval(() => {
        let changed = false;

        state.plants.forEach(plant => {
            const plantType = PLANT_TYPES[plant.type];

            // Decay based on plant needs
            let waterDecay = 2;
            let sunDecay = 2;

            if (plantType.waterNeed === 'very high') waterDecay = 4;
            else if (plantType.waterNeed === 'high') waterDecay = 3;
            else if (plantType.waterNeed === 'low') waterDecay = 1;
            else if (plantType.waterNeed === 'very low') waterDecay = 0.5;

            if (plantType.sunlightNeed === 'very high') sunDecay = 4;
            else if (plantType.sunlightNeed === 'high') sunDecay = 3;
            else if (plantType.sunlightNeed === 'low') sunDecay = 1;

            plant.water = Math.max(plant.water - waterDecay, 0);
            plant.sunlight = Math.max(plant.sunlight - sunDecay, 0);
            updateHappiness(plant);
            changed = true;
        });

        if (changed) {
            // Refresh selected plant display if there is one
            if (state.selectedPlantId) {
                selectPlant(state.selectedPlantId);
            }
            updateUI();
            renderPlants();
            saveGame();
        }
    }, 30000);

    // Passive carbon generation from healthy plants (every minute)
    setInterval(() => {
        let totalCarbon = 0;

        state.plants.forEach(plant => {
            if (plant.happiness >= 70) {
                const plantType = PLANT_TYPES[plant.type];
                // Generate carbon proportional to health
                const carbonAmount = Math.round(plantType.carbonPerDay * (plant.happiness / 100) / 24);
                totalCarbon += carbonAmount;
            }
        });

        if (totalCarbon > 0) {
            state.carbonSaved += totalCarbon;
            state.stats.totalCarbonSaved += totalCarbon;

            // Check goal
            if (state.carbonSaved >= state.dailyGoal) {
                const bonus = 100;
                state.coins += bonus;
                state.stats.totalCoinsEarned += bonus;
                
                // Update user's EarthCredits
                updateUserEarthCredits(state.coins);
                
                notify(`🎉 Daily goal completed! +${bonus} EarthCredits 🪙`);
                state.carbonSaved = 0;
            }

            updateUI();
            saveGame();
        }
    }, 60000);
}

// ====================
// UTILITIES
// ====================
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ====================
// KEYBOARD SUPPORT
// ====================
document.addEventListener('DOMContentLoaded', () => {
    const renameInput = document.getElementById('renameInput');
    if (renameInput) {
        renameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                confirmRename();
            }
        });
    }
});

// Initialize when window loads
window.onload = init;

// Make functions globally available
window.init = init;
window.buyItem = buyItem;
window.buyPlant = buyPlant;
window.openCarbonLog = openCarbonLog;
window.openLeaderboard = openLeaderboard;
window.showSummary = showSummary;
window.openSettings = openSettings;
window.closeModal = closeModal;
window.openRenameModal = openRenameModal;
window.confirmRename = confirmRename;
window.openRemoveModal = openRemoveModal;
window.confirmRemove = confirmRemove;
window.openPlantDetail = openPlantDetail;
window.selectPlant = selectPlant;
window.useResource = useResource;
window.exportData = exportData;
window.importData = importData;
window.handleImportFile = handleImportFile;
window.confirmReset = confirmReset;
window.notify = notify;
