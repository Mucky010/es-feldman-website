# Admin + Blog System Design

**Date**: 2025-04-28
**Status**: Approved

## Overview

Convert the current static HTML SPA into a Next.js app with an admin dashboard for editing page content and managing a blog. Uses Vercel Postgres for storage and Vercel Blob for images.

## Architecture

- **Framework**: Next.js 14 App Router
- **Database**: Vercel Postgres
- **Image Storage**: Vercel Blob Storage
- **Auth**: Simple password login via iron-session (sealed cookie) + bcrypt-hashed password in env var
- **Rich Text**: Tiptap editor for blog posts
- **Styling**: Preserve current design; use CSS modules or inline styles matching existing

## Data Model

### `page_content`

| Column | Type | Notes |
|--------|------|-------|
| `key` | text PK | e.g. "hero_title", "hero_description", "about_bio" |
| `value` | text | Editable content |
| `section` | text | Grouping: "hero", "about", "work" |
| `updated_at` | timestamp | |

### `work_entries`

| Column | Type | Notes |
|--------|------|-------|
| `id` | serial PK | |
| `year` | text | Display year range |
| `org` | text | Organization name |
| `role` | text | |
| `description` | text | |
| `stat` | text nullable | Highlight stat |
| `link` | text nullable | URL |
| `sort_order` | int | Display order |

### `research_entries`

| Column | Type | Notes |
|--------|------|-------|
| `id` | serial PK | |
| `year` | text | |
| `title` | text | |
| `authors` | text | |
| `journal` | text | |
| `doi` | text nullable | |
| `sort_order` | int | |

### `blog_posts`

| Column | Type | Notes |
|--------|------|-------|
| `id` | serial PK | |
| `title` | text | |
| `slug` | text unique | URL-safe title |
| `content` | text | Rich text HTML/JSON |
| `excerpt` | text | Short summary |
| `image_url` | text nullable | Vercel Blob URL |
| `published` | boolean | Default false |
| `published_at` | timestamp nullable | |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home page (hero, intro) |
| `/work` | Work history |
| `/research` | Research publications |
| `/collabiora` | Collabiora page |
| `/about` | About page |
| `/blog` | Blog listing |
| `/blog/[slug]` | Blog post detail |
| `/admin/login` | Admin login form |
| `/admin` | Admin dashboard (redirect if not authed) |

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/login` | POST | Validate password, set session cookie |
| `/api/auth/logout` | POST | Clear session |
| `/api/admin/page-content` | GET/PUT | Read/update page content |
| `/api/admin/work` | GET/POST/PUT/DELETE | CRUD work entries |
| `/api/admin/research` | GET/POST/PUT/DELETE | CRUD research entries |
| `/api/admin/blog` | GET/POST | List/create blog posts |
| `/api/admin/blog/[id]` | GET/PUT/DELETE | Single post CRUD |
| `/api/admin/upload` | POST | Upload image to Vercel Blob |

## Admin Dashboard

Single page at `/admin` with sections:
1. **Page Content** — text fields for hero title, description, about bio, etc.
2. **Work Entries** — add/edit/delete/reorder work history
3. **Research** — add/edit/delete/reorder publications
4. **Blog Posts** — list with edit/create/delete, Tiptap editor, image upload

## Auth Flow

1. Admin visits `/admin/login`, enters password
2. Server validates against `ADMIN_PASSWORD_HASH` env var (bcrypt)
3. On success, sets an iron-session cookie valid for 24h
4. All `/admin` and `/api/admin/*` routes check session
5. Logout clears the cookie

## Image Upload Flow

1. Admin uploads image from blog editor or work entry
2. Client sends to `/api/admin/upload`
3. Server writes to Vercel Blob Storage
4. Returns public URL, stored in DB

## Migration Plan

1. Run `npx create-next-app@latest` in a subdirectory
2. Set up Vercel Postgres + Blob Storage
3. Create DB schema (migration SQL file)
4. Port React components to Next.js pages
5. Create API routes for admin
6. Build admin dashboard UI
7. Seed database with current content
8. Deploy to Vercel, connect to same GitHub repo or new project
