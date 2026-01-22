// --- Configuration ---
const MAX_ACTIONS_PER_SECOND = 5; // Threshold for suspicious activity
const WARNING_TIMEOUT = 2000;     // How long the warning stays visible

// --- State ---
let activityLog = [];
let actionTimestamps = []; // Used for rate limiting
let warningTimer = null;

// --- DOM Elements ---
const logContainer = document.getElementById('activity-log');
const warningBanner = document.getElementById('warning-banner');
const resetBtn = document.getElementById('reset-btn');
const exportBtn = document.getElementById('export-btn');

// --- 1. & 3. Event Listeners (Bubbling & Capturing) ---

// A. Track CLICKS (Bubbling Phase)
// We attach to document to catch clicks anywhere via propagation
document.addEventListener('click', (e) => {
    // Ignore clicks on the system control buttons themselves to avoid log spam
    if (e.target === resetBtn || e.target === exportBtn) return;
    
    logActivity('click', e.target);
});

// B. Track KEY PRESSES (Bubbling Phase)
document.addEventListener('keydown', (e) => {
    logActivity('keydown', e.target, `Key: ${e.key}`);
});

// C. Track FOCUS (Capturing Phase)
// Focus events do not bubble. We MUST use {capture: true} to catch them at the document level.
document.addEventListener('focus', (e) => {
    logActivity('focus', e.target);
}, { capture: true });


// --- Core Functions ---

/**
 * 2. Store activity and 4. Display log
 */
function logActivity(type, targetElement, details = '') {
    // Check for suspicious behavior first
    if (detectSuspiciousActivity()) {
        showWarning();
    }

    // Create log object
    const entry = {
        id: Date.now(),
        type: type.toUpperCase(),
        target: targetElement.tagName.toLowerCase() + (targetElement.id ? `#${targetElement.id}` : ''),
        details: details,
        timestamp: new Date().toLocaleTimeString()
    };

    // Store in state array
    activityLog.push(entry);

    // Update DOM
    renderLogEntry(entry);
}

/**
 * 4. Dynamically display activity in the DOM
 */
function renderLogEntry(entry) {
    const div = document.createElement('div');
    div.className = 'log-entry';
    div.innerHTML = `
        <span class="log-time">[${entry.timestamp}]</span>
        <span class="log-type">${entry.type}</span>: 
        Target <${entry.target}> ${entry.details}
    `;
    
    // Prepend to show newest first, or append for chronological
    logContainer.prepend(div);
}

/**
 * 5. Suspicious Activity Logic (Rate Limiter)
 */
function detectSuspiciousActivity() {
    const now = Date.now();
    // Add current timestamp to the tracker
    actionTimestamps.push(now);

    // Remove timestamps older than 1 second
    actionTimestamps = actionTimestamps.filter(t => now - t <= 1000);

    // If we have more actions than allowed in the last second
    return actionTimestamps.length > MAX_ACTIONS_PER_SECOND;
}

function showWarning() {
    warningBanner.style.display = 'block';
    
    // Clear previous timer if exists so the banner stays up if spamming continues
    if (warningTimer) clearTimeout(warningTimer);
    
    warningTimer = setTimeout(() => {
        warningBanner.style.display = 'none';
    }, WARNING_TIMEOUT);
}

// --- 6. Reset and Export Features ---

// Reset
resetBtn.addEventListener('click', () => {
    activityLog = [];
    actionTimestamps = [];
    logContainer.innerHTML = '';
    console.log("Log cleared.");
});

// Export
exportBtn.addEventListener('click', () => {
    if (activityLog.length === 0) {
        alert("No activity to export!");
        return;
    }

    // Format the log as a readable string
    let fileContent = "USER ACTIVITY LOG\n=================\n\n";
    activityLog.forEach(entry => {
        fileContent += `[${entry.timestamp}] ${entry.type} on <${entry.target}> ${entry.details}\n`;
    });

    // Create a Blob (file-like object) and trigger download
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'activity_log.txt';
    a.click();
    
    // Cleanup
    URL.revokeObjectURL(url);
});