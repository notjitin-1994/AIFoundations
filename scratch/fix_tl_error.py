import os
import re

slide_files = []
for root, _, files in os.walk('src/components/modules'):
    for file in files:
        if file.endswith('.tsx'):
            slide_files.append(os.path.join(root, file))

for filepath in slide_files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Check if the file has the injected block
    if 'if (tl.current && seekTime !== null) {' in content:
        # Replace it with safe check
        content = content.replace(
            'if (tl.current && seekTime !== null) {',
            'if (typeof tl !== "undefined" && tl?.current && seekTime !== null) {'
        )
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Fixed {filepath}")
