# Design Specification: Machine Learning concepts split

This document outlines the design and implementation details for splitting the single interactive Machine Learning Concepts slide into three distinct, audio-synchronized slides.

## Objectives
1. Ensure all content (images, titles, descriptions, analogies) fits cleanly within the viewport.
2. Split the single continuous audio narration (`m1-ml-concepts.mp3`) into three synchronized segments.
3. Enhance the visual hierarchy using glassmorphism, proper spacing, and elegant entry animations.
4. Improve pacing and progression tracking on the main progress indicator.

## Architecture & Layout
Instead of a single slide with tab buttons, we will split the concepts into three separate slides within the main slide array:
- **Slide 1**: `Supervised Learning`
- **Slide 2**: `Unsupervised Learning`
- **Slide 3**: `Reinforcement Learning`

Each slide will render a viewport-optimized screen layout:
- Left Column (or top on mobile): A premium 16:9 3D rendered concept image with rounded corners and glowing border.
- Right Column: Concept title, definition, and analogy container in a glassmorphic card.
- Auto-advancing timed reveals for definition and analogy elements, mapped precisely to the audio track duration.

## Audio Synchronization Timings
We will use the existing continuous audio file `/audio/m1-ml-concepts.mp3` with custom playback segment boundaries for each slide:

1. **Supervised Learning** (Slide 1):
   - Audio Playback Range: `0.0s` to `20.0s`
   - Definition Reveal: `9.0s`
   - Analogy Reveal: `12.0s`
   - Auto-pause / slide completion at `20.0s`

2. **Unsupervised Learning** (Slide 2):
   - Audio Playback Range: `20.0s` to `31.0s`
   - Definition Reveal: `21.0s` (relative `1.0s` into the segment)
   - Analogy Reveal: `24.0s` (relative `4.0s` into the segment)
   - Auto-pause / slide completion at `31.0s`

3. **Reinforcement Learning** (Slide 3):
   - Audio Playback Range: `31.0s` to end (approx `49.5s`)
   - Definition Reveal: `32.0s` (relative `1.0s` into the segment)
   - Analogy Reveal: `35.0s` (relative `4.0s` into the segment)
   - Slide completion when audio ends.

## State Management & Handlers
A single parameterized React component `MachineLearningConcept` will receive `conceptId` (`0 | 1 | 2`) and `onComplete?: () => void`. 
- Local audio references will manage loading and skipping to the start time segment (`currentTime = startTime`).
- An event listener for `timeupdate` will track segment progress and trigger state transitions (reveals, completion mark, pausing).
- Nav overrides will ensure the user can only click the next button after the audio segment has finished playing.
