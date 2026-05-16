# AgriTrust: AI-Powered Grain Verification and Escrow for Africa

## Live Demo

https://agritrust-frontend.vercel.app

## Problem Statement

Nigeria loses an estimated hundreds of billions of naira annually to grain fraud across its agricultural supply chain. Buyers receive sacks of maize adulterated with stones, sand, or inferior grain, paying premium prices for substandard product with no recourse. Farmers face the other side of the same broken system: middlemen undervalue genuine quality grain because there is no independent, trusted grading mechanism, so honest farmers are underpaid by the same margin that fraudulent sellers profit. With over 30 million smallholder farmers and one of the largest grain markets in sub-Saharan Africa, the trust deficit between farmers, buyers, and aggregators is one of the most urgent unsolved problems in African agri-commerce.

## Solution Overview

AgriTrust is an AI-powered grain quality verification and escrow payments platform that eliminates fraud from the grain supply chain. A farmer photographs their grain batch; the computer vision model grades it in 5 to 15 seconds and generates a tamper-evident quality report with moisture assessment, defect detection, and an AI-recommended fair price. Buyers purchase against that verified report. Payment is held in Squad-powered escrow and released to the farmer only after delivery is confirmed, making fraud structurally impossible on both sides.

## How It Works

1. **Farmer scans grain** using their phone camera directly in the app (no separate upload step required).
2. **AI grades the batch** in a single API call, detecting defects, estimating moisture content, assigning a grade (A to D), and computing a fair market price. The same response returns the Squad escrow account details, so the scan and payment setup happen atomically.
3. **Buyer receives payment instructions**: a Squad-issued virtual bank account, account number, and transaction reference tied to that specific scan.
4. **Buyer transfers funds** to the Squad-issued virtual account. Payment is held securely until delivery is confirmed.
5. **Delivery verification**: the buyer inspects the physical grain on arrival and submits the observed grade via the app.
6. **Escrow is released** automatically if the delivered grade matches the AI-assessed grade. If there is a quality mismatch, the dispute flow is triggered and disbursement is withheld.
7. **Farmer Trust Score** updates after every transaction, reflecting their honesty rate and unlocking lower platform fees over time.

## AI Technical Depth

The core of AgriTrust is a **computer vision grading model** deployed on the backend that processes grain sample images in real time.

**Model outputs:** A single call to `/grade-and-scan` returns a structured AI assessment containing:

- **Grade classification** (A, B, C, or D) with a numeric confidence percentage
- **Defect list**: specific defect types detected in the sample (mould, weevil damage, broken kernels, foreign matter)
- **Anomaly score**: a continuous measure of how far the sample deviates from clean-grade grain
- **Dark blobs detected**: a count of visually anomalous regions in the image, used as a defect signal
- **Moisture assessment**: Low, Medium, or High, inferred from visual texture patterns
- **Model score**: the raw output of the grading model before post-processing
- **AI Score**: a composite quality index used as the direct input to price calculation
- **Reasoning**: a plain-language explanation of why the model assigned the grade it did

**Output reliability:** Every grading response includes a `confidence` percentage. The reasoning field gives both parties full transparency into how the AI reached its conclusion. Weather data (humidity, temperature) is submitted alongside the image to give the model environmental context at the time of the scan.

**Price computation:** The recommended unit price is derived from the AI Score mapped against market benchmarks per grain type (Maize, Rice, Sorghum), producing a total amount that reflects actual quality, not just weight.

**Client-side image handling:** Images are captured via the browser `getUserMedia` API (rear camera, `facingMode: environment`) and compressed using the Canvas API before upload: JPEG at 75% quality, maximum width 1280 pixels. This keeps scan latency low on slow mobile networks without sacrificing enough detail for accurate grading.

## Squad API Integration

Squad's API is the financial backbone of the verification workflow, not a bolt-on feature. All three integrated endpoints are functional in the current build.

**1. Grade and scan with integrated escrow (`/grade-and-scan`)**

The single most important API call in the product. When a farmer submits a grain image, this endpoint returns the full AI assessment AND the Squad payment details (bank name, virtual account number, payment instructions, transaction reference, and transaction ID) in one atomic response. There is no separate escrow-initiation step: the scan event and the payment setup are coupled by design, so a buyer can never be sent payment instructions that are not backed by a verified AI scan.

**2. Delivery verification and disbursement (`/verify-delivery`)**

Called by the buyer after physically inspecting the delivered grain. The buyer submits the transaction reference and their observed grade. The backend compares this against the AI-assessed grade. If they match, Squad automatically disburses funds to the farmer's registered account and returns a `disbursementId` confirming the transfer. If they do not match, the `outcome` field is set accordingly and disbursement is withheld, protecting the buyer from receiving grain that does not match what the AI certified.

**3. Trust score (`/farmer/:phone/trust-score`)**

Returns the farmer's `trustScore` (0 to 100), tier (`BRONZE`, `SILVER`, `GOLD`, or `PLATINUM`), total trade count, honest trade count, and `platformFeePercent`. The fee percentage decreases as the trust score rises, creating a direct financial incentive for farmers to trade honestly over time.

The transaction reference ties the AI scan, the virtual escrow account, and the delivery confirmation into a single auditable chain, so every naira moved through the system is traceable back to a specific verified grain quality event.

## Problem Relevance and Domain Insight

Grain fraud in Nigeria takes several well-documented forms:

- **Adulteration at point of sale**: mixing low-grade or foreign material into bags before weighing
- **Grade misrepresentation**: labelling C-grade grain as A-grade to command higher price premiums
- **Moisture manipulation**: adding water weight before sale, causing post-purchase spoilage and financial loss for the buyer
- **Payment default after delivery**: buyers receiving grain and delaying or refusing payment, with no recourse for farmers who have already handed over stock

AgriTrust addresses all four. The AI scan happens before any money changes hands, so grade misrepresentation is caught at source. The escrow model makes delivery-default structurally impossible: the farmer knows payment is locked in a Squad virtual account before handing over the grain. Moisture is assessed in every AI output. The Trust Score creates a reputational and financial incentive that discourages repeated dishonest behaviour.

The GPS coordinate captured at scan time (via the browser Geolocation API) creates a geographic audit trail, useful for aggregators consolidating purchases across multiple farm gates and for detecting anomalies such as the same device scanning grain in two distant locations within a short time window.

## Solution Design and Scalability

**System architecture:**

```
Mobile/Web Client (React + Vite)
        |
        v
AgriTrust Backend API (Node.js, deployed on Render)
        |
        +-- AI Grading Service  -->  CV Model (grain image -> grade + price + payment details)
        +-- Squad API Client    -->  Escrow initiation, verification, disbursement
        +-- Trust Score Store   -->  Per-farmer transaction ledger
```

**Frontend:** React 19, TypeScript, Vite, Tailwind CSS. Camera-first grain capture using the browser `getUserMedia` API with `facingMode: environment` for the rear camera on mobile. Images are compressed client-side before upload to minimise latency on slow networks. GPS coordinates are attached to every grading request.

**Stateless scan flow:** Each scan is self-contained. Farmer metadata, grain type, quantity, image (base64), GPS coordinates, and weather data are submitted in a single POST. The response includes the full AI assessment, pricing, and Squad payment details. The client requires no subsequent polling to render the full results page.

**Scaling path:**

- The AI grading service is independently deployable and horizontally scalable. High scan volumes can be handled by running multiple inference workers behind a load balancer without changes to the API contract.
- Squad's virtual account model means escrow accounts are created on-demand per transaction with no pre-funding required from AgriTrust.
- The trust score ledger is append-only by design, making it straightforward to replicate to a read replica for analytics without affecting the write path.
- The frontend is a static build deployable to any CDN. There is no server required for the client layer.

**Multi-crop support:** The grading model currently handles Maize, Rice, and Sorghum. Additional crops require a retraining run on the AI service, not an architecture change.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js (deployed on Render)
- **AI:** Computer vision grading model served via REST API
- **Payments and Escrow:** Squad API (virtual accounts, escrow, disbursement, trust scoring)
- **Camera capture:** Browser `getUserMedia` API + Canvas API
- **Location:** Browser Geolocation API
- **Deployment:** Vercel (frontend), Render (backend)

## Installation and Local Setup

### Prerequisites

- Node.js 18 or higher
- Access to the AgriTrust backend

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env.local` in the project root:

```bash
VITE_API_BASE_URL=https://agritrust-backend-4zhi.onrender.com/api/squad
```

### 3. Start the dev server

```bash
npm run dev
```

Open http://localhost:5173

### 4. Build for production

```bash
npm run build
```

## Key User Flows

| Flow | Entry point | Outcome |
|---|---|---|
| Farmer scans grain | `/farmer/scan` | AI grade report and escrow account generated in one call |
| Buyer views offer | `/buyer` | Verified grade, price, and payment instructions |
| Buyer pays | `/buyer/payment` | Funds locked in Squad virtual account |
| Delivery confirmed | `/verify` | Squad releases payment to farmer automatically |
| Trust score check | `/farmer/profile` | Farmer views tier, honest trade rate, platform fee |

## Future Roadmap

- Aggregator dashboard for bulk orders across multiple farmers
- Offline-capable PWA for low-connectivity farm environments
- Integration with commodity exchange APIs for live price benchmarks
- Batch scanning for large warehouse inspections
- Buyer reputation scores mirroring the farmer Trust Score system

## License

MIT

---

AgriTrust exists to make fair grain trade the default: if a farmer grows quality grain, they should be paid for it, automatically, verifiably, and without trusting a middleman.
