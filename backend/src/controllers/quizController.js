const QuizQuestion = require("../models/QuizQuestion");

// jest.setTimeout(30000); // Increase global timeout to 30 seconds - Causes issues when running

// Get quiz questions by difficulty
exports.getQuizByDifficulty = async (req, res) => {
  try {
    const { difficulty } = req.params;
    const count = parseInt(req.query.count) || 10;

    // Validate difficulty
    if (!["easy", "medium", "hard"].includes(difficulty)) {
      return res.status(400).json({
        success: false,
        error: "Invalid difficulty level. Must be easy, medium, or hard.",
        data: null,
      });
    }

    // Get random questions of specified difficulty
    const questions = await QuizQuestion.aggregate([
      { $match: { difficulty } },
      { $sample: { size: count } },
    ]);

    // Format questions for client
    const formattedQuestions = questions.map((question) => {
      let optionCount;
      switch (difficulty) {
        case "easy":
          optionCount = 2;
          break;
        case "medium":
          optionCount = 3;
          break;
        case "hard":
          optionCount = 4;
          break;
        default:
          optionCount = 4;
      }

      // Get all options but limit based on difficulty
      const allOptions = [
        question.correctMeaning,
        ...question.incorrectMeanings,
      ];
      // Always include correct answer, then add random incorrect ones up to the count
      const correctOption = allOptions[0];
      const incorrectOptions = allOptions
        .slice(1)
        .sort(() => 0.5 - Math.random())
        .slice(0, optionCount - 1);
      const options = [correctOption, ...incorrectOptions].sort(
        () => 0.5 - Math.random()
      );

      return {
        id: question._id,
        rune: question.rune,
        options,
        difficulty: question.difficulty,
        category: question.category,
      };
    });

    // Return the formatted questions - this was missing!
    return res.status(200).json({
      success: true,
      data: formattedQuestions,
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to retrieve quiz questions: " + error.message,
      data: null,
    });
  }
};
// Check quiz answer
exports.checkAnswer = async (req, res) => {
  try {
    const { questionId, selectedAnswer } = req.body;

    if (!questionId || !selectedAnswer) {
      return res.status(400).json({
        success: false,
        error: "Question ID and selected answer are required",
        data: null,
      });
    }

    const question = await QuizQuestion.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        error: "Question not found",
        data: null,
      });
    }

    const isCorrect = selectedAnswer === question.correctMeaning;

    return res.json({
      success: true,
      data: {
        isCorrect,
        correctAnswer: question.correctMeaning,
        additionalInfo: question.additionalInfo,
      },
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to check answer: " + error.message,
      data: null,
    });
  }
};
