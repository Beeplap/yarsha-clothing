import re

with open("index.html") as f:
    html = f.read()

# Handle HTML-encoded &amp; URLs in award images
more_images = re.findall(r'https://images\.prismic\.io/buzzworthy/([A-Za-z0-9_-]+\.(?:webp|jpg))\?auto=format,compress[^"\']*', html)
unique_filenames = set()
for match in more_images:
    filename = match
    unique_filenames.add(filename)

for filename in sorted(unique_filenames):
    # Find all occurrences of this URL pattern
    pattern = re.escape(f"https://images.prismic.io/buzzworthy/{filename}") + r'\?auto=format,compress[^"\' ]*'
    for match in re.findall(pattern, html):
        html = html.replace(match, f"external/{filename}")

with open("index.html", "w") as f:
    f.write(html)

remaining = len(re.findall(r'https://images\.prismic|https://buzzworthy\.cdn\.prismic|https://cdnjs\.cloudflare', html))
print(f"Remaining CDN URLs: {remaining}")

# Check remaining external URLs
urls = re.findall(r'https?://[^"\'\s<>]+', html)
social = [u for u in urls if any(s in u for s in ['linkedin', 'instagram', 'twitter.com', 'behance', 'dribbble'])]
others = [u for u in urls if u not in social and 'buzzworthystudio.com' in u]
print(f"Social links (intentional): {len(social)}")
print(f"Other site URLs: {others[:5]}")