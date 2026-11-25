FROM postgres:16-alpine

COPY docker-entrypoint.sh /usr/local/bin/hyperlessons-postgres
RUN chmod +x /usr/local/bin/hyperlessons-postgres

ENTRYPOINT ["/usr/local/bin/hyperlessons-postgres"]
CMD ["postgres"]
