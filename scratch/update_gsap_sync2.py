import os
import re
import glob

# Find all files
slide_files = []
for root, _, files in os.walk('src/components/modules'):
    for file in files:
        if file.endswith('.tsx'):
            slide_files.append(os.path.join(root, file))

for filepath in slide_files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Skip if it doesn't use useNarrationStore
    if 'useNarrationStore' not in content:
        continue
        
    # Check if we already injected seekTime
    if 'seekTime' in content:
        continue

    # 1. Update the destructuring of useNarrationStore
    # We will use regex to find `useNarrationStore()` and inject `seekTime`
    match = re.search(r'const\s+\{\s*([^}]+)\s*\}\s*=\s*useNarrationStore\(\);', content)
    if match:
        old_destructure = match.group(0)
        vars = match.group(1).strip()
        new_destructure = f"const {{ {vars}, seekTime }} = useNarrationStore();"
        content = content.replace(old_destructure, new_destructure)
        
        # 2. Add the seekTime useEffect right after the isPlaying useEffect
        is_playing_effect = r'\}, \[[^\]]*isPlaying[^\]]*\]\);'
        
        seek_effect = """
  useEffect(() => {
    if (tl.current && seekTime !== null) {
      tl.current.time(seekTime);
    }
  }, [seekTime]);
"""
        
        match_playing = re.search(is_playing_effect, content)
        if match_playing:
            old_str = match_playing.group(0)
            new_str = old_str + "\n" + seek_effect
            content = content.replace(old_str, new_str, 1)
            
            with open(filepath, 'w') as f:
                f.write(content)
            print(f"Updated {filepath}")
        else:
            print(f"Skipping {filepath} - could not find isPlaying useEffect")

print("Done.")
