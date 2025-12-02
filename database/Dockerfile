# Dockerfile for PostgreSQL Database with ComplyCrafter Schema
FROM postgres:15

# Set environment variables
ENV POSTGRES_USER=comply
ENV POSTGRES_PASSWORD=comply
ENV POSTGRES_DB=comply

# Copy initialization scripts
COPY init.sql /docker-entrypoint-initdb.d/01-init.sql
#COPY seed_data.sql /docker-entrypoint-initdb.d/02-seed_data.sql

# The scripts in /docker-entrypoint-initdb.d/ will be executed automatically
# when the container starts for the first time

