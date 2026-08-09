import json
import re
from pathlib import Path
from app.services.skill_aliases import SKILL_ALIASES

SKILLS_FILE = Path(__file__).parent.parent / "resources" / "skills.json"

# Load skills once when the application starts
with open(SKILLS_FILE, "r", encoding="utf-8") as file:
    SKILLS = json.load(file)

# the skills dictionary from above will now be flattened and converted into a single list
ALL_SKILLS = []
for category in SKILLS.values():
    ALL_SKILLS.extend(category)
    
# Creating a lookup for canonical skill names.
# Example:
# "python" -> "Python"
# "fastapi" -> "FastAPI"
# CANONICAL_SKILLS = {skill.lower(): skill for skill in ALL_SKILLS}
CANONICAL_SKILLS = {}
for skill in ALL_SKILLS:
    CANONICAL_SKILLS[skill.lower()] = skill

SKILL_SEARCH_TERMS = {}

for skill in ALL_SKILLS:
    SKILL_SEARCH_TERMS[skill] = [skill]

for alias, canonical_skill in SKILL_ALIASES.items():
    if canonical_skill in SKILL_SEARCH_TERMS:
        SKILL_SEARCH_TERMS[canonical_skill].append(alias)

# below function is made for calling ALL_SKILLS in other files
def get_all_skills() -> list[str]:
    return ALL_SKILLS

def normalize_skill(skill: str) -> str:
    # Converts a skill or alias into its canonical skill name
    # eg, fastapi -> FastAPI
    # python -> Python
    
    skill = skill.strip().lower()
    
    canonical_skills = SKILL_ALIASES.get(skill, skill)
    
    return CANONICAL_SKILLS.get(
        canonical_skills.lower(),
        canonical_skills
    )

def extract_skills(text: str) -> list[str]:
    # Extracts skills from the given text and returns
    # canonical skill names.
    matched_skills = []
    text = text.lower()
    
    for canonical_skill, search_terms in SKILL_SEARCH_TERMS.items():
        for term in search_terms:
            # Escapes special regex characters such as:
            # C++, Node.js, ASP.NET, etc.
            escaped_term = re.escape(term.lower())
            
            # Matching the skill as a complete phrase
            pattern = rf"(?<!\w){escaped_term}(?!\w)"
            
            if re.search(pattern, text):
                matched_skills.append(canonical_skill)
                
                # Once one version of the skill is found,
                # don't check its other aliases.
                break
    
    return matched_skills