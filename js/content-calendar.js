// Content Calendar for AI Unplugged Blog
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the blog page or a page containing the content calendar element
    if (document.getElementById('content-calendar') || window.location.pathname.includes('blog')) {
        initContentCalendar();
    }
});

// Initialize Content Calendar
function initContentCalendar() {
    // Create calendar container if it doesn't exist
    let calendarContainer = document.getElementById('content-calendar');
    if (!calendarContainer) {
        // Create container element
        calendarContainer = document.createElement('div');
        calendarContainer.id = 'content-calendar';
        
        // Find the appropriate place to insert the calendar
        const blogContent = document.querySelector('.blog-content') || document.querySelector('main');
        if (blogContent) {
            // Create a header for the section
            const calendarSection = document.createElement('section');
            calendarSection.classList.add('content-calendar-section');
            
            const sectionHeader = document.createElement('div');
            sectionHeader.classList.add('section-header');
            sectionHeader.innerHTML = `
                <h2>AI Content Calendar</h2>
                <p>Stay updated with our upcoming AI content and never miss an important article.</p>
            `;
            
            calendarSection.appendChild(sectionHeader);
            calendarSection.appendChild(calendarContainer);
            
            // Insert before the footer or at the end of main content
            const footer = document.querySelector('footer');
            if (footer) {
                blogContent.insertBefore(calendarSection, footer);
            } else {
                blogContent.appendChild(calendarSection);
            }
        }
    }
    
    // Add styles
    addCalendarStyles();
    
    // Render the calendar
    renderCalendar(calendarContainer);
    
    // Add subscribe form 
    addSubscribeForm(calendarContainer);
}

// Render the calendar
function renderCalendar(container) {
    // Clear container
    container.innerHTML = '';
    
    // Create header with controls
    const calendarHeader = document.createElement('div');
    calendarHeader.classList.add('calendar-header');
    
    // Get current date
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Set up month and year for the calendar view
    let viewMonth = currentMonth;
    let viewYear = currentYear;
    
    // Helper function to update calendar
    function updateCalendarView() {
        // Update month/year display
        monthYearDisplay.textContent = getMonthName(viewMonth) + ' ' + viewYear;
        
        // Update calendar grid
        updateCalendarGrid(calendarGrid, viewMonth, viewYear);
    }
    
    // Create month/year display
    const monthYearDisplay = document.createElement('h3');
    monthYearDisplay.classList.add('month-year');
    monthYearDisplay.textContent = getMonthName(viewMonth) + ' ' + viewYear;
    
    // Create navigation controls
    const navControls = document.createElement('div');
    navControls.classList.add('calendar-nav');
    
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevButton.setAttribute('aria-label', 'Previous month');
    prevButton.addEventListener('click', function() {
        viewMonth--;
        if (viewMonth < 0) {
            viewMonth = 11;
            viewYear--;
        }
        updateCalendarView();
    });
    
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextButton.setAttribute('aria-label', 'Next month');
    nextButton.addEventListener('click', function() {
        viewMonth++;
        if (viewMonth > 11) {
            viewMonth = 0;
            viewYear++;
        }
        updateCalendarView();
    });
    
    const todayButton = document.createElement('button');
    todayButton.textContent = 'Today';
    todayButton.classList.add('today-button');
    todayButton.addEventListener('click', function() {
        viewMonth = currentMonth;
        viewYear = currentYear;
        updateCalendarView();
    });
    
    navControls.appendChild(prevButton);
    navControls.appendChild(todayButton);
    navControls.appendChild(nextButton);
    
    // Assemble header
    calendarHeader.appendChild(monthYearDisplay);
    calendarHeader.appendChild(navControls);
    container.appendChild(calendarHeader);
    
    // Create content type legend
    const legend = document.createElement('div');
    legend.classList.add('content-legend');
    legend.innerHTML = `
        <div class="legend-item">
            <span class="legend-color" style="background-color: #4285f4;"></span>
            <span class="legend-label">Tutorial</span>
        </div>
        <div class="legend-item">
            <span class="legend-color" style="background-color: #34a853;"></span>
            <span class="legend-label">Case Study</span>
        </div>
        <div class="legend-item">
            <span class="legend-color" style="background-color: #fbbc05;"></span>
            <span class="legend-label">Industry Insights</span>
        </div>
        <div class="legend-item">
            <span class="legend-color" style="background-color: #ea4335;"></span>
            <span class="legend-label">News & Updates</span>
        </div>
        <div class="legend-item">
            <span class="legend-color" style="background-color: #9c27b0;"></span>
            <span class="legend-label">Webinar</span>
        </div>
    `;
    container.appendChild(legend);
    
    // Create calendar grid
    const calendarGrid = document.createElement('div');
    calendarGrid.classList.add('calendar-grid');
    container.appendChild(calendarGrid);
    
    // Initial render
    updateCalendarGrid(calendarGrid, viewMonth, viewYear);
    
    // Create upcoming content list
    const upcomingContent = document.createElement('div');
    upcomingContent.classList.add('upcoming-content');
    upcomingContent.innerHTML = `
        <h3>Upcoming Content</h3>
        <div class="content-list"></div>
    `;
    container.appendChild(upcomingContent);
    
    // Populate upcoming content list
    updateUpcomingContent(upcomingContent.querySelector('.content-list'));
}

// Update calendar grid
function updateCalendarGrid(gridContainer, month, year) {
    // Clear grid
    gridContainer.innerHTML = '';
    
    // Add day headers
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.classList.add('day-header');
        dayHeader.textContent = day;
        gridContainer.appendChild(dayHeader);
    });
    
    // Get first day of month and total days
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    
    // Get content for this month
    const monthContent = getContentForMonth(month, year);
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('calendar-day', 'empty');
        gridContainer.appendChild(emptyCell);
    }
    
    // Add days of month
    const today = new Date();
    const currentDate = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    for (let i = 1; i <= lastDate; i++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('calendar-day');
        
        // Check if this is today
        if (i === currentDate && month === currentMonth && year === currentYear) {
            dayCell.classList.add('today');
        }
        
        // Add date number
        const dateNumber = document.createElement('div');
        dateNumber.classList.add('date-number');
        dateNumber.textContent = i;
        dayCell.appendChild(dateNumber);
        
        // Add content indicators for this day
        const contentForDay = monthContent.filter(item => item.day === i);
        if (contentForDay.length > 0) {
            const contentIndicators = document.createElement('div');
            contentIndicators.classList.add('content-indicators');
            
            contentForDay.forEach(content => {
                const indicator = document.createElement('div');
                indicator.classList.add('content-indicator');
                indicator.style.backgroundColor = getContentTypeColor(content.type);
                indicator.setAttribute('title', content.title);
                contentIndicators.appendChild(indicator);
                
                // Make the day clickable to show content details
                dayCell.classList.add('has-content');
                dayCell.addEventListener('click', function() {
                    showContentDetails(content);
                });
            });
            
            dayCell.appendChild(contentIndicators);
        }
        
        gridContainer.appendChild(dayCell);
    }
}

// Show content details in a modal
function showContentDetails(content) {
    // Create modal container
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');
    
    const modal = document.createElement('div');
    modal.classList.add('content-modal');
    
    // Create modal content
    modal.innerHTML = `
        <div class="modal-header">
            <h3>${content.title}</h3>
            <button class="close-modal"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
            <div class="content-type" style="background-color: ${getContentTypeColor(content.type)}">
                ${content.type}
            </div>
            <div class="content-date">
                ${getMonthName(content.month)} ${content.day}, ${content.year}
            </div>
            <div class="content-description">
                ${content.description}
            </div>
            ${content.topic ? `<div class="content-topics"><strong>Topics:</strong> ${content.topic}</div>` : ''}
        </div>
        <div class="modal-footer">
            ${content.url ? `<a href="${content.url}" class="btn-primary modal-button">Read Now</a>` : 
              `<button class="btn-secondary modal-button reminder-button">Set Reminder</button>`}
        </div>
    `;
    
    // Add to page
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);
    
    // Add event listeners
    modal.querySelector('.close-modal').addEventListener('click', function() {
        modalOverlay.remove();
    });
    
    // Close when clicking outside
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            modalOverlay.remove();
        }
    });
    
    // Handle reminder button
    const reminderButton = modal.querySelector('.reminder-button');
    if (reminderButton) {
        reminderButton.addEventListener('click', function() {
            // In a real implementation, this would integrate with a calendar API
            // or notification system. For now, we'll just show a message.
            this.textContent = 'Reminder Set';
            this.disabled = true;
            
            // Show notification
            showNotification('Reminder set for ' + content.title);
        });
    }
}

// Show a notification message
function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('calendar-notification');
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Update upcoming content list
function updateUpcomingContent(container) {
    // Clear container
    container.innerHTML = '';
    
    // Get current date
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const currentDate = now.getDate();
    
    // Get upcoming content (current month and next month)
    let upcomingItems = [];
    
    // Current month (remaining days)
    const currentMonthContent = getContentForMonth(currentMonth, currentYear);
    const remainingCurrentMonth = currentMonthContent.filter(item => item.day >= currentDate);
    upcomingItems = upcomingItems.concat(remainingCurrentMonth);
    
    // Next month
    let nextMonth = currentMonth + 1;
    let nextYear = currentYear;
    if (nextMonth > 11) {
        nextMonth = 0;
        nextYear++;
    }
    
    const nextMonthContent = getContentForMonth(nextMonth, nextYear);
    upcomingItems = upcomingItems.concat(nextMonthContent);
    
    // Sort by date
    upcomingItems.sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        if (a.month !== b.month) return a.month - b.month;
        return a.day - b.day;
    });
    
    // Limit to 5 items
    upcomingItems = upcomingItems.slice(0, 5);
    
    // Create list items
    if (upcomingItems.length === 0) {
        container.innerHTML = '<p class="no-content">No upcoming content scheduled.</p>';
        return;
    }
    
    upcomingItems.forEach(item => {
        const listItem = document.createElement('div');
        listItem.classList.add('content-list-item');
        
        listItem.innerHTML = `
            <div class="content-date">
                ${getMonthName(item.month)} ${item.day}
            </div>
            <div class="content-info">
                <div class="content-title">${item.title}</div>
                <div class="content-type-badge" style="background-color: ${getContentTypeColor(item.type)}">${item.type}</div>
            </div>
        `;
        
        // Make item clickable
        listItem.addEventListener('click', function() {
            showContentDetails(item);
        });
        
        container.appendChild(listItem);
    });
}

// Add subscribe form
function addSubscribeForm(container) {
    const formContainer = document.createElement('div');
    formContainer.classList.add('calendar-subscribe');
    
    formContainer.innerHTML = `
        <h3>Never Miss an Update</h3>
        <p>Subscribe to receive notifications when new content is published.</p>
        <form id="calendar-subscribe-form" class="subscribe-form">
            <input type="email" placeholder="Your email address" id="subscriber-email" required>
            <button type="submit">Subscribe</button>
        </form>
    `;
    
    container.appendChild(formContainer);
    
    // Add form submission handler
    document.getElementById('calendar-subscribe-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('subscriber-email').value.trim();
        if (email) {
            // In a real implementation, this would send the email to a server
            // For now, just show a success message
            this.innerHTML = '<p class="subscribe-success">Thank you! You have been subscribed to our content updates.</p>';
        }
    });
}

// Get content for a specific month
function getContentForMonth(month, year) {
    // This would typically come from a CMS or database
    // For demo purposes, we'll use hard-coded content
    const allContent = [
        // Past content
        {
            title: "Introduction to AI Chatbots",
            day: 5,
            month: 4, // May (0-indexed)
            year: 2023,
            type: "Tutorial",
            description: "Learn the basics of AI chatbots and how they can transform your customer service experience.",
            topic: "Chatbots, Customer Service",
            url: "blog-post-1.html"
        },
        {
            title: "How RetailCo Increased Sales by 35% with AI",
            day: 12,
            month: 4,
            year: 2023,
            type: "Case Study",
            description: "Detailed analysis of how RetailCo implemented AI solutions and achieved remarkable results.",
            topic: "Retail, Sales Optimization",
            url: "blog-post-2.html"
        },
        
        // Current and upcoming content
        {
            title: "AI Trends to Watch in 2023",
            day: 3,
            month: 5, // June
            year: 2023,
            type: "Industry Insights",
            description: "Explore the most important AI trends that will shape business technology in the coming year.",
            topic: "Trends, Future of AI",
            url: "blog-post-3.html"
        },
        {
            title: "Implementing Predictive Analytics: A Step-by-Step Guide",
            day: 15,
            month: 5,
            year: 2023,
            type: "Tutorial",
            description: "Follow our comprehensive guide to implementing predictive analytics in your business operations.",
            topic: "Predictive Analytics, Implementation",
            url: "blog-post-4.html"
        },
        {
            title: "AI Ethics and Responsible Implementation",
            day: 22,
            month: 5,
            year: 2023,
            type: "Webinar",
            description: "Join our panel of experts as they discuss ethical considerations in AI implementation.",
            topic: "Ethics, Responsible AI"
        },
        {
            title: "New Feature Release: Enhanced Analytics Dashboard",
            day: 28,
            month: 5,
            year: 2023,
            type: "News & Updates",
            description: "Explore our newly released analytics dashboard with enhanced visualization and reporting features.",
            topic: "Product Updates, Analytics"
        },
        
        // Next month
        {
            title: "Healthcare AI: Transforming Patient Care",
            day: 5,
            month: 6, // July
            year: 2023,
            type: "Industry Insights",
            description: "Discover how AI is revolutionizing healthcare and improving patient outcomes.",
            topic: "Healthcare, Industry Specific"
        },
        {
            title: "Building Your First AI Model with Python",
            day: 12,
            month: 6,
            year: 2023,
            type: "Tutorial",
            description: "A beginner-friendly guide to building and deploying your first AI model using Python.",
            topic: "Development, Python, Machine Learning"
        },
        {
            title: "FinTech Revolution: How AI is Changing Banking",
            day: 19,
            month: 6,
            year: 2023,
            type: "Webinar",
            description: "Industry experts discuss the transformative impact of AI on financial services.",
            topic: "Finance, Banking, Industry Specific"
        }
    ];
    
    // Filter content for the requested month and year
    return allContent.filter(item => item.month === month && item.year === year);
}

// Get color for content type
function getContentTypeColor(type) {
    const colorMap = {
        'Tutorial': '#4285f4',
        'Case Study': '#34a853',
        'Industry Insights': '#fbbc05',
        'News & Updates': '#ea4335',
        'Webinar': '#9c27b0'
    };
    
    return colorMap[type] || '#888';
}

// Get month name
function getMonthName(monthIndex) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return months[monthIndex];
}

// Add calendar styles
function addCalendarStyles() {
    const style = document.createElement('style');
    style.textContent = `
        #content-calendar {
            font-family: 'Montserrat', sans-serif;
            max-width: 800px;
            margin: 0 auto 40px;
            padding: 20px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .content-calendar-section {
            margin: 60px 0;
            padding: 20px;
        }
        
        .section-header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .section-header h2 {
            color: var(--primary-color, #4285f4);
            margin-bottom: 10px;
        }
        
        .calendar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .month-year {
            font-size: 20px;
            font-weight: 600;
            margin: 0;
        }
        
        .calendar-nav {
            display: flex;
            gap: 10px;
            align-items: center;
        }
        
        .calendar-nav button {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 16px;
            color: var(--primary-color, #4285f4);
            padding: 5px;
        }
        
        .today-button {
            background-color: #f0f0f0;
            border-radius: 4px;
            padding: 5px 10px !important;
        }
        
        .content-legend {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-bottom: 15px;
            justify-content: center;
        }
        
        .legend-item {
            display: flex;
            align-items: center;
            font-size: 12px;
        }
        
        .legend-color {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 5px;
        }
        
        .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 5px;
            margin-bottom: 30px;
        }
        
        .day-header {
            text-align: center;
            font-weight: 600;
            padding: 10px;
            font-size: 14px;
            color: #666;
        }
        
        .calendar-day {
            min-height: 80px;
            background-color: #f9f9f9;
            border-radius: 5px;
            padding: 5px;
            position: relative;
        }
        
        .calendar-day.empty {
            background-color: transparent;
        }
        
        .calendar-day.today {
            background-color: #e6f2ff;
            border: 1px solid var(--primary-color, #4285f4);
        }
        
        .calendar-day.has-content {
            cursor: pointer;
        }
        
        .calendar-day.has-content:hover {
            transform: translateY(-2px);
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;
        }
        
        .date-number {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 5px;
        }
        
        .content-indicators {
            display: flex;
            flex-wrap: wrap;
            gap: 3px;
        }
        
        .content-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
        }
        
        .upcoming-content {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .upcoming-content h3 {
            margin-top: 0;
            margin-bottom: 15px;
            font-size: 18px;
            color: var(--primary-color, #4285f4);
        }
        
        .content-list-item {
            display: flex;
            padding: 10px;
            border-bottom: 1px solid #eee;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .content-list-item:last-child {
            border-bottom: none;
        }
        
        .content-list-item:hover {
            background-color: #f0f0f0;
            border-radius: 5px;
        }
        
        .content-date {
            min-width: 100px;
            font-weight: 500;
        }
        
        .content-info {
            flex: 1;
        }
        
        .content-title {
            margin-bottom: 5px;
        }
        
        .content-type-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 11px;
            color: white;
        }
        
        .no-content {
            text-align: center;
            color: #888;
            font-style: italic;
        }
        
        .calendar-subscribe {
            text-align: center;
            padding: 20px;
            background-color: #f0f6ff;
            border-radius: 8px;
        }
        
        .calendar-subscribe h3 {
            margin-top: 0;
            color: var(--primary-color, #4285f4);
        }
        
        .subscribe-form {
            display: flex;
            max-width: 500px;
            margin: 15px auto 0;
        }
        
        .subscribe-form input {
            flex: 1;
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 5px 0 0 5px;
            font-size: 14px;
        }
        
        .subscribe-form button {
            padding: 10px 20px;
            background-color: var(--primary-color, #4285f4);
            color: white;
            border: none;
            border-radius: 0 5px 5px 0;
            cursor: pointer;
            font-weight: 500;
        }
        
        .subscribe-success {
            color: #34a853;
            font-weight: 500;
        }
        
        /* Modal styles */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        
        .content-modal {
            background-color: white;
            border-radius: 10px;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
        }
        
        .modal-header {
            padding: 15px 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-header h3 {
            margin: 0;
            font-size: 18px;
        }
        
        .close-modal {
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            color: #666;
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .content-type {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 15px;
            font-size: 12px;
            color: white;
            margin-bottom: 10px;
        }
        
        .content-date {
            font-size: 14px;
            color: #666;
            margin-bottom: 15px;
        }
        
        .content-description {
            margin-bottom: 15px;
            line-height: 1.5;
        }
        
        .content-topics {
            font-size: 14px;
            color: #666;
        }
        
        .modal-footer {
            padding: 15px 20px;
            border-top: 1px solid #eee;
            text-align: right;
        }
        
        .modal-button {
            padding: 10px 15px;
            border-radius: 5px;
            font-weight: 500;
            cursor: pointer;
            border: none;
        }
        
        .btn-primary {
            background-color: var(--primary-color, #4285f4);
            color: white;
            text-decoration: none;
            display: inline-block;
        }
        
        .btn-secondary {
            background-color: #f0f0f0;
            color: #333;
        }
        
        .calendar-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #333;
            color: white;
            padding: 12px 20px;
            border-radius: 5px;
            z-index: 1001;
            animation: fadeIn 0.3s;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        }
        
        .calendar-notification.hide {
            animation: fadeOut 0.3s;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(10px); }
        }
        
        @media (max-width: 768px) {
            .calendar-grid {
                font-size: 12px;
            }
            
            .calendar-day {
                min-height: 60px;
            }
            
            .subscribe-form {
                flex-direction: column;
            }
            
            .subscribe-form input {
                border-radius: 5px;
                margin-bottom: 10px;
            }
            
            .subscribe-form button {
                border-radius: 5px;
            }
        }
    `;
    document.head.appendChild(style);
} 