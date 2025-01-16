# Sense Admin Panel Application

## Overview

This application serves as the admin panel for Sense, a data management and analytics platform. It acts as a central hub
for managing access control, metadata, and integrations for Sense, Metabase, and a Postgres database. The application is
built using AdminJS, a powerful admin panel framework for Node.js applications.

## Key Components and Functionality

1. **Access Control List (ACL) Management**
    - Maintains user-organization-database relationships
    - Defines which users belong to which organizations
    - Determines database access rights for users and organizations
    - Root access control is maintained by ZenStack in the schema.zmodel file

2. **API Exposure**
    - Provides an API for the Sense application
    - Enables Sense to query access rights and permissions

3. **Database and Integration**
    - Local Postgres Database: Stores application-specific data, including ACL information
    - Metabase Integration: Connects to Metabase for data source management and metadata

4. **Metabase Integration**
    - Retrieves database, table, and field information from Metabase
    - Updates metadata in Metabase via its API
    - Utilizes a custom Metabase resource class that translates the Metabase API into a database-like interface
    - Enables CRUD operations on Metabase resources (e.g., databases, tables, fields) through this custom interface

5. **Data Flow**
    - Reads from and writes to the local Postgres database for application data
    - Interacts with Metabase API to manage external data sources
    - Synchronizes information between Sense, Metabase, and the local database
    - Provides a unified interface for customers, making Metabase integration transparent

6. **ZenStack Access Control**
    - Root access control is defined in the schema.zmodel file
    - Uses decorators like @@allow and @@deny to manage permissions for each model
    - Implements fine-grained access control based on user roles and relationships

7. **AdminJS Framework**
    - Provides the core structure and functionality for the admin panel
    - Offers a customizable UI for managing application data and settings
    - Integrates with various plugins for enhanced functionality

## Architecture

```
+-------------+     +------------------+
|             |     |                  |
|    Sense    <-----> Admin Panel App  |
|             |     |   (AdminJS-based)|
+-------------+     +------------------+
                            ^
                            |
                    +-------+-------+
                    |               |
          +---------v-----+   +-----v----------+
          |               |   |                |
          | Local Postgres|   |    Metabase    |
          |   Database    |   |  (Data Source) |
          |               |   |                |
          +---------------+   +----------------+
```

## Primary Functions

1. **User and Organization Management**
    - Create, read, update, and delete users and organizations
    - Assign users to organizations
    - Manage superusers and organization admins

2. **Data Source Access Control**
    - Provide a unified interface for managing Metabase resources
    - Abstract Metabase complexity, offering a seamless experience for customers
    - Define which organizations and users can access specific data sources in Metabase
    - Manage granular permissions for database objects (tables, fields) in Metabase
    - Utilize ZenStack's schema.zmodel for application-level access control

3. **Metabase Synchronization**
    - Fetch updated database schemas from Metabase
    - Push access control changes to Metabase
    - Ensure consistency between local ACL and Metabase permissions

4. **API Services**
    - Provide endpoints for Sense to query user permissions
    - Offer interfaces for managing users, organizations, and their access rights

5. **Audit and Logging**
    - Track changes to ACLs and important system events
    - Provide reports on access patterns and permission changes

## Technical Stack

- Backend: Node.js with TypeScript
- Admin Panel Framework: AdminJS
- Local Database: PostgreSQL (for application data storage)
- ORM: Prisma (for interacting with the local PostgreSQL database)
- External Data Source Integration: Metabase API
- Authentication: Cognito (inferred from the presence of Cognito-related types)
- Access Control: ZenStack (using schema.zmodel file for application-level access control)

## AdminJS Plugins and Features

- Relations plugin: Manages relationships between different entities
- Logger plugin: Provides detailed logging for admin panel activities
- Custom components: Tailored UI elements for specific admin tasks
- Action hooks: Custom logic for pre and post-action operations
- Resource customization: Adapted resource views and actions for Sense-specific needs

## Key Files and Their Roles

- `src/api/user.api.ts`: Defines user-related API endpoints and types
- `src/auth/cognito.types.ts`: Contains types for Cognito authentication tokens
- `src/auth/login.component.tsx`: Handles the login UI and logic
- `src/auth/utils.ts`: Provides authentication utility functions
- `src/data-sources/metabase/*.ts`: Manages Metabase integration, including resources, health checks, and type
  definitions
    - Includes custom Metabase resource class for translating Metabase API into a database-like interface
- `src/data-sources/prisma/*.ts`: Handles Prisma ORM integration for database operations
- `schema.zmodel`: Defines data models, relationships, and access control rules using Zod
- AdminJS configuration files: Set up resources, plugins, and customizations for the admin panel

## Security Considerations

- Implements robust ACL to ensure data access is strictly controlled
- Utilizes Cognito for secure authentication
- Ensures secure communication with Metabase and the Postgres database
- Leverages ZenStack's schema.zmodel for defining and enforcing fine-grained access control
- Implements role-based access control (RBAC) with superusers and organization admins
- AdminJS security features: Role-based access control, action-level permissions

## Maintenance and Scalability

- Modular architecture allows for easy addition of new data sources or integrations
- Clear separation of concerns between different components (auth, API, data sources)
- Health check mechanisms in place for both Metabase and Prisma connections
- Centralized access control management through ZenStack's schema.zmodel
- Extensible model structure for adding new entities and relationships
- AdminJS plugin system allows for easy extension of functionality

This AdminJS-based admin panel application plays a crucial role in managing the complex relationships between users,
organizations, and data sources within the Sense ecosystem. It serves as a bridge between the main Sense application,
the underlying databases, and Metabase, ensuring consistent and secure access to data across the platform. The use of
ZenStack's schema.zmodel for access control provides a powerful and flexible way to manage permissions at the core of
the system, allowing for fine-grained control over data access and operations. The AdminJS framework provides a robust
and customizable foundation for building a user-friendly and feature-rich admin interface, streamlining the management
of the Sense platform.
