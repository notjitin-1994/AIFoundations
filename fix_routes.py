import os
import shutil

src_dir = "/home/jitin/AIFoundations/src"
app_dir = os.path.join(src_dir, "app")
course_dir = os.path.join(app_dir, "courses", "aifoundations-concept2application")

# 1. Overwrite page.tsx in src/app with the course landing page
shutil.copy2(os.path.join(course_dir, "page.tsx"), os.path.join(app_dir, "page.tsx"))

# 2. Move other directories (dashboard, certificate, modules)
for item in ["dashboard", "certificate", "modules"]:
    src_path = os.path.join(course_dir, item)
    dst_path = os.path.join(app_dir, item)
    if os.path.exists(dst_path):
        shutil.rmtree(dst_path)
    shutil.move(src_path, dst_path)

# 3. Remove courses directory
shutil.rmtree(os.path.join(app_dir, "courses"))

# 4. Search and replace all instances of /courses/aifoundations-concept2application
# in all .ts and .tsx files
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith(".ts") or file.endswith(".tsx"):
            file_path = os.path.join(root, file)
            with open(file_path, "r") as f:
                content = f.read()
            
            new_content = content.replace("/courses/aifoundations-concept2application", "")
            
            if new_content != content:
                with open(file_path, "w") as f:
                    f.write(new_content)
                print(f"Updated {file_path}")

print("Done reorganizing and updating routes.")
