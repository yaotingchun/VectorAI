<h1 align="center">🏭 Vector.ai — Virtual Factory Intelligence System</h1>

<p align="center">
  <strong>Transforming reactive factories into intelligent, self-aware manufacturing environments.</strong><br/>
  <em>A hardware-and-software platform combining a plug-and-play sensor kit with an interactive 2D digital twin, deterministic RUL prediction, AI-driven root cause diagnostics, and dynamic process rerouting.</em>
</p>

<p align="center">
  <em><b>"Where factories stop reacting and start thinking."</b></em>
</p>

<p align="center">
  <b>🌐 <a href="https://vector-ai-661695302381.us-central1.run.app/">Live Web Platform</a></b> •
  <b>🚀 <a href="https://youtu.be/AyJzMufqzEE">Live Demo Video</a></b> •
  <b>🎥 <a href="https://youtu.be/exQmN5-FIZA">Watch our Pitching Video</a></b>
</p>

---

## 👥 Team Details & Responsibilities

* **Team Name**: GoodQuestions
* **Competition / Initiative**: MAIC Nexus Challenge

| Member | Role | Responsibility |
| :--- | :--- | :--- |
| **Angela Ngu Xin Yi** | Leader | **Backend & Cloud Architecture**: Developing the Node.js API services (`server.cjs`), Cloud Run container deployment, GCP authentication, Firestore database schemas, and real-time telemetry streaming pipelines. |
| **Chun Yao Ting** | Member | **Frontend & Digital Twin Visualization**: Developing the React 18 UI, 2D HTML5 V-Factory Digital Twin Canvas engine, live telemetry charts, executive dashboard widgets, and interactive floorplan layout engine. |
| **Evelyn Ang** | Member | **AI Models & GenAI Diagnostics**: Developing Google Gemini 2.5 Flash API integration, multi-turn AI copilot orchestration, RAG retrieval pipelines, and 11 OEM cleanroom technical manual ingestion. |
| **Teoh Xin Yee** | Member | **Autonomous Rerouting & Process Engine**: Developing the graph-based Dynamic Rerouting Engine, SECS/GEM & MES interlock solver, queue balancing algorithms, and multi-channel alerting services (WhatsApp / Email). |
| **Toh Shee Thong** | Member | **Predictive Maintenance & Degradation Modeling**: Developing the deterministic Remaining Useful Life (RUL) mathematical formulas, sensor threshold & change-point detection algorithms, Auto Maintenance Agent, and SLA work order generator. |

---

## 📋 Problem Statement

### Current Industry Still Suffers From:
1. **Reactive Maintenance**: Machines are repaired only *after* failure, causing catastrophic unplanned stoppages and lost production batches.
2. **Wasteful Preventive Maintenance**: Consumable parts and tooling are replaced on rigid, fixed calendar schedules regardless of actual physical wear, driving up unnecessary spare parts costs.
3. **No Continuous Real-Time Monitoring**: Lack of continuous tracking across high-frequency vibration, temperature, and electrical loads prevents failures from being caught in their early degradation phases.
4. **Fragmented Floorplan Visibility**: No unified, spatial view of the manufacturing floor, delaying issue identification, cross-team triage, and executive decision-making.

```
┌───────────────────────────────┐     ┌────────────────────────────────────────────────────────┐
│   INDUSTRY PAIN POINTS        │ ──► │  DISASTROUS BUSINESS IMPACTS                           │
│ 1. Reactive repairs           │     │ • Disrupts production schedules & delays fulfillment   │
│ 2. Fixed-schedule maintenance │     │ • Rising maintenance costs & wasted spare parts        │
│ 3. No continuous monitoring   │     │ • Failures escalate unnoticed into sudden breakdowns   │
│ 4. Fragmented factory views   │     │ • Slow, uncoordinated response increases risk          │
└───────────────────────────────┘     └────────────────────────────────────────────────────────┘
```

> [!WARNING]
> **Financial Reality**: The typical cost of unplanned downtime at a manufacturing facility is estimated at **RM 4.14 Million**, leading to severely compressed operating margins and delayed customer fulfillment.

---

## 💡 Proposed Solution: Vector.ai

**Vector.ai** is a unified hardware-and-software platform combining a **clip-on physical sensor kit** with a **digital factory environment**, enabling supervisors and reliability engineers to instantly understand the overall health and operational trajectory of their production floor through an intuitive visual interface.

### 🌟 Core Capabilities
* **Plug-and-Play Sensor Kit**: Non-invasive clip-on IoT sensor node (Vibration, Temperature, Load) with instant NFC tag provisioning.
* **2D Digital Twin of the Factory Floor**: Spatial drag-and-drop floorplan canvas mapping cleanroom zones (ISO 5–8), machine nodes, and dynamic conveyor flows.
* **Real-Time Machine Monitoring**: Sub-second telemetry aggregation, parameter drift tracking, and anomaly detection with change-point analysis.
* **AI-Driven Anomaly Detection & RAG Insights**: Multi-source diagnostic engine matching sensor anomalies to 11 OEM machine manuals and SOPs.
* **Predictive Maintenance (RUL-Based)**: Mathematically explainable Remaining Useful Life calculations with parameter wear share breakdowns.
* **Dynamic Process Rerouting**: Autonomous graph-based solver that reallocates MES lot queues, SECS/GEM interlocks, and AGV carriers to avoid bottleneck halts.

---

## 🧠 AI Beyond a Chatbot: Real Sensors, Real-Time Intelligence, Human-Approved Action

Vector.ai elevates industrial AI far beyond a passive chat interface into a closed-loop intelligence cockpit:

```
  TYPICAL SYSTEM                                VECTOR.AI COCKPIT
┌──────────────────┐                         ┌──────────────────────────────┐
│  Sensor Reading  │                         │ Sensor Reading (NFC IoT Kit) │
└────────┬─────────┘                         └──────────────┬───────────────┘
         │                                                  │
         ▼                                                  ▼
┌──────────────────┐                         ┌──────────────────────────────┐
│ Dashboard Display│                         │   AI Detects & Predicts      │
└────────┬─────────┘                         │  (Anomalies & RUL Forecast)  │
         │                                   └──────────────┬───────────────┘
         ▼                                                  │
┌──────────────────┐                         ┌──────────────▼───────────────┐
│ Engineer Decides │                         │  AI Explains & Recommends    │
│ (Manual Guess)   │                         │  (Manual-Grounded RAG SOPs)  │
└──────────────────┘                         └──────────────┬───────────────┘
                                                            │
                                             ┌──────────────▼───────────────┐
                                             │    Human-Approved Action     │
                                             │ (One-Click Reroute/WorkOrder)│
                                             └──────────────────────────────┘
```

| Question | Traditional Systems | Vector.ai Intelligence System |
| :--- | :--- | :--- |
| **What is happening?** | Raw, fragmented sensor time-series | Unified 2D Digital Twin with real-time health score |
| **Why is happening?** | Requires hours of manual manual-digging | RAG-grounded root cause analysis with SOP citation |
| **What will happen next?** | Unknown until machine halts | Explainable Remaining Useful Life (RUL) prediction |
| **What should be done now?** | Trial-and-error engineer troubleshooting | Auto-generated work order & dynamic lot reroute plan |

---

## 🏗️ 4-Layer Intelligent System Architecture

Vector.ai decouples factory telemetry, knowledge grounding, and autonomous execution into 4 distinct, cohesive software layers:

### 1. Visual & Interaction Layer
* **Focus**: Real-time spatial monitoring and executive cockpit.
* **Components**: 2D HTML5 Canvas Floorplan, Executive KPI Dashboard, Interactive Machine Asset Drawer.
* **Deliverables**: Unified factory health score (0–100), live OEE trends, and spatial machine nodes with sub-millisecond canvas redraws.

### 2. Data Layer
* **Focus**: Schema configuration and authoritative knowledge management.
* **Components**: Configurable Machine Schemas, Sensor Registry & Telemetry Data Lake, 11 Authoritative OEM Manual RAG Repositories.
* **Deliverables**: Structured machine contracts, raw/downsampled time-series datasets, and indexed SOP vectors.

### 3. Telemetry & Intelligence Layer
* **Focus**: Stream ingestion, signal filtering and anomaly detection.
* **Components**: Telemetry Ingestion (WiFi / MQTT), Signal Normalization & Noise Filtering, Anomaly & Change-Point Detection Engine.
* **Deliverables**: Real-time parameter deviations, multi-sensor health indices, and RAG diagnostic insights.

### 4. Prediction & Action Layer
* **Focus**: Failure forecasting, dynamic lot rerouting and maintenance dispatch.
* **Components**: Deterministic Weighted RUL Prediction, Graph-Based Dynamic Rerouting Engine, Auto Maintenance Work Order Scheduler.
* **Deliverables**: RUL operating hours forecast, automated MES lot reroute plans, and dispatched work orders with SLA tracking.

---

## 🛠️ Technologies Used

* **Frontend**: React 18, Vite 6, TypeScript, Lucide Icons, HTML5 Canvas 2D Engine, React Router.
* **Backend & Server**: Node.js (`server.cjs`), Python 3.10+ (`scripts/fetch_machines.py`, `scripts/seedFirestore.js`), Native REST Proxy.
* **Database & Cloud Infrastructure**: Google Cloud Platform (GCP), Cloud Run, Google Cloud Firestore, Firebase SDK.
* **AI & Generative Intelligence**: Google Gemini 2.5 Flash (`@google/genai` & Vertex AI), Client-Side RAG Vector/Keyword Index, Deterministic Physical Degradation Formulas.
* **Hardware & Protocols**: Clip-on IoT Sensor Kit, NFC Hardware Provisioning, MQTT, SECS/GEM & MES Data Contracts.

---

## 📈 Commercial Opportunity & Business Model

### Who Pays?
1. **Semiconductor & OSAT Manufacturers**: Face extraordinarily costly downtime (**millions per hour**) and multi-hundred-thousand dollar wafer scrap risks.
2. **Electronics Assembly Factories (EMS / SMT)**: Suffer from ultra-high machine utilization and dense production schedules with little room for unplanned stops.
3. **Automotive Component Suppliers**: Manage multi-stage precision lines requiring strict IATF 16949 quality compliance and predictive maintenance records.

### Flexible SaaS Subscription Model

#### 🥉 Starter Plan — `RM 499 / month`
> **Best for:** Small production lines and pilot deployments (up to 20 machines).
* **Included Capabilities**: 2D Digital Twin Floorplan Map, Real-Time Equipment Telemetry Dashboard, and Standard Parameter Threshold Alerts.
* **Deployment & Support**: Multi-tenant Cloud with Community & Standard Support.

#### 🥈 Professional Plan — `RM 1,999 / month`
> **Best for:** Growing smart factories and full cleanroom lines with unlimited machines.
* **Included Capabilities**: Full VectorAI GenAI Copilot (RAG-grounded with OEM manuals), Deterministic RUL Prediction Engine, Dynamic Process Rerouting Solver, and Auto Maintenance Agent with SLA dispatch.
* **Deployment & Support**: Cloud-ready deployment with Priority Engineering Support.

#### 🥇 Enterprise Plan — `Custom Pricing`
> **Best for:** Multi-fab semiconductor enterprises requiring dedicated on-premise infrastructure.
* **Included Capabilities**: Everything in Professional plus On-Premise / Hybrid Cloud Deployment, Private Custom AI instances, Custom OEM Manual Ingestion, and Direct SECS/GEM, MES & OPC-UA integration.
* **Deployment & Support**: Dedicated On-Premise / Private Cloud with 24/7 Dedicated Account Engineering SLA.

---

## 💰 Return on Investment (ROI) & Value Creation

Vector.ai delivers measurable, high-impact business outcomes across three primary performance drivers:

* ⚡ **Up to 70% Reduction in Unplanned Downtime**: Achieved through proactive deterministic RUL wear alerts and automated lot rerouting during equipment degradations.
* 💸 **20% – 30% Savings in Maintenance Costs**: Shifts operations from fixed-calendar parts replacement to condition-based servicing, drastically reducing premature parts scrap.
* ⏳ **15% – 25% Increase in Equipment Lifespan**: Eliminates thermal and vibration runaway via timely micro-balancing, re-truing, and lubrication.

### Strategic Value Dimensions
* **Financial Impact**: Drastically lowers maintenance expenses, avoids emergency overtime repair charges, and protects high-value wafer lots from being scrapped.
* **Operational Impact**: Moves technicians from reactive firefighting to scheduled condition-based maintenance, while autonomous rerouting keeps production running during maintenance windows.
* **Strategic Impact**: Accelerates factory readiness for Industry 4.0, unifies fragmented siloed telemetry into a single pane of glass, and scales easily across diverse equipment lines.

---

## 🚀 Scalability: One Factory $\to$ Enterprise Network

* **More Factories**: Cloud-ready architecture supporting multi-site centralized management, role-based access control (Plant Manager, Maintenance Specialist, Operator), and cross-site benchmarks.
* **More Machines & Schemas**: Schema-driven machine integration allows new industrial assets to be provisioned via NFC and JSON schemas without requiring any source code modifications.
* **More Industries**: Readily extensible beyond semiconductor cleanrooms to **Food Processing, Automotive, Pharmaceutical, and Energy & Utilities**.

---

## 🌍 ESG & National Impact

Vector.ai strongly supports **Malaysia's Smart Manufacturing Vision** and global sustainability goals:

* **🌱 Environmental**:
  - Eliminates premature replacement of expensive machine parts.
  - Minimizes industrial scrap and electronic waste.
  - Optimizes machine energy efficiency through thermal and load anomaly elimination.
* **⚖️ Governance**:
  - Automatically standardizes digital maintenance logs and SOP compliance.
  - Provides 100% mathematically explainable, auditable AI decisions.
* **👥 Social**:
  - Creates safer cleanroom environments by preventing catastrophic high-pressure or high-speed machine failures.
  - Alleviates technician stress and emergency overtime calls.
* **🇲🇾 National Transformation**:
  - Direct contributor to **SDG 9 (Industry, Innovation, and Infrastructure)**.
  - Directly aligns with Malaysia's **National AI Roadmap** and **New Industrial Master Plan (NIMP 2030)** to empower local SMEs with accessible smart manufacturing.

---

## 💻 Usage Instructions

### 1. Prerequisites
* **Node.js**: Version 18.0.0 or higher.
* **Python**: Version 3.10 or higher.
* **Google Cloud / Firebase Project** (Optional; mock telemetry fallback included).

### 2. Installation & Setup

**Clone the Repository**:
```bash
git clone https://github.com/yaotingchun/VectorAI.git
cd VectorAI
```

**Install Dependencies**:
```bash
npm install
```

**Configure Credentials (Optional for Live Vertex AI / Gemini API)**:
* Place your Google Service Account key in `credentials/google.json` or `credentials/firebase.json`.
* Or define `VITE_GEMINI_API_KEY=your_key_here` in a `.env` file.

### 3. Running Locally

**Sync Machine Schemas & Manuals**:
```bash
python scripts/fetch_machines.py
```

**Start the Vite Frontend**:
```bash
npm run dev
```
* Access the local platform at `http://localhost:5173`

**Start the Production Server & Gemini API Proxy**:
```bash
npm run build
npm start
```
* Access the unified app and proxy at `http://localhost:8080`

### 4. Docker & Cloud Run Deployment

```bash
docker build -t vector-ai .
docker run -p 8080:8080 -e PORT=8080 vector-ai
```

---

## 🎯 Implementation Roadmap

* **Phase 1 (Hardware Ingestion & Edge Streaming)**: Deploy EMQX / Apache Kafka MQTT broker to handle ultra-high frequency multi-sensor telemetry with zero buffer loss.
* **Phase 2 (Dynamic Digital Twin & Schema Expansion)**: Expand the 2D layout engine with 3D WebGL capabilities and universal OPC-UA / SECS-GEM protocol drivers.
* **Phase 3 (Closed-Loop Autonomous Interlocks)**: Connect the Rerouting Engine directly to physical Automated Material Handling Systems (AMHS) and AGVs for automated wafer carrier dispatch.
* **Phase 4 (Enterprise Multi-Fab Cloud Platform)**: Implement federated learning across international facilities, integrating with enterprise ERP/MES platforms (SAP, Siemens Opcenter, IBM Maximo).
