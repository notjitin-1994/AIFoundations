import os

def replace_in_file(path, old, new):
    with open(path, "r") as f:
        content = f.read()
    new_content = content.replace(old, new)
    if new_content != content:
        with open(path, "w") as f:
            f.write(new_content)
        print(f"Updated {path}")

replace_in_file("src/app/page.tsx", '<Link href="/"', '<a href="/"')
replace_in_file("src/app/page.tsx", '</Link>', '</a>')
replace_in_file("src/components/landing/hero.tsx", 'href=""', 'href="/"')
replace_in_file("src/components/layout/app-shell.tsx", 'pathname === ""', 'pathname === "/"')

print("Minor fixes applied.")
