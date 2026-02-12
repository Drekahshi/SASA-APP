import os
import glob

# Find all HTML files
html_files = glob.glob('*.html')

updated_count = 0
for file_path in html_files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace copyright text
        new_content = content.replace(
            'Copyright © 2022 All Rights Reserved.',
            'Copyright © 2026 Bankai Labs. All Rights Reserved'
        )
        
        if content != new_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Updated: {file_path}')
            updated_count += 1
    except Exception as e:
        print(f'Error updating {file_path}: {e}')

print(f'\nTotal files updated: {updated_count}')
