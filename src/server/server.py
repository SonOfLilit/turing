from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse 
from pydantic import BaseModel

import httpx
from dotenv import load_dotenv
import os

load_dotenv()
OPENAI_API_KEY = os.environ['OPENAI_API_KEY']

app = FastAPI()

app.mount("/static", StaticFiles(directory="../client/build/static"), name="static")

class LevelData(BaseModel):
    question: str
    bot_answer: str

class Answer(BaseModel):
    user_answer: str

LEVELS = [
    LevelData(question="How are you?", bot_answer="Good."),
    LevelData(question="What is the average speed of an unladen swallow?", bot_answer="20mph"),
]

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return FileResponse('../client/build/index.html')

@app.get("/level/{level_id}")
async def get_level(level_id: int) -> LevelData:
    return LEVELS[level_id]

@app.post("/level/{level_id}")
async def post_level(level_id: int, answer: Answer):
    level = LEVELS[level_id]
    prompt = 'You are a Turing Test judge. One answer is made by a bot. Which is human? Answer just "A" or "B"'
    problem = f"""\
Q: {level.question}
A: {level.bot_answer}
B: {answer.user_answer}"""
    result = await judge(prompt, problem)
    print(result)
    if result not in ["A", "B"]:
        return {"result": None}
    return {"result": result == "B"}

OPENAPI_ENDPOINT = 'https://api.openai.com/v1/chat/completions'
async def judge(prompt, question):
    response = httpx.post(
        OPENAPI_ENDPOINT,
        headers={"Authorization": f"Bearer {OPENAI_API_KEY}"},
        json={
            "model": "gpt-3.5-turbo",
            "messages": [
                {"role": "system", "content": prompt},
                {"role": "user", "content": question}
            ],
            "temperature": 0.7
        }
    )
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]
