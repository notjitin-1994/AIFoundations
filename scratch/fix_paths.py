import os
import glob

base = "/courses/aifoundations-concept2application"

files = [
    "src/components/modules/m3/slides/18c-skills-directories.tsx",
    "src/components/modules/m3/slides/6c-important-mcps.tsx"
]

for f in files:
    with open(f, 'r') as file:
        content = file.read()
    content = content.replace('"/images/favicons/', f'"{base}/images/favicons/')
    with open(f, 'w') as file:
        file.write(content)
print("Done")
