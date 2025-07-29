# Admin Panel Documentation

## Overview

The admin panel provides comprehensive management capabilities for the content generation platform. It allows administrators to manage users, categories, projects, blueprints, and monitor system activities.

## Features

### 1. Dashboard
- **Statistics Overview**: View total users, projects, blueprints, and activities
- **Real-time Metrics**: Monitor today's activities and new user registrations
- **Quick Actions**: Access to common admin functions

### 2. User Management
- **User List**: View all registered users with search functionality
- **User Details**: See user information including word usage and role
- **Edit Users**: Modify user details, roles, and word allocations
- **Delete Users**: Remove users from the system
- **Role Management**: Assign admin or user roles

### 3. Category Management
- **Hierarchical View**: Tree structure for categories with expand/collapse
- **Category CRUD**: Create, read, update, and delete categories
- **Field Management**: Configure custom fields for each category
- **Settings**: Manage focus, tone, quantity, and content length settings
- **Type Filtering**: Separate blueprint and project categories

### 4. Project Management
- **Project List**: View all user projects with filtering
- **Status Management**: Update project status (Active, Draft, Archived)
- **Owner Information**: See project owners and their details
- **Search & Filter**: Find projects by name, description, or status

### 5. Blueprint Management
- **Blueprint List**: View all content blueprints
- **Template Management**: Edit blueprint titles, descriptions, and offer types
- **Category Assignment**: Manage blueprint category associations
- **Starred Items**: Mark important blueprints

### 6. Activity Monitoring
- **Activity Log**: View all system activities
- **User Actions**: Track user login, logout, and content creation
- **Filtering**: Filter activities by action type
- **Real-time Updates**: Monitor current system usage

### 7. Settings
- **General Settings**: Site configuration and user limits
- **Security Settings**: Authentication and session management
- **Notification Settings**: Email and system alert preferences
- **Appearance Settings**: Theme and UI customization
- **Database Settings**: Connection status and maintenance
- **Integration Settings**: API keys and third-party services

## Access Control

### Admin Authentication
- Only users with `role: 'admin'` can access the admin panel
- Automatic redirect for non-admin users
- Session-based authentication with JWT tokens

### Route Protection
- All admin routes are protected by middleware
- Automatic redirect to login for unauthenticated users
- Role-based access control for admin functions

## API Endpoints

### Dashboard
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

### Users
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

### Categories
- `GET /api/admin/categories` - Get all categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category

### Projects
- `GET /api/admin/projects` - Get all projects
- `PUT /api/admin/projects/:id` - Update project
- `DELETE /api/admin/projects/:id` - Delete project

### Blueprints
- `GET /api/admin/blueprints` - Get all blueprints
- `PUT /api/admin/blueprints/:id` - Update blueprint
- `DELETE /api/admin/blueprints/:id` - Delete blueprint

### Activities
- `GET /api/admin/activities` - Get recent activities

## Usage

### Accessing the Admin Panel
1. Log in as an admin user
2. Click on your profile in the header
3. Select "Admin Panel" from the dropdown menu
4. Or navigate directly to `/admin`

### Managing Users
1. Go to `/admin/users`
2. Use the search bar to find specific users
3. Click the edit icon to modify user details
4. Use the delete icon to remove users

### Managing Categories
1. Go to `/admin/categories`
2. Use the tree view to navigate categories
3. Click "Add Category" to create new categories
4. Use the edit icon to modify category settings
5. Configure fields and settings as needed

### Monitoring Activities
1. Go to `/admin/activities`
2. View real-time activity feed
3. Use filters to focus on specific action types
4. Monitor system usage patterns

## Security Considerations

- All admin routes require authentication and admin role
- API endpoints validate user permissions
- Sensitive operations require confirmation
- Activity logging for audit trails
- Session timeout for security

## Future Enhancements

- Advanced analytics and reporting
- Bulk operations for users and content
- Automated backup and restore
- Advanced search and filtering
- Real-time notifications
- Export functionality for reports
- Advanced user analytics
- Content moderation tools 