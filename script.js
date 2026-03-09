
// LOGIN SYSTEM

const loginPage=document.getElementById("loginPage");
const mainWebsite=document.getElementById("mainWebsite");

const loginBtn=document.getElementById("loginBtn");
const logoutBtn=document.getElementById("logoutBtn");

const loginError=document.getElementById("loginError");

if(localStorage.getItem("loggedIn")==="true")
{
loginPage.style.display="none";
mainWebsite.style.display="block";
}
else
{
mainWebsite.style.display="none";
}


loginBtn.addEventListener("click",()=>{

const username=document.getElementById("username").value;

const password=document.getElementById("password").value;

if(username==="admin" && password==="1234")
{

localStorage.setItem("loggedIn","true");

loginPage.style.display="none";

mainWebsite.style.display="block";

}

else
{
loginError.style.display="block";
}

});


logoutBtn.addEventListener("click",()=>{

localStorage.removeItem("loggedIn");

location.reload();


});
document.getElementById("googleLogin").onclick = function(){
document.getElementById("loginPage").style.display="none";
document.getElementById("mainWebsite").style.display="block";
}

document.getElementById("appleLogin").onclick = function(){
document.getElementById("loginPage").style.display="none";
document.getElementById("mainWebsite").style.display="block";
}



// Navigation
const navLinks = document.querySelectorAll('.nav-menu a');
const sections = document.querySelectorAll('.section');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active-section'));
        
        link.classList.add('active');
        const targetId = link.getAttribute('href');
        document.querySelector(targetId).classList.add('active-section');
    });
});


// ============================================
// PART 1: Dynamic Topic Management
// ============================================

// Default topics
let topics = ['Stack', 'Queue', 'Linked List', 'Trees', 'Sorting'];

// DOM elements
const topicsInput = document.getElementById('topicsInput');
const updateTopicsBtn = document.getElementById('updateTopicsBtn');
const topicsListSpan = document.getElementById('topicsList');
const analyzeBtn = document.getElementById('analyzeBtn');
const questionInput = document.getElementById('questionInput');
const analysisResult = document.getElementById('analysisResult');
const tableBody = document.getElementById('tableBody');
const topTopicInfo = document.getElementById('topTopicInfo');

// Update topics display
function updateTopicsDisplay() {
    topicsListSpan.textContent = topics.join(', ');
}

// Handle topic update
updateTopicsBtn.addEventListener('click', () => {
    const inputText = topicsInput.value.trim();
    if (inputText) {
        topics = inputText.split(',').map(topic => topic.trim()).filter(topic => topic.length > 0);
        updateTopicsDisplay();
        alert(`✅ Topics updated! Now analyzing: ${topics.join(', ')}`);
    } else {
        alert('❌ Please enter at least one topic.');
    }
});

// ============================================
// PART 2: FIXED Exam Pattern Analyzer
// ============================================

analyzeBtn.addEventListener('click', () => {
    const text = questionInput.value;
    if (!text.trim()) {
        alert('❌ Please paste some exam questions first.');
        return;
    }

    if (topics.length === 0) {
        alert('❌ Please define some topics to analyze.');
        return;
    }

    // FIXED: Better frequency counting
    const frequencies = new Array(topics.length).fill(0);
    let totalMentions = 0;
    
    // Convert text to lowercase for case-insensitive matching
    const lowerText = text.toLowerCase();
    
    // Process each topic
    topics.forEach((topic, index) => {
        const topicLower = topic.toLowerCase();
        let count = 0;
        
        // FIXED: Better matching for both single and multi-word topics
        if (topicLower.includes(' ')) {
            // For multi-word topics (like "Linked List", "World War II")
            // Create regex that matches the exact phrase
            const regex = new RegExp(topicLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            const matches = text.match(regex);
            count = matches ? matches.length : 0;
            
            // Also check for variations (linked list, linked lists)
            const pluralRegex = new RegExp(topicLower + 's?', 'gi');
            const pluralMatches = text.match(pluralRegex);
            if (pluralMatches && pluralMatches.length > count) {
                count = pluralMatches.length;
            }
        } else {
            // For single word topics
            // Split into words and clean punctuation
            const words = lowerText.split(/[\s.,!?;:()\-"]+/);
            
            // Count exact matches
            words.forEach(word => {
                // Remove trailing punctuation
                const cleanWord = word.replace(/[.,!?;:()\-"]$/, '');
                if (cleanWord === topicLower) {
                    count++;
                }
            });
            
            // Also check for plural forms
            const pluralForm = topicLower + 's';
            words.forEach(word => {
                const cleanWord = word.replace(/[.,!?;:()\-"]$/, '');
                if (cleanWord === pluralForm) {
                    count++;
                }
            });
        }
        
        frequencies[index] = count;
        totalMentions += count;
    });

    // Display results in table
    tableBody.innerHTML = '';
    let maxFreq = -1;
    let topTopic = '';
    let hasAnyTopic = false;
    
    topics.forEach((topic, index) => {
        const freq = frequencies[index];
        const percentage = totalMentions > 0 ? ((freq / totalMentions) * 100).toFixed(1) : '0';
        
        if (freq > 0) {
            hasAnyTopic = true;
        }
        
        if (freq > maxFreq) {
            maxFreq = freq;
            topTopic = topic;
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${topic}</strong></td>
            <td style="text-align: center; font-weight: bold;">${freq}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="min-width: 45px;">${percentage}%</span>
                    <div class="percentage-bar" style="flex-grow: 1;">
                        <div class="percentage-fill" style="width: ${percentage}%;"></div>
                    </div>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Show result message
    if (hasAnyTopic) {
        topTopicInfo.innerHTML = `📊 <strong>Most Important Topic:</strong> ${topTopic} (appears ${maxFreq} time${maxFreq > 1 ? 's' : ''})`;
        analysisResult.style.display = 'block';
        
        // Store for paper generator
        sessionStorage.setItem('analysisTopics', JSON.stringify(topics));
        sessionStorage.setItem('topicFrequencies', JSON.stringify(frequencies));
    } else {
        topTopicInfo.innerHTML = '❌ No matching topics found in the text. Try different keywords or check your spelling.';
        analysisResult.style.display = 'block';
    }
});

// ============================================
// PART 3: Sample Paper Generator
// ============================================

const generatePaperBtn = document.getElementById('generatePaperBtn');
const paperResult = document.getElementById('paperResult');
const paperContent = document.getElementById('paperContent');

generatePaperBtn.addEventListener('click', () => {
    const storedTopics = JSON.parse(sessionStorage.getItem('analysisTopics'));
    const frequencies = JSON.parse(sessionStorage.getItem('topicFrequencies')) || [];
    
    if (!storedTopics || storedTopics.length === 0 || frequencies.length === 0) {
        paperContent.innerHTML = '<p style="color: #ff4757;">⚠️ Please analyze some questions first to generate a relevant paper.</p>';
        paperResult.style.display = 'block';
        return;
    }
    
    // Get topics that actually appeared
    const topicImportance = storedTopics.map((topic, i) => ({ 
        topic, 
        count: frequencies[i] || 0 
    })).sort((a, b) => b.count - a.count);
    
    const importantTopics = topicImportance.filter(t => t.count > 0).map(t => t.topic);
    
    if (importantTopics.length === 0) {
        paperContent.innerHTML = '<p style="color: #ff4757;">⚠️ No topics were detected. Please analyze some questions first.</p>';
        paperResult.style.display = 'block';
        return;
    }
    
    // Generate paper
    let paper = '<div style="font-family: Arial, sans-serif;">';
    
    // Header
    paper += '<div style="text-align: center; margin-bottom: 30px;">';
    paper += '<h2 style="color: #667eea; margin-bottom: 5px;">📝 Practice Exam Paper</h2>';
    paper += '<p style="color: #666;">Based on detected topics: ' + importantTopics.join(', ') + '</p>';
    paper += '<hr style="border: 1px solid #667eea; width: 50%;"></div>';
    
    // Section A
    paper += '<h3 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 5px;">Section A (Short Questions) - 2 marks each</h3>';
    paper += '<ol style="list-style-type: decimal; padding-left: 20px;">';
    
    const shortQuestions = [
        'Define {topic} and give a real-world example.',
        'Explain the key characteristics of {topic} in brief.',
        'What are the main applications of {topic}?',
        'Write a short note on the importance of {topic}.',
        'List the key components of {topic}.',
        'Describe the basic principles of {topic}.',
        'How does {topic} relate to everyday life?'
    ];
    
    for (let i = 0; i < 5; i++) {
        const topic = importantTopics[i % importantTopics.length];
        const question = shortQuestions[Math.floor(Math.random() * shortQuestions.length)];
        paper += `<li style="margin-bottom: 10px;">${question.replace('{topic}', topic)}</li>`;
    }
    paper += '</ol>';
    
    // Section B
    paper += '<h3 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 5px; margin-top: 25px;">Section B (Long Questions) - 5 marks each</h3>';
    paper += '<ol style="list-style-type: decimal; padding-left: 20px;" start="6">';
    
    const longQuestions = [
        'Discuss in detail the concept of {topic} with relevant examples.',
        'Compare and contrast {topic1} and {topic2}. Provide examples.',
        'Write a comprehensive essay on the evolution and significance of {topic}.',
        'Analyze the relationship between {topic1} and {topic2} in detail.',
        'Solve a practical problem using principles of {topic}. Show all steps.',
        'Critically evaluate the role of {topic} in modern context.'
    ];
    
    for (let i = 0; i < 4; i++) {
        if (importantTopics.length >= 2) {
            const topic1 = importantTopics[i % importantTopics.length];
            const topic2 = importantTopics[(i + 1) % importantTopics.length];
            let question = longQuestions[i % longQuestions.length];
            question = question.replace('{topic1}', topic1).replace('{topic2}', topic2).replace('{topic}', topic1);
            paper += `<li style="margin-bottom: 15px;">${question}</li>`;
        } else {
            let question = longQuestions[i % longQuestions.length];
            question = question.replace('{topic1}', importantTopics[0])
                              .replace('{topic2}', importantTopics[0])
                              .replace('{topic}', importantTopics[0]);
            paper += `<li style="margin-bottom: 15px;">${question}</li>`;
        }
    }
    paper += '</ol>';
    
    // Footer
    paper += '<div style="margin-top: 30px; padding: 15px; background: #f0f2f5; border-radius: 10px;">';
    paper += '<p style="margin: 0;"><strong>⏱️ Time:</strong> 1 hour</p>';
    paper += '<p style="margin: 5px 0 0;"><strong>📚 Total Marks:</strong> 30</p>';
    paper += '<p style="margin: 5px 0 0; color: #666; font-style: italic;">Answer all questions. Each question in Section A carries 2 marks, Section B carries 5 marks.</p>';
    paper += '</div></div>';
    
    paperContent.innerHTML = paper;
    paperResult.style.display = 'block';
});

// ============================================
// PART 4: Study Planner with Realistic Timetable
// ============================================

const addTaskBtn = document.getElementById('addTaskBtn');
const taskInput = document.getElementById('taskInput');
const taskDaySelect = document.getElementById('taskDaySelect');
const taskList = document.getElementById('taskList');
const weeklyTimetable = document.getElementById('weeklyTimetable');
const currentWeekInfo = document.getElementById('currentWeekInfo');

// Get current week dates
function getWeekDates() {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Calculate Monday (start of week)
    const monday = new Date(today);
    const diff = currentDay === 0 ? 6 : currentDay - 1;
    monday.setDate(today.getDate() - diff);
    
    const weekDates = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        weekDates.push({
            dayName: days[i],
            date: date,
            dateString: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            isToday: date.toDateString() === today.toDateString()
        });
    }
    
    return weekDates;
}

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';
    if (tasks.length === 0) {
        taskList.innerHTML = '<li style="text-align: center; color: #999; padding: 20px;">No tasks yet. Add one above!</li>';
        return;
    }
    
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(index));
        
        const span = document.createElement('span');
        span.textContent = task.text;
        
        const dayBadge = document.createElement('span');
        dayBadge.className = 'task-day-badge';
        dayBadge.textContent = task.day || 'Monday';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => deleteTask(index));
        
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(dayBadge);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

function renderTimetable() {
    const weekDates = getWeekDates();
    
    const startDate = weekDates[0].date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    const endDate = weekDates[6].date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    currentWeekInfo.textContent = `📅 Week of ${startDate} - ${endDate}`;
    
    let timetableHTML = '';
    
    weekDates.forEach(dayInfo => {
        const dayTasks = tasks.filter(task => task.day === dayInfo.dayName);
        
        let tasksHTML = '';
        if (dayTasks.length > 0) {
            dayTasks.forEach(task => {
                tasksHTML += `<div class="task-item ${task.completed ? 'completed' : ''}">${task.text}</div>`;
            });
        } else {
            tasksHTML = '<div class="no-tasks">✨ No tasks planned</div>';
        }
        
        timetableHTML += `
            <div class="timetable-day ${dayInfo.isToday ? 'today' : ''}">
                <div class="day-header">
                    <span class="day-name">${dayInfo.dayName}</span>
                    <span class="day-date">${dayInfo.dateString}</span>
                </div>
                <div class="day-tasks">
                    ${tasksHTML}
                </div>
            </div>
        `;
    });
    
    weeklyTimetable.innerHTML = timetableHTML;
}

function addTask() {
    const text = taskInput.value.trim();
    const day = taskDaySelect.value;
    
    if (text) {
        tasks.push({ 
            text, 
            day,
            completed: false,
            createdAt: new Date().toISOString()
        });
        saveTasks();
        taskInput.value = '';
        renderTasks();
        renderTimetable();
    } else {
        alert('Please enter a task description.');
    }
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
    renderTimetable();
}

function deleteTask(index) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
        renderTimetable();
    }
}

// Event listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Initial render
updateTopicsDisplay();
renderTasks();
renderTimetable();

// Refresh timetable at midnight
function checkForDateUpdate() {
    const now = new Date();
    const night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0, 0, 0
    );
    const msToMidnight = night.getTime() - now.getTime();
    
    setTimeout(() => {
        renderTimetable();
        setInterval(renderTimetable, 24 * 60 * 60 * 1000);
    }, msToMidnight);
}

checkForDateUpdate();