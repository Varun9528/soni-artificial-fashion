# Next.js Async Client Component Error Fix

## Problem
The homepage was showing the following error:
```
<Home> is an async Client Component. Only Server Components can be async at the moment. This error is often caused by accidentally adding `'use client'` to a module that was originally written for the server.
```

## Root Cause
The issue was caused by declaring the Home component as `async` while also having the `'use client'` directive at the top of the file. In Next.js, components marked with `'use client'` cannot be async functions.

## Solution
Modified [src/app/page.tsx](file:///c:/Users/hp/Desktop/pachmarhi/pachmarhi-marketplace/src/app/page.tsx) to:
1. Remove the `async` keyword from the component declaration
2. Keep all data fetching logic inside `useEffect` hooks (which is the correct approach for Client Components)
3. Maintain the `'use client'` directive since the component uses client-side hooks like `useState` and `useEffect`

## Changes Made
- Changed `export default async function Home()` to `export default function Home()`
- Kept all existing data fetching logic inside the `useEffect` hook
- Preserved all client-side interactivity features

## Result
The error has been resolved and the homepage now loads correctly. The component properly fetches data on the client side using `useEffect` and displays the content as expected.

## Key Learning
In Next.js:
- Server Components can be async (for server-side data fetching)
- Client Components cannot be async (must use useEffect for data fetching)
- The `'use client'` directive should only be used when the component needs client-side interactivity

---
*Fix completed on: October 8, 2025*
*Status: ✅ ERROR RESOLVED*