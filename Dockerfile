FROM mcr.microsoft.com/playwright:v1.42.0-jammy

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --production

COPY . .

ENV NODE_ENV=production
ENV PORT=3000
ENV DATA_DIR=/data
ENV HEADLESS=false
ENV SLOW_MO=80

EXPOSE 3000

CMD ["npm", "start"]
