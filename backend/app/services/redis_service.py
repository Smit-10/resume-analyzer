import redis
import hashlib
import json
from app.config import REDIS_URL

redis_client = redis.Redis.from_url(
    REDIS_URL,
    decode_responses=True
)

CACHE_EXPIRATION = 60 * 60 * 24 * 30

def create_review_cache_key(resume_id: int, job_skills: list[str]) -> str:
    # Create a unique Redis key using resume ID and job skills.
    
    normalized_skills = sorted(skill.lower().strip() for skill in job_skills)
    
    skills_text = "|".join(normalized_skills)
    
    skills_hash = hashlib.sha256(skills_text.encode("utf-8")).hexdigest()
    
    return f"resume_review:{resume_id}:{skills_hash}"

def save_review(key: str, review: dict):
    # Save the LLM review in Redis for 30 days.
    try: 
        redis_client.setex(key, CACHE_EXPIRATION, json.dumps(review))
        print("Review saved in Redis.")
    
    except redis.RedisError:
        print("Redis unavailable. Review was not cached.")

def get_review(key: str):
    # Getting a cached review from Redis.
    # Returns: dict if cache hit, None if cache miss or Redis Unavailable
    
    try:
        cached_review = redis_client.get(key)
    
        if cached_review is None:
            return None
    
        return json.loads(cached_review)
    
    # if invalid or corrupted JSON is received, JSONDecodeError is raised
    except json.JSONDecodeError:
        print("Corrupted Redis Cache. Deleting cache.")
        
        try:
            redis_client.delete(key)
        except redis.RedisError:
            print("Could not delete corrupted Redis cache.")
            
        return None
    
    except redis.RedisError:
        print("Redis Unavailable. Skipping cache.")
        return None

def delete_reviews_for_resume(resume_id: int):
    try:
        # Delete a cached review
        pattern = f"resume_review:{resume_id}:*"
        
        # deletes cached review for given resume_id because if a resume is deleted,
        # everything related to that resume_id should be deleted from redis
        keys = redis_client.scan_iter(match=pattern)
        
        for key in keys:
            redis_client.delete(key)

    except redis.RedisError:
        print("Redis unavailable. Cached reviews could not be deleted.")