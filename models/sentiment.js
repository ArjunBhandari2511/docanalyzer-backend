const Sentiment = require("sentiment");

const sentiment = new Sentiment();

// Sentiment Analysis Function
const analyzeSentiment = (text) => {
    const result = sentiment.analyze(text);
    return {
        score: result.score, // Positive or Negative sentiment score
        comparative: result.comparative, // Strength of sentiment
        positiveWords: result.positive,
        negativeWords: result.negative,
    };
};

module.exports = { analyzeSentiment };
