import re
import os

filepaths = []
for root, _, files in os.walk('src/components/modules'):
    for f in files:
        if f.endswith('.tsx'):
            filepaths.append(os.path.join(root, f))

for filepath in filepaths:
    with open(filepath, 'r') as f:
        content = f.read()

    # The block to remove is:
    #   useEffect(() => {
    #     if (typeof tl !== "undefined" && tl?.current && seekTime !== null) {
    #       tl.current.time(seekTime);
    #     }
    #   }, [seekTime]);
    
    # We will split by "export function " or "function " to process component by component
    # Actually, it's easier to just use regex to find components.
    
    # Alternatively, just use sed-like logic line by line.
    lines = content.split('\n')
    new_lines = []
    
    in_effect = False
    effect_lines = []
    has_tl = False
    
    def process_component(comp_text):
        if 'const tl =' not in comp_text and 'tl = useRef' not in comp_text:
            # Remove the effect
            comp_text = re.sub(r'\s*useEffect\(\(\) => \{\n\s*if \(typeof tl !== "undefined" && tl\?\.current && seekTime !== null\) \{\n\s*tl\.current\.time\(seekTime\);\n\s*\}\n\s*\}, \[seekTime\]\);', '', comp_text)
        return comp_text

    # Split by function definition
    parts = re.split(r'(?=\b(?:export )?function\b)', content)
    new_parts = []
    for part in parts:
        new_parts.append(process_component(part))
        
    new_content = ''.join(new_parts)
    
    with open(filepath, 'w') as f:
        f.write(new_content)
print("Done fixing TS errors")
