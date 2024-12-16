FROM node:18.17.1

WORKDIR /usr/app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Start the application
CMD [ "npm", "run", "dev" ]
