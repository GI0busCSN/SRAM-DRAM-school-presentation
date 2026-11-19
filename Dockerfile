# Serves the prebuilt site. Run "npm run build" locally first so dist/ exists.
FROM nginx:1.27-alpine
COPY dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
