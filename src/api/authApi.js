// src/api/authApi.js
// ---------------------------------------------------------------------------
// Backward-compatibility re-export shim.
// All auth API logic now lives in src/api/api.js.
// This file exists solely so any existing import of authApi or its named
// functions from this path continues to work without changes.
//
// TODO: migrate all consumers to import directly from '../api/api' and then
//       delete this file.
// ---------------------------------------------------------------------------
export { authApi, login, register, forgotPassword, socialLogin } from "./api";
