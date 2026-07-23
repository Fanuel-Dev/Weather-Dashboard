# 🌧️ Aloft — Minimalist & Atmospheric Weather Engine

[![Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20JavaScript-38bdf8?style=for-the-badge&logoColor=fff)](https://github.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![UX Paradigms](https://img.shields.io/badge/UI-Atmospheric%20%2F%20Dark-fbbf24?style=for-the-badge)](https://github.com/)

> **"Atmospheric weather metrics, delivered live."**

**Aloft** is an elegant, client-side weather application engineered with an atmospheric dark interface and dynamic visual particle layers (such as live falling rain streaks matching real-time ambient condition states). It provides instant global city lookups, temperature metrics, "feels-like" calibrations, high/low ranges, and an interactive 24-hour hourly forecast track.

[Explore Live Workspace](https://yourusername.github.io/aloft) • [Report a Bug](https://github.com/yourusername/aloft/issues) • [Request Feature](https://github.com/yourusername/aloft/issues)

---

## 📸 Interface Preview & Gallery

### Live Weather Dashboard & Hourly Track
<!-- Replace this placeholder URL with your real cropped screenshot once uploaded to GitHub -->
![Aloft Workspace Interface](https://raw.githubusercontent.com/yourusername/aloft/main/assets/screenshots/dashboard-preview.png)

### 🎥 Atmospheric Interface Walkthrough
> **Watch Aloft in action:** Click the workspace preview below to see dynamic city lookups, real-time forecast rendering, and ambient weather particle effects executing without page reloads.

[![Aloft Interactive Walkthrough](https://raw.githubusercontent.com/yourusername/aloft/main/assets/screenshots/video-thumbnail.png)](https://github.com/yourusername/aloft "Watch Walkthrough")

---

## ✨ Core Engineering & Feature Set

* **⛈️ Dynamic Particle Weather Layer:** Integrated CSS/JS animation engine that renders active weather states (such as live drizzle and rain streaks) over an obsidian dark viewport.
* **🔍 Asynchronous City Search:** Real-time query input system fetching live location data and weather metrics on the fly using asynchronous `fetch` pipelines.
* **📊 Comprehensive Meteorological Indicators:**
  * Primary temperature display (`14°C`) paired with "feels like" calibration (`15°`).
  * Real-time condition logging (`Light drizzle`).
  * Daily High/Low ranges (`20°` / `11°`).
  * Timestamped data synchronization (`updated 07:15 PM`).
* **🕒 Scrollable 24-Hour Forecast Track:** Horizontal forecast matrix detailing predicted temperature fluctuations, timestamps, and condition icons across upcoming 24-hour intervals.
* **🎨 High-Contrast Dark Mode UI:** Designed with a midnight palette, gold action triggers (`#f59e0b`), and subtle card boundaries to maximize contrast and eliminate eye strain.

---

## 🛠 Tech Stack Matrix

| Module | Technologies | Core Operational Mandate |
| :--- | :--- | :--- |
| **Structure** | HTML5 | Accessible search forms, semantic layout grouping, and metric containers |
| **Styling** | CSS3 Grid / Flex | Custom keyframe animations, glassmorphic card overlays, fluid horizontal track sliders |
| **Engine** | Vanilla JavaScript | Asynchronous API fetching (`fetch`), DOM manipulation, dynamic time formatting, condition mapping |

---

## 📦 Rapid Local Setup

### 1. Repository Clone
```bash
git clone [https://github.com/yourusername/aloft.git](https://github.com/yourusername/aloft.git)
cd aloft
