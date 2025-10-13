/**
 * Farmers Market Bakery - Menu Display Script
 * Loads and displays menu data from menu.json
 */

// Configuration
const MENU_DATA_URL = 'data/menu.json';

// DOM elements
let menuContainer;
let lastUpdatedElement;
let marketDateElement;

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', () => {
    menuContainer = document.getElementById('menuContainer');
    lastUpdatedElement = document.getElementById('lastUpdated');
    marketDateElement = document.getElementById('marketDate');

    loadMenu();
});

/**
 * Load menu data from JSON file
 */
async function loadMenu() {
    try {
        const response = await fetch(MENU_DATA_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const menuData = await response.json();
        displayMenu(menuData);
    } catch (error) {
        console.error('Error loading menu:', error);
        displayError('Unable to load menu. Please try again later.');
    }
}

/**
 * Display the menu on the page
 */
function displayMenu(menuData) {
    // Update header information
    if (menuData.market_date) {
        const date = new Date(menuData.market_date);
        marketDateElement.textContent = `Market Day: ${formatDate(date)}`;
    }

    if (menuData.last_updated) {
        const date = new Date(menuData.last_updated);
        lastUpdatedElement.textContent = formatDateTime(date);
    }

    // Clear loading message
    menuContainer.innerHTML = '';

    // Check if there are categories
    if (!menuData.categories || menuData.categories.length === 0) {
        displayError('No menu items available at this time.');
        return;
    }

    // Display each category
    menuData.categories.forEach(category => {
        if (category.items && category.items.length > 0) {
            const categoryElement = createCategoryElement(category);
            menuContainer.appendChild(categoryElement);
        }
    });
}

/**
 * Create a category section element
 */
function createCategoryElement(category) {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'category';

    // Category header
    const header = document.createElement('div');
    header.className = 'category-header';
    header.textContent = category.name;
    categoryDiv.appendChild(header);

    // Menu items container
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'menu-items';

    // Add each item
    category.items.forEach(item => {
        const itemElement = createMenuItem(item);
        itemsContainer.appendChild(itemElement);
    });

    categoryDiv.appendChild(itemsContainer);

    return categoryDiv;
}

/**
 * Create a menu item element
 */
function createMenuItem(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'menu-item';

    // Add sold-out class if applicable
    if (item.sold_out) {
        itemDiv.classList.add('sold-out');
    }

    // Item header (name and price)
    const itemHeader = document.createElement('div');
    itemHeader.className = 'item-header';

    const itemName = document.createElement('div');
    itemName.className = 'item-name';
    itemName.textContent = item.name;
    itemHeader.appendChild(itemName);

    const itemPrice = document.createElement('div');
    itemPrice.className = 'item-price';
    itemPrice.textContent = formatPrice(item.price);
    itemHeader.appendChild(itemPrice);

    itemDiv.appendChild(itemHeader);

    // Item description
    if (item.description) {
        const description = document.createElement('div');
        description.className = 'item-description';
        description.textContent = item.description;
        itemDiv.appendChild(description);
    }

    // Allergens
    if (item.allergens && item.allergens.length > 0) {
        const allergensDiv = document.createElement('div');
        allergensDiv.className = 'item-allergens';

        const label = document.createElement('span');
        label.className = 'allergens-label';
        label.textContent = 'Contains:';
        allergensDiv.appendChild(label);

        item.allergens.forEach(allergen => {
            const tag = document.createElement('span');
            tag.className = 'allergen-tag';
            tag.textContent = allergen;
            allergensDiv.appendChild(tag);
        });

        itemDiv.appendChild(allergensDiv);
    }

    return itemDiv;
}

/**
 * Display an error message
 */
function displayError(message) {
    menuContainer.innerHTML = `
        <div class="loading" style="color: #DC143C;">
            ${message}
        </div>
    `;
}

/**
 * Format a date as a readable string
 */
function formatDate(date) {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Format a date and time as a readable string
 */
function formatDateTime(date) {
    const dateOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    const timeOptions = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };

    const dateStr = date.toLocaleDateString('en-US', dateOptions);
    const timeStr = date.toLocaleTimeString('en-US', timeOptions);

    return `${dateStr} at ${timeStr}`;
}

/**
 * Format a price as currency
 */
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

/**
 * Service Worker registration for offline support (optional)
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/service-worker.js')
        //     .then(registration => console.log('ServiceWorker registered'))
        //     .catch(err => console.log('ServiceWorker registration failed'));
    });
}
