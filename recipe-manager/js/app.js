// Recipe Manager Application
class RecipeManager {
    constructor() {
        this.recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        this.mealPlan = JSON.parse(localStorage.getItem('mealPlan')) || {};
        this.shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
        this.currentRecipeId = null;
        this.currentIngredients = [];
        this.currentInstructions = [];
        this.currentTab = 'recipes';
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.selectedDate = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderRecipes();
        this.renderCalendar();
        this.renderShoppingList();
        this.switchTab('recipes');
    }

    setupEventListeners() {
        // Tab switching
        document.getElementById('recipes-tab').addEventListener('click', () => this.switchTab('recipes'));
        document.getElementById('planner-tab').addEventListener('click', () => this.switchTab('planner'));
        document.getElementById('shopping-tab').addEventListener('click', () => this.switchTab('shopping'));

        // Recipe form
        document.getElementById('add-recipe-btn').addEventListener('click', () => this.openRecipeModal());
        document.getElementById('close-modal').addEventListener('click', () => this.closeRecipeModal());
        document.getElementById('cancel-recipe').addEventListener('click', () => this.closeRecipeModal());
        document.getElementById('recipe-form').addEventListener('submit', (e) => this.saveRecipe(e));

        // Ingredients and instructions
        document.getElementById('add-ingredient').addEventListener('click', () => this.addIngredient());
        document.getElementById('add-instruction').addEventListener('click', () => this.addInstruction());

        // Search and filter
        document.getElementById('recipe-search').addEventListener('input', (e) => this.handleSearch(e));
        document.getElementById('category-filter').addEventListener('change', (e) => this.handleFilter(e));

        // Recipe detail modal
        document.getElementById('close-detail-modal').addEventListener('click', () => this.closeDetailModal());

        // Meal plan modal
        document.getElementById('close-meal-modal').addEventListener('click', () => this.closeMealModal());

        // Shopping list
        document.getElementById('generate-shopping-list').addEventListener('click', () => this.generateShoppingList());
        document.getElementById('clear-shopping-list').addEventListener('click', () => this.clearShoppingList());
        document.getElementById('export-shopping-list').addEventListener('click', () => this.exportShoppingList());

        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target.id === 'recipe-modal') this.closeRecipeModal();
            if (e.target.id === 'recipe-detail-modal') this.closeDetailModal();
            if (e.target.id === 'meal-plan-modal') this.closeMealModal();
        });
    }

    switchTab(tab) {
        this.currentTab = tab;
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`${tab}-tab`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${tab}-content`).classList.add('active');

        // Render content based on tab
        if (tab === 'recipes') {
            this.renderRecipes();
        } else if (tab === 'planner') {
            this.renderCalendar();
        } else if (tab === 'shopping') {
            this.renderShoppingList();
        }
    }

    openRecipeModal(recipeId = null) {
        this.currentRecipeId = recipeId;
        const modal = document.getElementById('recipe-modal');
        const modalTitle = document.getElementById('modal-title');
        
        if (recipeId) {
            const recipe = this.recipes.find(r => r.id === recipeId);
            modalTitle.textContent = 'Edit Recipe';
            document.getElementById('recipe-name').value = recipe.name;
            document.getElementById('recipe-category').value = recipe.category;
            document.getElementById('recipe-time').value = recipe.time;
            document.getElementById('recipe-servings').value = recipe.servings;
            document.getElementById('recipe-image').value = recipe.image;
            this.currentIngredients = [...recipe.ingredients];
            this.currentInstructions = [...recipe.instructions];
        } else {
            modalTitle.textContent = 'Add New Recipe';
            document.getElementById('recipe-form').reset();
            this.currentIngredients = [];
            this.currentInstructions = [];
        }
        
        this.renderIngredientList();
        this.renderInstructionList();
        modal.style.display = 'block';
    }

    closeRecipeModal() {
        document.getElementById('recipe-modal').style.display = 'none';
        document.getElementById('recipe-form').reset();
        this.currentRecipeId = null;
        this.currentIngredients = [];
        this.currentInstructions = [];
    }

    addIngredient() {
        const ingredient = prompt('Enter ingredient (e.g., "2 cups flour"):');
        if (ingredient && ingredient.trim()) {
            this.currentIngredients.push(ingredient.trim());
            this.renderIngredientList();
        }
    }

    renderIngredientList() {
        const list = document.getElementById('ingredient-list');
        list.innerHTML = this.currentIngredients.map((ing, index) => `
            <div class="ingredient-item">
                <span>${ing}</span>
                <button type="button" class="remove-btn" onclick="recipeManager.removeIngredient(${index})">×</button>
            </div>
        `).join('');
    }

    removeIngredient(index) {
        this.currentIngredients.splice(index, 1);
        this.renderIngredientList();
    }

    addInstruction() {
        const instruction = prompt('Enter instruction step:');
        if (instruction && instruction.trim()) {
            this.currentInstructions.push(instruction.trim());
            this.renderInstructionList();
        }
    }

    renderInstructionList() {
        const list = document.getElementById('instruction-list');
        list.innerHTML = this.currentInstructions.map((inst, index) => `
            <div class="instruction-item">
                <span><strong>Step ${index + 1}:</strong> ${inst}</span>
                <button type="button" class="remove-btn" onclick="recipeManager.removeInstruction(${index})">×</button>
            </div>
        `).join('');
    }

    removeInstruction(index) {
        this.currentInstructions.splice(index, 1);
        this.renderInstructionList();
    }

    saveRecipe(e) {
        e.preventDefault();
        
        const name = document.getElementById('recipe-name').value.trim();
        const category = document.getElementById('recipe-category').value;
        const time = document.getElementById('recipe-time').value;
        const servings = document.getElementById('recipe-servings').value;
        const image = document.getElementById('recipe-image').value.trim();

        if (!name) {
            alert('Please enter a recipe name');
            return;
        }

        if (this.currentIngredients.length === 0) {
            alert('Please add at least one ingredient');
            return;
        }

        if (this.currentInstructions.length === 0) {
            alert('Please add at least one instruction');
            return;
        }

        const recipe = {
            id: this.currentRecipeId || Date.now(),
            name,
            category,
            time: parseInt(time),
            servings: parseInt(servings),
            image: image || 'https://via.placeholder.com/300x200?text=Recipe',
            ingredients: [...this.currentIngredients],
            instructions: [...this.currentInstructions],
            createdAt: this.currentRecipeId ? 
                this.recipes.find(r => r.id === this.currentRecipeId).createdAt : 
                new Date().toISOString()
        };

        if (this.currentRecipeId) {
            const index = this.recipes.findIndex(r => r.id === this.currentRecipeId);
            this.recipes[index] = recipe;
        } else {
            this.recipes.push(recipe);
        }

        this.saveToLocalStorage();
        this.closeRecipeModal();
        this.renderRecipes();
    }

    handleSearch(e) {
        this.currentSearch = e.target.value.toLowerCase();
        this.renderRecipes();
    }

    handleFilter(e) {
        this.currentFilter = e.target.value;
        this.renderRecipes();
    }

    getFilteredRecipes() {
        return this.recipes.filter(recipe => {
            const matchesSearch = recipe.name.toLowerCase().includes(this.currentSearch) ||
                                recipe.ingredients.some(ing => ing.toLowerCase().includes(this.currentSearch));
            const matchesFilter = this.currentFilter === 'all' || recipe.category === this.currentFilter;
            return matchesSearch && matchesFilter;
        });
    }

    renderRecipes() {
        const grid = document.getElementById('recipe-grid');
        const filteredRecipes = this.getFilteredRecipes();

        if (filteredRecipes.length === 0) {
            grid.innerHTML = '<p class="no-recipes">No recipes found. Add your first recipe!</p>';
            return;
        }

        grid.innerHTML = filteredRecipes.map(recipe => `
            <div class="recipe-card" onclick="recipeManager.openRecipeDetail(${recipe.id})">
                <img src="${recipe.image}" alt="${recipe.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Recipe'">
                <div class="recipe-card-content">
                    <h3>${recipe.name}</h3>
                    <div class="recipe-meta">
                        <span class="category-badge">${recipe.category}</span>
                        <span>⏱️ ${recipe.time} min</span>
                        <span>🍽️ ${recipe.servings} servings</span>
                    </div>
                    <div class="recipe-actions">
                        <button class="btn-secondary" onclick="event.stopPropagation(); recipeManager.openRecipeModal(${recipe.id})">Edit</button>
                        <button class="btn-danger" onclick="event.stopPropagation(); recipeManager.deleteRecipe(${recipe.id})">Delete</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    openRecipeDetail(recipeId) {
        const recipe = this.recipes.find(r => r.id === recipeId);
        if (!recipe) return;

        const modal = document.getElementById('recipe-detail-modal');
        const detail = document.getElementById('recipe-detail');

        detail.innerHTML = `
            <div class="recipe-detail-content">
                <img src="${recipe.image}" alt="${recipe.name}" class="recipe-detail-image" onerror="this.src='https://via.placeholder.com/600x400?text=Recipe'">
                <h2>${recipe.name}</h2>
                <div class="recipe-detail-meta">
                    <span class="category-badge">${recipe.category}</span>
                    <span>⏱️ ${recipe.time} minutes</span>
                    <span>🍽️ ${recipe.servings} servings</span>
                </div>
                <div class="recipe-section">
                    <h3>Ingredients</h3>
                    <ul class="ingredients-list">
                        ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                    </ul>
                </div>
                <div class="recipe-section">
                    <h3>Instructions</h3>
                    <ol class="instructions-list">
                        ${recipe.instructions.map(inst => `<li>${inst}</li>`).join('')}
                    </ol>
                </div>
            </div>
        `;

        modal.style.display = 'block';
    }

    closeDetailModal() {
        document.getElementById('recipe-detail-modal').style.display = 'none';
    }

    deleteRecipe(recipeId) {
        if (!confirm('Are you sure you want to delete this recipe?')) return;

        this.recipes = this.recipes.filter(r => r.id !== recipeId);
        
        // Remove from meal plan
        Object.keys(this.mealPlan).forEach(date => {
            this.mealPlan[date] = this.mealPlan[date].filter(id => id !== recipeId);
            if (this.mealPlan[date].length === 0) {
                delete this.mealPlan[date];
            }
        });

        this.saveToLocalStorage();
        this.renderRecipes();
        this.renderCalendar();
    }

    renderCalendar() {
        const calendar = document.getElementById('meal-calendar');
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        let html = '<div class="calendar-grid">';
        
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            const isToday = dateStr === today.toISOString().split('T')[0];
            
            const meals = this.mealPlan[dateStr] || [];
            const mealRecipes = meals.map(id => this.recipes.find(r => r.id === id)).filter(r => r);

            html += `
                <div class="calendar-day ${isToday ? 'today' : ''}">
                    <div class="calendar-day-header">
                        <h4>${days[i]}</h4>
                        <p>${date.getDate()}/${date.getMonth() + 1}</p>
                    </div>
                    <div class="calendar-meals">
                        ${mealRecipes.map(recipe => `
                            <div class="meal-item">
                                <span>${recipe.name}</span>
                                <button class="remove-meal-btn" onclick="recipeManager.removeMealFromPlan('${dateStr}', ${recipe.id})">×</button>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn-add-meal" onclick="recipeManager.openMealModal('${dateStr}')">+ Add Meal</button>
                </div>
            `;
        }
        
        html += '</div>';
        calendar.innerHTML = html;
    }

    openMealModal(dateStr) {
        this.selectedDate = dateStr;
        const modal = document.getElementById('meal-plan-modal');
        const dateInput = document.getElementById('meal-plan-date');
        const selection = document.getElementById('recipe-selection');

        dateInput.value = dateStr;

        selection.innerHTML = `
            <select id="recipe-select" class="form-input">
                <option value="">Select a recipe</option>
                ${this.recipes.map(recipe => `
                    <option value="${recipe.id}">${recipe.name}</option>
                `).join('')}
            </select>
            <button type="button" class="btn-primary" onclick="recipeManager.addMealToPlan()">Add to Plan</button>
        `;

        modal.style.display = 'block';
    }

    closeMealModal() {
        document.getElementById('meal-plan-modal').style.display = 'none';
        this.selectedDate = null;
    }

    addMealToPlan() {
        const select = document.getElementById('recipe-select');
        const recipeId = parseInt(select.value);
        
        if (!recipeId) {
            alert('Please select a recipe');
            return;
        }

        if (!this.mealPlan[this.selectedDate]) {
            this.mealPlan[this.selectedDate] = [];
        }

        if (!this.mealPlan[this.selectedDate].includes(recipeId)) {
            this.mealPlan[this.selectedDate].push(recipeId);
            this.saveToLocalStorage();
            this.renderCalendar();
            this.closeMealModal();
        } else {
            alert('This recipe is already in the meal plan for this day');
        }
    }

    removeMealFromPlan(dateStr, recipeId) {
        if (!confirm('Remove this meal from the plan?')) return;

        this.mealPlan[dateStr] = this.mealPlan[dateStr].filter(id => id !== recipeId);
        if (this.mealPlan[dateStr].length === 0) {
            delete this.mealPlan[dateStr];
        }

        this.saveToLocalStorage();
        this.renderCalendar();
    }

    generateShoppingList() {
        const ingredients = new Map();

        Object.values(this.mealPlan).forEach(meals => {
            meals.forEach(recipeId => {
                const recipe = this.recipes.find(r => r.id === recipeId);
                if (recipe) {
                    recipe.ingredients.forEach(ing => {
                        const count = ingredients.get(ing) || 0;
                        ingredients.set(ing, count + 1);
                    });
                }
            });
        });

        this.shoppingList = Array.from(ingredients.entries()).map(([ingredient, count]) => ({
            ingredient,
            count,
            checked: false
        }));

        this.saveToLocalStorage();
        this.renderShoppingList();
        this.switchTab('shopping');
    }

    renderShoppingList() {
        const list = document.getElementById('shopping-list');

        if (this.shoppingList.length === 0) {
            list.innerHTML = '<p class="no-items">No items in shopping list. Generate from meal plan!</p>';
            return;
        }

        list.innerHTML = this.shoppingList.map((item, index) => `
            <div class="shopping-item ${item.checked ? 'checked' : ''}">
                <input type="checkbox" 
                       ${item.checked ? 'checked' : ''} 
                       onchange="recipeManager.toggleShoppingItem(${index})">
                <span>${item.ingredient} ${item.count > 1 ? `(×${item.count})` : ''}</span>
                <button class="remove-btn" onclick="recipeManager.removeShoppingItem(${index})">×</button>
            </div>
        `).join('');
    }

    toggleShoppingItem(index) {
        this.shoppingList[index].checked = !this.shoppingList[index].checked;
        this.saveToLocalStorage();
        this.renderShoppingList();
    }

    removeShoppingItem(index) {
        this.shoppingList.splice(index, 1);
        this.saveToLocalStorage();
        this.renderShoppingList();
    }

    clearShoppingList() {
        if (!confirm('Clear entire shopping list?')) return;
        this.shoppingList = [];
        this.saveToLocalStorage();
        this.renderShoppingList();
    }

    exportShoppingList() {
        if (this.shoppingList.length === 0) {
            alert('Shopping list is empty');
            return;
        }

        const content = `SHOPPING LIST\nGenerated: ${new Date().toLocaleDateString()}\n\n` +
            this.shoppingList.map(item => 
                `${item.checked ? '☑' : '☐'} ${item.ingredient} ${item.count > 1 ? `(×${item.count})` : ''}`
            ).join('\n');

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, `shopping-list-${new Date().toISOString().split('T')[0]}.txt`);
    }

    saveToLocalStorage() {
        localStorage.setItem('recipes', JSON.stringify(this.recipes));
        localStorage.setItem('mealPlan', JSON.stringify(this.mealPlan));
        localStorage.setItem('shoppingList', JSON.stringify(this.shoppingList));
    }
}

// Initialize the app
const recipeManager = new RecipeManager();

// Add some sample recipes if none exist
if (recipeManager.recipes.length === 0) {
    const sampleRecipes = [
        {
            id: 1,
            name: 'Spaghetti Carbonara',
            category: 'dinner',
            time: 30,
            servings: 4,
            image: 'https://via.placeholder.com/300x200?text=Spaghetti+Carbonara',
            ingredients: [
                '400g spaghetti',
                '200g pancetta',
                '4 eggs',
                '100g parmesan cheese',
                'Black pepper',
                'Salt'
            ],
            instructions: [
                'Cook spaghetti according to package directions',
                'Fry pancetta until crispy',
                'Beat eggs with parmesan cheese',
                'Drain pasta and mix with pancetta',
                'Remove from heat and stir in egg mixture',
                'Season with pepper and serve'
            ],
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            name: 'Greek Salad',
            category: 'salad',
            time: 15,
            servings: 2,
            image: 'https://via.placeholder.com/300x200?text=Greek+Salad',
            ingredients: [
                '2 tomatoes',
                '1 cucumber',
                '1 red onion',
                '200g feta cheese',
                'Kalamata olives',
                'Olive oil',
                'Oregano'
            ],
            instructions: [
                'Chop tomatoes and cucumber into chunks',
                'Slice red onion thinly',
                'Combine vegetables in a bowl',
                'Add olives and cubed feta',
                'Drizzle with olive oil',
                'Sprinkle with oregano and serve'
            ],
            createdAt: new Date().toISOString()
        },
        {
            id: 3,
            name: 'Chocolate Chip Cookies',
            category: 'dessert',
            time: 25,
            servings: 24,
            image: 'https://via.placeholder.com/300x200?text=Chocolate+Chip+Cookies',
            ingredients: [
                '2 cups flour',
                '1 cup butter',
                '1 cup sugar',
                '2 eggs',
                '2 cups chocolate chips',
                '1 tsp vanilla extract',
                '1 tsp baking soda'
            ],
            instructions: [
                'Preheat oven to 375°F',
                'Cream butter and sugar',
                'Beat in eggs and vanilla',
                'Mix in flour and baking soda',
                'Stir in chocolate chips',
                'Drop spoonfuls onto baking sheet',
                'Bake for 10-12 minutes'
            ],
            createdAt: new Date().toISOString()
        }
    ];

    recipeManager.recipes = sampleRecipes;
    recipeManager.saveToLocalStorage();
    recipeManager.renderRecipes();
}