// ===========================
// INITIALIZE DEFAULT VALUES
// ===========================

// Get tomorrow's date
const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
};

// Get first day of next month (returns day number)
const getFirstDayOfNextMonth = () => {
    return 1; // Always return 1 for 1st of every month
};

// Set default values on page load
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startDate').value = getTomorrowDate();
    document.getElementById('monthlyBonusDate').value = getFirstDayOfNextMonth();
});

// ===========================
// HINGLISH QUOTES
// ===========================
const hinglishQuotes = [
    "Bhai tu to consistency ka baap nikla 😎🔥",
    "Points aa rahe hain, tension jaa rahi hai 💸",
    "Aaj nahi to kal, tu target phodega 💪",
    "Boss level unlocked! Paisa hi paisa hoga 🤑",
    "Mast chal raha hai bhai, keep it up! 🚀",
    "Target dekh ke dar gaya tha, par tune kar dikhaya! 💯",
    "Shabash mere sher! Aage badh 🦁✨"
];

// ===========================
// CALCULATE REWARDS
// ===========================
const calculateRewards = () => {
    // Get all input values
    const dailyPoints = parseInt(document.getElementById('dailyPoints').value);
    const startDate = document.getElementById('startDate').value;
    const startingPoints = parseInt(document.getElementById('startingPoints').value);
    const targetPoints = parseInt(document.getElementById('targetPoints').value);
    const mondayBonus = parseInt(document.getElementById('mondayBonus').value);
    const monthlyBonus = parseInt(document.getElementById('monthlyBonus').value);
    const monthlyBonusDate = parseInt(document.getElementById('monthlyBonusDate').value); // Now it's a number (1-31)
    const weeklyStreakDay = parseInt(document.getElementById('weeklyStreakDay').value);
    const weeklyStreakPoints = parseInt(document.getElementById('weeklyStreakPoints').value);
    const bigStreakBonus = parseInt(document.getElementById('bigStreakBonus').value);
    const completedStreaks = parseInt(document.getElementById('completedStreaks').value);

    // Validation
    if (!startDate) {
        alert('Bhai start date to sahi se daalo! 📅');
        return;
    }

    if (targetPoints <= startingPoints) {
        alert('Target points starting points se zyada hone chahiye! 🎯');
        return;
    }

    // Initialize calculation variables
    let currentPoints = startingPoints;
    let currentDate = new Date(startDate);
    let streakCount = completedStreaks;
    let bigStreakAwarded = false;
    const milestones = [];
    let daysCount = 0;

    // Main calculation loop
    while (currentPoints < targetPoints) {
        daysCount++;

        // Add daily points
        currentPoints += dailyPoints;

        // Check Monday bonus
        if (currentDate.getDay() === 1 && mondayBonus > 0) {
            currentPoints += mondayBonus;
        }

        // Check monthly bonus
        // Check if current date's day matches the bonus day
        if (currentDate.getDate() === monthlyBonusDate && monthlyBonus > 0) {
            currentPoints += monthlyBonus;
            milestones.push({
                date: new Date(currentDate),
                type: 'monthly',
                points: monthlyBonus
            });
        }

        // Check weekly streak
        if (currentDate.getDay() === weeklyStreakDay && weeklyStreakPoints > 0) {
            currentPoints += weeklyStreakPoints;
            streakCount++;

            milestones.push({
                date: new Date(currentDate),
                type: 'weekly',
                streak: streakCount
            });

            // Check big streak (after 12 streaks)
            if (streakCount === 12 && !bigStreakAwarded && bigStreakBonus > 0) {
                currentPoints += bigStreakBonus;
                bigStreakAwarded = true;
                milestones.push({
                    date: new Date(currentDate),
                    type: 'bigstreak',
                    points: bigStreakBonus
                });
            }
        }

        // Check if target reached
        if (currentPoints >= targetPoints) {
            break;
        }

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);

        // Safety check to prevent infinite loop
        if (daysCount > 10000) {
            alert('Bhai itna time lagega? Apne inputs check karo! ⚠️');
            return;
        }
    }

    // Calculate progress percentage
    const progressPercent = Math.min(100, ((currentPoints - startingPoints) / (targetPoints - startingPoints)) * 100);

    // Display results
    displayResults({
        finalDate: currentDate,
        finalPoints: currentPoints,
        daysCount: daysCount,
        progressPercent: progressPercent.toFixed(1),
        milestones: milestones.slice(-3).reverse()
    });
};

// ===========================
// DISPLAY RESULTS
// ===========================
const displayResults = (result) => {
    const resultCard = document.getElementById('resultCard');
    const { finalDate, finalPoints, daysCount, progressPercent, milestones } = result;

    // Format date
    const formattedDate = finalDate.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
    });

    // Update result values
    document.getElementById('finalDate').textContent = formattedDate;
    document.getElementById('finalPoints').textContent = finalPoints.toLocaleString();
    document.getElementById('daysCount').textContent = `${daysCount} days`;
    document.getElementById('progressPercent').textContent = `${progressPercent}% 🚀`;

    // Update progress bar
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    progressBar.style.width = `${progressPercent}%`;
    if (progressPercent > 10) {
        progressText.textContent = `${progressPercent}%`;
    } else {
        progressText.textContent = '';
    }

    // Random quote
    const randomQuote = hinglishQuotes[Math.floor(Math.random() * hinglishQuotes.length)];
    document.getElementById('funnyQuote').textContent = `😂 ${randomQuote}`;

    // Display milestones
    if (milestones.length > 0) {
        const timelineSection = document.getElementById('timelineSection');
        const timelineList = document.getElementById('timelineList');
        timelineSection.classList.remove('hidden');
        timelineList.innerHTML = '';

        milestones.forEach(milestone => {
            const item = document.createElement('div');
            item.className = 'timeline-item';

            const label = document.createElement('span');
            label.className = 'timeline-label';
            
            if (milestone.type === 'weekly') {
                label.textContent = `🔥 Weekly Streak #${milestone.streak}`;
            } else if (milestone.type === 'monthly') {
                label.textContent = `📆 Monthly Bonus (+${milestone.points})`;
            } else if (milestone.type === 'bigstreak') {
                label.textContent = `💥 BIG STREAK! (+${milestone.points})`;
            }

            const date = document.createElement('span');
            date.className = 'timeline-date';
            date.textContent = milestone.date.toLocaleDateString('en-IN', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
            });

            item.appendChild(label);
            item.appendChild(date);
            timelineList.appendChild(item);
        });
    } else {
        document.getElementById('timelineSection').classList.add('hidden');
    }

    // Show result card with animation
    resultCard.classList.remove('hidden');
    resultCard.classList.add('shake');
    setTimeout(() => {
        resultCard.classList.remove('shake');
    }, 500);

    // Create confetti
    createConfetti();

    // Scroll to results
    setTimeout(() => {
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
};

// ===========================
// CREATE CONFETTI ANIMATION
// ===========================
const createConfetti = () => {
    const confettiContainer = document.getElementById('confettiContainer');
    confettiContainer.innerHTML = '';

    const colors = ['#fbbf24', '#ec4899', '#8b5cf6', '#06b6d4'];

    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        confettiContainer.appendChild(confetti);

        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
};

// ===========================
// RESET FORM
// ===========================
const resetForm = () => {
    // Reset to default values
    document.getElementById('dailyPoints').value = 65;
    document.getElementById('startDate').value = getTomorrowDate();
    document.getElementById('startingPoints').value = 894;
    document.getElementById('targetPoints').value = 7275;
    document.getElementById('mondayBonus').value = 30;
    document.getElementById('monthlyBonus').value = 700;
    document.getElementById('monthlyBonusDate').value = getFirstDayOfNextMonth();
    document.getElementById('weeklyStreakDay').value = 2;
    document.getElementById('weeklyStreakPoints').value = 100;
    document.getElementById('bigStreakBonus').value = 1000;
    document.getElementById('completedStreaks').value = 0;

    // Hide result card
    document.getElementById('resultCard').classList.add('hidden');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ===========================
// EVENT LISTENERS
// ===========================
document.getElementById('calculateBtn').addEventListener('click', calculateRewards);
document.getElementById('resetBtn').addEventListener('click', resetForm);

// Allow Enter key to calculate
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        calculateRewards();
    }
});