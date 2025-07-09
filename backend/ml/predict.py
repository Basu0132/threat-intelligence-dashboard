import joblib
import os
import sys
import json

# always load from the script's directory
BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, 'threat_model.pkl')

model = joblib.load(MODEL_PATH)

description = sys.argv[1]

predicted_category = model.predict([description])[0]

print(json.dumps({"predicted_category": predicted_category}))
