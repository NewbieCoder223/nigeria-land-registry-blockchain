import zipfile
import xml.etree.ElementTree as ET
import re
import os

docx_path = r"C:\Users\Fidelis\OneDrive\Desktop\Final Year Project\AUST_FORMAT.docx"
output_path = r"C:\Users\Fidelis\OneDrive\Desktop\Final Year Project\AUST_PROJECT_FORMAT.md"

NSMAP = {
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
}

def get_text_from_docx(docx_path):
    with zipfile.ZipFile(docx_path, 'r') as z:
        with z.open('word/document.xml') as f:
            tree = ET.parse(f)
            root = tree.getroot()

    paragraphs: list[str] = []
    for para in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
        texts = []
        # Check for heading style
        pPr = para.find('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}pPr')
        style_name = ""
        is_bold = False
        if pPr is not None:
            pStyle = pPr.find('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}pStyle')
            if pStyle is not None:
                style_name = pStyle.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}val', '')

        for run in para.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}r'):
            # Check if run is bold
            rPr = run.find('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}rPr')
            if rPr is not None:
                b = rPr.find('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}b')
                if b is not None:
                    is_bold = True

            for t in run.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t'):
                if t.text:
                    texts.append(t.text)

        line = ''.join(texts).strip()
        if line:
            # Try to detect headings
            if 'Heading1' in style_name or 'heading1' in style_name.lower():
                paragraphs.append(f"# {line}")
            elif 'Heading2' in style_name or 'heading2' in style_name.lower():
                paragraphs.append(f"## {line}")
            elif 'Heading3' in style_name or 'heading3' in style_name.lower():
                paragraphs.append(f"### {line}")
            elif is_bold and len(line) < 100:
                paragraphs.append(f"**{line}**")
            else:
                paragraphs.append(line)
        else:
            paragraphs.append("")

    return '\n\n'.join(paragraphs)

md_content = get_text_from_docx(docx_path)

# Clean up excessive blank lines
md_content = re.sub(r'\n{4,}', '\n\n\n', md_content)

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(md_content)

print(f"Converted to: {output_path}")
print(f"Size: {os.path.getsize(output_path)} bytes")
print("--- First 3000 chars ---")
print(md_content[:3000])
