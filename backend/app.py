from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib

# Initialize FastAPI app
app = FastAPI()

# Enable CORS (for frontend integration)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to ["http://localhost:3000"] if using React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model pipeline
model = joblib.load("spam_classifier_model.pkl")

# Define request body structure
class EmailInput(BaseModel):
    text: str

# Define prediction route
@app.post("/predict")
def predict_spam(input_data: EmailInput):
    print(input_data)
    email_text = input_data.text
    prediction = model.predict([email_text])[0]
    print(prediction)
    return {
        "prediction": "spam" if prediction == 1 else "ham"
    }

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}
