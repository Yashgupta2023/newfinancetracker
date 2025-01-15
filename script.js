let users = JSON.parse(localStorage.getItem('users')) || [];  // Fetch users from localStorage
let currentUser = null;
let currentBudget = 0;
let totalExpenses = 0;

const authSection = document.getElementById('auth-section');
const welcomeSection = document.getElementById('welcome-section');
const appSection = document.getElementById('app-section');
const userNameDisplay = document.getElementById('user-name');
const budgetDisplay = document.getElementById('budget-display');
const remainingBudgetDisplay = document.getElementById('remaining-budget');
const expenseList = document.getElementById('expense-list');
const allExpensesList = document.getElementById('all-expenses-list');

document.getElementById('toggle-link').addEventListener('click', toggleAuthMode);

function toggleAuthMode() {
    const authTitle = document.getElementById('auth-title');
    const authButton = document.getElementById('auth-button');
    const toggleText = document.getElementById('toggle-auth');

    if (authTitle.textContent === 'Sign Up') {
        authTitle.textContent = 'Login';
        authButton.textContent = 'Login';
        toggleText.innerHTML = 'Don\'t have an account? <span id="toggle-link">Sign Up</span>';
    } else {
        authTitle.textContent = 'Sign Up';
        authButton.textContent = 'Sign Up';
        toggleText.innerHTML = 'Already have an account? <span id="toggle-link">Login</span>';
    }
    document.getElementById('toggle-link').addEventListener('click', toggleAuthMode);
}

document.getElementById('auth-button').addEventListener('click', handleAuth);

function handleAuth() {
    const name = document.getElementById('name').value.trim();
    const contact = document.getElementById('contact').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!name || !contact || !username || !password) {
        alert('Please fill in all fields.');
        return;
    }

    // Always fetch the latest users from localStorage before attempting login or sign-up
    users = JSON.parse(localStorage.getItem('users')) || [];

    if (document.getElementById('auth-title').textContent === 'Sign Up') {
        if (users.some(user => user.username === username)) {
            alert('Username already exists. Please choose a different one.');
            return;
        }
        users.push({ name, contact, username, password, budget: 0, expenses: [] });
        localStorage.setItem('users', JSON.stringify(users));  // Save updated users
        alert('Sign Up successful! Please login.');
        toggleAuthMode();
    } else {
        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
            currentUser = user;
            currentBudget = user.budget;
            totalExpenses = user.expenses.reduce((sum, expense) => sum + expense.amount, 0);
            showWelcomeSection();
        } else {
            alert('Invalid username or password.');
        }
    }
}

function showWelcomeSection() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('welcome-section').style.display = 'block';
    userNameDisplay.textContent = currentUser.name;
    budgetDisplay.textContent = `Current Budget: ₹${currentBudget}`;
}

function showBudgetSection() {
    document.getElementById('budget-section').style.display = 'block';
}

function setBudget(type) {
    const budgetInput = document.getElementById('budget-input');
    if (!budgetInput.value) {
        alert('Please enter a budget value.');
        return;
    }

    const newBudget = parseFloat(budgetInput.value);
    if (type === 'fresh') {
        currentBudget = newBudget;
    } else {
        currentBudget += newBudget;
    }
    currentUser.budget = currentBudget;
    localStorage.setItem('users', JSON.stringify(users));  // Save updated users

    budgetDisplay.textContent = `Current Budget: ₹${currentBudget}`;
    alert('Budget updated successfully!');
    document.getElementById('budget-section').style.display = 'none';
}

function showExpenseSection() {
    document.getElementById('expense-section').style.display = 'block';
}

function addExpense() {
    const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
    const expenseCategory = document.getElementById('expense-category').value;

    if (!expenseAmount) {
        alert('Please enter a valid expense amount.');
        return;
    }

    const expense = { category: expenseCategory, amount: expenseAmount };
    currentUser.expenses.push(expense);
    totalExpenses += expenseAmount;
    localStorage.setItem('users', JSON.stringify(users));  // Save updated users

    expenseList.innerHTML += `<li>${expenseCategory}: ₹${expenseAmount}</li>`;
    document.getElementById('expense-amount').value = '';
    document.getElementById('expense-category').value = 'Food';
}

function viewAdvice() {
    const adviceSection = document.getElementById('advice-section');
    let adviceText = '';

    if (totalExpenses > currentBudget * 0.8) {
        adviceText = 'You are spending a bit too much! Try to reduce expenses where possible. Consider saving more for future needs.';
    } else if (totalExpenses <= currentBudget * 0.5) {
        adviceText = 'Good job! You are managing your expenses well. Keep up the great work and consider investing a portion of your savings.';
    } else {
        adviceText = 'You are on track with your budget! Continue monitoring your spending to stay within your budget.';
    }

    const adviceList = document.getElementById('advice-list');
    adviceList.innerHTML = `<li>${adviceText}</li>`;
    adviceSection.style.display = 'block';
}

function viewExpenses() {
    const expensesSection = document.getElementById('expenses-section');
    allExpensesList.innerHTML = currentUser.expenses.map(exp => `<li>${exp.category}: ₹${exp.amount}</li>`).join('');
    remainingBudgetDisplay.textContent = `Remaining Budget: ₹${currentBudget - totalExpenses}`;
    expensesSection.style.display = 'block';
}

function logout() {
    currentUser = null;
    currentBudget = 0;
    totalExpenses = 0;
    // Do not remove users from localStorage, so users can log back in
    alert('Logged out successfully!');
    window.location.reload();  // Reload page to reset everything
}

