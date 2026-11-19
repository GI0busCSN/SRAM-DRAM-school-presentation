# Serves the prebuilt site. Run "npm run build" locally first so dist/ exists.
FROM docker.io/library/node:22-alpine
WORKDIR /app
COPY dist ./dist
COPY server.mjs ./
EXPOSE 80
CMD ["node", "server.mjs"]
