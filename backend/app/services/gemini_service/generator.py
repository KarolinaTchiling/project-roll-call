import google.generativeai as genai
import os
from dotenv import load_dotenv

# this class creates a generator that calls google gemini
class Generator:

    # constructor
    def __init__(self):
        load_dotenv()
        api_key = os.getenv("API_KEY")
        genai.configure(api_key = api_key)
        self.model = genai.GenerativeModel("gemini-1.5-flash")
