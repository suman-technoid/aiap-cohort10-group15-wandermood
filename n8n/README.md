# n8n Workflow Setup — WanderMood Email

This document explains how to set up the n8n workflow that sends itinerary emails.

## Workflow Overview

The workflow receives a webhook from the WanderMood app when a user submits their email, 
then formats and sends a beautiful HTML email with their full itinerary.

## Setup Steps

### 1. Create a new Workflow in n8n

### 2. Add a Webhook Node (Trigger)
- **Method:** POST
- **Path:** `/wondermood-send`
- **Response Mode:** When the last node finishes
- Copy the **Production URL** — this is your `N8N_WEBHOOK_URL`

### 3. Add a Function Node (Format Email)
This node takes the raw itinerary data and formats it into HTML email content.

```javascript
// Function node code
const input = $input.first().json;

const { email, moodName, moodEmoji, itinerary, preferences } = input;

// Build day-by-day HTML
const daysHtml = itinerary.days.map(day => {
  const itemsHtml = day.items.map(item => 
    `<tr>
      <td style="padding:8px 12px;color:#8B7355;font-weight:600;font-size:13px;width:80px;vertical-align:top;">${item.time}</td>
      <td style="padding:8px 12px;color:#4A4035;font-size:14px;">${item.text}</td>
    </tr>`
  ).join('');
  
  return `
    <div style="margin-bottom:24px;border:1px solid #E8E2D9;border-radius:16px;overflow:hidden;">
      <div style="padding:16px 20px;background:#F9F7F4;border-bottom:1px solid #E8E2D9;">
        <span style="font-size:12px;color:#8B7355;text-transform:uppercase;letter-spacing:0.05em;">Day ${day.n}</span>
        <h3 style="margin:4px 0 0;font-family:Georgia,serif;font-size:20px;color:#2C2520;">${day.title}</h3>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        ${itemsHtml}
      </table>
    </div>`;
}).join('');

// Build tips HTML
const tipsHtml = itinerary.tips.map(tip => 
  `<div style="padding:12px 16px;border-left:3px solid #8B7355;margin-bottom:8px;background:#FDFCFA;">
    <span style="font-size:14px;color:#4A4035;">✦ ${tip}</span>
  </div>`
).join('');

// Build packing HTML
const packingHtml = itinerary.packing.map(item => 
  `<span style="display:inline-block;padding:6px 14px;margin:4px;border-radius:999px;background:#F3EFE8;color:#4A4035;font-size:13px;">${item}</span>`
).join('');

// Stats HTML
const statsHtml = itinerary.stats.map(s => 
  `<td style="padding:16px;text-align:center;border-right:1px solid #E8E2D9;">
    <div style="font-family:Georgia,serif;font-size:20px;color:#2C2520;">${s.value}</div>
    <div style="font-size:11px;color:#8B7355;text-transform:uppercase;letter-spacing:0.05em;margin-top:4px;">${s.label}</div>
  </td>`
).join('');

const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F9F7F4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    
    <!-- Header -->
    <div style="text-align:center;margin-bottom:40px;">
      <h1 style="font-family:Georgia,serif;font-size:32px;color:#2C2520;margin:0;">
        wander<em>mood</em>
      </h1>
      <p style="color:#8B7355;font-size:14px;margin-top:8px;">Your trip is ready</p>
    </div>

    <!-- Mood badge -->
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:36px;">${moodEmoji}</span>
      <p style="font-size:14px;color:#8B7355;margin-top:8px;">Mood: <strong>${moodName}</strong></p>
    </div>

    <!-- Trip title -->
    <div style="text-align:center;margin-bottom:32px;">
      <h2 style="font-family:Georgia,serif;font-size:28px;color:#2C2520;margin:0 0 8px;">${itinerary.title}</h2>
      <p style="color:#6B5F52;font-size:15px;margin:0;">📍 ${itinerary.place} · ${itinerary.range}</p>
    </div>

    <!-- Summary -->
    <p style="font-family:Georgia,serif;font-size:18px;line-height:1.6;color:#4A4035;text-align:center;margin-bottom:32px;padding:0 20px;">
      ${itinerary.summary}
    </p>

    <!-- Stats -->
    <table style="width:100%;border-collapse:collapse;border:1px solid #E8E2D9;border-radius:12px;overflow:hidden;margin-bottom:32px;">
      <tr>${statsHtml}</tr>
    </table>

    <!-- Days -->
    <h3 style="font-family:Georgia,serif;font-size:22px;color:#2C2520;margin-bottom:16px;">Day by day</h3>
    ${daysHtml}

    <!-- Tips -->
    <h3 style="font-family:Georgia,serif;font-size:22px;color:#2C2520;margin:32px 0 16px;">Good to know</h3>
    ${tipsHtml}

    <!-- Packing -->
    <h3 style="font-family:Georgia,serif;font-size:22px;color:#2C2520;margin:32px 0 16px;">Pack light</h3>
    <div style="margin-bottom:40px;">${packingHtml}</div>

    <!-- Footer -->
    <div style="text-align:center;padding-top:32px;border-top:1px solid #E8E2D9;">
      <p style="color:#8B7355;font-size:13px;">
        Crafted with feeling by WanderMood<br>
        <a href="#" style="color:#8B7355;">Plan another trip</a>
      </p>
    </div>
  </div>
</body>
</html>`;

return [{
  json: {
    to: email,
    subject: `${moodEmoji} Your ${moodName} trip: ${itinerary.title}`,
    html: htmlBody,
    tripId: input.tripId
  }
}];
```

### 4. Add an Email Node (Send Email)
Choose your preferred email provider:

**Option A: Gmail Node**
- Connect your Gmail account
- To: `{{ $json.to }}`
- Subject: `{{ $json.subject }}`  
- HTML: `{{ $json.html }}`

**Option B: SMTP Node (SendGrid, Mailgun, etc.)**
- Configure SMTP credentials
- From: `hello@wandermood.app`
- To: `{{ $json.to }}`
- Subject: `{{ $json.subject }}`
- HTML: `{{ $json.html }}`

**Option C: SendGrid Node**
- API Key: your SendGrid API key
- From: `hello@wandermood.app`
- To: `{{ $json.to }}`
- Subject: `{{ $json.subject }}`
- HTML: `{{ $json.html }}`

### 5. Add a Respond to Webhook Node
- Response Code: 200
- Response Body: `{ "success": true }`

## Webhook Payload Structure

The webhook receives this JSON:

```json
{
  "tripId": "uuid-from-supabase",
  "email": "user@example.com",
  "moodName": "Unwind",
  "moodEmoji": "😌",
  "preferences": {
    "budget": "comfortable",
    "scope": "domestic",
    "length": "weekend",
    "company": "solo"
  },
  "itinerary": {
    "title": "Backwater drift",
    "place": "Alleppey & Kumarakom, Kerala",
    "range": "Thu 18 – Sun 21 Sep",
    "summary": "Four unhurried days...",
    "stats": [{ "label": "Length", "value": "4 days" }, ...],
    "days": [{ "n": 1, "title": "Arrive & exhale", "items": [...] }, ...],
    "tips": ["Carry light cotton...", ...],
    "packing": ["Linen shirts", ...]
  }
}
```

## Environment Variable

Once you have the production webhook URL, add it to `.env.local`:

```
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/wondermood-send
```

## Testing

1. Activate the workflow in n8n
2. Use the n8n "Test webhook" mode first
3. Submit a test email through the WanderMood app
4. Check n8n execution logs for any errors
