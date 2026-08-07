import json
import re
from pathlib import Path

SKILLS_FILE = Path(__file__).parent.parent / "resources" / "skills.json"

# Load skills once when the application starts
with open(SKILLS_FILE, "r", encoding="utf-8") as file:
    SKILLS = json.load(file)

# the skills dictionary from above will now be flattened and converted into a single list
ALL_SKILLS = []
for category in SKILLS.values():
    ALL_SKILLS.extend(category)

# below function is made for calling ALL_SKILLS in other files
def get_all_skills() -> list[str]:
    return ALL_SKILLS

