import os
import PyPDF2
from PIL import Image
import io
import re

def extract_text_and_images(pdf_path, output_dir):
    """
    Extract text and images from a PDF file and save them to the output directory.
    Returns a dictionary with text content organized by page.
    """
    # Create output directories if they don't exist
    images_dir = os.path.join(output_dir, 'images')
    os.makedirs(images_dir, exist_ok=True)
    
    # Open the PDF file
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        num_pages = len(reader.pages)
        
        # Dictionary to store text content by page
        content = {}
        
        # Extract text and images from each page
        for page_num in range(num_pages):
            page = reader.pages[page_num]
            
            # Extract text
            text = page.extract_text()
            content[page_num] = text
            
            # Save text to file
            with open(os.path.join(output_dir, f'page_{page_num+1}.txt'), 'w', encoding='utf-8') as text_file:
                text_file.write(text)
            
            # Try to extract images (this is a simplified approach)
            try:
                if '/XObject' in page['/Resources']:
                    xObject = page['/Resources']['/XObject'].get_object()
                    for obj in xObject:
                        if xObject[obj]['/Subtype'] == '/Image':
                            image_data = xObject[obj].get_data()
                            image_name = f'image_page_{page_num+1}_{obj}.png'
                            
                            # Try to convert image data to an image
                            try:
                                image = Image.open(io.BytesIO(image_data))
                                image.save(os.path.join(images_dir, image_name))
                                print(f"Saved image: {image_name}")
                            except Exception as e:
                                print(f"Error saving image {image_name}: {e}")
            except Exception as e:
                print(f"Error extracting images from page {page_num+1}: {e}")
        
        return content

def categorize_content(content):
    """
    Categorize content into different Earth Science topics based on keywords.
    Returns a dictionary with content organized by topic.
    """
    topics = {
        'geologic-history': [],
        'rock-correlation': [],
        'radioactive-dating': [],
        'geologic-time-scale': []
    }
    
    # Keywords for each topic
    keywords = {
        'geologic-history': ['geologic history', 'earth history', 'formation of earth', 'geological events'],
        'rock-correlation': ['rock correlation', 'stratigraphy', 'rock layers', 'correlation', 'cross-section'],
        'radioactive-dating': ['radioactive dating', 'radiometric', 'half-life', 'decay', 'isotope'],
        'geologic-time-scale': ['geologic time', 'time scale', 'eon', 'era', 'period', 'epoch']
    }
    
    # Categorize each page based on keywords
    for page_num, text in content.items():
        page_categorized = False
        
        for topic, topic_keywords in keywords.items():
            for keyword in topic_keywords:
                if keyword.lower() in text.lower():
                    topics[topic].append((page_num, text))
                    page_categorized = True
                    break
            if page_categorized:
                break
        
        # If page doesn't match any specific topic, check which one it's closest to
        if not page_categorized:
            # Default to geologic-history if no clear match
            topics['geologic-history'].append((page_num, text))
    
    return topics

def create_html_content(topics, images_dir):
    """
    Create HTML content for each topic based on the categorized content.
    Returns a dictionary with HTML content for each topic.
    """
    html_content = {}
    
    for topic, pages in topics.items():
        # Sort pages by page number
        pages.sort(key=lambda x: x[0])
        
        # Create HTML content for the topic
        topic_html = f"<h2>{topic.replace('-', ' ').title()}</h2>\n"
        
        for page_num, text in pages:
            # Clean up text and convert to HTML paragraphs
            paragraphs = text.split('\n\n')
            for para in paragraphs:
                if para.strip():
                    # Check if paragraph looks like a heading
                    if len(para) < 100 and para.isupper():
                        topic_html += f"<h3>{para}</h3>\n"
                    else:
                        topic_html += f"<p>{para}</p>\n"
            
            # Add images for this page if they exist
            image_pattern = f"image_page_{page_num+1}_"
            for image_file in os.listdir(images_dir):
                if image_pattern in image_file:
                    topic_html += f'<div class="content-image"><img src="../../images/{image_file}" alt="Diagram from page {page_num+1}"></div>\n'
        
        html_content[topic] = topic_html
    
    return html_content

def main():
    pdf_path = '/home/ubuntu/earth-science-tutor/content/Earth Science Period 10 (24-25).pdf'
    output_dir = '/home/ubuntu/earth-science-tutor/content/extracted'
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Extract text and images from PDF
    print("Extracting content from PDF...")
    content = extract_text_and_images(pdf_path, output_dir)
    
    # Categorize content by topic
    print("Categorizing content by topic...")
    topics = categorize_content(content)
    
    # Create HTML content for each topic
    print("Creating HTML content...")
    html_content = create_html_content(topics, os.path.join(output_dir, 'images'))
    
    # Save HTML content to files
    for topic, html in html_content.items():
        topic_dir = f'/home/ubuntu/earth-science-tutor/topics/{topic}'
        with open(os.path.join(topic_dir, 'content.html'), 'w', encoding='utf-8') as file:
            file.write(html)
        print(f"Saved HTML content for {topic}")
    
    # Copy images to the website images directory
    images_dir = '/home/ubuntu/earth-science-tutor/images'
    os.makedirs(images_dir, exist_ok=True)
    
    for image_file in os.listdir(os.path.join(output_dir, 'images')):
        source_path = os.path.join(output_dir, 'images', image_file)
        dest_path = os.path.join(images_dir, image_file)
        
        # Copy the image file
        with open(source_path, 'rb') as src, open(dest_path, 'wb') as dst:
            dst.write(src.read())
        print(f"Copied image: {image_file}")
    
    print("Content extraction and processing complete!")

if __name__ == "__main__":
    main()
