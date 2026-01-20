
        // Mobile Menu Toggle
        const menuToggle = document.getElementById('menu-toggle');
        const navLinks = document.getElementById('nav-links');
        
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
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
                
                // Reset filters when switching tabs
                document.getElementById('size-filter').value = 'all';
                document.getElementById('search').value = '';
                filterItems();
            });
        });
        
        // Size Filter
        const sizeFilter = document.getElementById('size-filter');
        sizeFilter.addEventListener('change', filterItems);
        
        // Category Filter
        const categoryFilter = document.getElementById('category-filter');
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
        
        // Search Filter
        const searchInput = document.getElementById('search');
        searchInput.addEventListener('input', filterItems);
        
        function filterItems() {
            const selectedSize = sizeFilter.value;
            const searchTerm = searchInput.value.toLowerCase();
            
            // Get the active category content
            const activeContent = document.querySelector('.category-content.active');
            if (!activeContent) return;
            
            // Get all tables in the active category
            const tables = activeContent.querySelectorAll('.price-table');
            
            tables.forEach(table => {
                const rows = table.querySelectorAll('tbody tr');
                let hasVisibleRows = false;
                
                rows.forEach(row => {
                    const sizeCell = row.querySelector('.size');
                    const sizeText = sizeCell ? sizeCell.textContent : '';
                    const rowText = row.textContent.toLowerCase();
                    
                    let shouldShow = true;
                    
                    // Filter by size
                    if (selectedSize !== 'all') {
                        // Check if the size matches (handles ranges like "18-22" and fixed sizes)
                        const sizeMatch = sizeText.includes(selectedSize) || 
                                         (sizeText.includes('–') && 
                                          parseInt(selectedSize) >= parseInt(sizeText.split('–')[0]) && 
                                          parseInt(selectedSize) <= parseInt(sizeText.split('–')[1]));
                        if (!sizeMatch) {
                            shouldShow = false;
                        }
                    }
                    
                    // Filter by search term
                    if (searchTerm && !rowText.includes(searchTerm)) {
                        shouldShow = false;
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
        
        // Highlight current year in footer
        document.addEventListener('DOMContentLoaded', function() {
            const yearSpan = document.querySelector('.footer-section p strong');
            if (yearSpan) {
                yearSpan.textContent = 'Academic Year: 2025–26';
            }
            
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
            
            // Initialize with Shirts category active
            filterItems();
        });