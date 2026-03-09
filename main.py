from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List
import os
import resend
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="DocuForger Email Proxy")

# Configure CORS so the Next.js app can talk to this proxy
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://docuforger.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

resend.api_key = os.getenv("RESEND_API_KEY")

class EmailRequest(BaseModel):
    to: List[str]
    subject: str
    html: str

@app.get("/")
def read_root():
    return {"status": "ok", "service": "DocuForger Proxy"}

@app.post("/emails")
def send_email(request: EmailRequest = Body(...)):
    try:
        if not resend.api_key:
            raise HTTPException(status_code=500, detail="RESEND_API_KEY environment variable is not configured.")

        params: resend.Emails.SendParams = {
            "from": "DocuForger <onboarding@resend.dev>",
            "to": request.to,
            "subject": request.subject,
            "html": request.html,
        }

        email = resend.Emails.send(params)
        return {"success": True, "id": email["id"]}
        
    except Exception as e:
        print(f"Error sending email: {e}")
        raise HTTPException(status_code=500, detail=str(e))
