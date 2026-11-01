import os
from datetime import datetime, timezone
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from pymongo import MongoClient
from pymongo.errors import PyMongoError

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://127.0.0.1:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "cynbit_solutions")
origins = [
    item.strip()
    for item in os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173"
    ).split(",")
    if item.strip()
]

client = MongoClient(MONGODB_URL, serverSelectionTimeoutMS=4000)
db = client[DATABASE_NAME]
inquiries = db["inquiries"]

app = FastAPI(
    title="Cynbit Smart Solution Finder API",
    description="A prototype API for service recommendations and project inquiries.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

SERVICES = {
    "ai-automation": {
        "service": "AI & Automation",
        "description": "Use intelligent automation to reduce repetitive work and improve business workflows.",
        "benefits": ["Automate repetitive tasks", "Improve team productivity", "Reduce manual errors"],
        "next_step": "Discuss the business process you would like to automate."
    },
    "web-development": {
        "service": "Web Development",
        "description": "Build responsive websites and custom web applications around your business needs.",
        "benefits": ["Responsive user experience", "Custom application features", "Scalable web architecture"],
        "next_step": "Share the key pages and features your website or application needs."
    },
    "cloud-devops": {
        "service": "Cloud & DevOps",
        "description": "Plan reliable cloud infrastructure and smoother application deployment workflows.",
        "benefits": ["Scalable infrastructure", "Repeatable deployments", "Improved application availability"],
        "next_step": "Describe your current hosting or deployment setup."
    },
    "data-analytics": {
        "service": "Data Analytics",
        "description": "Turn business data into useful reports, dashboards and actionable insights.",
        "benefits": ["Clear business dashboards", "Better reporting", "Data-informed decisions"],
        "next_step": "Tell us which data sources or business metrics matter most."
    },
    "cybersecurity": {
        "service": "Cybersecurity",
        "description": "Identify security risks and improve the protection of your digital systems.",
        "benefits": ["Identify potential risks", "Improve security practices", "Prioritize protective measures"],
        "next_step": "Describe the systems or applications you want to assess."
    },
    "digital-marketing": {
        "service": "Digital Marketing",
        "description": "Strengthen your online presence and connect with the right audience.",
        "benefits": ["Improve online visibility", "Reach relevant audiences", "Measure campaign performance"],
        "next_step": "Share your target audience and main growth objective."
    },
    "not-sure": {
        "service": "Technology Consultation",
        "description": "Get help clarifying your requirements and identifying a suitable technology direction.",
        "benefits": ["Clarify business requirements", "Explore suitable technologies", "Plan practical next steps"],
        "next_step": "Describe your business challenge and our team can help scope it."
    },
}

Requirement = Literal[
    "ai-automation",
    "web-development",
    "cloud-devops",
    "data-analytics",
    "cybersecurity",
    "digital-marketing",
    "not-sure",
]


class RecommendationRequest(BaseModel):
    requirement: Requirement
    project_size: Literal["small", "medium", "large"]
    budget: Literal["under-1000", "1000-5000", "5000-10000", "above-10000", "not-decided"]
    timeline: Literal["less-than-1-month", "1-3-months", "3-6-months", "flexible"]


class InquiryRequest(RecommendationRequest):
    full_name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    company: str = Field(default="", max_length=150)
    project_description: str = Field(min_length=10, max_length=2000)
    recommended_service: str = Field(min_length=2, max_length=100)


@app.get("/")
def home():
    return {"message": "Cynbit Smart Solution Finder API is running", "docs": "/docs"}


@app.get("/health")
def health():
    try:
        client.admin.command("ping")
        return {"api": "healthy", "database": "connected"}
    except PyMongoError:
        return {"api": "healthy", "database": "disconnected"}


@app.get("/api/services")
def get_services():
    return SERVICES


@app.post("/api/recommendations")
def get_recommendation(payload: RecommendationRequest):
    return {
        "success": True,
        "recommendation": SERVICES[payload.requirement],
        "project_context": {
            "project_size": payload.project_size,
            "budget": payload.budget,
            "timeline": payload.timeline,
        },
    }


@app.post("/api/inquiries", status_code=201)
def create_inquiry(payload: InquiryRequest):
    document = payload.model_dump()
    document["email"] = str(document["email"])
    document["created_at"] = datetime.now(timezone.utc)
    document["status"] = "NEW"

    try:
        result = inquiries.insert_one(document)
        return {
            "success": True,
            "message": "Your inquiry was submitted successfully.",
            "inquiry_id": str(result.inserted_id),
        }
    except PyMongoError:
        raise HTTPException(
            status_code=503,
            detail="The inquiry service is temporarily unavailable. Please try again later.",
        )
