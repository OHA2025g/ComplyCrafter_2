# Subscription Feature Database Schema

## Overview

The subscription feature has been integrated into the ComplyCrafter database schema. This document describes the subscription-related columns added to the `user_accounts` table.

## Database Changes

### User Accounts Table - Subscription Columns

The following columns have been added to the `user_accounts` table:

1. **subscription_status** (VARCHAR(50))
   - Default: `'trial'`
   - Possible values: `'trial'`, `'active'`, `'expired'`, `'cancelled'`
   - Tracks the current subscription status of the user

2. **subscription_plan** (VARCHAR(50), nullable)
   - Possible values: `'starter'`, `'professional'`, `'enterprise'`, or `NULL`
   - Indicates the subscription plan the user has selected
   - NULL during trial period

3. **trial_ends_at** (TIMESTAMP WITHOUT TIME ZONE, nullable)
   - Date and time when the trial period ends
   - Typically set to 14 days from account creation
   - NULL if trial has ended or user has an active subscription

4. **subscription_expires_at** (TIMESTAMP WITHOUT TIME ZONE, nullable)
   - Date and time when the active subscription expires
   - NULL during trial period or if subscription is cancelled
   - Set when user subscribes to a plan

## Indexes

The following indexes have been added for performance:

- `ix_user_accounts_subscription_status` - For filtering users by subscription status
- `ix_user_accounts_subscription_plan` - For filtering users by plan type
- `ix_user_accounts_trial_ends_at` - For finding users with expiring trials
- `ix_user_accounts_subscription_expires_at` - For finding users with expiring subscriptions

## Sample Data

The seed data includes users with different subscription states:

1. **Admin User** - `active` subscription with `enterprise` plan (1 year expiry)
2. **John Doe** - `active` subscription with `professional` plan (6 months expiry)
3. **Jane Smith** - `trial` status (14 days remaining)
4. **Robert Wilson** - `trial` status (10 days remaining)

## API Integration

The subscription feature is integrated with the following API endpoints:

- `/auth/signup` - Sets new users to `trial` status with 14-day trial period
- `/auth/login` - Checks and updates trial status on login
- `/auth/me` - Returns subscription status in user profile
- `/subscription/*` - Subscription management endpoints (if implemented)

## Business Logic

### Trial Period
- New users start with `subscription_status = 'trial'`
- `trial_ends_at` is set to 14 days from account creation
- During trial, `subscription_plan` is NULL

### Subscription Activation
- When user selects a plan, `subscription_status` changes to `'active'`
- `subscription_plan` is set to the selected plan
- `subscription_expires_at` is set based on plan duration
- `trial_ends_at` may remain for historical tracking

### Subscription Expiry
- When `subscription_expires_at` passes, status should be updated to `'expired'`
- The `SubscriptionService.check_and_update_trial_status()` method handles this

### Requires Subscription Check
- The `requires_subscription()` method (implemented in UserAccount model) checks if:
  - User is in trial period (`trial_ends_at > NOW()`)
  - User has active subscription (`subscription_status = 'active'` AND `subscription_expires_at > NOW()`)
  - Returns `False` if either condition is true, `True` otherwise

## Migration Notes

If you're updating an existing database, you can add these columns with:

```sql
ALTER TABLE user_accounts
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'trial',
ADD COLUMN IF NOT EXISTS subscription_plan VARCHAR(50),
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITHOUT TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITHOUT TIME ZONE;

-- Create indexes
CREATE INDEX IF NOT EXISTS ix_user_accounts_subscription_status ON user_accounts (subscription_status);
CREATE INDEX IF NOT EXISTS ix_user_accounts_subscription_plan ON user_accounts (subscription_plan);
CREATE INDEX IF NOT EXISTS ix_user_accounts_trial_ends_at ON user_accounts (trial_ends_at);
CREATE INDEX IF NOT EXISTS ix_user_accounts_subscription_expires_at ON user_accounts (subscription_expires_at);
```

## Related Files

- `database/init.sql` - Contains the table definition with subscription columns
- `database/seed_data.sql` - Contains sample users with subscription data
- `services/forms/app/models/user_account.py` - UserAccount model (needs subscription fields)
- `services/forms/app/services/subscription_service.py` - Subscription service (if exists)
- `services/forms/app/api/routes/subscription.py` - Subscription API routes (if exists)
- `services/forms/app/schemas/auth.py` - Contains subscription-related schemas

## Next Steps

1. Update the `UserAccount` model in `services/forms/app/models/user_account.py` to include subscription fields
2. Implement or verify `SubscriptionService` with `check_and_update_trial_status()` method
3. Implement or verify `requires_subscription()` method on UserAccount model
4. Create or verify subscription API routes in `services/forms/app/api/routes/subscription.py`

