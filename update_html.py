import re

html_path = r"C:\Users\mravera\Desktop\Vista Cenit\Web\series.html"
with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

# Map of original identifiers to gpt equivalents
gpt_map = {
    "DJI_0382.JPG": "0382.png",
    "DJI_0383.JPG": "0383.png",
    "DJI_0453.JPG": "0453.png",
    "DJI_0455.JPG": "0455.png",
    "DJI_0472.JPG": "0472.png",
    "DJI_0503.JPG": "0503.png",
    "DJI_0506.JPG": "0506 centrado.png",
    "DJI_0522.JPG": "0522.png",
    "DJI_0541.JPG": "0541.png",
    "DJI_0464.JPG": "0464.png",
    "DJI_0466.JPG": "0466.png",
    "DJI_0615.JPG": "0615.png",
    "DJI_0634.JPG": "0634.png",
    "DJI_0409.JPG": "0409.png",
    "DJI_0414.JPG": "0414.png",
    "IMG_8626.JPG": "8626.jpg"
}

for orig, gpt in gpt_map.items():
    # Find <img src=".../orig" alt="..." class="gallery-img">
    # We will just append data-gpt="../gpt/{gpt}" to the class="gallery-img"
    search_str = f'src="../Serie [^/]+/{orig}" alt="[^"]+" class="gallery-img"'
    replace_str = search_str.replace('class="gallery-img"', f'class="gallery-img" data-gpt="../gpt/{gpt}"')
    
    # We can use regex to make it safer
    pattern = re.compile(f'(src="\\.\\./[^"]+/{orig}" alt="[^"]+" class="gallery-img")')
    def repl(m):
        return f'{m.group(1)} data-gpt="../gpt/{gpt}"'
    
    html = pattern.sub(repl, html)

# Replace lightbox inner structure to support a scrolling container instead of a single image.
old_lightbox_inner = """        <div class="lightbox-content">
            <img src="" alt="Ampliada" class="lightbox-img" id="lightbox-img">
        </div>"""

new_lightbox_inner = """        <div class="lightbox-content" id="lightbox-content">
            <div class="lightbox-scroll-container" id="lightbox-scroll-container">
                <!-- JS will inject images here -->
            </div>
            
            <div class="lightbox-dots" id="lightbox-dots">
                <!-- JS will inject dots if there are multiple images -->
            </div>
        </div>"""

html = html.replace(old_lightbox_inner, new_lightbox_inner)

# Also add CSS for the new lightbox structure
old_css_lightbox = """.lightbox-img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
        }"""

new_css_lightbox = """.lightbox-scroll-container {
            display: flex;
            width: 100%;
            height: 100%;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
            -ms-overflow-style: none;
            align-items: center;
        }

        .lightbox-scroll-container::-webkit-scrollbar {
            display: none;
        }

        .lightbox-scroll-item {
            flex: 0 0 100%;
            width: 100%;
            height: 100%;
            scroll-snap-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: var(--space-md);
        }

        .lightbox-img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
        }

        .lightbox-dots {
            position: absolute;
            bottom: -30px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
        }

        .lightbox-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.3);
            cursor: pointer;
            transition: background-color var(--transition-fast);
        }

        .lightbox-dot.active {
            background-color: rgba(255, 255, 255, 0.9);
        }"""

html = html.replace(old_css_lightbox, new_css_lightbox)

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html)
print("Updated series.html")
