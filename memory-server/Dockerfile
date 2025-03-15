FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Command will be specified in smithery.yaml
CMD ["echo", "Please use smithery.yaml to start the server"]