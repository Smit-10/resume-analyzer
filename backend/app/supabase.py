from supabase import create_client
from app.config import SUPABASE_URL, SUPABASE_SECRET_KEY

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_SECRET_KEY
)