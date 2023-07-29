FROM node:20.3.0

WORKDIR /story-teller/front

COPY . .

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the project files



CMD ["npm", "run", "dev"]
