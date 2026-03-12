import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("login", "login/login.tsx"),
  route("track/:trackName", "track/track.tsx"),
] satisfies RouteConfig;
