import re
import os

# List of Kenyan author names to use
kenyan_names = [
    "Onyango Owino",
    "James Kariuki", 
    "Mohammed Njoroge",
    "Austin Sama",
    "Oscar Owino",
    "Grace Wanjiku",
    "David Kiplagat",
    "Fatuma Hassan",
    "Peter Mwangi",
    "Sarah Akinyi",
    "Daniel Kamau",
    "Amina Abdullahi",
    "Joseph Ochieng",
    "Mary Njeri",
    "Hassan Omar",
    "Lucy Chebet",
    "Michael Mutua",
    "Rose Wambui",
    "Ibrahim Musa",
    "Jane Awino"
]

def replace_authors_in_file(filepath):
    """Replace all instances of 'John Wick' with rotating Kenyan names"""
    print(f"Processing {filepath}...")
    
    # Read the file
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all occurrences of "John Wick"
    matches = list(re.finditer(r'John Wick', content))
    print(f"Found {len(matches)} occurrences of 'John Wick'")
    
    if matches:
        # Replace from end to beginning to maintain positions
        name_index = 0
        for match in reversed(matches):
            # Get the name to use (cycle through the list)
            name = kenyan_names[name_index % len(kenyan_names)]
            # Replace this occurrence
            content = content[:match.start()] + name + content[match.end():]
            name_index += 1
        
        # Write back to file
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✓ Replaced all occurrences in {os.path.basename(filepath)}")
        return True
    else:
        print(f"No occurrences found in {os.path.basename(filepath)}")
        return False

if __name__ == "__main__":
    # Files to process
    base_dir = r"c:\Users\Austin NAMUYE\OneDrive\Desktop\NEWSDAPP\SASA Frontend\SASA"
    files_to_process = [
        os.path.join(base_dir, "index.html"),
        os.path.join(base_dir, "index-2.html"),
        os.path.join(base_dir, "index-3.html")
    ]
    
    print("=" * 60)
    print("Replacing 'John Wick' with Kenyan Author Names")
    print("=" * 60)
    print()
    
    for filepath in files_to_process:
        if os.path.exists(filepath):
            replace_authors_in_file(filepath)
            print()
        else:
            print(f"✗ File not found: {filepath}")
            print()
    
    print("=" * 60)
    print("Process complete!")
    print("=" * 60)
