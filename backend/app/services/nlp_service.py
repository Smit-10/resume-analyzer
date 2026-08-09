import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

NLP = spacy.load('en_core_web_sm')

# token.text      - Original text
# token.lower_    - Lowercase
# token.lemma_    - Root/base form
# token.pos_      - Part of Speech
# token.is_stop   - True if stop word
# token.is_punct  - True if punctuation
def tokenize(text: str) -> list[str]:
    doc = NLP(text)  # here, spaCy doesn't return a string, it returns a doc object
    tokens = []
    
    for token in doc:
        tokens.append(token.text)  # token is an object, hence call text attribute for actual token
    
    return tokens

def preprocess_for_tfidf(text: str) -> str:
    # Preprocessing the text for ID-IDF by:
    # - Tokenizing
    # - Removing punctuation
    # - Removing stop words
    # - Lemmatizing
    # - Converting to lowercase
    
    doc = NLP(text)
    processed_tokens = []
    
    for token in doc:
        if token.is_punct:  # if there is punctuation
            continue
        
        if token.is_stop:  # if there is stopword
            continue
        
        if token.is_space: # if there is space
            continue
        
        lemma = token.lemma_.lower()
        processed_tokens.append(lemma)
    
    return " ".join(processed_tokens)

def vectorize_documents(documents: list[str]):
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(documents)
    
    return tfidf_matrix

def calculate_similarity(resume_text: str, job_description: str) -> float:
    documents = [resume_text, job_description]
    tfidf_matrix = vectorize_documents(documents)
    
    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
    
    return float(similarity[0][0])