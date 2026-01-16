# ComfyPhone - Mobile-First ComfyUI Web App Plan

## 1. Project Overview
A web-based interface for ComfyUI, optimized for mobile devices, allowing users to generate images, view a persistent gallery, manage workflows, and configure server settings.

## 2. Technical Stack
- **Framework**: Next.js (App Router) for both frontend and simple API routes.
- **Styling**: Tailwind CSS for responsive, mobile-first design.
- **Icons**: Lucide React.
- **Motion**: Framer Motion (Motion) for smooth transitions and interactions.
- **State Management**: Zustand for global app state (config, gallery, current prompt).
- **Storage**: 
    - **Config**: LocalStorage (client-side).
    - **Gallery**: Next.js API route saving metadata to a local JSON file or SQLite, with images stored in a `public/output` folder or fetched directly from ComfyUI.
- **API Integration**: WebSocket connection to ComfyUI for real-time progress and HTTP POST for queueing prompts.

## 3. Core Features
### 3.1 Generate Section
- Large, thumb-friendly "Generate" button.
- Prompt input field.
- Progress bar/indicator (fetching from ComfyUI WebSocket).
- Display of the currently generating/most recent image.

### 3.2 Persistent Gallery
- Grid view of previously generated images.
- Full-screen viewer for selected images.
- Metadata display (prompt used, date).
- Persistence across sessions (server-side storage).

### 3.3 Workflow Management
- Visualization or selection of the current ComfyUI workflow.
- Ability to update parameters defined in the prompt (e.g., prompt text, seed, resolution).

### 3.4 Config
- ComfyUI Server URL (IP/Domain).
- Connection status indicator.
- Export/Import settings.

## 4. UI/UX Direction (Aesthetic)
- **Style**: "Refined Industrial" - Dark mode by default, high-contrast typography (Inter/Space Grotesk), subtle glassmorphism, and accent colors (Electric Blue or Cyber Lime).
- **Mobile-First**: Bottom navigation bar, swipeable gallery, large touch targets.

## 5. Implementation Steps
1. **Setup**: Initialize Next.js project with Tailwind.
2. **API Layer**: Create a service to communicate with ComfyUI (HTTP/WebSocket).
3. **Storage Layer**: Implement a simple file-based database for the gallery.
4. **Components**:
    - `Navbar`: Bottom navigation.
    - `Generator`: Main control interface.
    - `Gallery`: Image grid and viewer.
    - `Settings`: Configuration form.
5. **Workflow Logic**: Integrate the provided ComfyUI JSON and map dynamic fields (prompt, seed).
6. **Refinement**: Add animations and polish the mobile UI.
