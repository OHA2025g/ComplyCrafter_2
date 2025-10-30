FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Expose port
EXPOSE 4200

# Run the application with host binding to 0.0.0.0
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0"]

