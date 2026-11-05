# Frontend API Usage

Checked on 5 November 2026 against the current frontend source and the live [backend OpenAPI specification](https://backend-52c7fa59.fastapicloud.dev/openapi.json).

“Used” means a request is connected to a frontend flow, including conditional requests and requests passed through a function variable. This is a source-code inventory, not a record of traffic or a guarantee that every backend operation succeeds. No data-changing requests were sent for this audit.

| Inventory | Count |
| --- | ---: |
| Backend endpoints used by this frontend | 38 |
| Backend application endpoints not used | 8 |
| Backend home endpoint not used | 1 |
| Total endpoints in the live specification | 47 |

Every request wrapper currently defined in `src/api` has a frontend reference. There are no unused request wrappers. `logoutAPI` is also referenced, but only clears local storage and does not call a backend endpoint.

## Used Backend Endpoints

Paths below follow the backend specification. Parameter names inside braces can differ from local variable names while referring to the same path.

### Users

| Method and endpoint | Frontend function | Purpose | Frontend call sites |
| --- | --- | --- | --- |
| `GET /users/id/{id}` | [`getUserDetailsAPI`](src/api/profileApi.js#L4) | Profile display, designer email lookup, assigned designer details, and chat participant names | [CompanyDashboardPage](src/pages/dashboard/pages/CompanyDashboardPage.js#L53), [ProfileDetailsPage](src/pages/profile/pages/ProfileDetailsPage.js#L43), [DesignDesignerDetails](src/pages/designs/components/details/DesignDesignerDetails.js#L28), [EnquiryChatSessionPage](src/pages/dashboard/pages/EnquiryChatSessionPage.js#L130), [LoginPage](src/pages/auth/pages/LoginPage.js#L33) |
| `POST /users/register` | [`registerUserAPI`](src/api/authApi.js#L11) | Customer registration | [RegisterPage](src/pages/auth/pages/RegisterPage.js#L26) |
| `POST /users/login` | [`loginAPI`](src/api/authApi.js#L4) | Login | [LoginPage](src/pages/auth/pages/LoginPage.js#L29) |
| `PUT /users/update/{id}` | [`updateUserProfileAPI`](src/api/profileApi.js#L8) | Personal profile management | [ProfileDetailsPage](src/pages/profile/pages/ProfileDetailsPage.js#L115) |
| `PUT /users/update-password/{id}` | [`updatePasswordAPI`](src/api/authApi.js#L41) | Password changes for personal and company profiles | [CompanyProfileDetailsPage](src/pages/profile/pages/CompanyProfileDetailsPage.js#L164), [ProfileDetailsPage](src/pages/profile/pages/ProfileDetailsPage.js#L150) |

### Companies

| Method and endpoint | Frontend function | Purpose | Frontend call sites |
| --- | --- | --- | --- |
| `GET /companies/{user_id}/designers` | [`get_company_designers`](src/api/companyApi.js#L4) | Company designer listing and design assignment options | [CompanyDashboardPage](src/pages/dashboard/pages/CompanyDashboardPage.js#L44) |
| `POST /companies/{user_id}/designers` | [`register_designer`](src/api/companyApi.js#L8) | Company registration of a designer | [CompanyDesignerRegistration](src/pages/dashboard/components/company/CompanyDesignerRegistration.js#L41) |
| `GET /companies/{id}` | [`getCompanyDetailsAPI`](src/api/profileApi.js#L17) | Company profile and company details on a design | [DesignCompanyDetails](src/pages/designs/components/details/DesignCompanyDetails.js#L28), [CompanyProfileDetailsPage](src/pages/profile/pages/CompanyProfileDetailsPage.js#L56) |
| `POST /companies/register` | [`registerCompanyAPI`](src/api/authApi.js#L21) | Company registration | [CompanyRegisterPage](src/pages/auth/pages/CompanyRegisterPage.js#L34) |
| `PUT /companies/update/{id}` | [`updateCompanyProfileAPI`](src/api/profileApi.js#L21) | Company profile management | [CompanyProfileDetailsPage](src/pages/profile/pages/CompanyProfileDetailsPage.js#L129) |

### Platform Management

| Method and endpoint | Frontend function | Purpose | Frontend call sites |
| --- | --- | --- | --- |
| `GET /platform/customers` | [`get_customers`](src/api/platformApi.js#L4) | Platform customer listing and search | [CustomerTable](src/pages/dashboard/components/platform/CustomerTable.js#L34) |
| `GET /platform/companies` | [`get_companies`](src/api/platformApi.js#L14) | Platform company listing and public company directory | [CompaniesPage](src/pages/companies/CompaniesPage.js#L36), [CompanyTable](src/pages/dashboard/components/platform/CompanyTable.js#L46) |
| `PUT /platform/updateStatus` | [`update_company_status`](src/api/platformApi.js#L24) | Platform approval, rejection, or pending status for companies | [CompanyTable](src/pages/dashboard/components/platform/CompanyTable.js#L83) |

### Contact Designer

| Method and endpoint | Frontend function | Purpose | Frontend call sites |
| --- | --- | --- | --- |
| `POST /contact/messages` | [`post_enquiry_message`](src/api/enquiryApi.js#L14) | Start an enquiry or send a reply | [EnquiryChatSessionPage](src/pages/dashboard/pages/EnquiryChatSessionPage.js#L178), [DesignEnquiryForm](src/pages/designs/components/details/DesignEnquiryForm.js#L51) |
| `GET /contact/lookup` | [`get_user_enquiries`](src/api/enquiryApi.js#L4) | Customer/designer enquiry listing and enquiry lookup after submission | [EnquiryList](src/pages/dashboard/components/shared/EnquiryList.js#L46), [EnquiryChatSessionPage](src/pages/dashboard/pages/EnquiryChatSessionPage.js#L78), [DesignEnquiryForm](src/pages/designs/components/details/DesignEnquiryForm.js#L57) |
| `GET /contact/{enquiry_id}/messages` | [`get_enquiry_messages`](src/api/enquiryApi.js#L10) | Conversation history and updates | [EnquiryChatSessionPage](src/pages/dashboard/pages/EnquiryChatSessionPage.js#L90) |
| `PATCH /contact/{enquiry_id}/complete` | [`change_enquiry_status`](src/api/enquiryApi.js#L23) | Complete an enquiry | [EnquiryChatSessionPage](src/pages/dashboard/pages/EnquiryChatSessionPage.js#L278) |
| `POST /contact/form` | [`submit_generic_form`](src/api/contactApi.js#L4) | Contact Us form | [ContactPage](src/pages/contact/ContactPage.js#L43) |

### Interior Designs

| Method and endpoint | Frontend function | Purpose | Frontend call sites |
| --- | --- | --- | --- |
| `GET /interior-designs` | [`get_interior_designs`](src/api/designApi.js#L4) | Public design browsing, search, filters, sorting, and related designs | [DesignsPage](src/pages/designs/DesignsPage.js#L58), [RelatedDesigns](src/pages/designs/components/details/RelatedDesigns.js#L24) |
| `POST /interior-designs` | [`create_design`](src/api/designApi.js#L32) | Company/designer design creation with photos | [DesignFormDialog](src/pages/dashboard/components/shared/DesignFormDialog.js#L158) |
| `GET /interior-designs/company/{company_id}` | [`get_company_designs`](src/api/designApi.js#L14) | Company design management and favourite statistics scoping | [DesignerDesignTableContent](src/pages/dashboard/components/shared/DesignerDesignTableContent.js#L56), [FavouriteStatistics](src/pages/dashboard/components/shared/FavouriteStatistics.js#L20) |
| `GET /interior-designs/designer/{designer_id}` | [`get_designer_designs`](src/api/designApi.js#L8) | Designer portfolio management and favourite statistics scoping | [DesignerDesignTableContent](src/pages/dashboard/components/shared/DesignerDesignTableContent.js#L57), [FavouriteStatistics](src/pages/dashboard/components/shared/FavouriteStatistics.js#L20) |
| `GET /interior-designs/{design_id}` | [`get_design`](src/api/designApi.js#L20) | Design details, editing, saved designs, and statistics metadata | [CustomerFavouriteDesigns](src/pages/dashboard/components/customer/CustomerFavouriteDesigns.js#L40), [DesignFormDialog](src/pages/dashboard/components/shared/DesignFormDialog.js#L57), [DesignStatistics](src/pages/dashboard/components/shared/DesignStatistics.js#L73), [FavouriteStatistics](src/pages/dashboard/components/shared/FavouriteStatistics.js#L77), [DesignDetails](src/pages/designs/components/details/DesignDetails.js#L43) |
| `DELETE /interior-designs/{design_id}` | [`delete_design`](src/api/designApi.js#L54) | Company/designer design removal | [DesignerDesignTableContent](src/pages/dashboard/components/shared/DesignerDesignTableContent.js#L155) |
| `PATCH /interior-designs/{design_id}` | [`update_design`](src/api/designApi.js#L40) | Company/designer design editing and photo changes | [DesignFormDialog](src/pages/dashboard/components/shared/DesignFormDialog.js#L157) |
| `PATCH /interior-designs/{design_id}/update` | [`update_design_status`](src/api/designApi.js#L48) | Company design review status: Reviewing or Approved | [DesignerDesignTableContent](src/pages/dashboard/components/shared/DesignerDesignTableContent.js#L174) |

### Categories

| Method and endpoint | Frontend function | Purpose | Frontend call sites |
| --- | --- | --- | --- |
| `GET /categories` | [`get_categories`](src/api/categoryApi.js#L8) | Category management, design filters, forms, and category labels | [CategoryTable](src/pages/dashboard/components/platform/CategoryTable.js#L50), [DesignFormDialog](src/pages/dashboard/components/shared/DesignFormDialog.js#L56), [DesignerDesignTableContent](src/pages/dashboard/components/shared/DesignerDesignTableContent.js#L83), [DesignsPage](src/pages/designs/DesignsPage.js#L98), [DesignDetails](src/pages/designs/components/details/DesignDetails.js#L43) |
| `POST /categories` | [`create_category`](src/api/categoryApi.js#L4) | Platform category creation | [CategoryTable](src/pages/dashboard/components/platform/CategoryTable.js#L134) |
| `GET /categories/{category_id}` | [`get_category`](src/api/categoryApi.js#L12) | Fetch a selected category for editing | [CategoryTable](src/pages/dashboard/components/platform/CategoryTable.js#L98) |
| `PATCH /categories/{category_id}` | [`update_category`](src/api/categoryApi.js#L16) | Platform category editing | [CategoryTable](src/pages/dashboard/components/platform/CategoryTable.js#L132) |
| `DELETE /categories/{category_id}` | [`delete_category`](src/api/categoryApi.js#L20) | Platform category removal | [CategoryTable](src/pages/dashboard/components/platform/CategoryTable.js#L164) |

### Views

| Method and endpoint | Frontend function | Purpose | Frontend call sites |
| --- | --- | --- | --- |
| `GET /views` | [`get_design_views`](src/api/designApi.js#L24) | Platform/company/designer view statistics | [DesignStatistics](src/pages/dashboard/components/shared/DesignStatistics.js#L48) |
| `POST /views` | [`create_design_view`](src/api/designApi.js#L28) | Record a detail-page visit by a guest or logged-in customer | [DesignDetails](src/pages/designs/components/details/DesignDetails.js#L74) |

### Favourites

| Method and endpoint | Frontend function | Purpose | Frontend call sites |
| --- | --- | --- | --- |
| `GET /favourites` | [`get_favourites`](src/api/favouriteApi.js#L4) | Favourite statistics and compatibility lookup for favourite record IDs | [FavouriteStatistics](src/pages/dashboard/components/shared/FavouriteStatistics.js#L53) |
| `POST /favourites` | [`create_favourite`](src/api/favouriteApi.js#L25) | Customer saves a design | [FavouriteDesignButton](src/pages/designs/components/shared/FavouriteDesignButton.js#L58) |
| `GET /favourites/user/{user_id}` | [`get_user_favourites`](src/api/favouriteApi.js#L8) | Customer favourites listing and record lookup before removal | [CustomerFavouriteDesigns](src/pages/dashboard/components/customer/CustomerFavouriteDesigns.js#L31), [FavouriteDesignButton](src/pages/designs/components/shared/FavouriteDesignButton.js#L46) |
| `DELETE /favourites/{favourite_id}` | [`delete_favourite`](src/api/favouriteApi.js#L29) | Customer removes one favourite using its record ID | [FavouriteDesignButton](src/pages/designs/components/shared/FavouriteDesignButton.js#L51) |

### Designers

| Method and endpoint | Frontend function | Purpose | Frontend call sites |
| --- | --- | --- | --- |
| `PATCH /designers/{user_id}` | [`updateDesignerProfileAPI`](src/api/profileApi.js#L38) | Designer biography and years of experience | [DesignerProfileDetails](src/pages/profile/components/designer/DesignerProfileDetails.js#L47) |

## Backend Endpoints Not Used

These endpoints exist in the live specification, but have no request wrapper or call site in the current frontend. They have not been removed from the backend.

| Method and endpoint | Reason |
| --- | --- |
| `GET /users/email/{email}` | No user-by-email lookup is connected. Designer emails are fetched by user ID. |
| `POST /users/deregister` | No user deregistration interface is connected. |
| `POST /users/reactivate` | No user reactivation interface is connected. |
| `POST /companies/deregister` | No company deregistration interface is connected. |
| `POST /companies/reactivate` | No company reactivation interface is connected. |
| `PUT /companies/update-password/{id}` | CompanyProfileDetailsPage currently calls the shared /users/update-password/{id} route instead. |
| `GET /contact/lookup/{user_id}/{design_id}` | The frontend uses GET /contact/lookup and locates the relevant enquiry from the result. |
| `GET /contact/lookup/{user_id}` | The frontend uses GET /contact/lookup with user_id or designer_id query parameters. |
| `GET /` | Backend home route; the frontend does not request it. |

## Request Flow Notes

- **Company approval:** company login verifies the account status through `GET /users/id/{id}` before creating a frontend session. Pending and rejected companies stay on the login page. Company registration does not automatically log in an unapproved account. The company-details response does not include approval status.
- **Designer details:** the design page fetches the assigned designer through `GET /users/id/{id}` using `design.designer_id`. Name and email are available; biography and years of experience are displayed only if the response supplies them. The checked response omits those extra fields.

- **Company identity:** company-scoped frontend requests use the logged-in company account’s `profile.id`. The design-list endpoint still calls its path placeholder `company_id` in OpenAPI. This does not introduce a second frontend ID lookup.
- **Company password:** both personal and company profile pages use `updatePasswordAPI`, which calls `PUT /users/update-password/{id}`. The dedicated company password endpoint is not connected. Confirm the intended backend contract before changing this.
- **Enquiries:** `GET /contact/lookup` receives `designer_id` for designers or `user_id` for customers. The two path-based lookup alternatives are unused.
- **Favourites:** `GET /favourites` supplies current records for statistics. If the customer-specific endpoint returns only design IDs, the compatibility path also uses all records to resolve the favourite record IDs required by DELETE.
- **Statistics:** view and favourite records are aggregated in the frontend. Favourite statistics use company/designer design lists to establish ownership, including all pages of those lists. There is no separate report-generation endpoint in the current specification.
- **Logout:** `logoutAPI` clears stored login information locally; it is not an HTTP request.

## Naming and BCE Diagram Reference

The tables use the existing function and component names so that this document matches the current source. No function or file was renamed during this audit.

| Code responsibility | Naming convention | Example |
| --- | --- | --- |
| React boundary components and their files | PascalCase | `DesignFormDialog.js`, `DesignFormDialog` |
| Frontend functions and event handlers | camelCase | `getCompanyDesigns`, `handleSubmit` |
| API module files | camelCase | `designApi.js` |
| Backend routes and JSON fields | Keep the backend contract | `designer_id`, `company_id`, `created_at` |

Current naming items to review before finalising diagrams:

- API wrappers mix snake_case (such as `get_company_designs`) and camelCase with an API suffix (such as `getUserDetailsAPI`). Standardise frontend function names to camelCase in a separate refactor, updating every caller and this inventory together.
- `DesignerDesignTableContent` is shared by companies and designers. `DesignTableContent` would describe its responsibility more accurately.
- React components can represent boundary responsibilities. Event handlers and API modules contain parts of the frontend coordination flow, but API wrappers are HTTP clients rather than the backend’s control or entity classes. Use backend implementation details to identify those classes; endpoint names alone do not establish them.
- Keep related helpers and request functions together when they share a responsibility. One main React component per component file does not require exactly one function per file.
