from langfuse_handler import PromptRunner
import sys

prompt = PromptRunner("attestation-schema", env_path="../../.env")

def match_skills(cleanText: str):
    input_data = {
        "text": cleanText
    }
    response = prompt.run_prompt(input_data=input_data)
    return response

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python getSchema.py <input>")
        sys.exit(1)

    response = match_skills(sys.argv[1])
    print(response)