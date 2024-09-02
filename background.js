// Define the clusters and keywords
let clusters = {
    'Education': [],
    'Technology': [],
    'News': [],
    'Mathematics': [],
    'Science': [],
    'English': [],
    'AI': [],
    'Art': [],
    'Music': [],
    'Shopping': [],
    'Unclassified': [],
    'Hass': [],
    'Religious Education': [],
    'Sport': []
};

const keywords = {
    'Education': ['education', 'school', 'university', 'courses', 'college', 'emmanuel', 'clickview', 'cewa'],
    'Technology': ['technology', 'tech', 'gadgets', 'electronics', 'smartphone', 'gaming', 'computers', 'software', 'hardware'],
    'News': ['news', 'current events', 'breaking news', 'headline', 'headlines', 'abc'],
    'Mathematics': ['mathematics', 'math', 'algebra', 'geometry', 'mathspace'],
    'Science': ['science', 'biology', 'chemistry', 'physics', 'cells'],
    'English': ['literature', 'books', 'reading', 'novels', 'book', 'library', 'goodreads', 'english', 'novel', 'poetry'],
    'AI': ['artificial intelligence', 'machine learning', 'AI', 'deep learning', 'chatgpt', 'bot', 'midjourney'],
    'Art': ['art', 'painting', 'sculpture', 'gallery', 'artist', 'artwork', 'museum'],
    'Music': ['music', 'songs', 'bands', 'concerts', 'albums', 'discography', 'guitar', 'sing', 'bass'],
    'Shopping': ['shopping', 'commerce', 'sale', 'buy', 'store', 'shop', 'ebay', 'amazon', 'retail', 'marketplace', 'temu', 'kmart'],
    'Hass': ['history', 'geography', 'social sciences', 'geographic', 'politics', 'law', 'opinion', 'legislation', 'parliament', 'government'],
    'Religious Education': ['religion', 'religious education', 'theology', 'spirituality', 'bible study', 'theological', 'pope', 'vatican', 'catholic', 'jesus', 'CEWA'],
    'Sport': ['basketball', 'cricket', 'golf', 'bbc sport', 'formula 1', 'boxing', 'super bowl', 'epl', 'mlb', 'tennis', 'world cup', 'soccer', 'motocross', 'nhl', 'wrestling', 'darts', 'handball', 'baseball', 'rugby', 'nba', 'playoffs', 'athlete', 'football', 'nfl', 'snooker', 'hockey', 'espn', 'afl'],
    'Unclassified': []
};

// Fetch and analyze metadata, then categorize based on that
async function fetchAndAnalyzeMetadata(url) {
    try {
        const response = await fetch(url);
        const htmlText = await response.text();
        const descriptionMatch = htmlText.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
        const keywordsMatch = htmlText.match(/<meta\s+name="keywords"\s+content="([^"]*)"/i);

        let categoryIdentified = 'Unclassified';
        Object.keys(keywords).forEach(category => {
            if ((descriptionMatch && keywords[category].some(keyword => descriptionMatch[1].includes(keyword))) ||
                (keywordsMatch && keywords[category].some(keyword => keywordsMatch[1].includes(keyword)))) {
                if (!clusters[category].includes(url.hostname)) {
                    clusters[category].push(url.hostname);
                    categoryIdentified = category;
                }
            }
        });

        return categoryIdentified;
    } catch (error) {
        console.error('Failed to fetch or parse page:', error);
        return 'Unclassified';
    }
}

// Categorize based directly on URL without fetching metadata
function categorizeBasedOnURL(item) {
    let sorted = false;
    Object.keys(keywords).forEach(category => {
        if (keywords[category].some(keyword => item.url.includes(keyword))) {
            sorted = true;
            if (!clusters[category].includes(item)) {
                clusters[category].push(item);
            }
        }
    });
    return sorted;
}

// Main function to handle categorization of history items
async function categorizeHistoryItem(item) {
//    let url = new URL(item.url);
    console.log(item);
    let categorized = false;
    categorized = categorizeBasedOnURL(item);
//    if (!categorized) {
//        categorized = await fetchAndAnalyzeMetadata(url.href);
//    }
    if (!categorized) {
        if (!clusters['Unclassified'].includes(item)) {
            clusters['Unclassified'].push(item);
        }
    }
    chrome.storage.local.set({ clusters: clusters });
}

// Set up listeners for history visits and categorize them
chrome.history.onVisited.addListener(categorizeHistoryItem);

// Categorize existing history on startup
chrome.history.search({ text: '', maxResults: 1000 }, data => {
    data.forEach(categorizeHistoryItem);
});