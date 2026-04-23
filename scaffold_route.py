import os

src_file = 'src/router/routes/modules/privacy.ts'
dest_file = 'src/router/routes/modules/terms-conditions.ts'

def process_content(content):
    content = content.replace('privacy', 'terms-conditions')
    content = content.replace('Privacy', 'TermsConditions')
    content = content.replace('PRIVACY', 'TERMS_CONDITIONS')
    return content

with open(src_file, 'r', encoding='utf-8') as f:
    content = f.read()

processed_content = process_content(content)

with open(dest_file, 'w', encoding='utf-8') as f:
    f.write(processed_content)
print("Route copied")
