# Fleet Tracking Frontend

One React app, role-based routing for drivers and admins, talking to the
Spring Boot backend over REST + a shared STOMP/WebSocket connection.

## Stack
- React 18 + Vite
- react-router-dom (role-gated routes)
- axios (JWT attached via interceptor)
- @stomp/stompjs + sockjs-client (live locations + alerts)
- react-leaflet + Leaflet (live map, OpenStreetMap tiles — no API key needed)
- recharts (admin analytics chart)

Verified: `npm install` and `npm run build` both complete cleanly in this
sandbox against the exact `package.json` in this zip (Node 22 / npm 10).

## Running it
```
npm install
npm run dev
```
Runs on http://localhost:5173. In dev, Vite proxies `/api` to
`http://localhost:8080` (see `vite.config.js`) — adjust the proxy target, or
set `VITE_API_BASE_URL` and `VITE_WS_BASE_URL` env vars, if your backend runs
elsewhere. `VITE_WS_BASE_URL` defaults to `/ws`, which won't proxy correctly
through Vite for a WebSocket by default — for local dev either add a `/ws`
proxy entry alongside `/api` in `vite.config.js`, or point
`VITE_WS_BASE_URL` straight at `http://localhost:8080/ws`.

## Getting in for the first time
1. Go to `/register-company` — creates the admin account.
2. As admin, use the **Onboard** tab to add trucks and drivers (a driver's
   phone + the temporary password you set is what they log in with).
3. Driver logs in at `/login` with their phone number.
4. Driver starts a trip (enters the truck ID the admin gave them + source/destination).

## How it's organized
```
src/
  auth/        shared login, company registration, JWT context, route guard
  driver/      driver layout + pages (start trip, active trip, history)
  admin/       admin layout + pages (live map, drivers, alerts, analytics, onboard)
  common/      websocket client, date/format utils
  styles/      design tokens (CSS variables) shared by every screen
```

Routing lives in `App.jsx`: `/driver/*` and `/admin/*` are each wrapped in
`RoleBasedRoute`, which reads the role out of the JWT (stored via
`AuthContext`) and bounces anyone in the wrong place. There's no separate
mobile app — the driver side is just a mobile-first layout in the same app,
so hosting stays to React + Spring Boot + the database, as you asked.

## Real-time data flow
- `common/websocket/socketClient.js` holds one shared STOMP connection for
  the whole app.
- Admin's live map subscribes to `/topic/company/{companyId}/locations` and
  `/topic/company/{companyId}/alerts`.
- A driver's alert banner subscribes to `/topic/driver/{driverId}/alerts`.
- The driver's `LiveLocationSender` component uses
  `navigator.geolocation.watchPosition` and posts a ping to
  `POST /api/locations/ping` every 15s (adjustable in that file) — that
  interval, not the raw geolocation callback, is what drives both the ping
  rate and the map's update rate.

## Known gaps / things to decide before production
- **WebSocket auth**: the client connects to `/ws` with no token in the
  handshake, matching the backend's current `permitAll` on that endpoint.
  Once you lock that down backend-side (see the backend README), you'll need
  to pass the JWT as a STOMP CONNECT header here too.
- **No truck picker on the driver form** — the driver types in a truck ID an
  admin gave them out of band. If you want a dropdown instead, add a
  `GET /api/admin/trucks` (or a driver-facing equivalent) on the backend and
  swap the text input in `StartTripPage.jsx`.
- **Company ID == admin user ID** everywhere in the admin API calls, since a
  Company IS the login. Fine for one-admin-per-company; revisit if you add
  multiple admin users per company.
- Large single JS bundle (~250kB gzipped, mostly Leaflet + recharts) — fine
  for now; route-level code-splitting is the first thing to add if it
  becomes a real problem.
- No tests included.
