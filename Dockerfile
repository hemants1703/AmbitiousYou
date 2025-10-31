FROM node:22-slim

# Set the working directory
WORKDIR /app

# Copy the package.json and pnpm-lock.yaml files to the working directory
COPY package*.json pnpm-lock.yaml ./

# Install pnpm globally and install the dependencies
RUN npm install -g pnpm
RUN pnpm install

# Copy the entire project files to the working directory
COPY . .

# Expose the port 3000
EXPOSE 3000

# Start the development server in the foreground
CMD pnpm run dev
