FROM python:3.11-slim

LABEL maintainer="ComplyCrafter Team"
LABEL description="MCA Data Cache Updater - Automated Background Job"

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements from jobs directory
COPY services/forms/app/jobs/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Create directory structure
RUN mkdir -p /app/services /app/logs

# Copy application files
COPY services/forms/app/jobs/mca_cache_updater.py .
COPY services/forms/app/services/company_cache_service.py ./services/

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV DATABASE_URL=postgresql+asyncpg://comply:comply@db:5432/comply

# Health check
HEALTHCHECK --interval=5m --timeout=30s --start-period=2m --retries=3 \
    CMD python -c "print('Health check OK')" || exit 1

# Run the application
CMD ["python", "mca_cache_updater.py"]

