
        // Mobile Menu Toggle
        const menuToggle = document.getElementById('menu-toggle');
        const navLinks = document.getElementById('nav-links');
        
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
        
        // Category Tab Switching
        const categoryTabs = document.querySelectorAll('.category-tab');
        const categoryContents = document.querySelectorAll('.category-content');
        
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                categoryTabs.forEach(t => t.classList.remove('active'));
                categoryContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show corresponding content
                const categoryId = tab.getAttribute('data-category');
                document.getElementById(categoryId).classList.add('active');
                
                // Reset size filter when switching tabs
                document.getElementById('size-filter').value = 'all';
                filterItems();
            });
        });
        
        // Get filter elements
        const sizeFilter = document.getElementById('size-filter');
        const categoryFilter = document.getElementById('category-filter');
        
        // Add event listeners for filtering
        if (sizeFilter) {
            sizeFilter.addEventListener('change', filterItems);
        }
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', function() {
                const selectedCategory = this.value;
                
                if (selectedCategory !== 'all') {
                    // Switch to the selected category tab
                    categoryTabs.forEach(t => t.classList.remove('active'));
                    categoryContents.forEach(c => c.classList.remove('active'));
                    
                    const activeTab = document.querySelector(`.category-tab[data-category="${selectedCategory}"]`);
                    const activeContent = document.getElementById(selectedCategory);
                    
                    if (activeTab) activeTab.classList.add('active');
                    if (activeContent) activeContent.classList.add('active');
                }
                
                filterItems();
            });
        }
        
        function filterItems() {
            const selectedSize = sizeFilter ? sizeFilter.value : 'all';
            const activeCategory = document.querySelector('.category-content.active');
            
            if (!activeCategory) return;
            
            // Get all tables in the active category
            const tables = activeCategory.querySelectorAll('.price-table');
            
            tables.forEach(table => {
                const rows = table.querySelectorAll('tbody tr');
                let hasVisibleRows = false;
                
                rows.forEach(row => {
                    const sizeCell = row.querySelector('.size');
                    const sizeText = sizeCell ? sizeCell.textContent : '';
                    
                    let shouldShow = true;
                    
                    // Filter by size - handle both individual sizes and ranges
                    if (selectedSize !== 'all' && sizeText) {
                        // Normalize the size text by replacing en dash with hyphen
                        const normalizedSizeText = sizeText.replace(/–/g, '-');
                        const sizeMatch = checkSizeMatch(normalizedSizeText, selectedSize);
                        
                        if (!sizeMatch) {
                            shouldShow = false;
                        }
                    }
                    
                    // Show/hide row
                    row.style.display = shouldShow ? '' : 'none';
                    
                    if (shouldShow) {
                        hasVisibleRows = true;
                    }
                });
                
                // Show/hide the entire table based on whether it has visible rows
                const tableTitle = table.previousElementSibling;
                if (tableTitle && tableTitle.classList.contains('table-title')) {
                    if (hasVisibleRows) {
                        table.style.display = '';
                        tableTitle.style.display = '';
                    } else {
                        table.style.display = 'none';
                        tableTitle.style.display = 'none';
                    }
                }
            });
        }
        
        // Helper function to check if a size matches the selected size
        function checkSizeMatch(sizeText, selectedSize) {
            // If it's a range like "18-22" or "18–22"
            if (sizeText.includes('-')) {
                const parts = sizeText.split('-').map(part => part.trim());
                if (parts.length === 2) {
                    const minSize = parseInt(parts[0]);
                    const maxSize = parseInt(parts[1]);
                    const selectedSizeNum = parseInt(selectedSize);
                    
                    // Check if selected size is within the range
                    if (!isNaN(minSize) && !isNaN(maxSize) && !isNaN(selectedSizeNum)) {
                        return selectedSizeNum >= minSize && selectedSizeNum <= maxSize;
                    }
                }
            }
            
            // If it's a single size or the range check failed, do exact match
            return sizeText.includes(selectedSize);
        }
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Initialize when page loads
        document.addEventListener('DOMContentLoaded', function() {
            // Add hover effects to table rows
            const tableRows = document.querySelectorAll('.price-table tbody tr');
            tableRows.forEach(row => {
                row.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateX(5px)';
                    this.style.transition = 'transform 0.2s ease';
                });
                
                row.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateX(0)';
                });
            });
            
            // Initialize with Shirts category active and filter applied
            filterItems();
        });