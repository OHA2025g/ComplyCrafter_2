FROM python:3.11-slim

WORKDIR /app

# Install poetry
RUN pip install --no-cache-dir poetry==1.7.1

# Copy poetry files
COPY services/forms/pyproject.toml ./
# Note: poetry.lock removed - will be generated during build

# Install dependencies
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi --no-root

# Copy shared libs
COPY libs /app/libs

# Copy application code
COPY services/forms /app

# Install the package
RUN poetry install --no-interaction --no-ansi

# Expose port
EXPOSE 8100

# Set PYTHONPATH to include libs
ENV PYTHONPATH=/app:/app/libs:$PYTHONPATH

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8100"]

