import os

BASE_DIR = r"c:\Users\Fidelis\OneDrive\Desktop\Final Year Project"

def rebuild():
    parts = []
    
    # Front Matter
    with open(os.path.join(BASE_DIR, "front_matter.md"), 'r', encoding='utf-8') as f:
        parts.append(f.read().strip())
        
    # Chapter 1
    with open(os.path.join(BASE_DIR, "chapter1_introduction.md"), 'r', encoding='utf-8') as f:
        parts.append(f.read().strip())
        
    # Chapter 2
    with open(os.path.join(BASE_DIR, "chapter2_literature_review.md"), 'r', encoding='utf-8') as f:
        parts.append(f.read().strip())
        
    # Chapter 3
    with open(os.path.join(BASE_DIR, "chapter3_analysis_design.md"), 'r', encoding='utf-8') as f:
        parts.append(f.read().strip())
        
    # References
    with open(os.path.join(BASE_DIR, "references.md"), 'r', encoding='utf-8') as f:
        parts.append(f.read().strip())
        
    # Rejoin with separator
    final_content = "\n\n---\n\n".join(parts) + "\n"
    
    # Write to chapters_1_to_3_FINAL.md
    with open(os.path.join(BASE_DIR, "chapters_1_to_3_FINAL.md"), 'w', encoding='utf-8') as f:
        f.write(final_content)
        
    print("Rebuilt chapters_1_to_3_FINAL.md successfully!")

if __name__ == "__main__":
    rebuild()
