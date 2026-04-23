import os

src_dir = 'src/views/Privacy'
dest_dir = 'src/views/TermsConditions'

def process_content(content):
    content = content.replace('privacy', 'terms-conditions')
    content = content.replace('Privacy', 'TermsConditions')
    content = content.replace('PRIVACY', 'TERMS_CONDITIONS')
    return content

for root, dirs, files in os.walk(src_dir):
    rel_path = os.path.relpath(root, src_dir)
    
    new_dir = os.path.join(dest_dir, rel_path.replace('privacy', 'terms-conditions').replace('Privacy', 'TermsConditions'))
    os.makedirs(new_dir, exist_ok=True)
    
    for file in files:
        src_file = os.path.join(root, file)
        
        new_file = file.replace('privacy', 'terms-conditions').replace('Privacy', 'TermsConditions')
        dest_file = os.path.join(new_dir, new_file)
        
        try:
            with open(src_file, 'r', encoding='utf-8') as f:
                content = f.read()
            processed_content = process_content(content)
            with open(dest_file, 'w', encoding='utf-8') as f:
                f.write(processed_content)
        except Exception as e:
            print(f"Skipping binary file {src_file}: {e}")

print("Copy and rename view successful")
