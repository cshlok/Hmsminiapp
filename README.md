# Clinic Management App

A cross-platform mobile application (Android and iOS) for small clinics and solo practitioners to manage patients, generate service quotes, and create bills.

## Features

1. **Patient Management**
   - Add/edit/delete patient profiles
   - Store basic info (name, age, gender, contact, medical history, allergies, medications)
   - Search and sort by name, date of last visit, or diagnosis

2. **Appointment Scheduling**
   - Book, edit, cancel appointments
   - Calendar view with reminders and time slot management

3. **Dynamic Service Management**
   - View list of available services
   - Add new services with custom price and category
   - Edit or delete existing services
   - Organize services into categories

4. **Quote Generator**
   - Select patient and services
   - Auto-calculate subtotal, apply optional discount or tax
   - Generate a shareable PDF quotation with clinic name/logo

5. **Billing System**
   - Convert quote into final bill
   - Generate and share invoices

6. **Security & Data**
   - Login via PIN or biometric authentication
   - Local storage with data export to XLS format

## Technology Stack

- **Framework**: React Native
- **State Management**: Redux Toolkit with Redux Persist
- **Local Storage**: Realm Database
- **UI Components**: React Native Paper
- **Authentication**: React Native Biometrics
- **PDF Generation**: React Native HTML to PDF
- **Data Export**: XLSX library

## Development Approach

This project follows a modular development approach, with each module being completed sequentially to allow for collaborative development using multiple accounts.

## Project Structure

```
/src
  /assets            # Images, fonts, and other static assets
  /components        # Reusable UI components
  /screens           # Application screens
  /navigation        # Navigation configuration
  /store             # Redux store setup
  /hooks             # Custom React hooks
  /services          # Business logic services
  /utils             # Utility functions
  /models            # Data models and types
  /storage           # Database and storage logic
  /theme             # UI theme configuration
  App.js             # Root component
```

## Getting Started

Instructions for setting up the development environment and running the app will be added as the project progresses.

## Module Status

- [ ] Project Foundation
- [ ] Patient Management
- [ ] Appointment Scheduling
- [ ] Service Management
- [ ] Quote Generator
- [ ] Billing System
- [ ] Data Export and Settings
- [ ] Testing and Optimization
