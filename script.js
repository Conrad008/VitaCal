let fooditems = [];

const foodForm = document.getElementById('food-form');
const foodNameInput = document.getElementById('food-name');
const calorieInput = document.getElementById('calorie-amount');
const foodList = document.getElementById('food-list');
const totalCaloriesDisplay = document.getElementById('total-calories');
const resetBtn = document.getElementById('reset-btn');
const emptyState = document.getElementById('empty-state');
const fetchSuggestionBtn = document.getElementById('suggestion-btn');
const suggestionDisplay = document.getElementById('suggestion-display');

const updateAppState = () => {
    localStorage.setItem('VitaCal_foods', JSON.stringify(foodItems));
    render();
};

/**
 * Handles adding a new item to the data array.
 * @param {string} name - Name of the food item
 * @param {number} calories - Amount of calories
 */
const addFoodItem = (name, calories) => {
    let uniqueId;
    if (crypto.randomUUID){
        uniqueId = crypto.randomUUID();
    }

    else {
        uniqueId = Date.now().toString();
    }
    const newItem = {
        id: uniqueId,
        name: name.trim(),
        calories: parseInt(calories, 10)
    };
    foodItems.push(newItem);
    updateAppState();
};

/**
 * @param {string} id - The ID of the item to purge
 */
const removeFoodItem = (id) => {
    foodItems = foodItems.filter(item => item.id !== id);
    updateAppState();
};

/**
 * Resets the daily consumption log back to an empty slate.
 */
const resetDay = () => {
    if (confirm('Are you sure you want to reset today\'s food log? This action cannot be undone.')) {
        foodItems = [];
        updateAppState();
    }
};

const fetchFoodSuggestion = async () => {
    suggestionDisplay.classList.remove('hidden');
    suggestionDisplay.textContent = "Fetching suggestion...";
    
    try {
        // Utilizing JSONPlaceholder to simulate data fetch, then mapping it to nutritious data mockups
        const response = await fetch('https://jsonplaceholder.typicode.com/todos/');
        if (!response.ok) throw new Error('Network response failure.');
        
        // Simulating parsing of nutritional API responses
        const mockHealthySnacks = [
            { name: "Greek Yogurt with Berries", calories: 180 },
            { name: "A Handful of Almonds", calories: 160 },
            { name: "Hummus and Carrots", calories: 140 },
            { name: "Sliced Apple with Peanut Butter", calories: 200 },
            { name: "Boiled Egg with Paprika", calories: 75 }
        ];
        
        // Pick a random snack from the mock pool
        const randomSnack = mockHealthySnacks[Math.floor(Math.random() * mockHealthySnacks.length)];
        
        // Output result to user with an inline button to auto-add it
        suggestionDisplay.innerHTML = `
            <div class="flex justify-between items-center">
                <span>💡 <strong>${randomSnack.name}</strong> (~${randomSnack.calories} kcal)</span>
                <button type="button" onclick="quickAdd('${randomSnack.name}', ${randomSnack.calories})" 
                    class="text-xs bg-[#87CEEB] hover:bg-[#87CEEB] text-white font-bold px-2 py-0.5 rounded transition">
                    + Add
                </button>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching data:', error);
        suggestionDisplay.textContent = "Could not load suggestions right now.";
    }
};

/**
 * Global helper function to instantly hook into simulated API suggestions.
 */
window.quickAdd = (name, calories) => {
    addFoodItem(name, calories);
    suggestionDisplay.classList.add('hidden');
};


