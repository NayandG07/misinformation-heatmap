#!/usr/bin/env python3
"""
Simple test server to verify FastAPI is working
"""

from fastapi import FastAPI
import uvicorn

app = FastAPI(title="Test Server")

@app.get("/")
async def root():
    return {"message": "Test server is working!"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    print("🚀 Starting test server...")
    print("🌐 Test server: http://localhost:8080")
    uvicorn.run(app, host="0.0.0.0", port=8080, log_level="info")