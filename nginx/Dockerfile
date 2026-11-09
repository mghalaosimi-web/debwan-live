# SECURITY: Pinned base image version for reproducible builds
FROM nginx:1.31.8-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/ /etc/nginx/conf.d/

EXPOSE 80 443
