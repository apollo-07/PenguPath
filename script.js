document.addEventListener("DOMContentLoaded", () => {
    // Game elements
    const gridContainer = document.getElementById("grid-container")
    const hintBtn = document.getElementById("hint-btn")
    const resetBtn = document.getElementById("reset-btn")
    const nextLevelBtn = document.getElementById("next-level-btn")
    const currentLevelDisplay = document.getElementById("current-level")
    const movesCountDisplay = document.getElementById("moves-count")
    const gameMessage = document.getElementById("game-message")
  
    // Modals
    const levelCompleteModal = document.getElementById("level-complete")
    const gameOverModal = document.getElementById("game-over")
    const gameCompleteModal = document.getElementById("game-complete")
    const levelMovesDisplay = document.getElementById("level-moves")
    const gameOverMessage = document.getElementById("game-over-message")
    const nextLevelModalBtn = document.getElementById("next-level-modal-btn")
    const retryBtn = document.getElementById("retry-btn")
    const restartGameBtn = document.getElementById("restart-game-btn")
  
    // Game state
    let grid = []
    let currentLevel = 1
    let movesCount = 0
    let penguinPosition = { row: 0, col: 0 }
    let goalPosition = { row: 0, col: 0 }
    let bearPositions = []
    let pathShown = false
    let gameActive = true
  
    // Cell types
    const CELL_TYPES = {
      ICE: 0,
      BROKEN: 1,
      GOAL: 2,
      MELTED: 3,
      BEAR: 4,
    }
  
    // Levels (0: ice, 1: broken ice, 2: goal, 4: bear)
    const levels = [
      // Level 1 - Simple introduction
      {
        grid: [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 2],
        ],
        start: { row: 0, col: 0 },
      },
      // Level 2 - Introduce obstacles
      {
        grid: [
          [0, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 2],
        ],
        start: { row: 0, col: 0 },
      },
      // Level 3 - More obstacles
      {
        grid: [
          [0, 0, 0, 0, 0],
          [0, 1, 1, 1, 0],
          [0, 0, 0, 0, 0],
          [0, 1, 1, 1, 0],
          [0, 0, 0, 0, 2],
        ],
        start: { row: 0, col: 0 },
      },
      // Level 4 - Introduce bear
      {
        grid: [
          [0, 0, 0, 0, 0],
          [0, 4, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 4, 0],
          [0, 0, 0, 0, 2],
        ],
        start: { row: 0, col: 0 },
      },
      // Level 5 - More complex with bears and obstacles
      {
        grid: [
          [0, 0, 0, 0, 0, 0],
          [0, 1, 1, 0, 4, 0],
          [0, 0, 0, 0, 1, 0],
          [0, 4, 1, 0, 0, 0],
          [0, 0, 0, 0, 1, 0],
          [0, 0, 0, 0, 0, 2],
        ],
        start: { row: 0, col: 0 },
      },
      // Level 6 - Maze-like
      {
        grid: [
          [0, 0, 0, 0, 1, 0],
          [1, 1, 0, 1, 0, 0],
          [0, 0, 0, 0, 0, 1],
          [0, 1, 1, 1, 0, 0],
          [0, 0, 0, 1, 1, 0],
          [1, 1, 0, 0, 0, 2],
        ],
        start: { row: 0, col: 0 },
      },
      // Level 7 - Bears and maze
      {
        grid: [
          [0, 0, 0, 1, 0, 0, 0],
          [0, 1, 0, 0, 0, 1, 0],
          [0, 0, 0, 1, 0, 4, 0],
          [1, 1, 0, 0, 0, 0, 0],
          [0, 0, 0, 1, 1, 1, 0],
          [0, 4, 0, 0, 0, 0, 0],
          [0, 0, 0, 1, 0, 0, 2],
        ],
        start: { row: 0, col: 0 },
      },
      // Level 8 - Complex maze with bears
      {
        grid: [
          [0, 0, 0, 0, 1, 0, 0],
          [0, 1, 1, 0, 0, 0, 1],
          [0, 0, 0, 0, 1, 0, 0],
          [1, 1, 1, 4, 0, 0, 1],
          [0, 0, 0, 1, 1, 0, 0],
          [0, 1, 0, 0, 0, 0, 1],
          [0, 4, 0, 1, 0, 0, 2],
        ],
        start: { row: 0, col: 0 },
      },
      // Level 9 - Challenging path
      {
        grid: [
          [0, 0, 0, 0, 1, 0, 0, 0],
          [1, 1, 1, 0, 0, 0, 1, 0],
          [0, 0, 0, 0, 1, 0, 0, 0],
          [0, 1, 1, 4, 0, 1, 1, 0],
          [0, 0, 0, 1, 0, 0, 0, 0],
          [1, 1, 0, 0, 0, 1, 1, 0],
          [0, 0, 0, 1, 0, 0, 4, 0],
          [0, 1, 0, 0, 0, 1, 0, 2],
        ],
        start: { row: 0, col: 0 },
      },
      // Level 10 - Very challenging
      {
        grid: [
          [0, 0, 0, 0, 1, 0, 0, 0],
          [0, 1, 1, 0, 0, 0, 1, 0],
          [0, 0, 4, 0, 1, 0, 0, 0],
          [1, 0, 1, 1, 0, 1, 1, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 1, 1, 1, 1, 1, 0, 1],
          [0, 0, 0, 0, 0, 4, 0, 0],
          [1, 1, 1, 1, 0, 0, 1, 2],
        ],
        start: { row: 0, col: 0 },
      },
      // Level 11 - Larger grid with multiple bears
      {
        grid: [
          [0, 0, 0, 0, 0, 1, 0, 0, 0],
          [0, 1, 1, 0, 0, 0, 0, 1, 0],
          [0, 0, 0, 0, 1, 1, 0, 0, 0],
          [1, 1, 1, 0, 0, 0, 0, 1, 0],
          [0, 0, 4, 0, 1, 1, 0, 0, 0],
          [0, 1, 1, 0, 0, 0, 0, 1, 0],
          [0, 0, 0, 0, 1, 4, 0, 0, 0],
          [1, 1, 1, 0, 0, 0, 0, 1, 0],
          [0, 0, 0, 0, 1, 0, 0, 0, 2],
        ],
        start: { row: 0, col: 0 },
      },
      // Level 12 - Complex path with bears
      {
        grid: [
          [0, 0, 0, 0, 1, 0, 0, 0, 0],
          [1, 1, 1, 0, 0, 0, 1, 1, 0],
          [0, 0, 0, 0, 1, 0, 0, 0, 0],
          [0, 1, 1, 4, 0, 1, 1, 0, 1],
          [0, 0, 0, 1, 0, 0, 0, 0, 0],
          [1, 1, 0, 0, 0, 1, 1, 1, 0],
          [0, 4, 0, 1, 0, 0, 4, 0, 0],
          [0, 1, 0, 0, 1, 1, 0, 1, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 2],
        ],
        start: { row: 0, col: 0 },
      },
      // Level 13 - Bear maze
      {
        grid: [
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
          [0, 1, 0, 1, 1, 1, 1, 0, 1, 0],
          [0, 1, 0, 1, 0, 0, 4, 0, 1, 0],
          [0, 1, 0, 1, 0, 1, 1, 0, 1, 0],
          [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        ],
        start: { row: 0, col: 0 },
      },
      // Level 14 - Bear gauntlet
      {
        grid: [
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
          [0, 0, 0, 0, 4, 0, 0, 0, 0, 0],
          [1, 1, 1, 0, 1, 0, 1, 1, 1, 0],
          [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
          [0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
          [0, 0, 0, 0, 4, 0, 0, 0, 0, 0],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        ],
        start: { row: 0, col: 0 },
      },
      // Level 15 - Final challenge
      {
        grid: [
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 1, 0, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 0, 1, 0, 0, 0, 4, 0, 0],
          [0, 1, 0, 1, 0, 1, 1, 1, 1, 0],
          [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 1, 1, 1, 1, 1, 1, 0, 1, 1],
          [0, 0, 0, 0, 0, 0, 4, 0, 0, 0],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        ],
        start: { row: 0, col: 0 },
      },
    ]
  
    // Initialize the game
    function initGame() {
      loadLevel(currentLevel)
  
      // Event listeners
      hintBtn.addEventListener("click", showHint)
      resetBtn.addEventListener("click", resetLevel)
      nextLevelBtn.addEventListener("click", goToNextLevel)
      nextLevelModalBtn.addEventListener("click", goToNextLevel)
      retryBtn.addEventListener("click", resetLevel)
      restartGameBtn.addEventListener("click", restartGame)
    }
  
    // Load a specific level
    function loadLevel(levelNum) {
      if (levelNum > levels.length) {
        showGameComplete()
        return
      }
  
      const level = levels[levelNum - 1]
      grid = JSON.parse(JSON.stringify(level.grid)) // Deep copy
      penguinPosition = { ...level.start }
      movesCount = 0
      pathShown = false
      gameActive = true
  
      // Find goal position and bear positions
      bearPositions = []
      for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
          if (grid[row][col] === CELL_TYPES.GOAL) {
            goalPosition = { row, col }
          } else if (grid[row][col] === CELL_TYPES.BEAR) {
            bearPositions.push({ row, col })
          }
        }
      }
  
      renderGrid()
      updateUI()
  
      // Show level message
      gameMessage.textContent = `Level ${levelNum}: Help the penguin reach the igloo!`
      setTimeout(() => {
        gameMessage.textContent = ""
      }, 3000)
    }
  
    // Render the grid
    function renderGrid() {
      gridContainer.innerHTML = ""
  
      // Set grid dimensions
      const rows = grid.length
      const cols = grid[0].length
      gridContainer.style.gridTemplateRows = `repeat(${rows}, 50px)`
      gridContainer.style.gridTemplateColumns = `repeat(${cols}, 50px)`
  
      // Create grid cells
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const cell = document.createElement("div")
          cell.classList.add("grid-cell")
  
          // Set cell type
          switch (grid[row][col]) {
            case CELL_TYPES.ICE:
              cell.classList.add("ice")
              break
            case CELL_TYPES.BROKEN:
              cell.classList.add("broken")
              break
            case CELL_TYPES.GOAL:
              cell.classList.add("goal")
              cell.innerHTML = "🏠" // Igloo emoji
              cell.classList.add("igloo")
              break
            case CELL_TYPES.MELTED:
              cell.classList.add("melted")
              break
            case CELL_TYPES.BEAR:
              cell.classList.add("bear-color")
              cell.innerHTML = "🐻" // Bear emoji
              cell.classList.add("bear")
              break
          }
  
          // Add penguin to starting position
          if (row === penguinPosition.row && col === penguinPosition.col) {
            // If the cell already has content (like an igloo), we need to preserve it
            const existingContent = cell.innerHTML
            cell.innerHTML = "🐧" + existingContent // Penguin emoji
            cell.classList.add("penguin")
          }
  
          // Add click event for movement
          cell.addEventListener("click", () => handleCellClick(row, col))
  
          gridContainer.appendChild(cell)
        }
      }
  
      // Highlight adjacent cells
      highlightAdjacentCells()
    }
  
    // Highlight cells adjacent to the penguin
    function highlightAdjacentCells() {
      const cells = document.querySelectorAll(".grid-cell")
      const rows = grid.length
      const cols = grid[0].length
  
      // Remove all highlights first
      cells.forEach((cell) => cell.classList.remove("adjacent"))
  
      // Add highlights to adjacent cells
      const directions = [
        { row: -1, col: 0 }, // up
        { row: 1, col: 0 }, // down
        { row: 0, col: -1 }, // left
        { row: 0, col: 1 }, // right
      ]
  
      directions.forEach((dir) => {
        const newRow = penguinPosition.row + dir.row
        const newCol = penguinPosition.col + dir.col
  
        // Check if the new position is within bounds
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
          // Don't highlight broken ice
          if (grid[newRow][newCol] !== CELL_TYPES.BROKEN) {
            const index = newRow * cols + newCol
            cells[index].classList.add("adjacent")
          }
        }
      })
    }
  
    // Handle cell click for movement
    function handleCellClick(row, col) {
      if (!gameActive) return
  
      // Check if the clicked cell is adjacent to the penguin
      const rowDiff = Math.abs(row - penguinPosition.row)
      const colDiff = Math.abs(col - penguinPosition.col)
      const isAdjacent = (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)
  
      if (isAdjacent) {
        // Check if the cell is valid for movement
        if (grid[row][col] === CELL_TYPES.BROKEN) {
          gameMessage.textContent = "You can't move onto cracked ice!"
          setTimeout(() => {
            gameMessage.textContent = ""
          }, 2000)
          return
        }
  
        // Check if the cell is a bear
        if (grid[row][col] === CELL_TYPES.BEAR) {
          gameOver("Oh no! The penguin was caught by a polar bear!")
          return
        }
  
        // Check if the cell is melted ice
        if (grid[row][col] === CELL_TYPES.MELTED) {
          gameOver("Oh no! The penguin fell into the icy water!")
          return
        }
  
        // Mark the current position as melted
        if (grid[penguinPosition.row][penguinPosition.col] !== CELL_TYPES.GOAL) {
          grid[penguinPosition.row][penguinPosition.col] = CELL_TYPES.MELTED
        }
  
        // Move the penguin
        penguinPosition = { row, col }
        movesCount++
  
        // Check if the penguin reached the goal
        if (row === goalPosition.row && col === goalPosition.col) {
          levelComplete()
        } else {
          renderGrid()
          updateUI()
        }
      } else {
        gameMessage.textContent = "You can only move to adjacent tiles!"
        setTimeout(() => {
          gameMessage.textContent = ""
        }, 2000)
      }
    }
  
    // Show the optimal path using A* algorithm
    function showHint() {
      if (!gameActive) return
  
      const path = findPath(penguinPosition, goalPosition)
  
      if (path.length > 0) {
        // Mark the path on the grid
        const cells = document.querySelectorAll(".grid-cell")
        const cols = grid[0].length
  
        path.forEach((pos) => {
          // Skip the start and end positions
          if (
            (pos.row === penguinPosition.row && pos.col === penguinPosition.col) ||
            (pos.row === goalPosition.row && pos.col === goalPosition.col)
          ) {
            return
          }
  
          const index = pos.row * cols + pos.col
          cells[index].classList.add("path")
        })
  
        pathShown = true
        gameMessage.textContent = "Here's the optimal path to the igloo!"
        setTimeout(() => {
          gameMessage.textContent = ""
        }, 3000)
      } else {
        gameMessage.textContent = "There's no valid path to the igloo!"
        setTimeout(() => {
          gameMessage.textContent = ""
        }, 3000)
      }
    }
  
    // A* pathfinding algorithm
    function findPath(start, goal) {
      const rows = grid.length
      const cols = grid[0].length
  
      // Create a 2D array to track visited nodes
      const visited = Array(rows)
        .fill()
        .map(() => Array(cols).fill(false))
  
      // Create a 2D array to track the parent of each node
      const parent = Array(rows)
        .fill()
        .map(() => Array(cols).fill(null))
  
      // Create a priority queue for the open set
      const openSet = [
        {
          pos: start,
          f: heuristic(start, goal),
          g: 0,
        },
      ]
  
      while (openSet.length > 0) {
        // Sort the open set by f value (lowest first)
        openSet.sort((a, b) => a.f - b.f)
  
        // Get the node with the lowest f value
        const current = openSet.shift()
        const { row, col } = current.pos
  
        // Check if we've reached the goal
        if (row === goal.row && col === goal.col) {
          // Reconstruct the path
          const path = []
          let currentPos = { row, col }
  
          while (currentPos) {
            path.unshift(currentPos)
            currentPos = parent[currentPos.row][currentPos.col]
          }
  
          return path
        }
  
        // Mark the current node as visited
        visited[row][col] = true
  
        // Check all adjacent nodes
        const directions = [
          { row: -1, col: 0 }, // up
          { row: 1, col: 0 }, // down
          { row: 0, col: -1 }, // left
          { row: 0, col: 1 }, // right
        ]
  
        for (const dir of directions) {
          const newRow = row + dir.row
          const newCol = col + dir.col
  
          // Check if the new position is within bounds
          if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            // Check if the new position is valid and not visited
            if (
              !visited[newRow][newCol] &&
              grid[newRow][newCol] !== CELL_TYPES.BROKEN &&
              grid[newRow][newCol] !== CELL_TYPES.MELTED &&
              grid[newRow][newCol] !== CELL_TYPES.BEAR
            ) {
              const g = current.g + 1
              const h = heuristic({ row: newRow, col: newCol }, goal)
              const f = g + h
  
              // Check if the node is already in the open set
              const existingNode = openSet.find((node) => node.pos.row === newRow && node.pos.col === newCol)
  
              if (!existingNode || g < existingNode.g) {
                // Add the node to the open set
                if (!existingNode) {
                  openSet.push({
                    pos: { row: newRow, col: newCol },
                    f,
                    g,
                  })
                } else {
                  existingNode.f = f
                  existingNode.g = g
                }
  
                // Set the parent
                parent[newRow][newCol] = { row, col }
              }
            }
          }
        }
      }
  
      // No path found
      return []
    }
  
    // Heuristic function for A* (Manhattan distance)
    function heuristic(a, b) {
      return Math.abs(a.row - b.row) + Math.abs(a.col - b.col)
    }
  
    // Level complete
    function levelComplete() {
      gameActive = false
  
      // Show level complete modal
      levelMovesDisplay.textContent = movesCount
      levelCompleteModal.style.display = "flex"
  
      // Enable next level button
      nextLevelBtn.disabled = false
    }
  
    // Game over
    function gameOver(message) {
      gameActive = false
  
      // Show game over modal
      gameOverMessage.textContent = message
      gameOverModal.style.display = "flex"
    }
  
    // Show game complete modal
    function showGameComplete() {
      gameCompleteModal.style.display = "flex"
    }
  
    // Go to next level
    function goToNextLevel() {
      // Hide modals
      levelCompleteModal.style.display = "none"
  
      // Load next level
      currentLevel++
      loadLevel(currentLevel)
    }
  
    // Reset the current level
    function resetLevel() {
      // Hide modals
      gameOverModal.style.display = "none"
  
      // Reload the current level
      loadLevel(currentLevel)
    }
  
    // Restart the game
    function restartGame() {
      // Hide modals
      gameCompleteModal.style.display = "none"
  
      // Reset to level 1
      currentLevel = 1
      loadLevel(currentLevel)
    }
  
    // Update UI elements
    function updateUI() {
      currentLevelDisplay.textContent = currentLevel
      movesCountDisplay.textContent = movesCount
  
      // Disable next level button if not at the end of a level
      nextLevelBtn.disabled = !(penguinPosition.row === goalPosition.row && penguinPosition.col === goalPosition.col)
    }
  
    // Initialize the game
    initGame()
  })
  