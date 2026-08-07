/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as landingPageGallery from "../landingPageGallery.js";
import type * as landingPages from "../landingPages.js";
import type * as lib_adminAuth from "../lib/adminAuth.js";
import type * as lib_createPageFromTemplate from "../lib/createPageFromTemplate.js";
import type * as lib_seedPressureWashingData from "../lib/seedPressureWashingData.js";
import type * as lib_seedSoftwashingData from "../lib/seedSoftwashingData.js";
import type * as lib_seedWindowCleaningData from "../lib/seedWindowCleaningData.js";
import type * as lib_slug from "../lib/slug.js";
import type * as lib_validators from "../lib/validators.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  landingPageGallery: typeof landingPageGallery;
  landingPages: typeof landingPages;
  "lib/adminAuth": typeof lib_adminAuth;
  "lib/createPageFromTemplate": typeof lib_createPageFromTemplate;
  "lib/seedPressureWashingData": typeof lib_seedPressureWashingData;
  "lib/seedSoftwashingData": typeof lib_seedSoftwashingData;
  "lib/seedWindowCleaningData": typeof lib_seedWindowCleaningData;
  "lib/slug": typeof lib_slug;
  "lib/validators": typeof lib_validators;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
