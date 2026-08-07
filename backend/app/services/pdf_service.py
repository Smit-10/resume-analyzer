import fitz
from pathlib import Path

def extract_text_from_pdf(pdf_path: Path) -> str:
    with fitz.open(pdf_path) as document:
        pages = []
        
        for page in document:
            pages.append(page.get_text())  # extracts text from each page and store each page's text as an element of list
    
    return "\n".join(pages)  # concatenate the strings(text of all pages)