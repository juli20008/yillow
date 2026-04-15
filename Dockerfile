FROM node:18-bullseye AS frontend

WORKDIR /frontend

COPY react-app/package*.json ./
RUN npm ci

COPY react-app/ ./
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build

FROM python:3.9 AS backend

ENV FLASK_APP=app
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1
ENV SQLALCHEMY_ECHO=True

WORKDIR /var/www

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY migrations ./migrations
COPY init_db.py reset_db.py update_images.py ./

RUN flask db upgrade && flask seed all

COPY --from=frontend /frontend/build ./app/static

CMD ["sh", "-c", "gunicorn --worker-class eventlet -w 1 --bind 0.0.0.0:${PORT:-10000} app:app"]
