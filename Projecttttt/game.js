class FlappyCat {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.startMessage = document.getElementById('startMessage');
        this.startMenu = document.getElementById('startMenu');
        
        // Set canvas size
        this.canvas.width = 360;
        this.canvas.height = 640;
        
        // Game state
        this.gameStarted = false;
        this.gameOver = false;
        this.score = 0;
        this.soundEnabled = true;
        
        // Load lose screen image
        this.loseImage = new Image();
        this.loseImage.src = 'sad u lose.png';
        
        // Audio setup
        this.jumpSound = new Audio('OIIAOIIA CAT but in 4K-[AudioTrimmer.com] (1).mp3');
        this.jumpSound.volume = 0.5;
        
        // Menu music
        this.menuMusic = new Audio('Yung Kai - Blue(Official music video)cat full versionfull video cat blue yung KaiOia Oia O eh eh.mp3');
        this.menuMusic.volume = 0.3;
        this.menuMusic.loop = true;
        this.menuMusic.play().catch(error => {
            console.log('Error playing menu music:', error);
        });

        // Gameplay music
        this.gameplayMusic = new Audio('OIIAOIIA CAT x Mingle Game Song  Uia Cat x Squid Game 2  OIIAOIIA Cat in Squid Game Season 2.mp3');
        this.gameplayMusic.volume = 0.3;
        this.gameplayMusic.loop = true;
        
        // Sound button setup
        this.soundButton = document.getElementById('soundButton');
        this.soundIcon = document.getElementById('soundIcon');
        this.soundButton.addEventListener('click', () => this.toggleSound());
        
        // Cat properties
        this.catX = this.canvas.width / 3;
        this.catY = this.canvas.height / 2;
        this.catWidth = 60;
        this.catHeight = 50;
        this.catSpeed = 0;
        this.gravity = 0.5;
        this.jumpForce = -8;
        
        // Load cat image
        this.catImage = new Image();
        this.catImage.onload = () => {
            console.log('Cat image loaded');
            this.draw();
        };
        this.catImage.src = 'sigma-removebg-preview.png';
        
        // Pipe properties
        this.pipes = [];
        this.pipeWidth = 52;
        this.pipeGap = 170; // Increased gap for cat
        this.pipeSpawnInterval = 2000;
        this.lastPipeSpawn = 0;
        
        // Event listeners
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('click', this.handleClick.bind(this));
        
        // Menu button listeners
        document.getElementById('playButton').addEventListener('click', () => this.startGame());
        document.getElementById('rateButton').addEventListener('click', () => {
            // Add rate functionality here
            alert('Rate functionality coming soon!');
        });
        document.getElementById('leaderboardButton').addEventListener('click', () => {
            // Add leaderboard functionality here
            alert('Leaderboard coming soon!');
        });
        
        // Start game loop
        this.lastTime = 0;
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    handleKeyDown(event) {
        if (event.code === 'Space') {
            if (this.gameStarted && !this.gameOver) {
                this.jump();
            }
        }
    }
    
    handleClick(event) {
        // Get click coordinates relative to canvas
        const rect = this.canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        
        // Ignore clicks on menu buttons
        if (event.target.closest('.menu-button') || event.target.closest('#rateButton') || event.target.closest('#soundButton')) {
            return;
        }
        
        // Check if play again button was clicked
        if (this.gameOver && this.playAgainButton) {
            if (clickX >= this.playAgainButton.x && 
                clickX <= this.playAgainButton.x + this.playAgainButton.width &&
                clickY >= this.playAgainButton.y && 
                clickY <= this.playAgainButton.y + this.playAgainButton.height) {
                // Reset game state
                this.gameOver = false;
                this.score = 0;
                this.catY = this.canvas.height / 2;
                this.catSpeed = 0;
                this.pipes = [];
                this.lastPipeSpawn = 0;
                this.updateScore();
                
                // Start the game immediately
                this.gameStarted = true;
                this.scoreElement.style.display = 'block';
                
                // Start gameplay music if sound is enabled
                if (this.soundEnabled) {
                    this.gameplayMusic.currentTime = 0;
                    this.gameplayMusic.play().catch(error => {
                        console.log('Error playing gameplay music:', error);
                    });
                }
                return;
            }
        }
        
        if (this.gameStarted && !this.gameOver) {
            this.jump();
        }
    }
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        
        // Update icon
        if (this.soundEnabled) {
            this.soundIcon.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCAxOGMtNC40MSAwLTgtMy41OS04LThzMy41OS04IDgtOCA4IDMuNTkgOCA4LTMuNTkgOC04IDh6Ii8+PHBhdGggZD0iTTEyIDZjLTMuMzEgMC02IDIuNjktNiA2czIuNjkgNiA2IDYgNi0yLjY5IDYtNi0yLjY5LTYtNi02em0wIDEwYy0yLjIxIDAtNC0xLjc5LTQtNHMxLjc5LTQgNC00IDQgMS43OSA0IDQtMS43OSA0LTQgNHoiLz48L3N2Zz4=";
            if (this.gameStarted && !this.gameOver) {
                this.gameplayMusic.play().catch(error => {
                    console.log('Error playing gameplay music:', error);
                });
            } else {
                this.menuMusic.play().catch(error => {
                    console.log('Error playing menu music:', error);
                });
            }
        } else {
            this.soundIcon.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTYuNSAxMmMwLTEuNzctLjk1LTMuMjktMi4zOC00LjE1TDEzIDkuMTljLjU3LjQ1IDEgMS4xMiAxIDEuODEgMCAxLjM4LTEuMTIgMi41LTIuNSAyLjUtLjY5IDAtMS4zMi0uMjgtMS43Ny0uNzRsLTEuMTQgMS4xNEMxMC45NSAxNC43MSAxMi4zOCAxNS41IDE0IDE1LjVjMi4yMSAwIDQtMS43OSA0LTMuNXptLTIuNSAwYzAtLjI4LS4yMi0uNS0uNS0uNXMtLjUuMjItLjUuNS4yMi41LjUuNS45LS4yMi45LS45ek0xOSAxMmMwIDEuMDgtLjM0IDIuMDgtLjkgMi45MWwxLjQxIDEuNDFjLjg3LTEuMjMgMS4zOS0yLjcxIDEuMzktNC4zMiAwLTQuMjgtMy40Ny03Ljc1LTcuNzUtNy43NS0xLjYxIDAtMy4wOS41Mi00LjMyIDEuMzlsMS40MSAxLjQxYy44My0uNTYgMS44My0uOSAyLjkxLS45IDMuMzEgMCA2IDIuNjkgNiA2ek0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDE4Yy00LjQxIDAtOC0zLjU5LTgtOHMzLjU5LTggOC04IDggMy41OSA4IDgtMy41OSA4LTggOHoiLz48L3N2Zz4=";
            this.menuMusic.pause();
            this.gameplayMusic.pause();
        }
    }
    
    startGame() {
        if (!this.gameStarted) {
            this.gameStarted = true;
            this.gameOver = false;
            this.score = 0;
            this.catY = this.canvas.height / 2;
            this.catSpeed = 0;
            this.pipes = [];
            this.lastPipeSpawn = 0;
            this.startMenu.style.display = 'none';
            this.startMessage.style.display = 'none';
            this.scoreElement.style.display = 'block';
            this.soundButton.style.display = 'none'; // Hide sound button during gameplay
            this.updateScore();
            
            // Stop menu music and start gameplay music only if sound is enabled
            this.menuMusic.pause();
            this.menuMusic.currentTime = 0;
            this.gameplayMusic.currentTime = 0;
            if (this.soundEnabled) {
                this.gameplayMusic.play().catch(error => {
                    console.log('Error playing gameplay music:', error);
                });
            }
        }
    }
    
    resetGame() {
        // Show menu and switch back to menu music
        this.startMenu.style.display = 'flex';
        this.soundButton.style.display = 'block'; // Show sound button in menu
        this.gameplayMusic.pause();
        this.gameplayMusic.currentTime = 0;
        this.menuMusic.currentTime = 0;
        if (this.soundEnabled) {
            this.menuMusic.play().catch(error => {
                console.log('Error playing menu music:', error);
            });
        }
        
        this.gameStarted = false;
        this.gameOver = false;
        this.score = 0;
        this.catY = this.canvas.height / 2;
        this.catSpeed = 0;
        this.pipes = [];
        this.lastPipeSpawn = 0;
        this.startMessage.style.display = 'none';
        this.scoreElement.style.display = 'none';
        this.updateScore();
    }
    
    jump() {
        this.catSpeed = this.jumpForce;
        // Play jump sound
        if (this.soundEnabled) {
            this.jumpSound.currentTime = 0;
            this.jumpSound.play().catch(error => {
                console.log('Error playing jump sound:', error);
            });
        }
    }
    
    spawnPipe() {
        const minHeight = 50;
        const maxHeight = this.canvas.height - this.pipeGap - minHeight;
        const height = Math.random() * (maxHeight - minHeight) + minHeight;
        
        this.pipes.push({
            x: this.canvas.width,
            height: height,
            passed: false
        });
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
    }
    
    checkCollision(pipe) {
        const catRight = this.catX + this.catWidth * 0.8;
        const catLeft = this.catX + this.catWidth * 0.2;
        const catTop = this.catY + this.catHeight * 0.2;
        const catBottom = this.catY + this.catHeight * 0.8;
        
        if (catRight > pipe.x && catLeft < pipe.x + this.pipeWidth &&
            (catTop < pipe.height || catBottom > pipe.height + this.pipeGap)) {
            return true;
        }
        return false;
    }
    
    showLoseScreen() {
        this.gameOver = true;
        // Stop gameplay music
        this.gameplayMusic.pause();
        this.gameplayMusic.currentTime = 0;
        
        // Draw the lose screen
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw "YOU LOSE" text
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('YOU LOSE', this.canvas.width / 2, this.canvas.height / 3);
        
        // Draw the lose image centered
        const imageWidth = 200;  // Adjust these values based on your image size
        const imageHeight = 200;
        const x = (this.canvas.width - imageWidth) / 2;
        const y = (this.canvas.height - imageHeight) / 2;
        this.ctx.drawImage(this.loseImage, x, y, imageWidth, imageHeight);
        
        // Draw "PLAY AGAIN" button with hover effect
        const buttonWidth = 160;
        const buttonHeight = 50;
        const buttonX = (this.canvas.width - buttonWidth) / 2;
        const buttonY = y + imageHeight + 20;
        
        // Store button position for click detection
        this.playAgainButton = {
            x: buttonX,
            y: buttonY,
            width: buttonWidth,
            height: buttonHeight
        };
        
        // Draw button background with shadow for better visibility
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        this.ctx.shadowBlur = 5;
        this.ctx.shadowOffsetY = 2;
        this.ctx.fillStyle = '#4CAF50';  // Green color
        this.ctx.beginPath();
        this.ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, 10);
        this.ctx.fill();
        
        // Reset shadow
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetY = 0;
        
        // Draw button text
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('PLAY AGAIN', this.canvas.width / 2, buttonY + buttonHeight / 2);
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background (sky blue)
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw pipes
        if (this.gameStarted) {
            for (const pipe of this.pipes) {
                // Draw pipes
                this.ctx.fillStyle = '#2ecc71';
                this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.height);
                this.ctx.fillRect(pipe.x, pipe.height + this.pipeGap,
                    this.pipeWidth, this.canvas.height - pipe.height - this.pipeGap);
            }
        }
        
        // Draw cat
        this.ctx.save();
        this.ctx.translate(this.catX + this.catWidth / 2, this.catY + this.catHeight / 2);
        this.ctx.rotate(Math.min(Math.max(this.catSpeed * 0.05, -0.3), 0.3));
        this.ctx.drawImage(this.catImage, 
            -this.catWidth / 2, -this.catHeight / 2, 
            this.catWidth, this.catHeight);
        this.ctx.restore();
        
        // Draw lose screen if game is over
        if (this.gameOver) {
            this.showLoseScreen();
        }
    }
    
    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        if (this.gameStarted && !this.gameOver) {
            // Update cat position
            this.catSpeed += this.gravity;
            this.catY += this.catSpeed;
            
            // Spawn pipes
            if (timestamp - this.lastPipeSpawn > this.pipeSpawnInterval) {
                this.spawnPipe();
                this.lastPipeSpawn = timestamp;
            }
            
            // Update pipes
            for (let i = this.pipes.length - 1; i >= 0; i--) {
                const pipe = this.pipes[i];
                pipe.x -= 2;
                
                // Check if pipe is passed
                if (!pipe.passed && pipe.x + this.pipeWidth < this.catX) {
                    pipe.passed = true;
                    this.score++;
                    this.updateScore();
                }
                
                // Remove off-screen pipes
                if (pipe.x + this.pipeWidth < 0) {
                    this.pipes.splice(i, 1);
                    continue;
                }
                
                // Check collision
                if (this.checkCollision(pipe)) {
                    this.showLoseScreen();
                }
            }
            
            // Check boundaries
            if (this.catY < 0) {
                this.catY = 0;
                this.catSpeed = 0;
            }
            if (this.catY + this.catHeight > this.canvas.height) {
                this.showLoseScreen();
            }
        }
        
        // Draw everything
        this.draw();
        
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}

// Start game when page loads
window.onload = () => {
    new FlappyCat();
}; 