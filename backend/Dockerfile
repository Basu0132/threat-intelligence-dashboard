# backend/Dockerfile
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app
COPY . .

# Install Python + pip + pip packages
RUN apt-get update && apt-get install -y python3 python3-pip
# RUN pip install pandas scikit-learn joblib

# Expose the backend port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
