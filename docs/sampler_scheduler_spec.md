# Task Specification: Sampler and Scheduler Selection

## 1.0 Purpose & Scope
Enable users to select and configure different samplers and schedulers for image generation within the ComfyPhone interface. This includes adding state management, API integration with ComfyUI, and UI components in the settings area.

## 2.0 Architectural Impact
- **State Management**: Update `lib/store.ts` to manage selected sampler/scheduler and available lists.
- **API Integration**: Update `lib/comfy.ts` to fetch available samplers/schedulers and apply them to the generation workflow.
- **UI Components**: Modify `components/Settings.tsx` to provide selection controls.

## 3.0 Task Decomposition

### Phase 1: Infrastructure & State (STORE)
#### CP-STORE-001: Define Sampler/Scheduler State
- **Objective**: Add `selectedSampler`, `samplers`, `selectedScheduler`, and `schedulers` to the Zustand store.
- **Files**: `lib/store.ts`
- **Validation**: Verify that state can be updated and persisted.

#### CP-API-001: Implement Metadata Fetching
- **Objective**: Create functions in `lib/comfy.ts` to fetch available samplers and schedulers from ComfyUI.
- **Endpoint**: `/object_info/KSampler` (extract from `sampler_name` and `scheduler` inputs).
- **Validation**: Log the fetched lists to console.

### Phase 2: Logic & Workflow (COMFY)
#### CP-COMFY-001: Update Queue Logic
- **Objective**: Modify `queuePrompt` to accept `sampler` and `scheduler` parameters and apply them to the workflow.
- **Logic**: Target nodes that have `sampler_name` and `scheduler` inputs (e.g., node `12`, `20`, `43`).
- **Validation**: Intercept the workflow JSON sent to ComfyUI and verify the values are applied.

### Phase 3: UI Implementation (SETTINGS)
#### CP-UI-001: Add Selection Dropdowns
- **Objective**: Add UI components in `components/Settings.tsx` for sampler and scheduler selection.
- **Design**: Follow the existing "Active Checkpoint" style.
- **Validation**: Ensure dropdowns populate with fetched data and update the store.

#### CP-UI-002: Implement Auto-Fetch for Metadata
- **Objective**: Trigger sampler/scheduler fetching when the server URL changes or the component mounts.
- **Files**: `components/Settings.tsx`
- **Validation**: Verify lists are populated upon successful server connection.

### Phase 4: Integration (GENERATOR)
#### CP-GEN-001: Pass Selection to Queue
- **Objective**: Update `Generator.tsx` to pass the selected sampler and scheduler from the store to `queuePrompt`.
- **Files**: `components/Generator.tsx`
- **Validation**: Perform a generation and confirm the ComfyUI logs show the correct sampler/scheduler being used.

## 4.0 Technical Considerations
- **Workflow Compatibility**: Different workflows might use different node IDs for samplers. The implementation should attempt to find nodes of type `KSampler`, `KSamplerAdvanced`, `KSamplerSelect`, etc., if node IDs aren't explicitly provided.
- **Error Handling**: Gracefully handle cases where the server is unreachable or doesn't support specific metadata requests.
- **Defaults**: Default to `euler_ancestral` and `beta` if none are selected.

## 5.0 Acceptance Criteria
- [ ] Users can see a list of available samplers in the Settings.
- [ ] Users can see a list of available schedulers in the Settings.
- [ ] Selected sampler/scheduler is saved in local storage.
- [ ] The generated image uses the selected sampler and scheduler.
- [ ] UI remains responsive while fetching metadata.
