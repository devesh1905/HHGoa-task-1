import fitz
from PIL import Image
import collections

doc = fitz.open("hhgoasite.pdf")
page = doc.load_page(0)
pix = page.get_pixmap()
img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

img = img.resize((150, 150))
colors = img.getcolors(150*150)
colors = sorted(colors, key=lambda x: x[0], reverse=True)

print("Dominant colors (count, RGB):")
for count, color in colors[:10]:
    hex_color = "#{:02x}{:02x}{:02x}".format(color[0], color[1], color[2])
    print(f"Count: {count} | RGB: {color} | Hex: {hex_color}")
