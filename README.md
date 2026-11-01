## Main Features and User Stories

### Authentication and Profile Management

- As a customer, I want to register an account so that I can contact designers about their designs. (Customer Account Registration)
- As a company, I want to register an account so that I can join the platform. (Company Account Registration)
- As a registered user, I want to log in and log out so that I can access my account. (User Login and Logout)
- As a registered user, I want to view and update my profile and change my password so that I can maintain my account information. (Profile and Password Management)

### Design Discovery

- As a visitor or customer, I want to browse designs so that I can find inspiration for my home. (Design Browsing)
- As a visitor or customer, I want to search, filter, and sort designs so that I can find designs matching my preferences and budget. (Design Search, Filtering and Sorting)
- As a visitor or customer, I want to view a design's details and photos so that I can understand the project before making an enquiry. (Design Details and Photo Gallery)

### Company Directory

- Browse approved companies with images and contact details.
- Search by company name or email and paginate matching companies.
- The directory uses `get_companies` and filters its results locally because the current API has no approval-status or name filter.

### Company Designer Registration

- As a company, I want to register a designer using their email, first name, and last name so that they can join my company. (Company Designer Registration)
- As a company, I want to see the server's registration confirmation or error message so that I know whether the designer account was created successfully. (Designer Registration Feedback)

### Designer Portfolio Management

- As a designer, I want to view and search my designs so that I can manage my portfolio. (Designer Portfolio Browsing and Search)
- As a designer, I want to create designs and upload photos so that customers can discover my work. (Design Creation and Photo Upload)
- As a designer, I want to update or delete my designs so that my portfolio stays current. (Design Update and Deletion)

### Design Enquiry Management

- As a customer, I want to send an enquiry about a design so that I can discuss my project with the designer. (Customer Design Enquiry Submission)
- As a customer or designer, I want to view my enquiries and their statuses so that I can track ongoing conversations. (Enquiry List and Status Tracking)
- As a customer or designer, I want to exchange messages and see conversation updates so that we can discuss project requirements. (Customer–Designer Messaging)
- As a designer, I want to mark an enquiry as completed so that finished conversations can be closed. (Enquiry Completion)
- As a customer or designer, I want to view completed conversations so that I can refer to previous discussions. (Completed Conversation Viewing)

### Platform Account Management

- As Platform Management, I want to view and search customer and company accounts so that I can review registered accounts. (Customer and Company Account Browsing and Search)
- As Platform Management, I want to approve, reject, or set company accounts to pending so that I can manage their account status. (Company Account Status Management)

### Category Management

- As Platform Management, I want to view, create, update, and delete design categories so that designs can be organised consistently. (Design Category Management)

### General Enquiries

- As a visitor or registered user, I want to submit a general enquiry through Contact Us so that I can get in touch with the company. (General Enquiry Submission)
- As a visitor or registered user, I want to see a submission confirmation so that I know my enquiry was sent successfully. (Enquiry Submission Confirmation)

## Features Not Yet Implemented

- Company designer listing/management.
- Dynamic company designer selection (design management currently uses one temporary designer option).
- Customer favourite designs.
- Designer view statistics and like notifications.
