import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import joblib

# Load CSV
df = pd.read_csv('D:/internship/New_folder/consecure/Cybersecurity_Dataset.csv')  # or your absolute path

# Features & target
X = df['Cleaned Threat Description']
y = df['Threat Category']

# Build model pipeline
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('clf', LogisticRegression(max_iter=1000))
])

# Train
pipeline.fit(X, y)

# Save
joblib.dump(pipeline, 'threat_model.pkl')
print("✅ Model trained and saved as threat_model.pkl")
