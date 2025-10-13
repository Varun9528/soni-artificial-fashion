import shutil
import os

# Define source and destination paths
source_path = r'..\public\images\logo\lettex-logo.png'
dest_path = r'public\images\logo\lettex-logo.png'

print(f"Source path: {source_path}")
print(f"Destination path: {dest_path}")

# Check if source file exists
if os.path.exists(source_path):
    print("Source file exists")
    try:
        # Copy file
        shutil.copy2(source_path, dest_path)
        print("Logo file copied successfully!")
        # Check file size
        size = os.path.getsize(dest_path)
        print(f"Destination file size: {size} bytes")
    except Exception as e:
        print(f"Error copying file: {e}")
else:
    print("Source file does not exist")