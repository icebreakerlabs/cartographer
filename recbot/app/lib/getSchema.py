from langfuse import Langfuse
from dotenv import load_dotenv
import os
import sys
from langfuse.openai import OpenAI
import json

load_dotenv(dotenv_path="../../.env")

os.environ["LANGFUSE_PUBLIC_KEY"] = os.getenv("LANGFUSE_PUBLIC_KEY")
os.environ["LANGFUSE_SECRET_KEY"] = os.getenv("LANGFUSE_SECRET_KEY")
os.environ["LANGFUSE_HOST"] = os.getenv("LANGFUSE_BASEURL")
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

langfuse = Langfuse()

prompt = langfuse.get_prompt("attestation-schema")


client = OpenAI()

def match_skills(cleanText: str, skillNames: str):
    
    messages = prompt.compile(text=cleanText,
    schemaNameString=skillNames)

    model = prompt.config["model"]
    temperature = prompt.config["temperature"]

    res = client.chat.completions.create(
        model = model,
        temperature = temperature,
        messages = messages,
        langfuse_prompt = prompt
    )
    res = res.choices[0].message.content
    return res

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python getSchema.py <input> <skillNames>")
        sys.exit(1)

    response = match_skills(sys.argv[1], sys.argv[2])
    print(response)