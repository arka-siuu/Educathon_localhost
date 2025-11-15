# Architecture

## System Overview
High-level description of the system architecture.

## Components
### Component 1
Description of component 1 and its responsibilities.

### Component 2
Description of component 2 and its responsibilities.

## Data Flow
Description of how data flows through the system.

## Technology Stack
- Frontend: [Technologies]
- Backend: [Technologies]
- Database: [Technologies]
- Infrastructure: [Technologies]

## Design Decisions
Explanation of key architectural decisions and their rationales.

## Diagrams

### System Architecture Diagram

```mermaid
graph TD
    Client[Client Applications] -->|HTTP/HTTPS| LB[Load Balancer]
    LB -->|Route Requests| API[API Gateway]

    subgraph "Security Layer"
        API -->|Authenticate| Auth[Authentication Service]
        Auth -->|JWT Token| Cache1[Redis Cache]
        Auth -->|User Data| UserDB[(User Database)]
    end

    subgraph "Core Services"
        API -->|Product Requests| ProductSvc[Product Service]
        API -->|Order Requests| OrderSvc[Order Service]
        API -->|User Requests| UserSvc[User Service]
        API -->|Payment Requests| PaymentSvc[Payment Service]

        ProductSvc -->|Product Data| ProductDB[(Product Database)]
        OrderSvc -->|Order Data| OrderDB[(Order Database)]
        UserSvc -->|User Profiles| UserDB
        UserSvc -->|User Preferences| Cache2[Redis Cache]
        PaymentSvc -->|Process Payment| PaymentGateway[Payment Gateway]
        PaymentGateway -->|External Provider| ExternalPayment[Payment Provider]
    end

    subgraph "Analytics & Monitoring"
        API -->|Logs| Logger[Logging Service]
        Logger -->|Store Logs| LogStorage[(Log Storage)]
        Logger -->|Metrics| Monitoring[Monitoring Service]
        ProductSvc & OrderSvc & UserSvc & PaymentSvc -->|Metrics| Monitoring
        Monitoring -->|Alerts| AlertSystem[Alert System]
    end

    subgraph "Data Processing"
        LogStorage -->|ETL| DataWarehouse[(Data Warehouse)]
        ProductDB & OrderDB & UserDB -->|ETL| DataWarehouse
        DataWarehouse -->|Analytics Data| BI[Business Intelligence]
    end
```

### Component Interaction Diagram

```mermaid
sequenceDiagram
    actor User
    participant Frontend as Web/Mobile Frontend
    participant Gateway as API Gateway
    participant Auth as Auth Service
    participant Order as Order Service
    participant Product as Product Service
    participant Payment as Payment Service
    participant DB as Databases
    participant External as External Services

    User->>Frontend: 1. Browse products
    Frontend->>Gateway: 2. Request product listing
    Gateway->>Auth: 3. Validate session
    Auth-->>Gateway: 4. Session valid
    Gateway->>Product: 5. Get products
    Product->>DB: 6. Query product data
    DB-->>Product: 7. Return products
    Product-->>Gateway: 8. Product listing
    Gateway-->>Frontend: 9. Product data
    Frontend-->>User: 10. Display products

    User->>Frontend: 11. Add to cart
    Frontend->>Gateway: 12. Add item to cart
    Gateway->>Order: 13. Update cart
    Order->>DB: 14. Save cart data
    DB-->>Order: 15. Confirm save
    Order-->>Gateway: 16. Cart updated
    Gateway-->>Frontend: 17. Update success
    Frontend-->>User: 18. Show updated cart

    User->>Frontend: 19. Checkout
    Frontend->>Gateway: 20. Process checkout
    Gateway->>Order: 21. Create order
    Order->>DB: 22. Save order
    DB-->>Order: 23. Order created
    Order->>Payment: 24. Process payment
    Payment->>External: 25. Payment request
    External-->>Payment: 26. Payment confirmation
    Payment-->>Order: 27. Payment status
    Order->>DB: 28. Update order status
    DB-->>Order: 29. Confirm update
    Order-->>Gateway: 30. Order completed
    Gateway-->>Frontend: 31. Order confirmation
    Frontend-->>User: 32. Display receipt
```

### Data Flow Diagram

```mermaid
flowchart TD
    User([User])

    subgraph "Data Input"
        A[Web UI] & B[Mobile App] & C[3rd Party Integration]
    end

    subgraph "API Layer"
        D[API Gateway]
    end

    subgraph "Business Logic"
        E[Validation] --> F[Business Rules]
        F --> G[Data Transformation]
        G --> H[Error Handling]
    end

    subgraph "Data Storage"
        I[(Primary Database)] & J[(Replica Database)]
        K[Cache Layer]
    end

    subgraph "External Systems"
        L[Payment Provider]
        M[Email Service]
        N[Analytics Platform]
    end

    User --> A & B & C
    A & B & C --> D
    D --> E
    H --> I
    I --> J
    F --> K
    K --> F
    H --> L & M
    I --> N

    style User fill:#f9f,stroke:#333,stroke-width:2px
    style A fill:#bbf,stroke:#333,stroke-width:1px
    style B fill:#bbf,stroke:#333,stroke-width:1px
    style C fill:#bbf,stroke:#333,stroke-width:1px
    style D fill:#dfd,stroke:#333,stroke-width:1px
    style I fill:#ffd,stroke:#333,stroke-width:1px
    style J fill:#ffd,stroke:#333,stroke-width:1px
```

### Entity Relationship Diagram

```mermaid
erDiagram
    USER {
        int user_id PK
        string username
        string email
        string password_hash
        datetime created_at
        datetime last_login
        boolean is_active
    }

    USER_PROFILE {
        int profile_id PK
        int user_id FK
        string first_name
        string last_name
        string address
        string phone
        date birth_date
        string profile_image
    }

    PRODUCT_CATEGORY {
        int category_id PK
        string name
        string description
        int parent_id FK
    }

    PRODUCT {
        int product_id PK
        string name
        string description
        decimal price
        int stock_quantity
        int category_id FK
        datetime created_at
        boolean is_available
    }

    PRODUCT_IMAGE {
        int image_id PK
        int product_id FK
        string image_url
        boolean is_primary
    }

    ORDER {
        int order_id PK
        int user_id FK
        decimal total_amount
        string status
        datetime created_at
        datetime updated_at
    }

    ORDER_ITEM {
        int item_id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal unit_price
        decimal subtotal
    }

    PAYMENT {
        int payment_id PK
        int order_id FK
        string payment_method
        decimal amount
        string status
        string transaction_id
        datetime payment_date
    }

    REVIEW {
        int review_id PK
        int user_id FK
        int product_id FK
        int rating
        string comment
        datetime created_at
    }

    USER ||--o{ USER_PROFILE : has
    USER ||--o{ ORDER : places
    USER ||--o{ REVIEW : writes
    PRODUCT_CATEGORY ||--o{ PRODUCT : categorizes
    PRODUCT_CATEGORY ||--o{ PRODUCT_CATEGORY : "parent of"
    PRODUCT ||--o{ PRODUCT_IMAGE : "displays with"
    PRODUCT ||--o{ ORDER_ITEM : contains
    PRODUCT ||--o{ REVIEW : receives
    ORDER ||--|{ ORDER_ITEM : includes
    ORDER ||--o| PAYMENT : "paid by"
```

### State Diagram

```mermaid
stateDiagram-v2
    [*] --> Created: User creates account
    Created --> Pending: Email verification sent
    Pending --> Active: User verifies email
    Pending --> Expired: Verification timeout
    Expired --> Pending: Resend verification
    Active --> Inactive: Admin disables / User requests deactivation
    Inactive --> Active: Admin reactivates / User requests reactivation
    Active --> Locked: Multiple failed login attempts
    Locked --> Active: Admin unlocks / Timeout expires
    Active --> Deleted: User requests deletion
    Deleted --> [*]

    note right of Created: Account created but unusable
    note right of Pending: Awaiting email verification
    note right of Active: Normal account state
    note right of Inactive: Account temporarily disabled
    note right of Locked: Security measure
    note left of Deleted: Soft delete with retention period
```

### Class Diagram

```mermaid
classDiagram
    class User {
        -int userId
        -String username
        -String email
        -String passwordHash
        -Date createdAt
        -boolean isActive
        +authenticate()
        +updateProfile()
        +resetPassword()
        +deactivateAccount()
    }

    class UserProfile {
        -int profileId
        -User user
        -String firstName
        -String lastName
        -String address
        -String phone
        -Date birthDate
        -String profileImageUrl
        +updateContactInfo()
        +updateProfileImage()
    }

    class Product {
        -int productId
        -String name
        -String description
        -float price
        -int stockQuantity
        -Category category
        -boolean isAvailable
        +updateStock()
        +changePrice()
        +toggleAvailability()
    }

    class Category {
        -int categoryId
        -String name
        -String description
        -Category parent
        -List~Category~ children
        +addSubcategory()
        +removeSubcategory()
    }

    class Order {
        -int orderId
        -User customer
        -List~OrderItem~ items
        -float totalAmount
        -String status
        -Date orderDate
        -PaymentInfo payment
        +calculateTotal()
        +addItem()
        +removeItem()
        +processPayment()
        +cancel()
    }

    class OrderItem {
        -int itemId
        -Order order
        -Product product
        -int quantity
        -float unitPrice
        -float subtotal
        +updateQuantity()
        +calculateSubtotal()
    }

    class PaymentInfo {
        -int paymentId
        -Order order
        -String paymentMethod
        -float amount
        -String transactionId
        -String status
        -Date paymentDate
        +processPayment()
        +refund()
    }

    class Review {
        -int reviewId
        -User author
        -Product product
        -int rating
        -String comment
        -Date createdAt
        +updateComment()
        +updateRating()
    }

    User "1" -- "1" UserProfile : has
    User "1" -- "*" Order : places
    User "1" -- "*" Review : writes
    Category "1" -- "*" Product : categorizes
    Category "0..1" -- "*" Category : contains
    Product "1" -- "*" OrderItem : included in
    Product "1" -- "*" Review : receives
    Order "1" -- "*" OrderItem : contains
    Order "1" -- "0..1" PaymentInfo : processed with
```

### Deployment Diagram

```mermaid
flowchart TD
    subgraph Client["Client Layer"]
        WebApp[Web Application]
        MobileApp[Mobile Application]
    end

    subgraph Cloud["Cloud Provider"]
        subgraph LB["Load Balancing"]
            ELB[Elastic Load Balancer]
            CDN[Content Delivery Network]
        end

        subgraph AppServers["Application Servers"]
            WebServer1[Web Server 1]
            WebServer2[Web Server 2]
            WebServer3[Web Server 3]
        end

        subgraph Services["Microservices"]
            AuthService[Authentication Service]
            ProductService[Product Service]
            OrderService[Order Service]
            PaymentService[Payment Service]
            NotificationService[Notification Service]
        end

        subgraph DataStorage["Data Storage"]
            subgraph SQL["SQL Databases"]
                PrimaryDB[(Primary Database)]
                ReplicaDB[(Replica Database)]
            end

            subgraph NoSQL["NoSQL Storage"]
                DocumentDB[(Document Store)]
                CacheDB[(Redis Cache)]
            end

            subgraph ObjectStorage["Object Storage"]
                S3[File Storage]
            end
        end

        subgraph Monitoring["Monitoring & Analytics"]
            Logging[Logging Service]
            Metrics[Metrics Collection]
            Alerts[Alert System]
            Dashboard[Monitoring Dashboard]
        end
    end

    subgraph External["External Services"]
        PaymentGateway[Payment Gateway]
        EmailService[Email Service]
        SMSProvider[SMS Provider]
    end

    %% Connections
    WebApp & MobileApp -->|HTTPS| ELB
    ELB --> WebServer1 & WebServer2 & WebServer3
    CDN -->|Static Assets| WebApp & MobileApp

    WebServer1 & WebServer2 & WebServer3 --> AuthService & ProductService & OrderService & PaymentService & NotificationService

    AuthService & ProductService & OrderService & PaymentService --> PrimaryDB
    PrimaryDB --> ReplicaDB

    Services -->|Cache Data| CacheDB
    Services -->|Document Data| DocumentDB
    Services -->|File Storage| S3

    PaymentService -->|Process Payment| PaymentGateway
    NotificationService -->|Send Email| EmailService
    NotificationService -->|Send SMS| SMSProvider

    Services -->|Log Events| Logging
    Services -->|Report Metrics| Metrics
    Metrics -->|Trigger| Alerts
    Logging & Metrics --> Dashboard

    style WebApp fill:#f9f,stroke:#333,stroke-width:1px
    style MobileApp fill:#f9f,stroke:#333,stroke-width:1px
    style PrimaryDB fill:#bbf,stroke:#333,stroke-width:2px
    style ReplicaDB fill:#bbf,stroke:#333,stroke-width:1px
    style AuthService fill:#bfb,stroke:#333,stroke-width:1px
```