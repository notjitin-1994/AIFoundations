# AssessmentRunner Component

The `AssessmentRunner` is a highly reusable, globally accessible component for injecting quizzes, knowledge checks, and exams into any slide deck within the application. It dynamically pulls from the central question bank (`src/lib/question-bank-extended-1.ts`), grades answers automatically, provides interactive feedback, and logs results via xAPI.

## Usage

To use the component in a module's slide array, embed it as an `interactive` slide type.

```tsx
import { AssessmentRunner } from "@/components/lesson/assessment-runner";

{
  id: "module-1-quiz",
  type: "interactive",
  requireCompletion: true,
  component: (markCompleted) => (
    <AssessmentRunner 
      kind="module" 
      moduleIds={["1"]} 
      totalQuestions={5}
      title="Module 1 Quiz" 
      description="Let's review the fundamentals before moving on." 
      onComplete={markCompleted} 
    />
  )
}
```

## Props Configuration

- `kind` (\`"baseline" | "module" | "final"\`): Categorizes the assessment for xAPI logging and telemetry.
- `moduleIds` (\`string[]\`): (Optional) Restricts the question selection to specific module IDs. If omitted, it draws from the entire question bank.
- `totalQuestions` (\`number\`): (Optional) The exact number of questions to randomly pull for this assessment run.
- `title` (\`string\`): The main heading displayed on the introductory screen.
- `description` (\`string\`): Subtext displayed on the introductory screen.
- `onComplete` (\`(result: any) => void\`): Callback triggered when the learner finishes the assessment. This is usually tied to unlocking the next slide or saving the score.

## Features

- **Global Navigation Hijacking**: When active, the component interfaces with the `CanvasNavContext` to seamlessly hijack the global slide navigation footer (disabling "Prev", hijacking "Next" as "Submit").
- **Dynamic Resizing**: The modal feedback overlays use sophisticated animations and dynamic heights to ensure content never overflows the parent Canvas bounding box without requiring clunky internal scrollbars.
- **Glassmorphic Feedback**: Correct/Incorrect overlays follow Emil Kowalski's animation guidelines, featuring snappy Custom Beziers, blur transitions, and left-aligned structured typography.
