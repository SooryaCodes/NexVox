# NexVox Sound Effects Guide

This document explains how to implement sound effects in NexVox components for a consistent and immersive user experience.

## Sound Types and Usage

The application uses various types of sound effects:

1. **Scroll Sounds**: Played when sections come into view
2. **Click Sounds**: Different variations for different button types
3. **Transition Sounds**: For page transitions and major UI changes
4. **Feedback Sounds**: Success, error, and completion sounds

## Using the Sound Effects Utility

### Section Sound Effects

To add sound effects to any section, use the `useSectionSoundEffects` hook:

```tsx
import { useSectionSoundEffects } from '@/utils/sectionSoundEffects';

const MySection: React.FC = () => {
  // Parameters: sectionId (optional), playScrollSound (boolean), soundType
  const sectionRef = useSectionSoundEffects('my-section', true, 'select');
  
  return (
    <section ref={sectionRef} id="my-section">
      {/* Your section content */}
    </section>
  );
};
```

Available sound types for sections:
- `'select'` (default): A subtle UI selection sound
- `'transition'`: Whoosh/transition sound for dynamic sections
- `'whoosh'`: Similar to transition but more pronounced
- `'oscillation'`: A futuristic sound effect for tech-focused sections

### Button Click Sounds

For button click sounds, use the `buttonSounds` object or `handleClickSound` function:

```tsx
import { buttonSounds, handleClickSound } from '@/utils/sectionSoundEffects';

// Using predefined button sounds
<button onClick={buttonSounds.primary}>Primary Action</button>
<button onClick={buttonSounds.secondary}>Secondary Action</button>
<button onClick={buttonSounds.tertiary}>Tertiary Action</button>
<button onClick={buttonSounds.icon}>Icon Button</button>

// Using handleClickSound directly
<button onClick={() => handleClickSound('heavy')}>Custom Sound</button>
```

Available button sound types:
- `buttonSounds.primary`: Heavy click for primary actions (`'heavy'`)
- `buttonSounds.secondary`: Standard click for secondary actions (`'default'`)
- `buttonSounds.tertiary`: Soft click for tertiary actions (`'soft'`)
- `buttonSounds.icon`: Muted click for icon buttons (`'muted'`)
- `buttonSounds.success`: Success sound for confirmations
- `buttonSounds.error`: Error sound for warnings/errors
- `buttonSounds.toggle`: Toggle sound for switches
- `buttonSounds.option`: Selection sound for options

## Guidelines for Implementation

1. **DO NOT use hover sounds** - Only use click and scroll sounds to avoid audio fatigue
2. **Use consistent sounds** for similar UI elements:
   - Primary actions (Register, Create, Submit) → `buttonSounds.primary`
   - Secondary actions (Login, Cancel, Back) → `buttonSounds.secondary`
   - Tertiary actions (Learn More, Details) → `buttonSounds.tertiary`
   - Icon buttons and small UI elements → `buttonSounds.icon`

3. **Section sounds** should match the section's purpose:
   - For technology/feature showcases → `'oscillation'`
   - For transitions between major content → `'transition'`
   - For standard sections → `'select'`

## Example Implementation

```tsx
import React from 'react';
import { useSectionSoundEffects, buttonSounds } from '@/utils/sectionSoundEffects';

const ExampleSection: React.FC = () => {
  const sectionRef = useSectionSoundEffects('example', true, 'select');
  
  return (
    <section ref={sectionRef} id="example" className="py-16">
      <h2>Example Section</h2>
      <p>This section demonstrates sound effect implementation.</p>
      
      <div className="mt-8 space-y-4">
        <button 
          onClick={buttonSounds.primary}
          className="px-6 py-2 bg-blue-500 text-white rounded-md"
        >
          Primary Action
        </button>
        
        <button 
          onClick={buttonSounds.secondary}
          className="px-6 py-2 bg-gray-500 text-white rounded-md"
        >
          Secondary Action
        </button>
      </div>
    </section>
  );
};

export default ExampleSection;
```

By following these guidelines, we ensure a consistent and pleasant audio experience throughout the application without overwhelming the user with too many sounds. 