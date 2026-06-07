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
            { name: "Ugali, kales and chicken", calories: 225 },
            { name: "BLT sandwich", calories: 125 },
            { name: "Rice and tilapia", calories: 105 },
            { name: "2 chapatis and legumes(beans,lentils...)", calories: 200 },
            { name: "Mashed potatoes and beef stew", calories:198},
            { name: "granola bar", calories:100},
        ];
        
        // Pick a random snack from the mock pool
        const randomSnack = mockHealthySnacks[Math.floor(Math.random() * mockHealthySnacks.length)];
        
        // Output result to user with an inline button to auto-add it
        suggestionDisplay.innerHTML = `
            <div class="flex justify-between items-center">
                <span><strong>${randomSnack.name}</strong> (~${randomSnack.calories} kcal)</span>
                <button type="button" onclick="quickAdd('${randomSnack.name}', ${randomSnack.calories})" 
                    class="text-xs bg-[#87CEEB] hover:bg-[#379ec7] cursor text-white font-bold px-2 py-0.5 rounded transition">
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


const render = () => {
    // Clear out current rendered view elements
    foodList.innerHTML = '';
    
    
    if (foodItems.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }

    
    foodItems.forEach(item => {
        const li = document.createElement('li');
        li.className = "flex justify-between items-center px-6 py-3 hover:bg-gray-50 transition duration-150";
        li.innerHTML = `
            <div class="flex flex-col">
                <span class="text-sm font-semibold text-gray-700">${item.name}</span>
                <span class="text-xs text-gray-400">${item.calories} kcal</span>
            </div>
            <button aria-label="Remove item" class="text-gray-400 hover:text-rose-500
             transition duration-150 p-1 cursor-pointer" data-id="${item.id}">
             Remove
            </button>
        `;
        foodList.appendChild(li);
    });

    const aggregateCalories = foodItems.reduce((acc, currentItem) => acc + currentItem.calories, 0);
    totalCaloriesDisplay.textContent = aggregateCalories.toLocaleString();
};

foodForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addFoodItem(foodNameInput.value, calorieInput.value);
    foodForm.reset();
    foodNameInput.focus();
});

// Event delegation pattern handling dynamic list removal actions
foodList.addEventListener('click', (e) => {
    const deleteButton = e.target.closest('button[data-id]');
    if (deleteButton) {
        const targetId = deleteButton.getAttribute('data-id');
        removeFoodItem(targetId);
    }
});

// Bind manual operations
resetBtn.addEventListener('click', resetDay);
fetchSuggestionBtn.addEventListener('click', fetchFoodSuggestion);

// Initialize application on load
(() => {
    const localDatabaseContent = localStorage.getItem('nutriTrack_foods');
    if (localDatabaseContent) {
        try {
            foodItems = JSON.parse(localDatabaseContent);
        } catch (e) {
            console.error('State extraction failure. Dropping invalid tables.');
            foodItems = [];
        }
    }
    render();
})();