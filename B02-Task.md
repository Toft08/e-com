# Task description

## Overview

In this project, you will finalize a full e-commerce web application by adding core features: shopping cart, orders, user & seller profiles with analytics, and product search/filtering.
You’ll integrate work from previous projects (auth, product/media, microservices) and enforce best practices: PR workflows, CI/CD (Jenkins), and code quality (SonarQube).

## Role Play

You are a full-stack engineer wrapping up the marketplace for launch.
Your mission: deliver a secure, performant, and user-friendly experience from browsing → cart → checkout → order tracking, with clean code, CI/CD, and clear documentation.

## Learning Objectives

- Design and extend data models for carts, orders, and profiles

- Implement RESTful APIs for carts, orders, search, and analytics

- Build Angular views (cart, checkout, order history, dashboards)

- Add search & filtering (text + facets) with efficient querying

- Apply error handling, validation, and role-based security

- Practice team workflows (PRs, reviews) and CI/CD with Jenkins

- Measure and improve code quality using SonarQube

- Write tests (unit, integration, e2e) for critical flows

## Instructions

### Database Design

Extend your existing schema (MongoDB collections or SQL tables—consistent with prior work)

### Best Practices Ecosystem Familiarity

- Create feature branches; open PRs for every change.

- Perform code reviews (security, performance, readability).

- Use Jenkins: pipeline stages = build → test → quality gate → package → deploy to staging.

- Protect main branch: require approved reviews and green pipeline.

### API Development Enhancement

Orders MicroService:

- Implement orders page to follow the order status.

- List the orders for both users and sellers using a search functionality.

- Implement orders management to remove, cancel, or redo orders.

User Profile:

- Develop a user profile section where users can see their best products, most buying products, and how much money they spent.

- Develop a seller profile section where they can see their best-selling products and how much money they gained.

Search and Filtering:

- Implement search functionality that enables users to search for products based on keywords.

- Add filtering options to refine product searches.

Shopping Cart Implementation:

- Create a shopping cart functionality that allows users to add products to their cart.

- Enable users to complete the purchase of the selected products in the shopping cart by selecting the "pay on delivery" feature.

Code Quality and Best Practices:

- Utilize SonarQube to ensure code quality and adherence to best practices.

- Address any code quality issues reported by SonarQube in your PRs.

- Document the improvements made based on SonarQube feedback.

Front-End Development with Angular

- Cart & Checkout

  - Cart page (list, qty edit, remove, subtotal/total).

  - Checkout wizard (address → review → confirm "Pay on Delivery").

- Orders

  - Order list with search (status/date).

  - Order details page with status timeline and totals.

- Profiles

  - User dashboard: total spent, most bought, top categories (charts).

  - Seller dashboard: revenue, best-selling products, units sold (charts).

- Search & Filtering

  - Product search page with keyword bar, filters (category, price sliders), sort, pagination.

- UX/Tech

  - Angular route guards (auth), HTTP interceptors (token, 401/403), Reactive Forms, responsive layout (Angular Material/Bootstrap).

Error Handling & Validation

- Backend: global exception handlers; consistent error schema { code, message, details }.

- Common statuses: 400 validation, 401/403 auth, 404 missing, 409 conflicts, avoid unhandled 5xx.

- Frontend: display inline form errors, snackbars/toasts for API failures, optimistic UI where safe.

Security Measures

- Reuse prior security setup: JWT/OAuth2, role checks, ownership enforcement.

- Protect sensitive data (no secrets in responses, mask PII where needed).

- Enforce HTTPS, secure cookies (if used), CORS at gateway.

- Server-side checks for: user vs seller capabilities, order ownership, and mutable status rules.

## Constraints

- Must implement: Cart, Orders, Profiles (analytics), Search/Filter, Pay on Delivery.

- Keep public endpoints read-only (e.g., product search); all mutations require auth.

- Pipeline must include tests + SonarQube quality gate.

## Evaluation

- 🛒 Cart & Checkout: add/update/remove items; create order with Pay on Delivery.

- 📦 Orders: list/search, details, cancel/redo; seller can list related orders.

- 👤 Profiles & Analytics: user spend & most bought; seller revenue & best sellers.

- 🔎 Search/Filters: keyword + facets with pagination.

- 🎨 UX: responsive, accessible, clear flows.

- 🧪 Testing: unit/integration/e2e for critical paths.

- 🔐 Security & Robustness: proper authZ, no unhandled 5xx.

- 🧭 Process: PRs, reviews, green CI, SonarQube issues addressed.

## Bonus (Optional)

- Wishlist (save for later).

- Additional payment methods (simulate gateway integration).

## Resources

- Backend

  - Spring Boot & REST: https://spring.io/guides

  - Spring Security (JWT/OAuth2): https://spring.io/projects/spring-security

- Data & Search

  - MongoDB Docs: https://www.mongodb.com/docs/

  - (Optional) Elasticsearch: https://www.elastic.co/guide/

- Frontend

  - Angular Docs: https://angular.io/docs

  - Angular Material: https://material.angular.io/

- Pipeline & Quality

  - Jenkins Pipelines: https://www.jenkins.io/doc/pipeline/tour/getting-started/

  - SonarQube: https://docs.sonarsource.com/sonarqube/

## Audit

#### Functional

##### Verify that the necessary tables, fields, relations are added.

- Has the database design been correctly implemented?

- Have the students added new relationships and have they used them correctly?

- Did the students convince you with their additions to the database?

##### Review the project repository to check for PRs and code reviews.

- Are developers following a collaborative development process with PRs and code reviews?

##### Check the implementation of Orders MicroService, User Profile, Search and Filtering, and Shopping Cart functionalities.

- Are the implemented functionalities consistent with the project instructions?

- Are the implemented functionalities clean and do they not pop up any errors or warnings in both back and front end?

##### Add products to the shopping cart and refresh the page.

- Are the added products still in the shopping cart with the selected quantities?

##### Utilize SonarQube to assess code quality and check for improvements based on SonarQube feedback.

- Are code quality issues identified by SonarQube being addressed and fixed?

##### Review the user interface to ensure it's user-friendly and responsive.

- Does the application provide a seamless and responsive user experience?

##### Check if proper error handling and validation mechanisms are in place.

- Are user interactions handled gracefully with appropriate error messages?

##### Verify the implementation of security measures as specified in the project instructions.

- Are security measures consistently applied throughout the application?

#### Collaboration and Development Process

##### Check the repository's PR history and comments to ensure code reviews are conducted.

- Are code reviews being performed for each PR?

##### Inspect the CI/CD pipeline configuration with Jenkins to ensure automated builds, tests, and deployments.

- Is the CI/CD pipeline correctly set up and being utilized for PRs?

##### Examine the repository log and PR merges to ensure that branches are being merged as instructed.

- Are branches merged correctly, and is the main codebase up-to-date?

##### Run a full test of the application to assess functionality and identify any issues.

- Does the application pass a comprehensive test to ensure that all new features work as expected?

##### Inspect the codebase for unit tests related to different parts of the application.

- Are there unit tests in place for critical parts of the application?

#### Bonus

##### Verify if the wishlist feature, if implemented, functions correctly.

- Is the wishlist feature functioning as expected?

##### Check if different payment methods, if implemented, work as intended.

- Are the implemented payment methods functioning correctly?
