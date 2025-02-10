const nlp = require("compromise");

// Named Entity Recognition (NER)
const extractEntities = (text) => {
    const doc = nlp(text);
    return {
        people: doc.people().out("array"),
        places: doc.places().out("array"),
        organizations: doc.organizations().out("array"),
    };
};

// Text Summarization (Simple Approach)
const summarizeText = (text, sentenceCount = 3) => {
    const sentences = text.split(". ").slice(0, sentenceCount).join(". ");
    return sentences ? sentences + "." : "No summary available.";
};

module.exports = { extractEntities, summarizeText };
