ARG grafana_version=latest
ARG grafana_image=grafana-enterprise

FROM grafana/${grafana_image}:${grafana_version}

ENV GF_AUTH_ANONYMOUS_ORG_ROLE "Admin"
ENV GF_AUTH_ANONYMOUS_ENABLED "true"
ENV GF_AUTH_BASIC_ENABLED "false"
ENV GF_DEFAULT_APP_MODE "development"

ENV NODE_ENV development
ENV GF_LOG_FILTERS plugin.isaozler-shiftselector-panel:debug
ENV GF_LOG_LEVEL debug
ENV GF_DATAPROXY_LOGGING 1
ENV GF_ENABLE_ALPHA true
ENV GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS isaozler-paretochart-panel,grafana-shift-selector

USER root
RUN sed -i 's/<\/body><\/html>/<script src=\"http:\/\/localhost:35729\/livereload.js\"><\/script><\/body><\/html>/g' /usr/share/grafana/public/views/index.html
