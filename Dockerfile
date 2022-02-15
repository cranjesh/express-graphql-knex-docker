FROM node:14-alpine as base
WORKDIR /home/node
COPY ./package* ./

FROM base as prod-dependencies
RUN npm i --production

# install app dependencies
FROM prod-dependencies as build
RUN npm i
COPY ./tsconfig.json ./swagger.json ./codegen.yml ./
COPY ./src ./src
RUN npm run build

FROM base
ARG APP_PORT
ENV APP_PORT=$APP_PORT
COPY --from=prod-dependencies /home/node/node_modules /home/node/node_modules
COPY --from=build /home/node/dist /home/node
COPY --from=build /home/node/swagger.json /home/swagger.json
COPY --from=build /home/node/swagger.json /home/swagger.json
EXPOSE 9500 $APP_PORT
ENTRYPOINT ["node", "index.js"]