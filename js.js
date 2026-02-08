// Garden State - Connected to Dashboard
let state = {
    coins: 0,
    water: 20,
    sunlight: 20,
    carbonSaved: 0,
    dailyGoal: 500,
    selectedPlantId: null,
    renamingPlantId: null,
    removingPlantId: null,
    plants: []
};

// Carbon saving activities for random events
const carbonActivities = [
    { text: 'Walked to work', amount: 50 },
    { text: 'Used reusable bag', amount: 30 },
    { text: 'Ate plant-based meal', amount: 80 },
    { text: 'Recycled materials', amount: 40 },
    { text: 'Took public transport', amount: 60 },
    { text: 'Used renewable energy', amount: 70 },
    { text: 'Composted waste', amount: 35 }
];

// Achievement tracking
const achievements = {
    'first-sprout': { unlocked: false, condition: (state) => state.plants.length >= 1 },
    'water-master': { unlocked: false, condition: (state) => false }, // Track separately
    'forest-guardian': { unlocked: false, condition: (state) => state.plants.filter(p => p.stage === 'Mature').length >= 5 },
    'planet-saver': { unlocked: false, condition: (state) => state.carbonSaved >= 10000 }, // 10kg in grams
    'top-gardener': { unlocked: false, condition: (state) => false }, // Leaderboard based
    'coin-collector': { unlocked: false, condition: (state) => state.coins >= 1000 }
};

// Water usage tracking
let waterUsageCount = 0;

// ==================== DASHBOARD INTEGRATION ====================
function loadGardenData() {
    console.log('Loading garden data from dashboard...');
    
    const currentUserId = localStorage.getItem('currentUserId');
    let users = JSON.parse(localStorage.getItem('users') || '{}');
    let currentUser = users[currentUserId] || {};
    
    // Get data from dashboard
    const earthCredits = currentUser.earthCredits || 0;
    const totalKgSaved = currentUser.totalKgSaved || 0;
    const dashboardPlants = currentUser.plants || [];
    const purchases = currentUser.purchases || [];
    
    console.log('Dashboard data:', {
        earthCredits,
        totalKgSaved,
        dashboardPlants,
        purchases
    });
    
    // Update state with dashboard data
    state.coins = earthCredits;
    state.carbonSaved = Math.round(totalKgSaved * 1000); // Convert kg to grams
    
    // Load water and sunlight from purchases
    state.water = 20; // Base amount
    state.sunlight = 20; // Base amount
    
    purchases.forEach(purchase => {
        if (purchase.item === 'water') {
            state.water += 10;
        } else if (purchase.item === 'sunlight') {
            state.sunlight += 10;
        }
    });
    
    // Convert dashboard plants to garden plants format
    if (dashboardPlants.length > 0) {
        state.plants = dashboardPlants.map((plantType, index) => {
            const plantEmoji = {
                'Lily': '🌸',
                'Tulip': '🌷',
                'Rose': '🌹',
                'Sunflower': '🌻'
            }[plantType] || '🌱';
            
            // Check if plant already exists in state to preserve stats
            const existingPlant = state.plants.find(p => 
                p.type === plantType.toLowerCase() || p.name === plantType
            );
            
            if (existingPlant) {
                return existingPlant;
            }
            
            return {
                id: Date.now() + index,
                name: plantType,
                type: plantType.toLowerCase(),
                emoji: plantEmoji,
                stage: 'Mature',
                water: 100,
                sunlight: 100,
                happiness: 100
            };
        });
    }
    
    console.log('Loaded garden state:', state);
    
    // Initialize the garden
    init();
    
    // Update achievements
    updateAchievements();
}

function saveGardenState() {
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) {
        console.log('No user logged in, cannot save garden state');
        return;
    }
    
    let users = JSON.parse(localStorage.getItem('users') || '{}');
    let currentUser = users[currentUserId] || {};
    
    // Update dashboard data with garden state
    currentUser.earthCredits = state.coins;
    currentUser.totalKgSaved = state.carbonSaved / 1000; // Convert grams to kg
    
    // Convert garden plants back to dashboard format
    if (state.plants.length > 0) {
        const plantTypeMap = {
            '🌸': 'Lily',
            '🌷': 'Tulip',
            '🌹': 'Rose',
            '🌻': 'Sunflower'
        };
        
        currentUser.plants = state.plants.map(p => {
            return plantTypeMap[p.emoji] || p.name;
        });
    }
    
    // Save water/sunlight purchases
    const baseResources = 20; // Base amount
    const waterPurchases = Math.max(0, Math.floor((state.water - baseResources) / 10));
    const sunlightPurchases = Math.max(0, Math.floor((state.sunlight - baseResources) / 10));
    
    // Update purchases in dashboard
    if (!currentUser.purchases) currentUser.purchases = [];
    
    // Filter out existing resource purchases
    currentUser.purchases = currentUser.purchases.filter(p => 
        !['water', 'sunlight'].includes(p.item)
    );
    
    // Add current resource purchases
    for (let i = 0; i < waterPurchases; i++) {
        currentUser.purchases.push({
            item: 'water',
            price: 20,
            date: new Date().toISOString()
        });
    }
    
    for (let i = 0; i < sunlightPurchases; i++) {
        currentUser.purchases.push({
            item: 'sunlight',
            price: 20,
            date: new Date().toISOString()
        });
    }
    
    // Save back to localStorage
    users[currentUserId] = currentUser;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    console.log('Garden state saved to dashboard:', {
        earthCredits: currentUser.earthCredits,
        totalKgSaved: currentUser.totalKgSaved,
        plants: currentUser.plants,
        purchases: currentUser.purchases
    });
}

function refreshFromDashboard() {
    console.log('Refreshing from dashboard...');
    loadGardenData();
    notify('🔄 Garden data refreshed from dashboard!');
}

// ==================== GARDEN FUNCTIONS ====================
function init() {
    console.log('Initializing garden...');
    renderPlants();
    updateUI();
    startGameLoops();
}

function renderPlants() {
    const grid = document.getElementById('plantsGrid');
    if (!grid) {
        console.error('plantsGrid element not found!');
        return;
    }
    
    grid.innerHTML = '';

    const maxSlots = 6;
    
    // Display user's plants
    for (let i = 0; i < maxSlots; i++) {
        if (i < state.plants.length) {
            const plant = state.plants[i];
            const card = document.createElement('div');
            card.className = 'plant-card';
            
            if (state.selectedPlantId === plant.id) {
                card.classList.add('selected');
            }

            card.onclick = (e) => {
                if (!e.target.closest('.plant-action-btn')) {
                    selectPlant(plant.id);
                }
            };

            card.innerHTML = `
                <div class="plant-header">
                    <div class="plant-icon">${plant.emoji}</div>
                    <div class="plant-info">
                        <div class="plant-name">${plant.name}</div>
                        <div class="plant-stage">${plant.stage}</div>
                    </div>
                    <div class="plant-actions">
                        <button class="plant-action-btn edit-btn" onclick="event.stopPropagation(); openRenameModal(${plant.id})" title="Rename plant">
                            🖊️
                        </button>
                        <button class="plant-action-btn remove-btn" onclick="event.stopPropagation(); openRemoveModal(${plant.id})" title="Remove plant">
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
                        <div class="mini-stat-icon">💖</div>
                        <div class="mini-stat-value">${plant.happiness}%</div>
                    </div>
                </div>
            `;

            grid.appendChild(card);
        } else {
            // Empty slot
            const emptyCard = document.createElement('div');
            emptyCard.className = 'plant-card empty';
            
            if (i === state.plants.length && state.plants.length < maxSlots) {
                // Next empty slot - show add plant prompt
                emptyCard.innerHTML = `
                    <div class="empty-slot-content">
                        <div class="add-plant-box">
                            <span class="plus-icon">+</span>
                        </div>
                        <div style="margin-top: 15px;">Add a Plant</div>
                        <div style="font-size: 0.85em; margin-top: 5px; color: var(--text-muted);">Buy from the store!</div>
                    </div>
                `;
                emptyCard.onclick = () => {
                    notify('🌱 Buy a plant from the store to add to your garden!');
                };
            } else {
                // Regular empty slot
                emptyCard.innerHTML = `
                    <div class="empty-slot-content">
                        <div class="empty-slot-icon">🌱</div>
                        <div>Empty Slot</div>
                    </div>
                `;
            }
            
            grid.appendChild(emptyCard);
        }
    }
}

function selectPlant(id) {
    state.selectedPlantId = id;
    const plant = state.plants.find(p => p.id === id);

    if (plant) {
        document.getElementById('detailIcon').innerHTML = plant.emoji;
        document.getElementById('detailName').textContent = plant.name;
        document.getElementById('detailStage').textContent = plant.stage;

        document.getElementById('waterStat').textContent = plant.water + '%';
        document.getElementById('waterBar').style.width = plant.water + '%';

        document.getElementById('sunStat').textContent = plant.sunlight + '%';
        document.getElementById('sunBar').style.width = plant.sunlight + '%';

        document.getElementById('happyStat').textContent = plant.happiness + '%';
        document.getElementById('happyBar').style.width = plant.happiness + '%';

        document.getElementById('statGroup').style.display = 'flex';
        document.getElementById('plantPreview').classList.add('active');

        // Highlight usable items
        if (plant.water < 100) {
            document.getElementById('waterItem').classList.add('usable');
        } else {
            document.getElementById('waterItem').classList.remove('usable');
        }

        if (plant.sunlight < 100) {
            document.getElementById('sunItem').classList.add('usable');
        } else {
            document.getElementById('sunItem').classList.remove('usable');
        }
    }

    renderPlants();
}

function updateUI() {
    // Update all UI elements with current state
    const coinDisplay = document.getElementById('coinDisplay');
    const storeCoinsDisplay = document.getElementById('storeCoinsDisplay');
    const waterStorage = document.getElementById('waterStorage');
    const sunInventory = document.getElementById('sunInventory');
    const missionText = document.getElementById('missionText');
    const goalBar = document.getElementById('goalBar');
    const goalText = document.getElementById('goalText');
    
    if (coinDisplay) coinDisplay.textContent = state.coins;
    if (storeCoinsDisplay) storeCoinsDisplay.textContent = state.coins;
    if (waterStorage) waterStorage.textContent = state.water;
    if (sunInventory) sunInventory.textContent = state.sunlight;
    if (missionText) missionText.textContent = `${state.carbonSaved}g / ${state.dailyGoal}g CO₂`;

    const goalPercent = Math.min((state.carbonSaved / state.dailyGoal) * 100, 100);
    if (goalBar) goalBar.style.width = goalPercent + '%';
    if (goalText) goalText.textContent = `${state.carbonSaved} / ${state.dailyGoal}g CO₂`;

    if (state.selectedPlantId) {
        const plant = state.plants.find(p => p.id === state.selectedPlantId);
        if (plant) {
            selectPlant(state.selectedPlantId);
        }
    }
}

function useResource(type) {
    if (!state.selectedPlantId) {
        notify('❌ Select a plant first!', 'error');
        return;
    }

    const plant = state.plants.find(p => p.id === state.selectedPlantId);
    if (!plant) {
        notify('❌ Plant not found!', 'error');
        return;
    }

    if (type === 'water' && state.water > 0) {
        if (plant.water < 100) {
            state.water--;
            plant.water = Math.min(plant.water + 25, 100);
            waterUsageCount++;
            updateHappiness(plant);
            notify('💧 Watered ' + plant.name);
            updateUI();
            
            // Check water master achievement
            if (waterUsageCount >= 10 && !achievements['water-master'].unlocked) {
                achievements['water-master'].unlocked = true;
                updateAchievements();
                notify('🏆 Achievement Unlocked: Water Master!');
            }
            
            saveGardenState();
        } else {
            notify('💧 Plant is fully watered!', 'error');
        }
    } else if (type === 'sunlight' && state.sunlight > 0) {
        if (plant.sunlight < 100) {
            state.sunlight--;
            plant.sunlight = Math.min(plant.sunlight + 25, 100);
            updateHappiness(plant);
            notify('🌤️ Gave sunlight to ' + plant.name);
            updateUI();
            saveGardenState();
        } else {
            notify('🌤️ Plant has enough sunlight!', 'error');
        }
    } else {
        notify('❌ Not enough resources!', 'error');
    }

    renderPlants();
}

function updateHappiness(plant) {
    plant.happiness = Math.round((plant.water + plant.sunlight) / 2);

    // Stage evolution
    if (plant.happiness > 85 && plant.stage === 'Seedling') {
        plant.stage = 'Young';
        notify(`🌱 ${plant.name} grew to Young stage!`);
    } else if (plant.happiness > 95 && plant.stage === 'Young') {
        plant.stage = 'Mature';
        notify(`🌸 ${plant.name} is now Mature!`);
        
        // Check forest guardian achievement
        const maturePlants = state.plants.filter(p => p.stage === 'Mature').length;
        if (maturePlants >= 5 && !achievements['forest-guardian'].unlocked) {
            achievements['forest-guardian'].unlocked = true;
            updateAchievements();
            notify('🏆 Achievement Unlocked: Forest Guardian!');
        }
    }
}

function buyItem(type, qty, price) {
    if (state.coins >= price) {
        state.coins -= price;

        if (type === 'water') {
            state.water += qty;
        } else if (type === 'sunlight') {
            state.sunlight += qty;
        }

        notify(`✅ Purchased ${qty}x ${type}`);
        updateUI();
        saveGardenState();
        
        // Check coin collector achievement
        if (state.coins >= 1000 && !achievements['coin-collector'].unlocked) {
            achievements['coin-collector'].unlocked = true;
            updateAchievements();
            notify('🏆 Achievement Unlocked: Coin Collector!');
        }
    } else {
        notify('❌ Not enough EarthCredits!', 'error');
    }
}

function buyPlant(name, emoji, price, type) {
    if (state.coins >= price) {
        if (state.plants.length >= 6) {
            notify('❌ Garden is full! Maximum 6 plants allowed.', 'error');
            return;
        }

        state.coins -= price;

        const newPlant = {
            id: Date.now(),
            name: name,
            type: type,
            emoji: emoji,
            stage: 'Seedling',
            water: 100,
            sunlight: 100,
            happiness: 100
        };

        state.plants.push(newPlant);
        notify(`🌱 Planted ${name}!`);
        renderPlants();
        updateUI();
        saveGardenState();
        
        // Check first sprout achievement
        if (state.plants.length === 1 && !achievements['first-sprout'].unlocked) {
            achievements['first-sprout'].unlocked = true;
            updateAchievements();
            notify('🏆 Achievement Unlocked: First Sprout!');
        }
        
        // Check coin collector achievement
        if (state.coins >= 1000 && !achievements['coin-collector'].unlocked) {
            achievements['coin-collector'].unlocked = true;
            updateAchievements();
            notify('🏆 Achievement Unlocked: Coin Collector!');
        }
    } else {
        notify('❌ Not enough EarthCredits!', 'error');
    }
}

function notify(message, type = 'success') {
    const notif = document.createElement('div');
    notif.className = 'notification' + (type === 'error' ? ' error' : '');

    const icon = type === 'error' ? '❌' : '🔔';
    notif.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <div class="notification-text">${message}</div>
    `;

    document.body.appendChild(notif);

    setTimeout(() => {
        notif.remove();
    }, 3000);
}

// ==================== MODAL FUNCTIONS ====================
function openLeaderboard() {
    const leaderboard = [
        { name: 'EcoWarrior 🌍', carbon: 15420, isUser: false },
        { name: 'GreenThumb 🌿', carbon: 12890, isUser: false },
        { name: 'You 🌱', carbon: state.carbonSaved, isUser: true },
        { name: 'PlantLover 🌸', carbon: 9560, isUser: false },
        { name: 'NatureFan 🍃', carbon: 7340, isUser: false },
        { name: 'EcoHero 💚', carbon: 6120, isUser: false }
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
    
    // Check top gardener achievement
    if (leaderboard[0].isUser && !achievements['top-gardener'].unlocked) {
        achievements['top-gardener'].unlocked = true;
        updateAchievements();
        notify('🏆 Achievement Unlocked: Top Gardener!');
    }
}

function showSummary() {
    const healthyPlants = state.plants.filter(p => p.happiness > 70).length;

    const summaryData = [
        { icon: '🌱', value: state.plants.length, label: 'Total Plants' },
        { icon: '💖', value: healthyPlants, label: 'Healthy Plants' },
        { icon: '♻️', value: state.carbonSaved + 'g', label: 'Carbon Saved' },
        { icon: '🪙', value: state.coins, label: 'EarthCredits' },
        { icon: '💧', value: state.water, label: 'Water Stock' },
        { icon: '🌤️', value: state.sunlight, label: 'Sunlight Stock' }
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

    document.getElementById('summaryModal').classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

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
        notify('❌ Please enter a name!', 'error');
        return;
    }
    
    const plant = state.plants.find(p => p.id === state.renamingPlantId);
    
    if (plant) {
        const oldName = plant.name;
        plant.name = newName;
        notify(`✏️ Renamed ${oldName} to ${newName}`);
        
        if (state.selectedPlantId === plant.id) {
            document.getElementById('detailName').textContent = plant.name;
        }
        
        renderPlants();
        saveGardenState();
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
        const plantName = plant.name;
        
        state.plants.splice(plantIndex, 1);
        
        if (state.selectedPlantId === state.removingPlantId) {
            state.selectedPlantId = null;
            document.getElementById('statGroup').style.display = 'none';
            document.getElementById('plantPreview').classList.remove('active');
            document.getElementById('detailIcon').innerHTML = '<span class="plus-icon">+</span>';
            document.getElementById('detailName').textContent = 'Select a Plant';
            document.getElementById('detailStage').textContent = 'No plant selected';
        }
        
        notify(`🗑️ Removed ${plantName} from your garden`);
        renderPlants();
        saveGardenState();
    }
    
    closeModal('removeModal');
    state.removingPlantId = null;
}

// ==================== ACHIEVEMENTS ====================
function updateAchievements() {
    // Update achievement UI
    Object.keys(achievements).forEach(achievementId => {
        const achievement = achievements[achievementId];
        const element = document.getElementById(`achievement-${achievementId}`);
        
        if (element) {
            if (achievement.unlocked) {
                element.classList.add('unlocked');
                element.classList.remove('locked');
            } else {
                element.classList.remove('unlocked');
                element.classList.add('locked');
            }
        }
    });
}

// ==================== GAME LOOPS ====================
function startGameLoops() {
    // Decay plants every 30 seconds
    setInterval(() => {
        state.plants.forEach(plant => {
            plant.water = Math.max(plant.water - 5, 0);
            plant.sunlight = Math.max(plant.sunlight - 5, 0);
            updateHappiness(plant);
        });
        updateUI();
        renderPlants();
        saveGardenState();
    }, 30000);

    // Random carbon events every 45 seconds
    setInterval(() => {
        if (Math.random() > 0.6 && state.plants.length > 0) {
            const activity = carbonActivities[Math.floor(Math.random() * carbonActivities.length)];
            state.carbonSaved += activity.amount;

            notify(`♻️ ${activity.text} (+${activity.amount}g CO₂)`);

            // Check goal completion
            if (state.carbonSaved >= state.dailyGoal) {
                state.coins += 100;
                notify('🎉 Daily goal completed! +100 EarthCredits!');
                state.carbonSaved = 0;
                
                // Check coin collector achievement
                if (state.coins >= 1000 && !achievements['coin-collector'].unlocked) {
                    achievements['coin-collector'].unlocked = true;
                    updateAchievements();
                    notify('🏆 Achievement Unlocked: Coin Collector!');
                }
            }
            
            // Check planet saver achievement
            if (state.carbonSaved >= 10000 && !achievements['planet-saver'].unlocked) {
                achievements['planet-saver'].unlocked = true;
                updateAchievements();
                notify('🏆 Achievement Unlocked: Planet Saver!');
            }

            updateUI();
            saveGardenState();
        }
    }, 45000);
    
    // Auto-refresh from dashboard every 60 seconds
    setInterval(() => {
        refreshFromDashboard();
    }, 60000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Garden page loaded, initializing...');
    
    // Check if user is logged in
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) {
        console.log('No user logged in, redirecting to index...');
        window.location.href = 'index.html';
        return;
    }
    
    // Load garden data from dashboard
    loadGardenData();
});