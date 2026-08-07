import spacy

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