document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('clusters');
    updateUI(container);
});

function updateUI(container) {
    chrome.storage.local.get(['clusters'], function(result) {
        console.log('Fetched storage after UI update:', JSON.stringify(result.clusters)); // Detailed log
        const clustersData = result.clusters || {};
        generateUI(clustersData, container);
    });
}

function generateUI(clustersData, container) {
    console.log('Generating UI with current cluster data:', JSON.stringify(clustersData)); // Detailed log
    container.innerHTML = '';
    Object.keys(clustersData).forEach(category => {
        const categoryElement = createCategoryElement(category, clustersData[category], container);
        container.appendChild(categoryElement);
    });
}

function createCategoryElement(category, sites, container) {
    const categoryElement = document.createElement('div');
    categoryElement.className = 'category';

    // Event listener for toggling the display of the list
    const titleBlock = document.createElement('div');
    titleBlock.className = 'category-title';
    titleBlock.addEventListener('click', () => {
        list.style.display = list.style.display === 'none' ? 'block' : 'none';
    });

    // Create and append the category icon
    const icon = document.createElement('img');
    icon.src = `icons/${category.toLowerCase()}.png`;  // Assuming the icon files are named after the categories
    icon.alt = `${category} Icon`;
    icon.className = 'category-icon';
    icon.style.width = '50px';  // Set the width of the icon
    icon.style.height = '50px';  // Set the height of the icon

    const title = document.createElement('h2');
    title.textContent = category;
    title.className = 'category-title';

    titleBlock.appendChild(icon);
    titleBlock.appendChild(title);

    const list = document.createElement('ul');
    list.className = 'category-list';
    list.style.display = 'none';

    sites.forEach((site, index) => {
        if (!site) return;  // Skip null or undefined values

        const listItem = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'delete-checkbox';
        checkbox.id = `delete-${category}-${index}`;
        checkbox.value = site;

        //const formattedSite = site.startsWith('http://') || site.startsWith('https://') ? site : `http://${site}`;
        const link = document.createElement('a');
        link.href = site.url;
        link.textContent = site.title;
        //link.target = "_blank";

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.appendChild(link);

        //listItem.appendChild(checkbox);
        listItem.appendChild(label);
        list.appendChild(listItem);
    });

    // Create and append the delete button
    const deleteAllButton = document.createElement('button');
    deleteAllButton.textContent = 'Delete Selected';
    deleteAllButton.type = 'button';
    deleteAllButton.addEventListener('click', function() {
        const selectedValues = Array.from(list.querySelectorAll('input[type="checkbox"]:checked')).map(el => el.value);
        updateStorage(category, selectedValues, container);
    });

    //list.appendChild(deleteAllButton);

    // Append elements to the categoryElement
    categoryElement.appendChild(titleBlock);
    categoryElement.appendChild(list);

    return categoryElement;
}




function updateStorage(category, selectedValues, container) {
    chrome.storage.local.get(['clusters'], function(result) {
        let clustersData = result.clusters || {};
        console.log(`Current storage before deletion for ${category}:`, JSON.stringify(clustersData[category])); // Detailed log
        clustersData[category] = clustersData[category].filter(url => !selectedValues.includes(url));
        chrome.storage.local.set({ clusters: clustersData }, () => {
            console.log(`Storage updated for ${category}, new data:`, JSON.stringify(clustersData[category])); // Detailed log
            updateUI(container);
        });
    });
}
