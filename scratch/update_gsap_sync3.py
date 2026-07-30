import re

filepath = 'src/components/modules/m1/index.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Replace all occurrences of destructuring
def replace_destructure(match):
    vars = match.group(1).strip()
    if 'seekTime' not in vars:
        return f"const {{ {vars}, seekTime }} = useNarrationStore();"
    return match.group(0)

content = re.sub(r'const\s+\{\s*([^}]+)\s*\}\s*=\s*useNarrationStore\(\);', replace_destructure, content)

# Now we need to append the useEffect after the isPlaying useEffect
seek_effect = """
  useEffect(() => {
    if (tl.current && seekTime !== null) {
      tl.current.time(seekTime);
    }
  }, [seekTime]);
"""

# We can replace `  }, [isPlaying]);` with `  }, [isPlaying]);\n\n  useEffect(() => {\n    if (tl.current && seekTime !== null) {\n      tl.current.time(seekTime);\n    }\n  }, [seekTime]);`
# But only if it doesn't already have it
content_parts = content.split('  }, [isPlaying]);')
new_content = ""
for i, part in enumerate(content_parts):
    if i < len(content_parts) - 1:
        if 'seekTime !== null' not in content_parts[i+1]:
            new_content += part + '  }, [isPlaying]);' + seek_effect
        else:
            new_content += part + '  }, [isPlaying]);'
    else:
        new_content += part

with open(filepath, 'w') as f:
    f.write(new_content)
print(f"Updated {filepath}")
