# WanderMood — Workflow Diagram

## User Flow

```mermaid
flowchart TD
    %% User-facing screens
    A[🏠 IntroScreen<br/>User enters name] -->|"Let's go"| B[🎭 MoodGrid<br/>Pick a mood from 9 options]
    B -->|Select mood| C[✨ MoodConfirm<br/>Review mood details]
    C -->|"This is my mood"| D[⏳ Loading<br/>2.2s transition]
    D --> E[⚙️ Preferences<br/>Budget · Scope · Length · Company]
    E -->|"Build my trip"| F[🎬 SampleTeaser<br/>Testimonial + loading messages]
    F -->|Generation done| G[🗺️ ItineraryScreen<br/>Full day-by-day plan]
    G -->|"Send to inbox"| H[📬 InboxScreen<br/>Enter email → receive trip]
    H -->|"Plan another mood"| A

    %% Swap / generate more loop
    G -->|"Show me another"| G

    style A fill:#f9f7f4,stroke:#8b7355
    style B fill:#f9f7f4,stroke:#8b7355
    style C fill:#f9f7f4,stroke:#8b7355
    style D fill:#f3efe8,stroke:#8b7355
    style E fill:#f9f7f4,stroke:#8b7355
    style F fill:#f3efe8,stroke:#8b7355
    style G fill:#f9f7f4,stroke:#8b7355
    style H fill:#f9f7f4,stroke:#8b7355
```

## System Architecture

```mermaid
flowchart LR
    subgraph Client["🖥️ Next.js Client (page.tsx)"]
        UI[Screen Components]
    end

    subgraph API["⚡ API Routes"]
        GenAPI["/api/generate-itinerary"]
        MatchAPI["/api/matching-trips"]
        SaveAPI["/api/save-trip"]
        SendAPI["/api/send-itinerary"]
        TrackAPI["/api/track-mood"]
        TestAPI["/api/testimonials"]
    end

    subgraph External["🌐 External Services"]
        DS[🤖 DeepSeek AI<br/>deepseek-chat model]
        SB[(🗄️ Supabase<br/>trips · moods_analytics · testimonials)]
        N8N[⚙️ n8n Workflow<br/>Email delivery]
        Email[📧 Gmail / SMTP / SendGrid]
    end

    UI --> GenAPI
    UI --> MatchAPI
    UI --> SendAPI
    UI --> TrackAPI
    UI --> TestAPI
    UI --> SaveAPI

    GenAPI --> DS
    GenAPI --> SB
    MatchAPI --> SB
    SaveAPI --> SB
    SendAPI --> SB
    SendAPI --> N8N
    TrackAPI --> SB
    TestAPI --> SB
    N8N --> Email
```

## Data Flow (detailed)

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant App as 🖥️ Next.js App
    participant API as ⚡ API Routes
    participant DS as 🤖 DeepSeek
    participant DB as 🗄️ Supabase
    participant N8N as ⚙️ n8n
    participant Mail as 📧 Email

    U->>App: Enter name → Pick mood
    App->>API: POST /api/track-mood
    API->>DB: INSERT moods_analytics

    U->>App: Set preferences → "Build my trip"
    App->>API: POST /api/generate-itinerary
    API->>DS: Chat completion (mood + prefs prompt)
    DS-->>API: Structured itinerary JSON
    API->>DB: INSERT trips (status: pending)
    API-->>App: Return itinerary

    Note over App: Show SampleTeaser while waiting

    App->>U: Display full itinerary

    opt User wants another trip
        U->>App: "Show me another"
        App->>API: GET /api/matching-trips
        API->>DB: Query existing trips (same mood + prefs)
        DB-->>API: Matching trips
        alt Not enough matches
            App->>API: POST /api/generate-itinerary
            API->>DS: Generate new (avoid duplicates)
            DS-->>API: New itinerary
        end
        API-->>App: Additional trips
    end

    U->>App: "Send to inbox" → Enter email
    App->>API: POST /api/send-itinerary
    API->>DB: UPDATE trip with email
    API->>N8N: POST webhook payload
    N8N->>N8N: Format HTML email
    N8N->>Mail: Send formatted email
    Mail-->>U: 📬 Trip in inbox
    N8N-->>API: 200 OK
    API->>DB: UPDATE trip status → "sent"
```

## API Route Summary

| Route | Method | Input | Output | External Calls |
|-------|--------|-------|--------|----------------|
| `/api/generate-itinerary` | POST | moodId, moodName, preferences, existingTitles | `{ itinerary }` | DeepSeek AI, Supabase |
| `/api/matching-trips` | GET | mood, budget, scope, length, company | `{ trips[] }` | Supabase |
| `/api/save-trip` | POST | moodId, moodName, preferences, itinerary | `{ success }` | Supabase |
| `/api/send-itinerary` | POST | email, moodId, preferences, itinerary | `{ tripId }` | Supabase, n8n webhook |
| `/api/track-mood` | POST | moodId, sessionId | `{ success }` | Supabase |
| `/api/testimonials` | GET | mood | `{ testimonial }` | Supabase |
