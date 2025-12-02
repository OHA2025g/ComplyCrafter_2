# ComplyCrafter Database Setup

This directory contains the database initialization scripts and Docker configuration for setting up the ComplyCrafter PostgreSQL database with all required tables and sample data.

## Structure

- `Dockerfile` - Custom PostgreSQL image with initialization scripts
- `init.sql` - Database schema initialization (creates all tables, indexes, functions, triggers)
- `seed_data.sql` - Sample data for testing and development
- `README.md` - This file

## Quick Start

### Using Docker Compose (Recommended)

1. **Start the database:**
   ```bash
   docker-compose -f docker-compose.database.yml up -d
   ```

2. **Check if database is running:**
   ```bash
   docker-compose -f docker-compose.database.yml ps
   ```

3. **View logs:**
   ```bash
   docker-compose -f docker-compose.database.yml logs -f db
   ```

4. **Connect to the database:**
   ```bash
   docker exec -it complycrafter-db psql -U comply -d comply
   ```

### Manual Setup

If you prefer to set up the database manually:

1. **Start PostgreSQL:**
   ```bash
   docker run -d \
     --name complycrafter-db \
     -e POSTGRES_USER=comply \
     -e POSTGRES_PASSWORD=comply \
     -e POSTGRES_DB=comply \
     -p 5432:5432 \
     postgres:15
   ```

2. **Wait for PostgreSQL to be ready:**
   ```bash
   docker exec complycrafter-db pg_isready -U comply
   ```

3. **Run initialization script:**
   ```bash
   docker exec -i complycrafter-db psql -U comply -d comply < init.sql
   ```

4. **Run seed data script:**
   ```bash
   docker exec -i complycrafter-db psql -U comply -d comply < seed_data.sql
   ```

## Database Connection Details

- **Host:** localhost (or `complycrafter-db` if connecting from another Docker container)
- **Port:** 5432
- **Database:** comply
- **Username:** comply
- **Password:** comply

## Environment Variables

You can override the default database credentials using environment variables:

```bash
export POSTGRES_USER=your_user
export POSTGRES_PASSWORD=your_password
export POSTGRES_DB=your_database
export DB_PORT=5432
```

## Database Schema

The database includes the following main table categories:

### Authentication & Users
- `user_accounts` - User accounts for authentication
- `otp_verifications` - OTP verification codes
- `password_reset_tokens` - Password reset tokens

### Company Management
- `user_companies` - Companies added by users
- `company_cache` - Cached company data from MCA API
- `mca_companies_cache` - MCA companies cache
- `company_search_cache` - Search query cache
- `director_cache` - Director information cache
- `api_performance_metrics` - API performance tracking

### Master Data
- `directors` - Directors and Key Managerial Personnel
- `shareholders` - Shareholders of companies
- `share_certificates` - Physical and Demat share certificates
- `debenture_holders` - Debenture holders

### Capital Structure
- `authorized_capital` - Authorized capital details
- `paid_up_capital` - Paid-up capital details
- `share_capital` - Comprehensive share capital structure
- `shareholder_transactions` - Shareholder transactions

### Meetings & Agendas
- `agendas` - Meeting agenda items
- `board_meetings` - Board meeting information
- `agm_meetings` - Annual General Meeting information
- `egm_meetings` - Extra Ordinary General Meeting information
- `committee_meetings` - Committee meeting information

### Form Submissions
- Phase 1 & 2 Forms: `adt1_submissions`, `ben2_submissions`, `pas3_submissions`, `dpt3_submissions`
- Phase 3 Forms (JSONB): `aoc4_submissions`, `aoc4cfs_submissions`, `mgt7a_submissions`, `msme_submissions`, `msme1_submissions`, `ndh1_submissions`, `ndh2_submissions`
- Phase 3+ Forms: Multiple `tbl_*` tables for various form types

## Sample Data

The seed data includes:
- 4 sample users (admin, john.doe, jane.smith, robert.wilson)
- 6 sample companies
- Directors, shareholders, share certificates, and debenture holders
- Capital structure data
- Meeting records and agendas
- Sample form submissions

**Default User Credentials:**
- Username: `admin`
- Email: `admin@complycrafter.com`
- Password: `password123` (hashed with bcrypt)

## Useful Commands

### Stop the database
```bash
docker-compose -f docker-compose.database.yml down
```

### Stop and remove volumes (clean slate)
```bash
docker-compose -f docker-compose.database.yml down -v
```

### Backup database
```bash
docker exec complycrafter-db pg_dump -U comply comply > backup.sql
```

### Restore database
```bash
docker exec -i complycrafter-db psql -U comply comply < backup.sql
```

### View all tables
```bash
docker exec -it complycrafter-db psql -U comply -d comply -c "\dt"
```

### Count records in tables
```bash
docker exec -it complycrafter-db psql -U comply -d comply -c "
SELECT 
    'user_accounts' as table_name, COUNT(*) as count FROM user_accounts
UNION ALL
SELECT 'user_companies', COUNT(*) FROM user_companies
UNION ALL
SELECT 'directors', COUNT(*) FROM directors
UNION ALL
SELECT 'shareholders', COUNT(*) FROM shareholders;
"
```

## Troubleshooting

### Database won't start
- Check if port 5432 is already in use: `netstat -an | grep 5432`
- Check Docker logs: `docker-compose -f docker-compose.database.yml logs db`

### Can't connect to database
- Ensure the container is running: `docker ps | grep complycrafter-db`
- Check the health status: `docker inspect complycrafter-db | grep Health`

### Initialization scripts not running
- Remove the volume and restart: `docker-compose -f docker-compose.database.yml down -v && docker-compose -f docker-compose.database.yml up -d`
- Check initialization logs: `docker logs complycrafter-db | grep -i "init"`

## Notes

- The initialization scripts run automatically when the container is first created
- If you need to re-run the scripts, you must remove the volume first
- The database uses PostgreSQL 15
- All timestamps are stored in UTC
- JSONB is used for flexible form submission data in Phase 3 forms

