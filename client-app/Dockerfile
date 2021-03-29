FROM node:alpine as build

WORKDIR '/app'

COPY ./package.json ./

RUN npm install react-infinite-scroller --legacy-peer-deps
RUN npm install

COPY . .

# ENV REACT_APP_API_URL=http://api:5000/api
# ENV REACT_APP_CHAT_URL=http://api:5000/chat

RUN npm run build

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
