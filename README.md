# Heatwave Command Center

THERMOSHIELD

Government-Grade Human-Centric Heatwave Intelligence & Early Warning Platform

Tagline

Predict the Heat. Understand the Risk. Act Before the Impact.

1. PROJECT OBJECTIVE

Build ThermoShield, a professional government-grade web application for extreme heatwave early warning, human thermal stress assessment, hyperlocal risk monitoring, health-impact prediction, and disaster-response decision support.

This application is intended for:

Municipal Corporations

District Administration

Disaster Management Authorities

Public Health Departments

Field Officers

Emergency Response Teams

Authorized Government Officials

The platform must help authorities answer seven questions immediately:

Where is the heat risk highest?

How severe is the risk?

What factors are causing the risk?

Who is most vulnerable?

What is expected over the next 3–5 days?

What actions should authorities take?

Which alerts and interventions are currently active?

The application must feel like a real government disaster-management command and decision-support system, not a commercial SaaS product.

2. VERY IMPORTANT — BACKEND RESTRICTION

DO NOT USE LOVABLE BACKEND SERVICES

This requirement is mandatory.

Do NOT use:

Lovable Cloud

Supabase

Supabase Authentication

Supabase Database

Supabase Storage

Firebase

Lovable-managed backend

Any other automatically generated backend

The application must be a React frontend connected to our own external Python FastAPI backend.

The backend will be developed separately by our team.

The frontend must communicate with the backend exclusively through REST APIs.

Use an environment variable:

VITE_API_BASE_URL=http://localhost:8000/api


Never hard-code backend URLs throughout the application.

Create a clean centralized API service layer.

3. TECHNOLOGY STACK

Use this technology stack.

FRONTEND

React.js

TypeScript

Tailwind CSS

Redux Toolkit

Chart.js / Recharts

MapLibre GL JS

BACKEND

External backend:

Python

FastAPI

Pydantic

Celery

Redis

The backend will NOT be implemented through Lovable.

DATABASE

External backend/database:

PostgreSQL

PostGIS

TimescaleDB

pgAdmin

The frontend communicates with the database only through FastAPI.

AI / ML

External AI/ML layer:

Scikit-learn

XGBoost

Pandas

NumPy

Joblib

GIS / DATA

PostGIS

GeoPandas

Shapely

MapLibre GL JS

QGIS

QGIS is for data preparation and does not need to be implemented in the frontend.

4. GOVERNMENT DESIGN LANGUAGE

This is one of the most important requirements.

The application MUST look like a government application.

Do NOT make it look like:

A startup SaaS dashboard

A crypto dashboard

A gaming interface

A flashy AI website

A social-media application

A futuristic neon interface

Instead, design it like a professional government command-and-control / disaster-management system.

Design principles

The UI must communicate:

Trust

Authority

Clarity

Reliability

Accessibility

Operational Efficiency

Data Accuracy

Security

5. VISUAL STYLE

Use a restrained professional palette.

Primary

Deep Navy / Government Blue

Secondary

White / Light Grey

Accent

Subtle blue

Risk colors

🟢 Low
🟡 Moderate
🟠 High
🔴 Critical

Risk colors should be used consistently throughout maps, cards, alerts and charts.

Do not use excessive gradients.

Do not use neon colors.

Do not use excessive shadows.

Do not use excessive glassmorphism.

Do not use glowing effects.

Do not use decorative elements that reduce readability.

6. TYPOGRAPHY

Use a highly readable professional font.

Prefer:

Inter

Noto Sans

Source Sans 3

Typography must prioritize readability over visual style.

Use clear hierarchy:

Page Title

Large and strong.

Section Title

Medium and clear.

Supporting Information

Smaller and readable.

Data

Large enough to identify immediately.

Avoid extremely thin fonts.

7. GOVERNMENT HEADER

Create a formal government-style header.

Example:

Government / Municipal Administration
Heatwave Intelligence & Early Warning System

THERMOSHIELD
Human-Centric Heatwave Intelligence


Do not impersonate a real Indian government department or use official government emblems unless explicitly provided/authorized.

Use a neutral ThermoShield identity.

The interface may include:

System name

Location

Last updated time

System status

Notification icon

User name

User role

Logout

Example:

THERMOSHIELD
Human-Centric Heatwave Intelligence

Chennai, Tamil Nadu
Last Updated: 10:30 AM

Municipal Authority
Administrator


8. FORMAL LANGUAGE

Use professional government terminology.

Prefer:

Heat Risk

instead of:

"Heat Score"

Prefer:

Thermal Stress

instead of:

"Heat Feeling"

Prefer:

Population Vulnerability

instead of:

"People at Risk"

Prefer:

Recommended Intervention

instead of:

"What You Should Do"

Prefer:

Health Impact Forecast

instead of:

"AI Prediction"

Prefer:

System Status

instead of:

"App Status"

Avoid casual language.

Avoid emojis throughout the main government interface.

Icons may be used, but they should be professional and subtle.

9. ACCESSIBILITY

This is a government application, so accessibility is a major requirement.

Ensure:

Strong color contrast

Readable typography

Keyboard navigation

Visible focus states

Screen-reader-friendly labels

Accessible buttons

Accessible forms

Clear error messages

No information conveyed through color alone

Responsive design

Proper ARIA labels where required

Risk indicators should include both:

Color + Text

For example:

🔴 CRITICAL

not simply a red card.

10. ROLE-BASED AUTHENTICATION

Implement the frontend authentication architecture for the external FastAPI backend.

Use JWT-based authentication.

Expected APIs:

POST /auth/login
POST /auth/refresh
POST /auth/logout
GET  /auth/me


Do NOT implement fake authentication.

11. USER ROLES

Support these roles.

MUNICIPAL AUTHORITY

Full access:

Dashboard

Heat Risk Map

Forecast

Thermal Stress

Population Vulnerability

Health Risk

Alerts

Recommended Actions

Reports

Analytics

Settings

DISASTER MANAGEMENT OFFICER

Access:

Heat Risk Map

Forecast

Alerts

Recommended Actions

Field response

Reports

Analytics

HEALTHCARE AUTHORITY

Access:

Health Risk

Hospitalization Forecast

Mortality Risk

Population Vulnerability

Forecast

Alerts

Reports

FIELD OFFICER

Access:

Assigned zones

Risk map

Active alerts

Recommended interventions

Field tasks

Task status

Do not expose unnecessary sensitive data.

CITIZEN

If included:

Only show:

Local heat risk

Safety recommendations

Public heat alerts

Cooling center information

Emergency guidance

Never expose sensitive demographic or health information.

12. ROLE-BASED ROUTING

After login:

Login
 ↓
FastAPI Authentication
 ↓
JWT
 ↓
User Profile
 ↓
Role
 ↓
Role-specific Dashboard


Unauthorized routes must be blocked.

Frontend role protection is only for navigation/UX.

Actual authorization must be enforced by FastAPI.

13. MAIN NAVIGATION

Use a clean government-style sidebar.

Dashboard

Heat Risk Map

3–5 Day Forecast

Thermal Stress

Population Vulnerability

Health Risk

Alerts

Recommended Actions

Reports

Analytics

System Status

Settings


The sidebar should:

Collapse smoothly

Remember state

Have clear active navigation

Use professional icons

Never become visually overwhelming

14. MAIN DASHBOARD

The dashboard is the most important screen.

The first screen should allow an authority to understand the current situation within seconds.

Show:

CURRENT HEAT RISK

CRITICAL

Ward 128
Chennai


WEATHER CONDITIONS

Temperature: 42.1°C
Humidity: 68%
Wind Speed: 12 km/h
Solar Radiation: High


THERMAL STRESS

WBGT: 33.8°C
UTCI: 45.1°C
Heat Index: 54°C


HEALTH IMPACT

Hospitalization Risk: +27%
Mortality Risk: HIGH


Clearly mark simulated prototype values.

15. HYPERLOCAL GIS MAP

This is a CORE FEATURE.

Use:

MapLibre GL JS

The map should support:

Ward boundaries

Zone boundaries

Risk visualization

Zoom

Pan

Ward selection

Layer control

Legend

Search

Risk filtering

Risk colors:

Green    = Low
Yellow   = Moderate
Orange   = High
Red      = Critical


Clicking a ward must open detailed information.

Example:

WARD 128

Risk Level:
CRITICAL

Temperature:
42.1°C

Humidity:
68%

WBGT:
33.8°C

UTCI:
45.1°C

Population Exposed:
184,200

Hospitalization Risk:
+27%

Mortality Risk:
HIGH


The map must be interactive.

Do not use a static screenshot as the main map.

16. 3–5 DAY FORECAST

Create a dedicated forecast page.

Show:

Today
+1 Day
+2 Days
+3 Days
+4 Days
+5 Days


For each day:

Temperature

Humidity

WBGT

UTCI

Heat Index

Risk level

Health risk

Forecast confidence

Use clean charts.

Allow selection by:

City

Zone

Ward

17. THERMAL STRESS MODULE

Create a professional analytical page.

Show:

WBGT

Wet Bulb Globe Temperature

UTCI

Universal Thermal Climate Index

HEAT INDEX

Display:

Value

Severity

Trend

Contributing conditions

Also display:

Risk Drivers

Temperature
Humidity
Wind
Solar Radiation


Create an explanation section:

Why is this area at high risk?

Example:

High humidity
Low wind circulation
High solar radiation
High outdoor-worker density


This is important for explainable decision-making.

18. POPULATION VULNERABILITY

Create a government-style demographic analysis page.

Show:

Population density

Elderly population

Children

Outdoor workers

Vulnerable population

Socio-economic indicators where available

Use:

Charts

Tables

GIS layers

Sensitive information must be role restricted.

19. HEALTH IMPACT FORECAST

Create:

Hospitalization Risk

Mortality Risk

Risk Trend

Forecast Horizon

Confidence

Example:

Hospitalization Risk
+27% compared with baseline

Mortality Risk
HIGH

Forecast Horizon
3–5 Days


Clearly label prototype values:

Prototype / Simulated Data

Do not present simulated data as actual government predictions.

20. EXPLAINABLE RISK

Create a dedicated section showing:

WHY IS THIS WARD AT RISK?

Example:

Temperature       ↑
Humidity          ↑
Wind Speed        ↓
Solar Radiation   ↑
Vulnerable Pop.   HIGH


Then summarize:

Primary Risk Factors

1. High humidity
2. Low wind circulation
3. High radiant heat
4. High vulnerable population exposure


This improves transparency and trust.

21. RECOMMENDED INTERVENTIONS

This should be a major government decision-support feature.

For a critical ward:

IMMEDIATE — 0–6 HOURS

Open cooling centers

Deploy water stations

Increase emergency medical readiness

WITHIN 12 HOURS

Adjust outdoor work hours

Alert vulnerable populations

Prepare hospital capacity

WITHIN 48 HOURS

Monitor power demand

Activate heat action plan

Coordinate disaster-management teams

Actions should have statuses:

Pending
In Progress
Completed
Cancelled


Authorized users can:

Assign action

Update status

View responsible officer

View deadline

22. ALERT MANAGEMENT

Create a formal government alert center.

Categories:

Critical

High

Moderate

Informational

Each alert should show:

Location

Risk level

Timestamp

Expected duration

Reason

Recommended action

Responsible authority

Allow:

Search

Filter

Sort

View

Mark as read

Open affected ward

23. MULTI-CHANNEL ALERT SYSTEM

Frontend should provide the interface for:

ThermoShield
      ↓
FastAPI
      ↓
Alert Engine
      ↓
Municipal Authority
      ↓
SMS / WhatsApp / Email
      ↓
Citizens


The actual communication services will be integrated through FastAPI.

Do not expose communication API credentials in frontend code.

24. REPORTS

Create professional government reports.

Types:

Daily Heat Risk Report

Ward Risk Report

3–5 Day Forecast

Population Vulnerability Report

Health Impact Report

Heatwave Event Report

Intervention Report

Provide:

View
Generate
Download
Export


If backend PDF generation is unavailable, create the correct API integration point rather than a fake download.

25. ANALYTICS

Create an analytics module showing:

Heat-risk trends

Ward comparison

Forecast trends

Health-impact trends

Population exposure

Alert statistics

Intervention completion

Historical heat events

Use clear government-reporting-style charts.

Avoid overly decorative charts.

26. SYSTEM STATUS

Create a dedicated system status section.

Show:

Weather Data Feed       ONLINE
Forecast Service        ONLINE
GIS Service             ONLINE
AI/ML Service           ONLINE
Database                ONLINE
Alert Service           ONLINE
FastAPI Backend         ONLINE


Use:

🟢 Operational

🟡 Degraded

🔴 Offline

Also show:

Last Data Update

Last Successful API Request

Model Status

27. FRONTEND ARCHITECTURE

Use a maintainable structure:

src/
 ├── api/
 │    ├── client.ts
 │    ├── authApi.ts
 │    ├── dashboardApi.ts
 │    ├── riskApi.ts
 │    ├── forecastApi.ts
 │    ├── thermalStressApi.ts
 │    ├── populationApi.ts
 │    ├── healthRiskApi.ts
 │    ├── alertsApi.ts
 │    ├── actionsApi.ts
 │    ├── reportsApi.ts
 │    └── systemApi.ts
 │
 ├── components/
 ├── pages/
 ├── layouts/
 ├── routes/
 ├── hooks/
 ├── store/
 ├── types/
 ├── utils/
 └── services/


Keep API communication centralized.

Do not place API requests randomly inside UI components.

28. API CONTRACT

Design the frontend for these external FastAPI endpoints:

POST /auth/login
POST /auth/refresh
POST /auth/logout
GET  /auth/me

GET /dashboard/summary

GET /risk/map
GET /risk/ward/{wardId}

GET /forecast
GET /forecast/ward/{wardId}

GET /thermal-stress/{wardId}

GET /population/{wardId}

GET /health-risk/{wardId}

GET /alerts
GET /alerts/{alertId}
PATCH /alerts/{alertId}/read

GET /actions
POST /actions
PATCH /actions/{actionId}

GET /reports
POST /reports/generate

GET /analytics/overview

GET /system/status


Do not implement a second backend.

29. MOCK DATA

During frontend development, mock data is acceptable.

However:

VITE_USE_MOCK_DATA=true


Keep all mock data isolated.

When FastAPI becomes available:

VITE_USE_MOCK_DATA=false


The application should then consume the real APIs.

Never mix simulated data and production API logic.

Always label prototype values appropriately.

30. EVERY CONTROL MUST WORK

This is mandatory.

Do not create decorative buttons.

Examples:

Refresh → refresh data.

View Details → open details.

View Map → navigate to map.

Filter → filter data.

Search → search data.

Mark as Read → update alert state/API.

Assign Action → open assignment flow.

Update Status → change status.

Logout → terminate session.

Profile → open profile.

If a feature requires backend functionality that is not yet available:

Build the correct UI.

Create the API service/hook.

Create loading/error states.

Clearly leave the backend integration point.

Do NOT fake a successful operation.

31. ANIMATION

Animations should be subtle and professional.

Use animation for:

Page transitions

Sidebar

Cards appearing

Charts loading

Map selection

Alerts

Modals

Data refresh

Avoid:

Excessive bouncing

Neon effects

Constant motion

Large parallax effects

Distracting animations

This is an emergency-management system.

The UI should feel calm and controlled, even when the risk level is critical.

32. RESPONSIVE DESIGN

The application must work on:

Desktop

Laptop

Tablet

Mobile

Desktop is the primary target.

Field officers may use mobile/tablet.

Ensure:

No horizontal overflow

No overlapping cards

Readable maps

Responsive tables

Accessible buttons

Responsive charts

33. DATA TABLES

Where tabular data is used, provide:

Search

Filtering

Sorting

Pagination

Clear headers

Risk indicators

Date/time

Export where applicable

Tables should look like professional government administrative systems.

34. SECURITY

Never expose:

Database credentials

ML credentials

SMS credentials

WhatsApp credentials

API secrets

Frontend should only contain public configuration such as:

VITE_API_BASE_URL


JWT tokens must be handled securely.

FastAPI remains responsible for real authorization.

35. PRIMARY WORKFLOW

The main municipal authority workflow should be:

LOGIN
 ↓
DASHBOARD
 ↓
IDENTIFY CRITICAL WARD
 ↓
OPEN HEAT RISK MAP
 ↓
SELECT WARD
 ↓
VIEW THERMAL STRESS
 ↓
VIEW VULNERABLE POPULATION
 ↓
VIEW 3–5 DAY HEALTH IMPACT
 ↓
UNDERSTAND RISK DRIVERS
 ↓
VIEW RECOMMENDED INTERVENTIONS
 ↓
ASSIGN / ACTIVATE ACTION
 ↓
ISSUE ALERT
 ↓
MONITOR RESPONSE


Make this workflow extremely easy to follow.

An officer should not need to navigate through multiple unnecessary screens to understand a critical situation.

36. DASHBOARD INFORMATION PRIORITY

The dashboard must prioritize information in this exact order:

1. CURRENT RISK

Where is the danger?

2. SEVERITY

How serious is it?

3. LOCATION

Which ward/zone is affected?

4. CAUSE

Why is it happening?

5. VULNERABILITY

Who is most exposed?

6. FORECAST

What will happen in 3–5 days?

7. ACTION

What should authorities do?

8. ALERT

Who needs to be informed?

37. DO NOT OVERDESIGN

The application should be visually impressive because of:

Information hierarchy

Clean layout

Excellent maps

Clear charts

Professional typography

Smooth interaction

Consistency

Accessibility

NOT because of:

Excessive gradients

Huge animations

Glowing cards

Neon colors

Excessive shadows

Decorative graphics

Think:

Government Command Center + Modern GIS + Public Safety Dashboard

38. PROTOTYPE PRESENTATION MODE

Because this application will initially be used as an SIH prototype, make the interface polished enough for demonstration.

The prototype should allow us to demonstrate:

Login
 ↓
Dashboard
 ↓
Critical Ward
 ↓
Map
 ↓
Thermal Stress
 ↓
Health Risk
 ↓
Recommended Actions
 ↓
Alert


Use clearly marked:

Prototype / Simulated Data

where appropriate.

39. FINAL QUALITY STANDARD

The final application should look as if it could realistically be proposed to:

Municipal Corporation

District Administration

Disaster Management Authority

Public Health Department

It must feel:

Formal

Trustworthy

Professional

Simple

Accessible

Operational

Reliable

Data-driven

The application should not feel like a college project.

40. FINAL DEVELOPMENT RULE

Build only the frontend.

Use:

React.js + TypeScript + Tailwind CSS + Redux Toolkit + Chart.js/Recharts + MapLibre GL JS

Connect conceptually and architecturally to:

Python + FastAPI + PostgreSQL/PostGIS + TimescaleDB + Scikit-learn + XGBoost + Celery + Redis

Do NOT use:

Lovable Cloud

Supabase

Firebase

or any other Lovable-managed backend.

The backend will be developed separately.

Where Lovable cannot implement a backend-dependent capability, leave a clean and documented API integration point for our team.

Every frontend feature that can be implemented locally must be fully functional.

The final result must be a formal, government-grade, easy-to-use, highly accessible and professionally animated heatwave decision-support platform.

CORE PRODUCT PRINCIPLE

ThermoShield should not merely tell an authority that a heatwave is coming. It should clearly show where the risk is, why the risk exists, who is vulnerable, what is likely to happen next, and what action should be taken.

THERMOSHIELD

Predict the Heat. Understand the Risk. Act Before the Impact.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f656096b-afa1-4500-8243-da25824808bf).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
