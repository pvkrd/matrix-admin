# Use a multi-stage build for efficiency
FROM node:18-alpine AS builder
ENV NODE_ENV build
# Set the user and working directory
USER node
WORKDIR /home/node
# Copy package.json and yarn.lock for dependency installation
COPY --chown=node:node package.json ./
# Install dependencies using Yarn
RUN mkdir .yarn && yarn install --cache-folder .yarn
# Copy the rest of the application code
COPY --chown=node:node . .
# Build the application and prune development dependencies
RUN yarn build \
    && yarn add connect-timeout \
    && yarn install --production
# ---mongocli atlas login --publicKey <publicKey> --privateKey <privateKey>
# Use a smaller base image for the production stage
FROM node:18-alpine
ENV NODE_ENV production
# Set the user and working directory
USER node
WORKDIR /home/node
# Copy only the necessary files from the builder stage
COPY --from=builder --chown=node:node /home/node/package.json ./package.json
COPY --from=builder --chown=node:node /home/node/yarn.lock ./yarn.lock
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/
COPY --from=builder --chown=node:node /home/node/.env ./.env

EXPOSE 3000 8081 80
# Start the application
CMD ["node", "dist/main"]