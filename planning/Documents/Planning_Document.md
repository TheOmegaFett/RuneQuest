### **Norse Rune Learning, Puzzle, and Divination App Planning Document**

#### **Overview**

The Norse Rune App is a web-based application that combines learning, puzzles, and divination tools. It provides users with an engaging way to explore the meanings and history of Norse runes, solve rune-based puzzles, and perform virtual rune readings for personal insights or guidance.

---

### **General Features**

#### **1. Rune Learning Module**

- **Interactive Guide**:
  - Displays each rune from the Elder Futhark alphabet.
  - Includes information about its name, pronunciation, meaning, reversed meaning (if applicable), and historical context.
- **Learning Tools**:
  - Flashcards to practice rune recognition.
  - Quizzes to test knowledge of rune meanings.

#### **2. Rune Puzzles**

- **Puzzle Types**:
  - **Pattern Completion**: Arrange runes in a specific order to complete a visual or thematic pattern.
  - **Decipher the Message**: Solve riddles or decode messages written in runes.
  - **Timed Challenges**: Solve puzzles within a given time limit to unlock new content.

#### **3. Rune Divination Module**

- **Casting Options**:

  - Single Rune Draw: Provides a focused insight.
  - Three-Rune Spread: Past, Present, and Future.
  - Five-Rune Spread: Adds Advice and Outcome positions.

- **Personalization**:

  - Users can input a question or theme to tailor interpretations.

- **Interpretation Features**:
  - Contextual relationships between runes in a spread.
  - Personalized readings based on user input.
  - Weighted rune selection for relevant themes.

#### **4. User Dashboard**

- Track progress in rune learning and puzzles.
- Save and revisit past divination readings.

#### **5. Visual Enhancements**

- Rune graphics, including upright and reversed orientations.
- Thematic visuals like Norse-style decorations or animations for rune casting.

---

### **Data Structures**

#### **1. Rune Dataset**

Structure for storing rune data:

```pseudo
Rune = {
  "name": String,  // Rune name (e.g., "Fehu")
  "meaning": String,  // Upright meaning
  "reversed": String,  // Reversed meaning
  "relationships": Map,  // Contextual relationships with other runes
  "theme_weights": Map,  // Weights for relevance to specific themes (e.g., love, career)
  "historical_context": String,  // Historical background
  "audio_pronunciation": URL,  // Link to audio file for pronunciation
}
```

**Example Rune Entry:**

```pseudo
Rune = {
  "name": "Fehu",
  "meaning": "Wealth, abundance, success",
  "reversed": "Loss, greed, stagnation",
  "relationships": {
    "Uruz": "Suggests strength will lead to success.",
    "Thurisaz": "Warns of potential greed-driven conflict."
  },
  "theme_weights": {
    "general": 1,
    "love": 2,
    "career": 3,
    "health": 1
  },
  "historical_context": "Fehu represents wealth in cattle, symbolizing prosperity in Norse culture.",
  "audio_pronunciation": "https://example.com/audio/fehu.mp3"
}
```

#### **2. User Data**

Structure for tracking user progress and preferences:

```pseudo
User = {
  "id": String,  // Unique identifier for the user
  "completed_quizzes": List,  // List of completed quiz IDs
  "saved_readings": List,  // List of past rune readings
  "preferences": {
    "theme": String,  // Default theme for divinations
    "difficulty": String  // Preferred puzzle difficulty level
  }
}
```

#### **3. Divination Reading**

Structure for storing a rune reading:

```pseudo
Reading = {
  "date": Date,  // Date of the reading
  "spread": String,  // Spread type (e.g., "three-rune")
  "question": String,  // User's input question
  "runes": List,  // List of cast runes with orientation and interpretation
  "interpretation": String  // Full interpretation text
}
```

---

### **User Flow**

#### **1. Learning Module**

1. User selects "Learn Runes" from the dashboard.
2. The app displays a grid of runes.
3. User clicks a rune to view its details and practice with flashcards or quizzes.

#### **2. Puzzle Module**

1. User selects "Rune Puzzles" from the dashboard.
2. The app displays available puzzles (locked/unlocked).
3. User completes puzzles to unlock new challenges or earn virtual badges.

#### **3. Divination Module**

1. User inputs a question or selects a theme.
2. User chooses a spread (Single Rune, Three Runes, Five Runes).
3. App casts runes and provides:
   - Rune graphics with upright/reversed orientation.
   - Position-based interpretations (e.g., Past, Present, Future).
   - Contextual insights and personalized interpretations.
4. User can save the reading or start a new one.

---

### **API Endpoints**

#### **1. Rune Data**

- GET /api/runes:
  - Returns a list of all runes with basic data.
- GET /api/runes/:id:
  - Returns detailed information for a specific rune.

#### **2. User Data**

- GET /api/user/:id:
  - Returns user progress and preferences.
- POST /api/user/:id/preferences:
  - Updates user preferences.

#### **3. Divination**

- POST /api/divination:
  - Accepts user input (spread type, question, theme).
  - Returns a generated rune reading.

#### **4. Puzzles**

- GET /api/puzzles:
  - Returns available puzzles with their status (locked/unlocked).
- POST /api/puzzles/:id/complete:
  - Marks a puzzle as completed.

---

### **Frontend Features**

#### **1. Dashboard**

- Navigation to Learning, Puzzles, and Divination modules.
- Progress indicators for completed quizzes and puzzles.

#### **2. Rune Details Page**

- Interactive rune display with text, audio, and visual elements.

#### **3. Divination Page**

- Clean UI for casting and displaying rune readings.
- Save and revisit options for past readings.

---

### **Potential Challenges and Solutions**

#### **Challenge**: Complex Relationships Between Runes

**Solution**: Use a relationship map or graph to dynamically determine rune interactions in a spread.

#### **Challenge**: Cultural Authenticity

**Solution**: Research Norse mythology thoroughly and include references to ensure accuracy and respect.

#### **Challenge**: Balancing Learning with Engagement

**Solution**: Combine educational content with interactive elements like puzzles and quizzes to keep users engaged.

---

### Ethical Development

As part of our efforts to adher to ethical web development practices over the course of this project, the development team will endeavour to do the following:

- RuneQuest will be designed to run on all major modern browsers, and the design of the website will be tested throughly to ensure that it looks and operates well on a range of devices.
  - Presently the above devices will include most smart phones, tablets and desktop and laptop screens.
  - Any browser that supports JavaScript and ExpressJs will be compatible. The latest versions of any package or program in the project will be used.
- All user interface components will made easily accesible for any user, and any forms will be clearly defined and inclusive.
- RuneQuest will not require any personal information from a user and as such will not cause any concerns for a user's security or privacy.
  - User data such as progress and settings preferences will be easy to export by the user for their own interest.
  - Any sensitive data, which should only include a user's password will be encrypted and be unavailable for direct reading from any other user.
- All links will be clearly defined and human-readable.
- All code will be optimised for performance, and follow DRY principles.
- Code comments will be used frequently to help any developer understand the purpose of code and files.
- Code will be tested and any errors will be handled appropriately.
- GitHub will be used for source control and all commits will have appropriate comments attached.
- Open source will be used first.
