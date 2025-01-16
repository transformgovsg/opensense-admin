# Environment Variables Documentation

🔐 Means the value should be treated as a secret.

## Application Configuration

### APP_HOST
Example Value: 0.0.0.0
The host IP address on which the application listens. 0.0.0.0 allows connections from any IP address. Typically in a docker container you may want to keep 0.0.0.0.

### APP_PORT
Example Value: 8051
The port number on which the application listens for incoming connections.

### NODE_ENV
Example Value: production
Specifies the runtime environment for Node.js. 'production' typically enables optimizations and disables development-specific features. To keep Admin.js code bundling functionality working correctly, please leave it to production in production. This is NOT OPTIONAL.

### LOG_LEVEL
Example Value: error
Sets the minimum severity of log messages to be recorded. 'error' logs only error messages and omits less severe levels.

## Authentication and Security

### OAUTH2_CLIENT_ID
The unique identifier for the application registered with the OAuth2 provider.

### OAUTH2_CLIENT_SECRET 🔐
The secret key associated with the OAuth2 client ID, used to authenticate the application to the OAuth2 provider.

### OAUTH2_AUTH_URL
Example Value: https://xxxx.auth.ap-southeast-1.amazoncognito.com/oauth2/authorize
The URL used to initiate the OAuth2 authorization process.

### OAUTH2_TOKEN_URL
Example Value: https://xxxx.auth.ap-southeast-1.amazoncognito.com/oauth2/token
The URL used to exchange authorization codes for access tokens.

### OAUTH2_JWKS_URL
Example Value: https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-xxx/.well-known/jwks.json
The URL to retrieve the JSON Web Key Set (JWKS) for verifying JWT tokens.

(For AWS Cognito ap-southeast-`xxx`, `xxx` is the Cognito User Pool ID. Which is not the same as cognito domain.)

### OAUTH2_CALLBACK_URL
Example Value: https://YOUR_DOMAIN/auth/oauth/aws-cognito/callback
The URL to which the OAuth2 provider redirects after successful authentication. Please ensure to put your actual domain.

### OAUTH2_LOGOUT_URL
Example Value: https://xxxx.auth.ap-southeast-1.amazoncognito.com/logout
The URL used to log out the user from the OAuth2 provider.

### OAUTH2_LOGOUT_CALLBACK_URL
Example Value: https://YOUR_DOMAIN/auth/oauth/aws-cognito/logout
The URL to which the user is redirected after logging out from the OAuth2 provider (AWS Cognito). Please ensure to put your actual domain.

### COOKIE_PASSWORD 🔐
A secret key used for encrypting and signing cookies to prevent tampering. 32 Characters recommended.

### SESSION_SECRET 🔐
A secret key used to sign the session ID cookie to prevent tampering. These value should be different than COOKIE_PASSWORD. 32 Characters recommended.

### API_KEY 🔐
A key used to authenticate API requests to the application. Sense will have to be configured using this key.

## Database and Caching

### DATABASE_URL 🔐
The connection string for the application's database, including credentials and connection details.
Format: `postgresql://user:pass@host:port/db_name?schema=schema_name`

### REDIS_URL 🔐
The connection string for Redis, used for caching or session storage.
Format: `redis://host:port/db_number` (i.e, `redis://localhost:6379/0`)

## Integrations

### METABASE_URL
Example Value: http://metabase:3000
The URL of the Metabase instance. This URL is invoked directly from the backend of sense admin. Thus, internal DNS works fine!

### METABASE_API_KEY 🔐
The API key used to authenticate requests to the Metabase API. [Relevant Documentation](https://www.metabase.com/docs/latest/people-and-groups/api-keys).

## Admin Panel

### ADMIN_JS_RELATIONS_LICENSE_KEY 🔐
The license key for [AdminJS relations](https://docs.adminjs.co/basics/features/relations) feature, enabling advanced functionality in the admin panel.
