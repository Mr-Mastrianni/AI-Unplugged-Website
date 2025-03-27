# AI Unplugged Website - Administrator Guide

## Overview

This guide provides information for administrators of the AI Unplugged website. It covers the website's structure, setup procedures, deployment, maintenance, and instructions for common administrative tasks.

## System Requirements

To set up and run the AI Unplugged website, you'll need:

- Web server (Apache, Nginx, etc.)
- Text editor or IDE for code editing
- FTP client or SSH access for uploading files (if deploying to a remote server)
- Modern web browser for testing (Chrome, Firefox, Safari, Edge)
- Basic knowledge of HTML, CSS, and JavaScript

## Setup Instructions

### Local Development Setup

1. **Clone or download the website files**:
   - If using Git: `git clone [repository-url]`
   - If downloading: Extract the zip file to your preferred location

2. **Set up a local server environment**:
   
   Option 1: Use a simple local server:
   - For Python: Navigate to the website folder and run:
     - Python 3: `python -m http.server 8000`
     - Python 2: `python -m SimpleHTTPServer 8000`
   - Access the site at: `http://localhost:8000`
   
   Option 2: Use a local development environment:
   - XAMPP/WAMP/MAMP: Copy the website files to the `htdocs` or `www` folder
   - Access the site via the local server URL (e.g., `http://localhost/Website`)

3. **Initial configuration**:
   - Review and update contact information
   - Replace placeholder images with actual company images
   - Update service details and pricing information

### Dependencies

The website uses the following external dependencies:

- **Font Awesome** (via CDN): For icons
- **Google Fonts** (via CDN): For typography (Montserrat and Merriweather)

No additional installation is required as these resources are loaded from their respective CDNs.

## Website Structure

The AI Unplugged website is built using HTML, CSS, and JavaScript. It follows a modular structure:

```
/Website/
├── index.html                  # Home page
├── about.html                  # About us page
├── services.html               # Services overview page
├── how-it-works.html           # Process explanation page
├── case-studies.html           # Success stories page
├── blog.html                   # Blog listing page
├── contact.html                # Contact information and form
├── privacy-policy.html         # Privacy policy document
├── terms-of-service.html       # Terms of service document
├── css/
│   └── styles.css              # Main stylesheet
├── js/
│   └── script.js               # Main JavaScript file
├── images/                     # Image files
├── services/                   # Individual service pages
│   ├── chatbots.html           # AI Chatbots page
│   ├── analytics.html          # Predictive Analytics page
│   └── automation.html         # Business Automation page
├── blog/                       # Individual blog posts
├── case-studies/               # Individual case studies
└── docs/                       # Documentation files
    ├── user-guide.md           # User documentation
    └── admin-guide.md          # This file
```

## Website Maintenance

### Updating Content

#### Text Content

To update text content on the website:

1. Identify the HTML file containing the content you wish to update
2. Open the file in a code editor
3. Locate the text within the HTML structure
4. Make the necessary changes
5. Save the file
6. Test the changes by viewing the page in a browser

#### Images

To update or add images:

1. Ensure new images are optimized for web (recommended sizes below)
2. Place new images in the `/images/` directory
3. Update HTML references to images as needed

Recommended image dimensions:
- Hero images: 1920 x 1080px
- Service cards: 800 x 600px
- Team members: 500 x 500px
- Blog thumbnails: 800 x 500px
- Case study images: 800 x 600px

### Adding New Pages

To add a new page:

1. Use an existing page as a template
2. Save with a new filename (use kebab-case for multiple words, e.g., `new-page.html`)
3. Update the page title, meta description, and content
4. Add navigation links to the new page in:
   - Main navigation in header
   - Footer links (if appropriate)

### Blog Management

To add a new blog post:

1. Create a new HTML file in the `/blog/` directory
2. Use a naming convention like `post-title-slug.html`
3. Copy the structure from an existing blog post
4. Update the post content, title, meta description, and publication date
5. Add a card for the new post on the main blog page (`blog.html`)
6. Update the "Recent Posts" sidebar if needed

### Case Studies Management

To add a new case study:

1. Create a new HTML file in the `/case-studies/` directory
2. Follow the same structure as existing case studies
3. Add the appropriate `data-category` attribute to match the filtering system
4. Update the case study card on the main case studies page (`case-studies.html`)

## Technical Reference

### CSS Structure

The `styles.css` file is organized into sections:

- Base styles (variables, typography, general elements)
- Navigation styles
- Section-specific styles (hero, services, testimonials, etc.)
- Page-specific styles
- Media queries for responsive design

When adding new styles, follow the existing patterns and keep styles organized in the appropriate sections.

### JavaScript Functionality

The `script.js` file includes the following functionality:

- Mobile navigation toggle
- Back to top button behavior
- Smooth scrolling for anchor links
- Testimonial slider functionality
- Contact form validation

Additional page-specific scripts (like the filter functionality for case studies) are included directly in their respective HTML files.

## Form Handling

The contact form is set up to be processed by a backend service. Currently, form submission is simulated with JavaScript for demonstration purposes. To connect to an actual backend:

1. Update the form action attribute with your backend endpoint
2. Configure form handling as needed for your backend service
3. Ensure proper validation and security measures are in place

## SEO Management

### Meta Tags

Each page includes:
- `<title>` tag
- Meta description
- Open Graph tags (for social sharing)

When updating pages or adding new ones, be sure to update these tags appropriately.

### Image Optimization

All images should:
- Include descriptive alt text
- Be optimized for web (compressed, appropriate format)
- Have descriptive filenames (use hyphens between words)

## Analytics Integration

To add analytics tracking:

1. Obtain your tracking code from your analytics provider (e.g., Google Analytics)
2. Add the tracking code to each page, ideally just before the closing `</head>` tag
3. Configure any event tracking as needed

## Deployment Instructions

### Preparing for Deployment

1. **Finalize content**:
   - Check all pages for typos and outdated information
   - Ensure all links work correctly
   - Optimize images for production

2. **Update SEO elements**:
   - Verify title tags and meta descriptions for all pages
   - Check that all images have alt text
   - Ensure canonical URLs are set correctly

3. **Pre-deployment testing**:
   - Test on multiple browsers (Chrome, Firefox, Safari, Edge)
   - Test on mobile devices or using responsive design tools
   - Validate HTML using W3C Validator: https://validator.w3.org/

### Deployment to Web Server

#### Shared Hosting

1. **Connect to your hosting account**:
   - Use an FTP client (like FileZilla) or the hosting control panel's file manager
   - Connect using the credentials provided by your hosting provider

2. **Upload the website files**:
   - Upload all files to the appropriate directory (usually `public_html`, `www`, or `htdocs`)
   - Ensure file permissions are set correctly:
     - HTML/CSS/JS files: 644
     - Directories: 755

3. **Point your domain to the website**:
   - If using a new domain, update DNS records to point to your hosting
   - If using a subdomain or existing domain, configure it in your hosting control panel

#### VPS or Dedicated Server

1. **Connect to your server**:
   - Use SSH to connect to your server
   - Navigate to the web server's document root (e.g., `/var/www/html/`)

2. **Transfer the website files**:
   - Use SCP, SFTP, or Git to transfer files
   - Example SCP command: `scp -r /path/to/local/files username@server:/var/www/html/`

3. **Configure the web server**:

   For Apache:
   - Create a virtual host configuration file in `/etc/apache2/sites-available/`
   - Example configuration:
     ```apache
     <VirtualHost *:80>
         ServerName aiunplugged.com
         ServerAlias www.aiunplugged.com
         DocumentRoot /var/www/html/aiunplugged
         
         <Directory /var/www/html/aiunplugged>
             Options -Indexes +FollowSymLinks
             AllowOverride All
             Require all granted
         </Directory>
         
         ErrorLog ${APACHE_LOG_DIR}/aiunplugged-error.log
         CustomLog ${APACHE_LOG_DIR}/aiunplugged-access.log combined
     </VirtualHost>
     ```
   - Enable the site: `sudo a2ensite your-config-file.conf`
   - Restart Apache: `sudo systemctl restart apache2`

   For Nginx:
   - Create a server block configuration file in `/etc/nginx/sites-available/`
   - Example configuration:
     ```nginx
     server {
         listen 80;
         server_name aiunplugged.com www.aiunplugged.com;
         root /var/www/html/aiunplugged;
         index index.html;
         
         location / {
             try_files $uri $uri/ =404;
         }
         
         error_log /var/log/nginx/aiunplugged-error.log;
         access_log /var/log/nginx/aiunplugged-access.log;
     }
     ```
   - Create a symbolic link to enable the site: `sudo ln -s /etc/nginx/sites-available/your-config-file /etc/nginx/sites-enabled/`
   - Test the configuration: `sudo nginx -t`
   - Restart Nginx: `sudo systemctl restart nginx`

### Post-Deployment Steps

1. **Set up SSL (HTTPS)**:
   - Use Let's Encrypt for free SSL certificates
   - For shared hosting, use the SSL tools in your hosting control panel
   - For VPS, use Certbot: `sudo certbot --nginx` or `sudo certbot --apache`

2. **Test the live website**:
   - Verify all pages load correctly
   - Test forms and interactive elements
   - Check that all links work
   - Verify that HTTPS is working properly

3. **Set up monitoring**:
   - Configure uptime monitoring (e.g., UptimeRobot, Pingdom)
   - Set up Google Search Console
   - Implement Google Analytics or other analytics tools

## Security Considerations

- All form inputs include validation to prevent common attacks
- External links use `rel="noopener noreferrer"` attributes
- No sensitive information is stored in client-side code
- Use HTTPS when deploying the site to production
- Regularly update external dependencies (e.g., Font Awesome, Google Fonts)
- Consider implementing Content Security Policy (CSP) headers
- Set up regular security scans of your website

## Backup Procedures

It's recommended to:
- Maintain a version control system (e.g., Git) for the website code
- Regularly backup the entire website directory
- Document any significant changes made to the website

## Troubleshooting Common Issues

### Broken Images

If images aren't displaying properly:
1. Check the file path in the HTML
2. Verify the image exists in the specified location
3. Confirm the file name and extension match exactly (case-sensitive)

### Layout Problems

If layout issues occur:
1. Check which screen sizes/devices are affected
2. Inspect the relevant CSS in the browser's developer tools
3. Add or modify media queries as needed

### JavaScript Functionality Issues

If interactive elements aren't working:
1. Check the browser console for errors
2. Verify that the correct elements are being selected in the JavaScript
3. Ensure all required scripts are loaded in the correct order

## Contact and Support

For assistance with website administration:
- **Technical Support Email**: tech@aiunplugged.com
- **Emergency Support**: (555) 987-6543

## Performance Optimization

To ensure optimal website performance:

1. **Image Optimization**:
   - Compress all images using tools like TinyPNG or ImageOptim
   - Consider using WebP format with fallbacks for broader browser support
   - Specify image dimensions in HTML to prevent layout shifts

2. **Code Minification**:
   - Minify CSS and JavaScript files for production
   - Use tools like UglifyJS for JavaScript and CSSNano for CSS
   - Consider bundling multiple CSS/JS files to reduce HTTP requests

3. **Browser Caching**:
   - Set appropriate cache headers for static resources
   - For Apache, use `.htaccess` file:
     ```apache
     <IfModule mod_expires.c>
       ExpiresActive On
       ExpiresByType image/jpg "access plus 1 year"
       ExpiresByType image/jpeg "access plus 1 year"
       ExpiresByType image/gif "access plus 1 year"
       ExpiresByType image/png "access plus 1 year"
       ExpiresByType image/webp "access plus 1 year"
       ExpiresByType text/css "access plus 1 month"
       ExpiresByType application/javascript "access plus 1 month"
       ExpiresByType image/svg+xml "access plus 1 month"
       ExpiresByType image/x-icon "access plus 1 year"
     </IfModule>
     ```

   - For Nginx, add to server block:
     ```nginx
     location ~* \.(jpg|jpeg|png|gif|ico|webp|css|js)$ {
       expires 1y;
       add_header Cache-Control "public, no-transform";
     }
     ```

4. **Lazy Loading**:
   - Enable lazy loading for images below the fold
   - Add `loading="lazy"` attribute to image tags

## Monitoring and Maintenance

### Regular Maintenance Tasks

Schedule the following maintenance tasks:

| Task                               | Frequency      |
|------------------------------------|----------------|
| Check for broken links             | Monthly        |
| Update content                     | As needed      |
| Verify contact form functionality  | Weekly         |
| Check website speed/performance    | Monthly        |
| Update service details and pricing | As needed      |
| Backup website                     | Weekly         |
| Update dependencies                | As released    |
| Security scan                      | Monthly        |

### Monitoring Tools

Consider implementing these tools for ongoing monitoring:

- **Google Analytics**: For visitor tracking and behavior
- **Google Search Console**: For SEO performance and issues
- **GTmetrix or PageSpeed Insights**: For performance monitoring
- **Uptime monitoring**: Services like UptimeRobot or Pingdom

## Change Log

| Date       | Version | Changes                           | Author        |
|------------|---------|-----------------------------------|---------------|
| 03/15/2025 | 1.0     | Initial website launch            | Web Dev Team  |
| 03/15/2025 | 1.0     | Initial documentation created     | Web Dev Team  |