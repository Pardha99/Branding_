document.addEventListener('DOMContentLoaded', () => {
    // Initialize todo list functionality
    initTodoList();
    
    // Initialize calendar functionality
    initCalendar();
    
    // Create star background
    createStars();
});

// Todo List Functionality
function initTodoList() {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTask');
    const todoList = document.getElementById('todoList');

    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('lunarTasks')) || [];
    renderTasks();

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            tasks.push({
                text: taskText,
                completed: false,
                id: Date.now()
            });
            localStorage.setItem('lunarTasks', JSON.stringify(tasks));
            renderTasks();
            taskInput.value = '';
        }
    }

    function renderTasks() {
        todoList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = task.completed ? 'completed' : '';
            li.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span>${task.text}</span>
                <button><i class="fas fa-trash"></i></button>
            `;

            // Toggle completion
            const checkbox = li.querySelector('input');
            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                li.className = task.completed ? 'completed' : '';
                localStorage.setItem('lunarTasks', JSON.stringify(tasks));
            });

            // Delete task
            const deleteBtn = li.querySelector('button');
            deleteBtn.addEventListener('click', () => {
                tasks = tasks.filter(t => t.id !== task.id);
                localStorage.setItem('lunarTasks', JSON.stringify(tasks));
                renderTasks();
            });

            todoList.appendChild(li);
        });
    }
}

// Custom Calendar Functionality
function initCalendar() {
    const calendarDays = document.getElementById('calendar-days');
    const currentMonthElement = document.getElementById('currentMonth');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    // Set initial date to March 2025 (to match the reference image)
    const currentDate = new Date();
    let displayedMonth = 2; // March (0-indexed)
    let displayedYear = 2025;

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Helper functions
    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    function renderCalendar() {
        calendarDays.innerHTML = '';
        currentMonthElement.textContent = `${months[displayedMonth]} ${displayedYear}`;

        const totalDays = daysInMonth(displayedYear, displayedMonth);
        const firstDay = firstDayOfMonth(displayedYear, displayedMonth);
        
        // Previous month's days
        const prevMonth = displayedMonth === 0 ? 11 : displayedMonth - 1;
        const prevYear = displayedMonth === 0 ? displayedYear - 1 : displayedYear;
        const prevMonthDays = daysInMonth(prevYear, prevMonth);
        
        // Add previous month's days
        for (let i = firstDay - 1; i >= 0; i--) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day other-month';
            dayElement.textContent = prevMonthDays - i;
            calendarDays.appendChild(dayElement);
        }

        // Current month's days
        const today = new Date();
        const isCurrentMonth = today.getMonth() === displayedMonth && today.getFullYear() === displayedYear;
        
        for (let day = 1; day <= totalDays; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            // Only highlight if it's today's actual date
            if (isCurrentMonth && day === today.getDate()) {
                dayElement.classList.add('highlighted');
            }
            
            dayElement.textContent = day;
            
            // Add click event to each day
            dayElement.addEventListener('click', () => {
                // Remove selected class from all days
                document.querySelectorAll('.calendar-day').forEach(d => 
                    d.classList.remove('selected')
                );
                // Add selected class to clicked day
                dayElement.classList.add('selected');
                
                const selectedDate = new Date(displayedYear, displayedMonth, day);
                console.log(`Selected date: ${selectedDate.toLocaleDateString()}`);
            });

            calendarDays.appendChild(dayElement);
        }

        // Next month's days
        const totalCells = 42; // 6 rows × 7 days
        const remainingCells = totalCells - (firstDay + totalDays);
        
        for (let day = 1; day <= remainingCells; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day other-month';
            dayElement.textContent = day;
            calendarDays.appendChild(dayElement);
        }
    }

    // Event listeners for month navigation
    prevMonthBtn.addEventListener('click', () => {
        if (displayedMonth === 0) {
            displayedYear--;
            displayedMonth = 11;
        } else {
            displayedMonth--;
        }
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        if (displayedMonth === 11) {
            displayedYear++;
            displayedMonth = 0;
        } else {
            displayedMonth++;
        }
        renderCalendar();
    });

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevMonthBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextMonthBtn.click();
        }
    });

    // Initial render
    renderCalendar();
}

// Create star background
function createStars() {
    const stars = document.querySelector('.stars');
    const count = 200;

    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3}px;
            height: ${Math.random() * 3}px;
            background: white;
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random()};
            animation: twinkle ${Math.random() * 5 + 3}s infinite;
        `;
        stars.appendChild(star);
    }
}

// Add CSS animation for twinkling stars
const style = document.createElement('style');
style.textContent = `
    @keyframes twinkle {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
    }
`;
document.head.appendChild(style); 