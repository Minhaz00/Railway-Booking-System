# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install application dependencies
RUN npm install --only=production

# Copy the rest of the application code
COPY . .

# Expose the application port (replace with your app's port)
EXPOSE 4000

# Command to run the application
CMD ["node", "server.js"]  
