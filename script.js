const fooditems = [];

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