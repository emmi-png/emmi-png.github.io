// Game state management
class NightPathGame {
    constructor() {
        this.currentScreen = 'start';
        this.currentChapter = 0;
        this.gameData = {
            chapters: [
                {
                    id: 1,
                    context: "You find yourself beneath the trees of the Forest of Whispers. They say anyone who dares to enter must face choices that change their fate forever.",
                    choices: [
                        {
                            text: "Follow the mossy path",
                            image: "s1fp/images/1a.png",
                            nextChapter: 2
                        },
                        {
                            text: "Approach the glowing pond",
                            image: "s1fp/images/1b.png",
                            nextChapter: 3
                        }
                    ]
                },
                {
                    id: 2,
                    context: "The trail climbs upward, stones scraping beneath your boots, leading toward ancient ruins carved into the mountainside.",
                    choices: [
                        {
                            text: "Climb the stone staircase",
                            image: "s1fp/images/2a.png",
                            nextChapter: 4
                        },
                        {
                            text: "Explore the cave entrance",
                            image: "s1fp/images/2b.png",
                            nextChapter: 5
                        }
                    ]
                },
                {
                    id: 3,
                    context: "A pond gleams with pale blue light, its surface rippling though no wind stirs.",
                    choices: [
                        {
                            text: "Approach the glowing pond",
                            image: "s1fp/images/2c.png",
                            nextChapter: 6
                        },
                        {
                            text: "Ignore the pond, keep walking",
                            image: "s1fp/images/2d.png",
                            nextChapter: 7
                        }
                    ]
                },
                {
                    id: 4,
                    context: "Steps carved into the rock spiral toward a towering altar.",
                    choices: [
                        {
                            text: "Light the carved torch",
                            image: "s1fp/images/3a.png",
                            nextChapter: 'ending-guardian'
                        },
                        {
                            text: "Leave the torch unlit",
                            image: "s1fp/images/3b.png",
                            nextChapter: 'ending-monarch'
                        }
                    ]
                },
                {
                    id: 5,
                    context: "The cave breathes cold air, and a deep voice echoes inside.",
                    choices: [
                        {
                            text: "Speak to the echoing voice",
                            image: "s1fp/images/3c.png",
                            nextChapter: 'ending-elemental'
                        },
                        {
                            text: "Stay silent",
                            image: "s1fp/images/3d.png",
                            nextChapter: 'ending-consumed'
                        }
                    ]
                },
                {
                    id: 6,
                    context: "A pond gleams with pale blue light, its surface rippling though no wind stirs.",
                    choices: [
                        {
                            text: "Touch the water",
                            image: "s1fp/images/3e.png",
                            nextChapter: 'ending-reversed'
                        },
                        {
                            text: "Wait by the water",
                            image: "s1fp/images/3f.png",
                            nextChapter: 'ending-peaceful'
                        }
                    ]
                },
                {
                    id: 7,
                    context: "The path stretches into silence until you find a crooked hut covered in vines.",
                    choices: [
                        {
                            text: "Enter the abandoned hut",
                            image: "s1fp/images/3g.png",
                            nextChapter: 'ending-keeper'
                        },
                        {
                            text: "Pass by the hut",
                            image: "s1fp/images/3h.png",
                            nextChapter: 'ending-dream'
                        }
                    ]
                }
            ],
            endings: {
                'ending-guardian': {
                    title: "The Mountain Guardian",
                    description: "You strike the torch, and flames roar to life. The mountain trembles as statues open their eyes. A booming voice declares: \"You have awakened us. You are now the mountain's guardian.\" Your body turns to stone, immortal and unyielding, forever watching over the valley below."
                },
                'ending-monarch': {
                    title: "The Underground Ruler",
                    description: "You pass the unlit torch, but the steps crumble beneath your feet. You fall into darkness and land in a vast underground kingdom. Golden halls stretch endlessly. The people bow, calling you their long-awaited ruler. The choice is no longer yours — you are their monarch."
                },
                'ending-elemental': {
                    title: "The Voice of Power",
                    description: "\"Who dares disturb me?\" the voice growls. You answer bravely with your name. Silence falls… then the cave trembles. \"At last,\" it says. \"The one who speaks their truth.\" The voice gifts you a new name of power, and with it, the ability to command the elements themselves."
                },
                'ending-consumed': {
                    title: "The Silent Shadow",
                    description: "You remain silent. The voice grows hungrier. Shadows stretch, wrapping around you. \"So quiet… so empty,\" it whispers. Your silence is devoured, and so are you. You fade into darkness, leaving no trace that you ever entered the cave."
                },
                'ending-reversed': {
                    title: "The Backwards Life",
                    description: "As your hand breaks the surface, the ripples swallow you whole. Suddenly, you stand in a world where rivers flow upward, and night turns into day within seconds. Time itself moves backward. You realize you will live your life in reverse — forever reliving moments, but never moving forward."
                },
                'ending-peaceful': {
                    title: "The Patient Guardian",
                    description: "You sit quietly. The pond glows brighter until a figure of light emerges — a spirit guardian. It kneels before you and whispers, \"Few have the patience to wait. You may leave safely.\" The forest parts, and you return home, carrying the memory of peace that will guide you for the rest of your life."
                },
                'ending-keeper': {
                    title: "The Forest Keeper",
                    description: "Inside, dust swirls around shelves of decaying books. One tome hums with power. As you open it, roots burst from the floor, wrapping around your legs. You are bound to the forest as its new keeper — immortal, but forever trapped within its borders."
                },
                'ending-dream': {
                    title: "The Dreamer's Return",
                    description: "You resist curiosity and continue forward. The trees blur, the air fades, and suddenly you wake up in your own bed. The Forest of Whispers was nothing but a dream — or was it? A single leaf from the mossy path rests on your pillow."
                }
            }
        };
        this.init();
    }

    init() {
        this.bindEventListeners();
        this.showScreen('start');
    }

    bindEventListeners() {
        // Start button
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startGame();
        });

        // Choice buttons
        document.getElementById('choice-1').addEventListener('click', () => {
            this.makeChoice(0);
        });

        document.getElementById('choice-2').addEventListener('click', () => {
            this.makeChoice(1);
        });

        // Restart button
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restartGame();
        });
    }

    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        document.getElementById(`${screenName}-screen`).classList.add('active');
        this.currentScreen = screenName;
    }

    startGame() {
        this.currentChapter = 0;
        this.loadChapter(1);
        this.showScreen('choice');
    }

    loadChapter(chapterId) {
        const chapter = this.gameData.chapters.find(ch => ch.id === chapterId);
        if (!chapter) return;

        // Update story context
        document.getElementById('story-context').textContent = chapter.context;

        // Update choices
        chapter.choices.forEach((choice, index) => {
            const choiceNum = index + 1;
            document.getElementById(`choice-${choiceNum}-text`).textContent = choice.text;
            document.getElementById(`choice-${choiceNum}-img`).src = choice.image;
            document.getElementById(`choice-${choiceNum}-img`).alt = choice.text;
        });

        this.currentChapter = chapterId;
    }

    makeChoice(choiceIndex) {
        const currentChapter = this.gameData.chapters.find(ch => ch.id === this.currentChapter);
        if (!currentChapter) return;

        const selectedChoice = currentChapter.choices[choiceIndex];
        const nextChapter = selectedChoice.nextChapter;

        // Add choice selection animation
        const choiceBox = document.getElementById(`choice-${choiceIndex + 1}`);
        choiceBox.style.transform = 'scale(0.95)';
        choiceBox.style.borderColor = 'rgba(255, 255, 255, 0.8)';

        setTimeout(() => {
            if (typeof nextChapter === 'string' && nextChapter.startsWith('ending-')) {
                this.showEnding(nextChapter);
            } else {
                this.loadChapter(nextChapter);
            }
            
            // Reset choice box styles
            choiceBox.style.transform = '';
            choiceBox.style.borderColor = '';
        }, 300);
    }

    showEnding(endingId) {
        const ending = this.gameData.endings[endingId];
        if (!ending) return;

        document.getElementById('ending-title').textContent = ending.title;
        document.getElementById('ending-description').textContent = ending.description;
        
        this.showScreen('ending');
    }

    restartGame() {
        this.currentChapter = 0;
        this.showScreen('start');
    }

    // Method to update game data (for future use when you add more content)
    updateGameData(newChapters, newEndings) {
        if (newChapters) {
            this.gameData.chapters = newChapters;
        }
        if (newEndings) {
            this.gameData.endings = { ...this.gameData.endings, ...newEndings };
        }
    }

    // Method to add a single chapter
    addChapter(chapter) {
        this.gameData.chapters.push(chapter);
    }

    // Method to add a single ending
    addEnding(endingId, ending) {
        this.gameData.endings[endingId] = ending;
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new NightPathGame();
    
    // Make game globally accessible for debugging/updates
    window.nightPathGame = game;
});

// Utility function to create placeholder images with different colors
function createPlaceholderImage(width = 300, height = 200, color = '#667eea', text = 'Choice Image') {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, '#764ba2');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add text
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, width / 2, height / 2);
    
    return canvas.toDataURL();
}

// Create placeholder images when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Create different colored placeholders
    const placeholders = [
        { id: 'choice-1-img', color: '#667eea', text: 'Path Less Traveled' },
        { id: 'choice-2-img', color: '#764ba2', text: 'Well-Worn Trail' }
    ];

    placeholders.forEach(placeholder => {
        const img = document.getElementById(placeholder.id);
        if (img) {
            img.src = createPlaceholderImage(300, 200, placeholder.color, placeholder.text);
        }
    });
});