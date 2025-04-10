from agency_swarm.tools import BaseTool
from pydantic import Field
import os
import re
from pathlib import Path
from bs4 import BeautifulSoup
import glob
from dotenv import load_dotenv

load_dotenv()

class TerminalThemeApplier(BaseTool):
    """
    A tool for applying a cyber terminal theme to web pages.
    This tool modifies HTML files to apply the terminal styling, adds necessary CSS and JavaScript,
    and ensures consistent theming across all pages of a website.
    """
    
    target_directory: str = Field(
        default=".", description="Directory containing the HTML files to apply the terminal theme to"
    )
    theme_option: str = Field(
        default="dark", description="Theme option for the terminal style (dark, matrix, neon)"
    )
    exclude_files: list = Field(
        default=[], description="List of files to exclude from theme application"
    )
    header_titles: dict = Field(
        default={}, description="Dictionary mapping section IDs to custom terminal header titles"
    )
    apply_to_sections: bool = Field(
        default=True, description="Whether to apply the terminal styling to individual sections"
    )
    
    def run(self):
        """
        Applies the terminal theme to all HTML files in the target directory 
        and ensures all necessary CSS and JS files are included.
        """
        # Get all HTML files in the target directory
        html_files = glob.glob(f"{self.target_directory}/**/*.html", recursive=True)
        
        if not html_files:
            return "No HTML files found in the target directory."
        
        # Filter out excluded files
        html_files = [f for f in html_files if Path(f).name not in self.exclude_files]
        
        applied_count = 0
        skipped_count = 0
        
        # Process each HTML file
        for html_file in html_files:
            try:
                if self._apply_theme_to_file(html_file):
                    applied_count += 1
                else:
                    skipped_count += 1
            except Exception as e:
                return f"Error applying theme to {html_file}: {str(e)}"
        
        return f"Terminal theme applied to {applied_count} files. {skipped_count} files were skipped."
    
    def _apply_theme_to_file(self, file_path):
        """Apply the terminal theme to a single HTML file."""
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Parse HTML with BeautifulSoup
        soup = BeautifulSoup(content, 'html.parser')
        
        # Check if theme is already applied
        if soup.select('.terminal-theme'):
            return False  # Theme already applied, skip this file
        
        # Add terminal theme class to body
        body = soup.find('body')
        if body:
            body['class'] = body.get('class', []) + ['terminal-theme', f'terminal-{self.theme_option}']
        
        # Ensure CSS is included
        self._ensure_css_included(soup)
        
        # Ensure JS is included
        self._ensure_js_included(soup)
        
        # Apply terminal styling to sections if enabled
        if self.apply_to_sections:
            self._apply_to_sections(soup)
        
        # Save the modified HTML
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(str(soup))
        
        return True
    
    def _ensure_css_included(self, soup):
        """Ensure terminal-theme.css is included in the head section."""
        head = soup.find('head')
        if not head:
            head = soup.new_tag('head')
            soup.html.insert(0, head)
        
        # Check if terminal-theme.css is already included
        css_links = soup.select('link[href*="terminal-theme.css"]')
        if not css_links:
            # Add the terminal-theme.css link
            css_link = soup.new_tag('link')
            css_link['rel'] = 'stylesheet'
            css_link['href'] = 'css/terminal-theme.css'
            head.append(css_link)
    
    def _ensure_js_included(self, soup):
        """Ensure terminal-effects.js is included before the closing body tag."""
        body = soup.find('body')
        if not body:
            return
        
        # Check if terminal-effects.js is already included
        js_scripts = soup.select('script[src*="terminal-effects.js"]')
        if not js_scripts:
            # Add the terminal-effects.js script
            js_script = soup.new_tag('script')
            js_script['src'] = 'js/terminal-effects.js'
            body.append(js_script)
    
    def _apply_to_sections(self, soup):
        """Apply terminal styling to individual sections in the page."""
        # Apply to all sections with IDs
        sections = soup.select('section[id]')
        for section in sections:
            section_id = section.get('id')
            
            # Add terminal section class
            section['class'] = section.get('class', []) + ['terminal-section']
            
            # Add matrix background if theme is matrix
            if self.theme_option == 'matrix':
                canvas = soup.new_tag('canvas')
                canvas['class'] = ['matrix-bg']
                section.insert(0, canvas)
            
            # Add terminal header if a header element exists
            header = section.find(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
            if header:
                # Create terminal header container
                terminal_header = soup.new_tag('div')
                terminal_header['class'] = ['terminal-header']
                
                # Create terminal buttons
                buttons_div = soup.new_tag('div')
                buttons_div['class'] = ['terminal-buttons']
                for color in ['red', 'yellow', 'green']:
                    button = soup.new_tag('span')
                    button['class'] = [f'terminal-button-{color}']
                    buttons_div.append(button)
                
                # Create terminal title
                title_div = soup.new_tag('div')
                title_div['class'] = ['terminal-title']
                
                # Use custom title if provided, otherwise use header text
                title_text = self.header_titles.get(section_id, header.get_text())
                title_div.string = title_text
                
                # Add buttons and title to terminal header
                terminal_header.append(buttons_div)
                terminal_header.append(title_div)
                
                # Replace the original header with the terminal header
                header.replace_with(terminal_header)
            
            # Apply terminal styling to specific elements based on section type
            if section_id == 'faq':
                self._apply_to_faq_section(section, soup)
            elif section_id == 'contact':
                self._apply_to_contact_section(section, soup)
            elif section_id == 'pricing':
                self._apply_to_pricing_section(section, soup)
    
    def _apply_to_faq_section(self, section, soup):
        """Apply terminal styling to FAQ section elements."""
        # Find all FAQ items
        faq_items = section.select('.faq-item')
        for item in faq_items:
            item['class'] = item.get('class', []) + ['terminal-faq-item']
            
            # Style question
            question = item.select_one('.faq-question')
            if question:
                question['class'] = question.get('class', []) + ['terminal-faq-question']
            
            # Style answer
            answer = item.select_one('.faq-answer')
            if answer:
                answer['class'] = answer.get('class', []) + ['terminal-faq-answer']
    
    def _apply_to_contact_section(self, section, soup):
        """Apply terminal styling to contact section elements."""
        # Style form
        form = section.select_one('form')
        if form:
            form['class'] = form.get('class', []) + ['terminal-form']
            
            # Style inputs
            for input_elem in form.select('input, textarea'):
                input_elem['class'] = input_elem.get('class', []) + ['terminal-input']
            
            # Style buttons
            for button in form.select('button'):
                button['class'] = button.get('class', []) + ['terminal-button']
    
    def _apply_to_pricing_section(self, section, soup):
        """Apply terminal styling to pricing section elements."""
        # Style pricing cards
        cards = section.select('.pricing-card')
        for i, card in enumerate(cards):
            card['class'] = card.get('class', []) + ['terminal-card']
            
            # Add different classes based on card position
            if i == 0:
                card['class'] = card.get('class', []) + ['terminal-card-basic']
            elif i == len(cards) - 1:
                card['class'] = card.get('class', []) + ['terminal-card-premium']
            else:
                card['class'] = card.get('class', []) + ['terminal-card-standard']
            
            # Style buttons
            for button in card.select('button, .button, a.btn'):
                button['class'] = button.get('class', []) + ['terminal-button']

if __name__ == "__main__":
    # Test the tool with default parameters
    applier = TerminalThemeApplier(target_directory=".", theme_option="dark")
    result = applier.run()
    print(result)
    
    # Test with matrix theme and custom headers
    custom_headers = {
        "faq": "TERMINAL INQUIRIES",
        "contact": "SECURE TRANSMISSION",
        "pricing": "RESOURCE ALLOCATION"
    }
    applier = TerminalThemeApplier(
        target_directory=".",
        theme_option="matrix",
        header_titles=custom_headers
    )
    result = applier.run()
    print(result) 