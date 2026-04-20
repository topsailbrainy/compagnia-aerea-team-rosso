# Dockerfile.dev
FROM node:20-bullseye

# Cartella di lavoro nel container
WORKDIR /app

# Copia solo package.json e package-lock.json per installare dipendenze
COPY package*.json ./

# Installa dipendenze
RUN npm install

# Copia tutto il progetto
COPY . .

# Esponi la porta di Vite
EXPOSE 5173

# Avvia il server di sviluppo Vite
CMD ["npm", "run", "dev"]