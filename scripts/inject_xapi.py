import os
import re

MODULES_DIR = 'src/components/modules'
LRS_IMPORT = 'import { useLRS } from "@/hooks/use-lrs";\n'

modified_count = 0

for root, dirs, files in os.walk(MODULES_DIR):
    if 'm1' in root: continue
    
    for file in files:
        if not file.endswith('.tsx'): continue
        filepath = os.path.join(root, file)
        
        with open(filepath, 'r') as f:
            content = f.read()
            
        if 'useLRS' in content: continue
        
        # Check if there are onClick or onChange or onDragEnd
        if not re.search(r'\b(onClick|onChange|onDragEnd|onValueChange)\s*=', content):
            continue
            
        # We know it has interactivity. 
        # Let's insert the import
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if line.startswith('import '):
                lines.insert(i, LRS_IMPORT.strip())
                break
                
        # Insert track declaration
        # Find the main component function
        for i in range(len(lines)):
            if re.search(r'export\s+(default\s+)?function\s+\w+\s*\(', lines[i]):
                for j in range(i, min(i+5, len(lines))):
                    if '{' in lines[j]:
                        lines.insert(j+1, '  const { track } = useLRS();')
                        break
                break
                
        content = '\n'.join(lines)
        
        # Now let's inject track into simple handlers
        # Pattern 1: onClick={() => {
        content = re.sub(
            r'(onClick|onChange|onDragEnd|onValueChange)=\{\s*\(\s*([^)]*)\s*\)\s*=>\s*\{',
            r'\1={(\2) => { track("http://adlnet.gov/expapi/verbs/interacted", "interacted", "http://smartslate.com/activities/interaction", "User Interacted");',
            content
        )
        
        # Pattern 2: onClick={() => setFoo(bar)}
        content = re.sub(
            r'(onClick|onChange|onDragEnd|onValueChange)=\{\s*\(\s*([^)]*)\s*\)\s*=>\s*([^\{].*?)\}',
            r'\1={(\2) => { track("http://adlnet.gov/expapi/verbs/interacted", "interacted", "http://smartslate.com/activities/interaction", "User Interacted"); return \3; }}',
            content
        )
        
        # Pattern 3: onClick={(e) => setFoo(e.target.value)} (already covered by pattern 2)
        
        with open(filepath, 'w') as f:
            f.write(content)
        modified_count += 1
        print(f"Modified {filepath}")

print(f"Total files modified: {modified_count}")
