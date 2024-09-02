document.addEventListener('DOMContentLoaded', function() {
    const clusterContainer = document.createElement('div');

    // Example data; replace with actual fetched data
    const websites = [
        {url: 'http://example.com', favicon: 'http://example.com/favicon.ico'},
        // more sites
    ];

    websites.forEach(site => {
        const imgElement = document.createElement('img');
        imgElement.src = site.favicon;
        imgElement.alt = 'Favicon';
        imgElement.title = site.url; // Tooltip to show URL on hover
        clusterContainer.appendChild(imgElement);
    });

    document.body.appendChild(clusterContainer);
});
