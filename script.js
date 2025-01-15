let users = JSON.parse(localStorage.getItem('users')) || [];
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
    const password = document.getElementById('password').value.trim();

    if (document.getElementById('auth-title').textContent === 'Sign Up') {
        const userExists = users.some(user => user.username === username);
        if (userExists) {
            alert('User already exists!');
            return;
        }
        users.push({ name, contact, username, password, expenses: [] });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Sign Up Successful! Please login.');
        return;
    }

    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        alert('Invalid credentials!');
        return;
    }
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    authSection.style.display = 'none';
    welcomeSection.style.display = 'block';
    userNameDisplay.textContent = currentUser.name;
    renderExpenses();
}

function setBudget(type) {
    const budgetInput = document.getElementById('budget-input').value;
    if (!budgetInput || isNaN(budgetInput)) {
        alert('Please enter a valid budget');
        return;
    }

    currentBudget = type === 'fresh' ? parseFloat(budgetInput) : currentBudget + parseFloat(budgetInput);
    budgetDisplay.textContent = `Current Budget: ₹${currentBudget}`;
    remainingBudgetDisplay.textContent = `Remaining Budget: ₹${currentBudget - totalExpenses}`;
}

function showExpenseSection() {
    document.getElementById('expense-section').style.display = 'block';
    document.getElementById('budget-section').style.display = 'none';
    document.getElementById('advice-section').style.display = 'none';
    document.getElementById('expenses-section').style.display = 'none';
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

    const expenseItem = document.createElement('li');
    expenseItem.innerHTML = `${expenseCategory}: ₹${expenseAmount} 
                             <button onclick="editExpense(${currentUser.expenses.length - 1})">Edit</button> 
                             <button onclick="deleteExpense(${currentUser.expenses.length - 1})">Delete</button>`;
    expenseList.appendChild(expenseItem);

    document.getElementById('expense-amount').value = '';
    document.getElementById('expense-category').value = 'Food';
}

function editExpense(index) {
    const newAmount = prompt("Enter new amount:", currentUser.expenses[index].amount);
    const newCategory = prompt("Enter new category:", currentUser.expenses[index].category);

    if (newAmount && newCategory) {
        currentUser.expenses[index].amount = parseFloat(newAmount);
        currentUser.expenses[index].category = newCategory;

        totalExpenses = currentUser.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        localStorage.setItem('users', JSON.stringify(users));  // Save updated users

        renderExpenses();
    }
}

function deleteExpense(index) {
    currentUser.expenses.splice(index, 1);
    totalExpenses = currentUser.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    localStorage.setItem('users', JSON.stringify(users));  // Save updated users
    renderExpenses();
}

function renderExpenses() {
    expenseList.innerHTML = '';
    currentUser.expenses.forEach((expense, index) => {
        const expenseItem = document.createElement('li');
        expenseItem.innerHTML = `${expense.category}: ₹${expense.amount} 
                                 <button onclick="editExpense(${index})">Edit</button> 
                                 <button onclick="deleteExpense(${index})">Delete</button>`;
        expenseList.appendChild(expenseItem);
    });

    remainingBudgetDisplay.textContent = `Remaining Budget: ₹${currentBudget - totalExpenses}`;
}

function viewExpenses() {
    const expensesSection = document.getElementById('expenses-section');
    renderExpenses(); 
    expensesSection.style.display = 'block';
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    authSection.style.display = 'block';
    welcomeSection.style.display = 'none';
}

